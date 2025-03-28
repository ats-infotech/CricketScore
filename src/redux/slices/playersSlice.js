import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: []
}

const playerSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        createPlayerData: (state, action) => {
            state.data.push(...action.payload)
        },
        updatePlayerData: (state, action) => {
            let data = action.payload[0]
            const { id } = data;
            const index = state.data.findIndex(item => item?.id === id)
            if (index !== -1) {
                state.data[index] = { ...data }
            }
        },
        deletePlayerData: (state, action) => {
            let { playerId } = action.payload
            state.data = state.data.filter(item => item?.id !== playerId)
        },
        deleteMultiplePlayerData: (state, action) => {
            let {playerId} = action.payload
            const playerIdSet = new Set(playerId);
            state.data = state.data.filter(item => !playerIdSet.has(item?.id))
        },
        deletePlayers: (state, action) => {
            const { selectedPlayer } = action.payload;
            const playersToDelete = new Set([...selectedPlayer.team1, ...selectedPlayer.team2]);
            if (playersToDelete) {
                selectedPlayer.team1 = selectedPlayer.team1.filter(id => !playersToDelete.has(id));
                selectedPlayer.team2 = selectedPlayer.team2.filter(id => !playersToDelete.has(id));
                state.selectedPlayer = selectedPlayer;
            }
        },
        updatePlayersStats: (state, action) => {
            const { players } = action.payload;
            players.forEach(stat => {
                const { playerId, ...stats } = stat;
                const index = state.data.findIndex(player => player.id === playerId);
                if (index !== -1) {
                    state.data[index] = {
                        ...state.data[index],
                        innings: (state.data[index].innings || 0) + (stats.innings || 0),
                        battingruns: (state.data[index].battingruns || 0) + (stats.battingrun || 0),
                        battingballs: (state.data[index].battingballs || 0) + (stats.battingball || 0),
                        battingfour: (state.data[index].battingfour || 0) + (stats.battingfour || 0),
                        battingsix: (state.data[index].battingsix || 0) + (stats.battingsix || 0),
                        battingout: (state.data[index].battingout || 0) + (stats.battingout || 0),
                        bowlingruns: (state.data[index].bowlingruns || 0) + (stats.bowlingrun || 0),
                        bowlingballs: (state.data[index].bowlingballs || 0) + (stats.bowlingball || 0),
                        bowlingwickets: (state.data[index].bowlingwickets || 0) + (stats.bowlingwickets || 0),
                        bowlingovers: (state.data[index].bowlingovers || 0) + (stats.bowlingover || 0)
                    };
                }
            });
        },
    }
})

export const { createPlayerData, updatePlayerData, deleteMultiplePlayerData, deletePlayerData, deletePlayers, updatePlayersStats } = playerSlice.actions
export const playersState = (state) => state.players
export default playerSlice.reducer