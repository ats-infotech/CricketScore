const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    data: [],
    auction: false
}


const auctionSlice = createSlice({
    name: 'auction',
    initialState,
    reducers: {
        scheduleAuction: (state, action) => {
            state.data.push({
                ...action.payload,
                auction_time: new Date(action.payload.auction_time).toISOString()
            })
        },
        updateAuction: (state, action) => {
            let findIndex = state.data.findIndex(item => item?.id === action.payload.id)
            if (findIndex !== -1) {
                let updateData = {
                    ...state.data[findIndex],
                    ...action.payload,
                    auction_time: new Date(action.payload.auction_time).toISOString()
                }
                state.data[findIndex] = updateData
            }
        }
    }
})

export const { scheduleAuction, updateAuction } = auctionSlice.actions
export default auctionSlice.reducer