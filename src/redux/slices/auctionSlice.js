const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    data: null,
    auction: false
}


const auctionSlice = createSlice({
    name: 'auction',
    initialState,
    reducers: {
        scheduleAuction: (state, action) => {
            state.data = action.payload
        },
        updateAuction: (state, action) => {
            state.data = { ...state.data, ...action.payload }
        }
    }
})

export const { scheduleAuction, updateAuction } = auctionSlice.actions
export default auctionSlice.reducer