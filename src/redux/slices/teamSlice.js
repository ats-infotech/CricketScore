import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: []
}

const teamSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        createTeams: (state, action) => {
            state.data.push(action.payload)
        },
        updateTeam: (state, action) => {
            let { id, ...rest } = action.payload
            const index = state.data.findIndex(item => item?.id === id)
            if (index !== -1) {
                state.data[index] = { ...state.data[index], ...rest };
            }
        },
        deleteTeam: (state, action) => {
            let { teamId } = action.payload
            const index = state.data.findIndex(item => item?.id === teamId);
            if (index !== -1) {
                state.data.splice(index, 1);
            }
        },
        deleteMultipleTeams: (state, action) => {
            const { teamIds } = action.payload;
            state.data = state.data.filter(item => !teamIds.includes(item.id));
        },
        updateTeamStats: (state, action) => {
            const { teams } = action.payload;

            teams.forEach(stat => {
                const { teamId, ...stats } = stat;
                const index = state.data.findIndex(teams => teams.id === teamId);

                if (index !== -1) {
                    state.data[index] = {
                        ...state.data[index],
                        match: (state.data[index].match ?? 0) + (stats.match ?? 0),
                        point: (state.data[index].point ?? 0) + (stats.point ?? 0),
                        win: (state.data[index].win ?? 0) + (stats.win ?? 0),
                        lose: (state.data[index].lose ?? 0) + (stats.lose ?? 0),
                        tie: (state.data[index].tie ?? 0) + (stats.tie ?? 0),
                        nrr: (state.data[index].nrr ?? 0) + (stats.nrr ?? 0),
                        noreason: (state.data[index].noreason ?? 0) + (stats.noreason ?? 0)
                    };
                }
            });
        }
    }
})

export const { createTeams, updateTeamStats, deleteTeam, deleteMultipleTeams, updateTeam } = teamSlice.actions
export const teamsState = (state) => state.teams
export default teamSlice.reducer