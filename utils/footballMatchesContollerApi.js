import { handleApiError } from "./apiErrors"

export const handleGetUpcomingFootballMatches = async () => {
  try {
    const response = await fetch('/api/football-upcoming-matches');
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetPastFootballMatches = async () => {
  try {
    const response = await fetch('/api/football-past-matches');
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetLiveFootballMatches = async () => {
  try {
    const response = await fetch('/api/football-live-matches');
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetPastMatchData = async (id) => {
  try {
    const response = await fetch(`/api/football-past-match/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

export const handleGetPastMatchSummary = async (id) => {
  try {
    const response = await fetch(`/api/football-past-match-summary/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

export const handleGetPastMatchStatistics = async (id) => {
  try {
    const response = await fetch(`/api/football-past-match-statistics/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

export const handleGetPastMatchLineups = async (id) => {
    try {
    const response = await fetch(`/api/football-past-match-lineup/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}