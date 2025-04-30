import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    current: {
        striker: null,
        nonStriker: null,
        bowler: null
    }
}

const playerScoreBoardSlice = createSlice({
    name: 'playerscoreboard',
    initialState,
    reducers: {
    }
})

export const playerScoreState = (state) => state.playerscoreboard
export default playerScoreBoardSlice.reducer