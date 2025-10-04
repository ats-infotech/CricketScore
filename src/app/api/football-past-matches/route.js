import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../utils/api';
import { apiRoutes } from '../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.resolve('./.cache/football/pastMatches.json');
const today = new Date();
const lastSevenDates = [];

// Get the last 7 days including today
for (let i = 6; i >= 0; i--) {
  const newDate = new Date(today);
  newDate.setDate(today.getDate() - i);
  lastSevenDates.push(newDate.toISOString().split('T')[0]);
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export async function GET(req) {
  try {
    let cachedData = {};
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(fileData).data || {};
    }

    const freshData = {};
    const updatedCache = {};

    const todayStr = today.toISOString().split('T')[0];
    const now = Date.now();

    for (const date of lastSevenDates) {
      const isToday = date === todayStr;
      const isCached = cachedData[date];
      const isExpired =
        isToday &&
        (!isCached?.timestamp || now - isCached.timestamp > FIFTEEN_MINUTES);

      if (isCached && (!isToday || !isExpired)) {
        freshData[date] = isCached.data;
        updatedCache[date] = isCached;
        continue;
      }

      // Calculate next day for API lt. filter
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayFormatted = nextDay.toISOString().split('T')[0];

      const response = await apiRequest(
        'GET',
        `${apiRoutes.FOOTBALL.MATCHES}?start_time=gte.${date}&start_time=lt.${nextDayFormatted}&status_type=eq.finished`,
        '',
        '',
        process.env.NEXT_PUBLIC_FOOTBALL_TEST_DEV_KEY,
        'football'
      );

      console.log(response);
      

      freshData[date] = response;
      updatedCache[date] = {
        data: response,
        timestamp: isToday ? now : undefined,
      };
    }

    // Clean up any outdated cached dates
    for (const cachedDate in cachedData) {
      if (!lastSevenDates.includes(cachedDate)) {
        delete updatedCache[cachedDate];
      }
    }

    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({ data: updatedCache }, null, 2),
      'utf-8'
    );

    return new Response(JSON.stringify(freshData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Server is temporarily down. Please try again in a little while.',
      }),
      { status: 500 }
    );
  }
}