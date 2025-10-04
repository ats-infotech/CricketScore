const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")
import { handleGetLiveFootballMatches, handleGetPastFootballMatches, handleGetPastMatchData, handleGetPastMatchLineups, handleGetPastMatchStatistics, handleGetPastMatchSummary, handleGetUpcomingFootballMatches } from "utils/footballMatchesContollerApi";

const initialState = {
  upcomingFootballMatches: [],
  pastFootballMatches: [],
  liveFootballMatches: [],
  particularMatchData: [],
  matchStats: [],
  matchSummary: [],
  matchLineups: [],
  success: false,
  loading: false,
  status: ''
}

// get upcoming football matches
export const getUpcomingFootballMatches = createAsyncThunk(
  "matches/getUpcomingFootballMatches",
  async (params, { rejectWithValue }) => {
    try {
      const response = await handleGetUpcomingFootballMatches(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get past football matches
export const getPastFootballMatches = createAsyncThunk(
  "matches/getPastFootballMatches",
  async (params, { rejectWithValue }) => {
    try {
      const response = await handleGetPastFootballMatches(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get live football matches
export const getLiveFootballMatches = createAsyncThunk(
  "matches/getLiveFootballMatches",
  async (params, { rejectWithValue }) => {
    try {
      const response = await handleGetLiveFootballMatches(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get past football match data
export const getPastFootballMatchData = createAsyncThunk(
  "matches/getPastFootballMatchData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetPastMatchData(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get past football match summary
export const getPastFootballMatchSummary = createAsyncThunk(
  "matches/getPastFootballMatchSummary",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetPastMatchSummary(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get past football match statistics
export const getPastFootballMatchStatistics = createAsyncThunk(
  "matches/getPastFootballMatchStatistics",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetPastMatchStatistics(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get past football match lineups
export const getPastFootballMatchLineups = createAsyncThunk(
  "matches/getPastFootballMatchLineups",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetPastMatchLineups(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

const footballMatchesSlice = createSlice(({
  name: 'footballData',
  initialState,
  extraReducers: (builder) => {
    //get upcoming football matches
    builder.addCase(getUpcomingFootballMatches.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getUpcomingFootballMatches.fulfilled, (state, action) => {
      state.upcomingFootballMatches = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getUpcomingFootballMatches.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get past football matches
    builder.addCase(getPastFootballMatches.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getPastFootballMatches.fulfilled, (state, action) => {
      state.pastFootballMatches = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getPastFootballMatches.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get past football match data
    builder.addCase(getPastFootballMatchData.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getPastFootballMatchData.fulfilled, (state, action) => {
      state.particularMatchData = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getPastFootballMatchData.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get past football match summary
    builder.addCase(getPastFootballMatchSummary.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getPastFootballMatchSummary.fulfilled, (state, action) => {
      state.matchSummary = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getPastFootballMatchSummary.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get past football match summary
    builder.addCase(getPastFootballMatchStatistics.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getPastFootballMatchStatistics.fulfilled, (state, action) => {
      state.matchStats = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getPastFootballMatchStatistics.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get past football match lineups
    builder.addCase(getPastFootballMatchLineups.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getPastFootballMatchLineups.fulfilled, (state, action) => {
      state.matchLineups = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getPastFootballMatchLineups.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get live football matches
    builder.addCase(getLiveFootballMatches.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getLiveFootballMatches.fulfilled, (state, action) => {
      state.liveFootballMatches = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getLiveFootballMatches.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })
  }
}))

export default footballMatchesSlice.reducer