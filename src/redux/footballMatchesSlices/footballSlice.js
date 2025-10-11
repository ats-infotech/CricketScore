const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")
import { handleGetEnglandAndFranceLeagueLiveMatches, handleGetEnglandAndFranceLeaguePastMatches, handleGetEnglandAndFranceLeagueUpcomingMatches, handleGetEnglandAndFranceLeagues, handleGetLiveFootballMatches, handleGetLiveMatchData, handleGetPastFootballMatches, handleGetPastMatchData, handleGetPremiumLeagueLiveMatches, handleGetPremiumLeaguePastMatchData, handleGetPremiumLeaguePastMatches, handleGetPremiumLeagueUpcomingMatches, handleGetPremiumLeagues, handleGetUpcomingFootballMatches } from "utils/footballMatchesContollerApi";

const initialState = {
  upcomingFootballMatches: [],
  pastFootballMatches: [],
  liveFootballMatches: [],
  particularMatchData: [],
  liveMatchData: [],
  premiumLeaguesData: [],
  premiumLeaguesUpcomingMatches: [],
  premiumLeaguesPastMatches: [],
  premiumLeaguesLiveMatches: [],
  premiumLeaguesPastMatchData: [],
  englandAndFranceLeaguesData: [],
  englandAndFranceUpcomingMatches:[],
  englandAndFrancePastMatches:[],
  englandAndFranceLiveMatches:[],
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

// get live football match data
export const getLiveFootballMatchData = createAsyncThunk(
  "matches/getLiveFootballMatchData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetLiveMatchData(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get permium football leagues
export const getPremiumFootballleagues = createAsyncThunk(
  "matches/getPremiumFootballleagues",
  async (params, { rejectWithValue }) => {
    try {
      const response = await handleGetPremiumLeagues(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get permium football league matches
export const getPremiumFootballLeagueUpcomingMatches = createAsyncThunk(
  "matches/getPremiumFootballLeagueUpcomingMatches",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetPremiumLeagueUpcomingMatches(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get permium football league past matches
export const getPremiumFootballLeaguePastMatches = createAsyncThunk(
  "matches/getPremiumFootballLeaguePastMatches",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetPremiumLeaguePastMatches(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get permium football league past match data
export const getPremiumFootballLeaguePastMatchData = createAsyncThunk(
  "matches/getPremiumFootballLeaguePastMatchData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetPremiumLeaguePastMatchData(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get permium football league live matches
export const getPremiumFootballLeagueLiveMatches = createAsyncThunk(
  "matches/getPremiumFootballLeagueLiveMatches",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetPremiumLeagueLiveMatches(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get england and france football leagues 
export const getEnglandAndFranceFootballleaguees = createAsyncThunk(
  "matches/getEnglandAndFranceFootballleaguees",
  async (params, { rejectWithValue }) => {
    try {
      const response = await handleGetEnglandAndFranceLeagues(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get england and france football league upcoming matches
export const getEnglandAndFranceFootballLeagueUpcomingMatches = createAsyncThunk(
  "matches/getEnglandAndFranceFootballLeagueUpcomingMatches",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetEnglandAndFranceLeagueUpcomingMatches(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get england and france football league past matches
export const getEnglandAndFranceFootballLeaguePastMatches = createAsyncThunk(
  "matches/getEnglandAndFranceFootballLeaguePastMatches",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetEnglandAndFranceLeaguePastMatches(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch upcoming football matches");
    }
  }
);

// get england and france football league live matches
export const getEnglandAndFranceFootballLeagueLiveMatches = createAsyncThunk(
  "matches/getEnglandAndFranceFootballLeagueLiveMatches",
  async (id, { rejectWithValue }) => {
    try {
      const response = await handleGetEnglandAndFranceLeagueLiveMatches(id);
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

    //get live football match data
    builder.addCase(getLiveFootballMatchData.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getLiveFootballMatchData.fulfilled, (state, action) => {
      state.liveMatchData = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getLiveFootballMatchData.rejected, (state) => {
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

    //get premium football leagues
    builder.addCase(getPremiumFootballleagues.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getPremiumFootballleagues.fulfilled, (state, action) => {
      state.premiumLeaguesData = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getPremiumFootballleagues.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get premium football league upcoming matches
    builder.addCase(getPremiumFootballLeagueUpcomingMatches.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getPremiumFootballLeagueUpcomingMatches.fulfilled, (state, action) => {
      state.premiumLeaguesUpcomingMatches = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getPremiumFootballLeagueUpcomingMatches.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get premium football league past matches
    builder.addCase(getPremiumFootballLeaguePastMatches.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getPremiumFootballLeaguePastMatches.fulfilled, (state, action) => {
      state.premiumLeaguesPastMatches = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getPremiumFootballLeaguePastMatches.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get premium football league past match Data
    builder.addCase(getPremiumFootballLeaguePastMatchData.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getPremiumFootballLeaguePastMatchData.fulfilled, (state, action) => {
      state.premiumLeaguesPastMatchData = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getPremiumFootballLeaguePastMatchData.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get premium football league live matches
    builder.addCase(getPremiumFootballLeagueLiveMatches.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getPremiumFootballLeagueLiveMatches.fulfilled, (state, action) => {
      state.premiumLeaguesLiveMatches = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getPremiumFootballLeagueLiveMatches.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get england and france football league upcoming matches
    builder.addCase(getEnglandAndFranceFootballLeagueUpcomingMatches.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getEnglandAndFranceFootballLeagueUpcomingMatches.fulfilled, (state, action) => {
      state.englandAndFranceUpcomingMatches = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getEnglandAndFranceFootballLeagueUpcomingMatches.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get england and france football league past matches
    builder.addCase(getEnglandAndFranceFootballLeaguePastMatches.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getEnglandAndFranceFootballLeaguePastMatches.fulfilled, (state, action) => {
      state.englandAndFrancePastMatches = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getEnglandAndFranceFootballLeaguePastMatches.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get england and france football league live matches
    builder.addCase(getEnglandAndFranceFootballLeagueLiveMatches.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getEnglandAndFranceFootballLeagueLiveMatches.fulfilled, (state, action) => {
      state.englandAndFranceLiveMatches = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getEnglandAndFranceFootballLeagueLiveMatches.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })

    //get england and france football leagues
    builder.addCase(getEnglandAndFranceFootballleaguees.pending, (state) => {
      state.success = false
      state.loading = true
      state.status = 'Processing Data'
    })
    builder.addCase(getEnglandAndFranceFootballleaguees.fulfilled, (state, action) => {
      state.englandAndFranceLeaguesData = action?.payload
      state.success = true
      state.loading = false
      state.status = 'Successful'
    })
    builder.addCase(getEnglandAndFranceFootballleaguees.rejected, (state) => {
      state.success = false
      state.loading = false
      state.status = 'Rejected'
    })
  }
}))

export default footballMatchesSlice.reducer