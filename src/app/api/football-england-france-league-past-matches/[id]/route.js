import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../../utils/api';

export const dynamic = 'force-dynamic';

// Path to the cache file
const CACHE_FILE = path.resolve('./.cache/football/englandAndFrancePastMatches.json');
const CACHE_TTL_MINUTES = 5;

// Generate past 6 days with from/to dates
const getPastDatePairs = () => {
  const datePairs = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const formattedDate = date.toISOString().split('T')[0];
    datePairs.push({ from: formattedDate, to: formattedDate });
  }

  return datePairs.reverse();
};

// Helper to check if cache is fresh
const isCacheFresh = (fetchedAt) => {
  if (!fetchedAt) return false;
  const age = Date.now() - new Date(fetchedAt).getTime();
  return age < CACHE_TTL_MINUTES * 60 * 1000;
};

export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'League ID is required' }),
      { status: 400 }
    );
  }

  const pastDates = getPastDatePairs();

  try {
    // Load existing cache if it exists
    let cachedData = {};
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(fileData).data || {};
    }

    const leagueCache = cachedData[id] || {};
    const freshData = {};

    for (const { from, to } of pastDates) {
      const cacheEntry = leagueCache[from];

      // If cached and fresh, use it
      if (cacheEntry && isCacheFresh(cacheEntry.fetchedAt)) {
        freshData[from] = cacheEntry.data;
      } else {
        // Fetch fresh data
        const response = await apiRequest(
          'GET',
          `/?action=get_events&APIkey=${process.env.NEXT_PUBLIC_FOOTBALL_LEAGUE_KEY}&from=${from}&to=${to}&leagueId=${id}&timezone=Asia/Kolkata`,
          '',
          '',
          '',
          'footballenglandfranceleague'
        );

        freshData[from] = response;

        // Update cache entry
        leagueCache[from] = {
          fetchedAt: new Date().toISOString(),
          data: response,
        };
      }
    }

    // Keep only the past 6 days
    const updatedLeagueCache = {};
    for (const { from } of pastDates) {
      updatedLeagueCache[from] = leagueCache[from];
    }

    // Save updated cache
    cachedData[id] = updatedLeagueCache;
    const toCache = { data: cachedData };

    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(toCache), 'utf-8');

    return new Response(JSON.stringify(freshData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching past matches:', error);
    return new Response(
      JSON.stringify({ error: 'Server is temporarily down. Please try again later.', error }),
      { status: 500 }
    );
  }
}
