import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../utils/api';
import { apiRoutes } from '../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.resolve('./.cache/football/premium_leagues.json');
const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day

export async function GET(req) {
  try {
    // Check if cache file exists and is valid
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      const { timestamp, data } = JSON.parse(fileData);

      if (Date.now() - timestamp < CACHE_TTL) {
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Fetch fresh data
    const response = await apiRequest(
        'GET',
        `${apiRoutes.FOOTBALL.FOOTBALL}/`,
        {
          met: 'Leagues',
          APIkey: process.env.NEXT_PUBLIC_FOOTBALL_LEAGUE_KEY
        },
        '',
        '',
        'footballpremiumleague'
      );
      

    // Save to cache
    const toCache = {
      timestamp: Date.now(),
      data: response,
    };

    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(toCache), 'utf-8');

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Server is temporarily down. Please try again in a little while.', error }),
      { status: 500 }
    );
  }
}
