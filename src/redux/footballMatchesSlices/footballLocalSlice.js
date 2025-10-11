import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    leagueType: '',
}

const footballLocalSlice = createSlice({
    name: 'footballLocal',
    initialState,
    reducers: {
        SelectedFootballLeague: (state, action) => {
            state.leagueType = action.payload
        },

        removeSelectedFootballLeague: (state) => {
            state.leagueType = ''
        },
    }
})

export const { SelectedFootballLeague, removeSelectedFootballLeague } = footballLocalSlice.actions

export const footballLocalState = (state) => state.local
export default footballLocalSlice.reducer