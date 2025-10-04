import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../../utils/api';
import { apiRoutes } from '../../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.resolve('./.cache/football/past-match-data.json');
const CACHE_EXPIRY_MS = 8 * 24 * 60 * 60 * 1000;

export async function GET(req, context) {
  const { id } = await context.params;

  try {
    let cache = {};

    // Load existing cache if it exists
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      cache = JSON.parse(fileData);

      // Remove expired entries
      const now = Date.now();
      for (const key in cache) {
        if (cache[key].timestamp && now - cache[key].timestamp > CACHE_EXPIRY_MS) {
          delete cache[key];
        }
      }
    }

    // Return cached data if exists and not expired
    if (cache[id]) {
      return new Response(JSON.stringify(cache[id].data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch fresh data from API
    const response = await apiRequest(
      'GET',
      `${apiRoutes.FOOTBALL.MATCHES}?id=eq.${id}`,
      '',
      '',
      process.env.NEXT_PUBLIC_FOOTBALL_APP_DEV_KEY,
      'football'
    );

    // Save new entry to cache with timestamp
    cache[id] = {
      data: response,
      timestamp: Date.now(),
    };

    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');

    return new Response(JSON.stringify(response), {
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