import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../../utils/api';
import { apiRoutes } from '../../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

// Path to the cache file
const CACHE_FILE = path.resolve('./.cache/football/premiumLiveMatches.json');

// Cache key for live matches
const LIVE_CACHE_KEY = 'live';

export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'League ID is required' }),
      { status: 400 }
    );
  }

  try {
    // Read existing cache
    let cachedData = {};
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(fileData).data || {};
    }

    const leagueCache = cachedData[id] || {};
    let liveData;

    if (leagueCache[LIVE_CACHE_KEY]) {
      // Use cached data
      liveData = leagueCache[LIVE_CACHE_KEY];
    } else {
      // Fetch live matches from API (no from/to needed)
      const response = await apiRequest(
        'GET',
        `${apiRoutes.FOOTBALL.FOOTBALL}/?met=Livescore&APIkey=${process.env.NEXT_PUBLIC_FOOTBALL_LEAGUE_KEY}&leagueId=${id}&timezone=Asia/Kolkata`,
        '',
        '',
        '',
        'footballpremiumleague'
      );

      liveData = response;
    }

    // Update cache
    cachedData[id] = {
      [LIVE_CACHE_KEY]: liveData
    };

    const toCache = { data: cachedData };
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(toCache), 'utf-8');

    return new Response(JSON.stringify(liveData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching premium live matches:', error);
    return new Response(
      JSON.stringify({ error: 'Server is temporarily down. Please try again later.', error }),
      { status: 500 }
    );
  }
}
