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
            if (!Array.isArray(state.data)) {
                console.warn("state.data was null or not an array, resetting it.");
                state.data = [];
            }
            state.data.push({ ...action.payload });
        },
        AddCurrentPlayer: (state, action) => {
            const { id, CurrentPlayer } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        CurrentPlayer: [...CurrentPlayer],
                    }
                    : item
            );
        },
        AddSoldPlayer: (state, action) => {
            const { id, SoldPlayers } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        SoldPlayers: [
                            ...(item.SoldPlayers || []),
                            ...SoldPlayers,
                        ]
                    }
                    : item
            );
        },
        AddUnsoldPlayer: (state, action) => {
            const { id, UnsoldPlayer } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        UnsoldPlayer: [
                            ...(item.UnsoldPlayer || []),
                            ...UnsoldPlayer,
                        ]
                    }
                    : item
            );
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

export const { scheduleAuction, updateAuction, AddCurrentPlayer, AddSoldPlayer, AddUnsoldPlayer } = auctionSlice.actions
export default auctionSlice.reducer