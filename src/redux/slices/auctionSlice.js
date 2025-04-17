const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    data: []
}

// auction status
// 1 - scheduled
// 2 - started
// 3 - completed

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
        statusUpdateAuction: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? { ...item, ...action.payload} : item
            );
        },
        addCurrentPlayer: (state, action) => {
            const { id, currentPlayer } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        currentPlayer: currentPlayer,
                    }
                    : item
            );
        },
        addSoldPlayer: (state, action) => {
            const { id, soldPlayers } = action.payload;

            state.data = state.data.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        soldPlayers: [
                            ...(item.soldPlayers || []),
                            soldPlayers,
                        ]
                    }
                    : item
            );
        },
        addUnsoldPlayer: (state, action) => {
            const { id, unsoldPlayers } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        unsoldPlayers: [
                            ...(item.unsoldPlayers || []),
                            unsoldPlayers,
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
        },
        handleReauctionUnsold: (state, action) => {
            const { id } = action.payload
            state.data = state.data.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        unsoldPlayers: []
                    }
                    : item
            );
        },
        handleResetAuction: (state, action) => {
            const { id } = action.payload
            state.data = state.data.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        soldPlayers: [],
                        unsoldPlayers: []
                    }
                    : item
            );
        },

    }
})

export const { scheduleAuction, statusUpdateAuction, updateAuction, addCurrentPlayer, addSoldPlayer, addUnsoldPlayer, handleReauctionUnsold, handleResetAuction } = auctionSlice.actions
export const auctionState = (state) => state.auction
export default auctionSlice.reducer