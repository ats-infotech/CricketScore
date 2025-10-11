import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../utils/api';
import { apiRoutes } from '../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.resolve('./.cache/football/upcomingMatches.json');
const today = new Date();
const upcomingDates = [];

for (let i = 0; i < 2; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  const formatted = date.toISOString().split('T')[0];
  upcomingDates.push(formatted);
}

export async function GET(req) {
  try {
    let cachedData = {};
    // Load existing cache if available
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(fileData).data || {};
    }

    const freshData = {};

    for (const date of upcomingDates) {
      if (cachedData[date]) {
        // Use cached data
        freshData[date] = cachedData[date];
      } else {
        // Call API-Football for this specific date
        const response = await apiRequest(
          'GET',
          `${apiRoutes.FOOTBALL.FIXTURES}`,
          {
            date: date,
            status: 'NS',
            timezone: 'Asia/Kolkata'
          },
          {
            'x-rapidapi-key': process.env.NEXT_PUBLIC_FOOTBALL_TEST_DEV_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          },
          '',
          'football'
        );

        // Store response under that date
        freshData[date] = response;
      }
    }

    // Keep only the 7 upcoming dates in cache
    const updatedCache = {};
    for (const date of upcomingDates) {
      updatedCache[date] = freshData[date];
    }

    // Save cache to file
    const toCache = { data: updatedCache };
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(toCache, null, 2), 'utf-8');

    return new Response(JSON.stringify(freshData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      { status: 500 }
    );
  }
}
