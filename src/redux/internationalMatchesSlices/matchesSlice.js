const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")
import { handleGetLiveMatches, handleGetLiveMatchScoreboard, handleGetPastMatchScorecard, handleGetRecentMatches, handleGetUpcomingMatches } from "../../../utils/matchesControllerApi"

const initialState = {
  liveMatches: [],
  upcomingMatches: [],
  recentMatches: [],
  liveMatchScoreboard: [],
  success: false,
  loading: false,
  status: ''
}

// get live matches
export const getLiveMatches = createAsyncThunk(
  "matches/getLiveMatches",
  async (params, { rejectWithValue }) => {
    try {
      const response = await handleGetLiveMatches(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch live matches");
    }
  }
);

// get upcoming matches
export const getUpcomingMatches = createAsyncThunk(
  "matches/getUpcomingMatches",
  async (params, { rejectWithValue }) => {
    try {
      const response = await handleGetUpcomingMatches(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming matches");
    }
  }
)

// get live matches
export const getRecentMatches = createAsyncThunk(
  "matches/getRecentMatches",
  async (params, { rejectWithValue }) => {
    try {
      const response = await handleGetRecentMatches(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch recent matches");
    }
  }
)

// get live match scorecard
export const getLiveMatchesScorecard = createAsyncThunk(
  "matches/getLiveMatchesScorecard",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetLiveMatchScoreboard(id)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch scorecard')
    }
  }
)

// get past match scorecard
export const getPastMatchesScorecard = createAsyncThunk(
  "matches/getPastMatchesScorecard",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetPastMatchScorecard(id)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch scorecard')
    }
  }
)

const matchesSlice = createSlice(({
  name: 'matchData',
  initialState,
  extraReducers: (builder) => {
    //get live matches
    builder.addCase(getLiveMatches.pending, (state) => {
      state.success = false,
        state.loading = true,
        state.status = 'Processing Data'
    })
    builder.addCase(getLiveMatches.fulfilled, (state, action) => {
      state.liveMatches = action?.payload
      state.success = true,
        state.loading = false,
        state.status = 'Successful'
    })
    builder.addCase(getLiveMatches.rejected, (state) => {
      state.success = false,
        state.loading = false,
        state.status = 'Rejected'
    })

    //get upcoming matches
    builder.addCase(getUpcomingMatches.pending, (state) => {
      state.success = false,
        state.loading = true,
        state.status = 'Processing Data'
    })
    builder.addCase(getUpcomingMatches.fulfilled, (state, action) => {
      state.upcomingMatches = action?.payload
      state.success = true,
        state.loading = false,
        state.status = 'Successful'
    })
    builder.addCase(getUpcomingMatches.rejected, (state) => {
      state.success = false,
        state.loading = false,
        state.status = 'Rejected'
    })

    //get Recent matches
    builder.addCase(getRecentMatches.pending, (state) => {
      state.success = false,
        state.loading = true,
        state.status = 'Processing Data'
    })
    builder.addCase(getRecentMatches.fulfilled, (state, action) => {
      state.recentMatches = action?.payload
      state.success = true,
        state.loading = false,
        state.status = 'Successful'
    })
    builder.addCase(getRecentMatches.rejected, (state) => {
      state.success = false,
        state.loading = false,
        state.status = 'Rejected'
    })

    //get live match scorecard
    builder.addCase(getLiveMatchesScorecard.pending, (state) => {
      state.success = false,
        state.loading = true,
        state.status = 'Processing Data'
    })
    builder.addCase(getLiveMatchesScorecard.fulfilled, (state, action) => {
      state.liveMatchScoreboard = action?.payload
      state.success = true,
        state.loading = false,
        state.status = 'Successful'
    })
    builder.addCase(getLiveMatchesScorecard.rejected, (state) => {
      state.success = false,
        state.loading = false,
        state.status = 'Rejected'
    })

    //get past match scorecard
    builder.addCase(getPastMatchesScorecard.pending, (state) => {
      state.success = false,
        state.loading = true,
        state.status = 'Processing Data'
    })
    builder.addCase(getPastMatchesScorecard.fulfilled, (state, action) => {
      state.liveMatchScoreboard = action?.payload
      state.success = true,
        state.loading = false,
        state.status = 'Successful'
    })
    builder.addCase(getPastMatchesScorecard.rejected, (state) => {
      state.success = false,
        state.loading = false,
        state.status = 'Rejected'
    })
  }
}))

export default matchesSlice.reducer