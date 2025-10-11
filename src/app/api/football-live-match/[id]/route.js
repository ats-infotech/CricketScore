import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../../utils/api';
import { apiRoutes } from '../../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.resolve('./.cache/football/live-match-data.json');

// ⏱ 30 minutes in milliseconds
const CACHE_EXPIRY_MS = 30 * 60 * 1000;

export async function GET(req, context) {
  const { id } = await context.params;

  try {
    let cache = {};

    // Load existing cache if it exists
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      cache = JSON.parse(fileData);
    }

    const now = Date.now();

    // ✅ If cached entry for ID exists and is fresh (within 30 mins), return it
    if (cache[id] && now - cache[id].timestamp < CACHE_EXPIRY_MS) {
      return new Response(JSON.stringify(cache[id].data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 📡 Fetch fresh data from API
    const response = await apiRequest(
      'GET',
      `${apiRoutes.FOOTBALL.FIXTURES}`,
      {
        id: id,
        timezone: 'Asia/Kolkata'
      },
      {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_FOOTBALL_TEST_DEV_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      },
      '',
      'football'
    );

    // 🧠 Update cache with fresh data and current timestamp
    cache[id] = {
      data: response,
      timestamp: now,
    };

    // ✍️ Ensure cache directory exists and save
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
