import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../../utils/api';
import { apiRoutes } from '../../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

// Path to the cache file
const CACHE_FILE = path.resolve('./.cache/football/premiumUpcomingMatches.json');

// Helper to generate upcoming 6 dates (including today)
const getUpcomingDatePairs = () => {
  const datePairs = [];

  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

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
  const { id } = params; // league ID from dynamic route

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'League ID is required' }),
      { status: 400 }
    );
  }

  const upcomingDates = getUpcomingDatePairs();

  try {
    // Read existing cache
    let cachedData = {};
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(fileData).data || {};
    }

    const leagueCache = cachedData[id] || {};
    const freshData = {};

    // Fetch missing dates only
    for (const { label, from, to } of upcomingDates) {
      if (leagueCache[label]) {
        freshData[label] = leagueCache[label];
      } else {
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

    // Keep only the latest 6 days
    const updatedLeagueCache = {};
    for (const { label } of upcomingDates) {
      updatedLeagueCache[label] = freshData[label];
    }

    // Update and save cache
    cachedData[id] = updatedLeagueCache;
    const toCache = { data: cachedData };

    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(toCache), 'utf-8');

    return new Response(JSON.stringify(freshData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching premium upcoming matches:', error);
    return new Response(
      JSON.stringify({ error: 'Server is temporarily down. Please try again later.', error }),
      { status: 500 }
    );
  }
}
