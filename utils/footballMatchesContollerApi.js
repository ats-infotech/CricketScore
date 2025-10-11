import { handleApiError } from "./apiErrors";

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

export const handleGetLiveMatchData = async (id) => {
  try {
    const response = await fetch(`/api/football-live-match/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

export const handleGetPremiumLeagues = async () => {
  try {
    const response = await fetch('/api/football-premium-leagues');
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetPremiumLeagueUpcomingMatches = async (id) => {
  try {
    const response = await fetch(`/api/football-premium-league-upcoming-matches/${id}`);
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetPremiumLeaguePastMatches = async (id) => {
  try {
    const response = await fetch(`/api/football-premium-league-past-matches/${id}`);
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetPremiumLeagueLiveMatches = async (id) => {
  try {
    const response = await fetch(`/api/football-premium-league-live-matches/${id}`);
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetPremiumLeaguePastMatchData = async (id) => {
  try {
    const response = await fetch(`/api/football-premium-league-past-match/${id}`);
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetEnglandAndFranceLeagues = async () => {
  try {
    const response = await fetch('/api/football-england-france-leagues');
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetEnglandAndFranceLeagueUpcomingMatches = async (id) => {
  try {
    const response = await fetch(`/api/football-england-france-league-upcoming-matches/${id}`);
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetEnglandAndFranceLeaguePastMatches = async (id) => {
  try {
    const response = await fetch(`/api/football-england-france-league-past-matches/${id}`);
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const handleGetEnglandAndFranceLeagueLiveMatches = async (id) => {
  try {
    const response = await fetch(`/api/football-england-france-league-live-matches/${id}`);
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}