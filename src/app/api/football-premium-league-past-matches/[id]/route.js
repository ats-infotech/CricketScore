import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../../utils/api';
import { apiRoutes } from '../../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

// Path to the cache file
const CACHE_FILE = path.resolve('./.cache/football/premiumPastMatches.json');

// Helper: Get past 6 days + today (total 7 days), using same from and to for API
const getPastDatePairs = () => {
  const datePairs = [];

  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const formatted = date.toISOString().split('T')[0]; // YYYY-MM-DD

    datePairs.push({
      label: formatted,
      from: formatted,
      to: formatted,
    });
  }

  return datePairs;
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
    // Read existing cache
    let cachedData = {};
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(fileData).data || {};
    }

    const leagueCache = cachedData[id] || {};
    const freshData = {};

    for (const { label, from, to } of pastDates) {
      if (leagueCache[label]) {
        freshData[label] = leagueCache[label];
      } else {
        // API call with from = to = current label date
        const response = await apiRequest(
          'GET',
          `${apiRoutes.FOOTBALL.FOOTBALL}/?met=Fixtures&APIkey=${process.env.NEXT_PUBLIC_FOOTBALL_LEAGUE_KEY}&from=${from}&to=${to}&leagueId=${id}&timezone=Asia/Kolkata`,
          '',
          '',
          '',
          'footballpremiumleague'
        );

        freshData[label] = response;
      }
    }

    // Keep only the 7 past days (including today)
    const updatedLeagueCache = {};
    for (const { label } of pastDates) {
      updatedLeagueCache[label] = freshData[label];
    }

    cachedData[id] = updatedLeagueCache;

    // Write cache to disk
    const toCache = { data: cachedData };
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(toCache), 'utf-8');

    return new Response(JSON.stringify(freshData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching premium past matches:', error);
    return new Response(
      JSON.stringify({ error: 'Server is temporarily down. Please try again later.', error }),
      { status: 500 }
    );
  }
}
