import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../../utils/api';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.resolve('./.cache/football/englandAndFranceLiveMatches.json');
const CACHE_TTL_MINUTES = 5;

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

  try {
    // Read cache
    let cachedData = {};
    if (fs.existsSync(CACHE_FILE)) {
      const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(fileData).data || {};
    }

    const leagueCache = cachedData[id];
    let liveMatchData;

    if (leagueCache && isCacheFresh(leagueCache.fetchedAt)) {
      // Use fresh cached data
      liveMatchData = leagueCache.data;
    } else {
      // Fetch from API
      const response = await apiRequest(
        'GET',
        `/?action=get_events&APIkey=${process.env.NEXT_PUBLIC_FOOTBALL_LEAGUE_KEY}&leagueId=${id}&timezone=Asia/Kolkata&match_live=1`,
        '',
        '',
        '',
        'footballenglandfranceleague'
      );

      liveMatchData = response;

      // Update cache
      cachedData[id] = {
        fetchedAt: new Date().toISOString(),
        data: response,
      };

      // Save cache
      fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
      fs.writeFileSync(CACHE_FILE, JSON.stringify({ data: cachedData }), 'utf-8');
    }

    return new Response(JSON.stringify(liveMatchData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching live matches:', error);
    return new Response(
      JSON.stringify({ error: 'Server is temporarily down. Please try again later.', error }),
      { status: 500 }
    );
  }
}
