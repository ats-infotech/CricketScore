import fs from 'fs';
import path from 'path';
import { apiRequest } from '../../../../../utils/api';
import { apiRoutes } from '../../../../../utils/apiRoutes';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.resolve('./.cache/cricket/past_statistics.json');

export async function GET(req, context) {
    const { id } = await context.params;

    try {
        let cache = {};

        // Load existing cache if it exists
        if (fs.existsSync(CACHE_FILE)) {
            const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
            cache = JSON.parse(fileData);
        }

        // Return cached data if matchId exists
        if (cache[id]) {
            return new Response(JSON.stringify(cache[id]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Fetch fresh data from API
        const response = await apiRequest(
            'GET',
            `${apiRoutes.CRICKET.MATCHES}/${id}${apiRoutes.CRICKET.STATISTICS}`,
            '',
            {
                'x-rapidapi-key': process.env.NEXT_PUBLIC_CRICKET_APP_DEV_KEY,
                'x-rapidapi-host': 'cricket-live-line-advance.p.rapidapi.com',
            }, null, 'cricket'
        );

        // Save new entry to cache
        cache[id] = response;

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
