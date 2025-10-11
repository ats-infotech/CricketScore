import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../../utils/api';
import { apiRoutes } from '../../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.resolve('./.cache/cricket/live_scorecards.json');
// Expire after 15 minutes
const CACHE_EXPIRY_MS = 15 * 60 * 1000;

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

        // Check if there's a valid, unexpired cache for this match ID
        if (
            cache[id] &&
            cache[id].timestamp &&
            now - cache[id].timestamp < CACHE_EXPIRY_MS
        ) {
            // Serve cached data
            return new Response(JSON.stringify(cache[id].data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Otherwise, fetch fresh data
        const response = await apiRequest(
            'GET',
            `${apiRoutes.CRICKET.MATCHES}/${id}${apiRoutes.CRICKET.STATISTICS}`,
            '',
            {
                'x-rapidapi-key': process.env.NEXT_PUBLIC_CRICKET_APP_DEV_KEY,
                'x-rapidapi-host': 'cricket-live-line-advance.p.rapidapi.com',
            }, null, 'cricket'
        );

        // Update cache with new data and timestamp for this match
        cache[id] = {
            data: response,
            timestamp: now,
        };

        // Ensure cache directory exists and save updated cache
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