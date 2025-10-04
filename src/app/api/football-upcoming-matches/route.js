import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../utils/api';
import { apiRoutes } from '../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.resolve('./.cache/football/upcomingMatches.json');
const today = new Date();
const upcomingDates = [];

// Create the list of upcoming dates (next 7 days)
for (let i = 0; i < 7; i++) {
  const newDate = new Date(today);
  newDate.setDate(today.getDate() + i);
  upcomingDates.push(newDate.toISOString().split('T')[0]);
}

export async function GET(req) {
  try {
    // Check if the cache file exists and read it
    let cachedData = {};
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(fileData).data || {};
    }

    // Object to store the fresh data
    const freshData = {};

    // Step 1: Check the cache for each upcoming date, skip API call if data exists
    for (const date of upcomingDates) {
      if (cachedData[date]) {
        freshData[date] = cachedData[date]; // Use cached data for that date
      }
    }

    // Step 2: Fetch data for dates that are missing in the cache
    for (const date of upcomingDates) {
      if (!cachedData[date]) {
        // Get the next day's date for 'lt.'
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1); // Add 1 day to the current date

        // Format the date to the correct format (YYYY-MM-DD)
        const nextDayFormatted = nextDay.toISOString().split('T')[0];

        // Fetch data for this date since it's missing in cache
        const response = await apiRequest(
          'GET',
          `${apiRoutes.FOOTBALL.MATCHES}?start_time=gte.${date}&start_time=lt.${nextDayFormatted}&status_type=eq.upcoming`,
          '',
          '',
          process.env.NEXT_PUBLIC_FOOTBALL_TEST_DEV_KEY,
          'football'
        );

        // Store the fresh data for this date
        freshData[date] = response;
      }
    }

    // Step 3: Remove data for any dates that are no longer in upcomingDates
    const updatedCache = {};

    for (const date of upcomingDates) {
      updatedCache[date] = freshData[date];
    }

    // Remove data for past dates (not in upcomingDates)
    for (const cachedDate in cachedData) {
      if (!upcomingDates.includes(cachedDate)) {
        delete updatedCache[cachedDate];
      }
    }

    // Step 4: Save the updated cache
    const toCache = {
      data: updatedCache,
    };

    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(toCache), 'utf-8');

    return new Response(JSON.stringify(freshData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Server is temporarily down. Please try again in a little while.' }),
      { status: 500 }
    );
  }
}
