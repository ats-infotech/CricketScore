const CRICKET_BASE_URL = process.env.NEXT_PUBLIC_CRICKET_BASE_URL;
const FOOTBALL_BASE_URL = process.env.NEXT_PUBLIC_FOOTBALL_BASE_URL;

export async function apiRequest(method, endpoint, data = null, customHeaders = {}, auth = null, sportsType) {
  let url = sportsType === 'cricket' ? `${CRICKET_BASE_URL}${endpoint}` : `${FOOTBALL_BASE_URL}${endpoint}`;

  if (data && method === 'GET') {
    const queryString = new URLSearchParams(data).toString();
    url += `?${queryString}`;
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  };

  if (auth) {
    options.headers['Authorization'] = `Bearer ${auth}`;
  }

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error(`[API ${method}] ${url}`, error);
    throw error;
  }
}