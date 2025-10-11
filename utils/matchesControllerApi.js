import { handleApiError } from "./apiErrors"

// this function gets upcoming matches data
export const handleGetUpcomingMatches = async () => {
  try {
    const response = await fetch('/api/upcoming-matches');
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// this function gets recent matches data
export const handleGetRecentMatches = async () => {
  try {
    const response = await fetch('/api/recent-matches');
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// this function gets live matches data
export const handleGetLiveMatches = async () => {
  try {
    const response = await fetch('/api/live-matches');
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// this function gets live matches scorecard data
export const handleGetLiveMatchScoreboard = async (id) => {
  try {
    const response = await fetch(`/api/livematch-scorecard/${id}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error);
  }
};

// this function gets past matches scorecard data
export const handleGetPastMatchScorecard = async (id) => {
  try {
    const response = await fetch(`/api/pastmatch-scorecard/${id}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error);
  }
}

// this function gets past matches statistics data
export const handleGetPastMatchStatistics = async (id) => {
  try {
    const response = await fetch(`/api/pastmatch-statistics/${id}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error);
  }
};

// this function gets live matches statistics data
export const handleLivePastMatchStatistics = async (id) => {
  try {
    const response = await fetch(`/api/livematch-statistics/${id}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error);
  }
};