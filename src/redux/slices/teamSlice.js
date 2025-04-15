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
        // updateTeamStats: (state, action) => {
        //     const { teams } = action.payload;
        //     console.log(teams);
            

        //     teams.forEach(stat => {
        //         const { teamId, ...stats } = stat;
        //         const index = state.data.findIndex(teams => teams.id === teamId);

        //         if (index !== -1) {
        //             state.data[index] = {
        //                 ...state.data[index],
        //                 match: (state.data[index].match ?? 0) + (stats.match ?? 0),
        //                 point: (state.data[index].point ?? 0) + (stats.point ?? 0),
        //                 win: (state.data[index].win ?? 0) + (stats.win ?? 0),
        //                 lose: (state.data[index].lose ?? 0) + (stats.lose ?? 0),
        //                 tie: (state.data[index].tie ?? 0) + (stats.tie ?? 0),
        //                 // nrr: (state.data[index].nrr ?? 0) + (stats.nrr ?? 0),
        //                 wicket: (state.data[index].wicket ?? 0) + (stats.wicket ?? 0),
        //                 runs: (state.data[index].runs ?? 0) + (stats.runs ?? 0),
        //                 overs: (state.data[index].overs ?? 0) + (stats.overs ?? 0),
        //                 balls: (state.data[index].balls ?? 0) + (stats.balls ?? 0),
        //                 noresult: (state.data[index].noresult ?? 0) + (stats.noresult ?? 0),
        //                 againtsruns: (state.data[index].againtsruns ?? 0) + (stats.againtsruns ?? 0),
        //                 againtsballs: (state.data[index].againtsballs ?? 0) + (stats.againtsballs ?? 0),
        //                 againtsovers: (state.data[index].againtsovers ?? 0) + (stats.againtsovers ?? 0),
        //             };
        //         }
        //     });
        // }
        updateTeamStats: (state, action) => {
            const { teams } = action.payload;
            
            teams.forEach(stat => {
                const { teamId, ...stats } = stat;
                const index = state.data.findIndex(team => team.id === teamId);
                
                if (index !== -1) {
                    const currentTeam = state.data[index];

                    // Standard cumulative stats
                    const updatedStats = {
                        ...currentTeam,
                        match: (currentTeam.match ?? 0) + (stats.match ?? 0),
                        point: (currentTeam.point ?? 0) + (stats.point ?? 0),
                        win: (currentTeam.win ?? 0) + (stats.win ?? 0),
                        lose: (currentTeam.lose ?? 0) + (stats.lose ?? 0),
                        tie: (currentTeam.tie ?? 0) + (stats.tie ?? 0),
                        wicket: (currentTeam.wicket ?? 0) + (stats.wicket ?? 0),
                        runs: (currentTeam.runs ?? 0) + (stats.runs ?? 0),
                        noresult: (currentTeam.noresult ?? 0) + (stats.noresult ?? 0),
                        balls: (currentTeam.balls ?? 0) + (stats.balls ?? 0),
                        overs: (currentTeam.overs ?? 0) + (stats.overs ?? 0) + Math.floor((currentTeam.balls ?? 0 + (stats.balls ?? 0)) / 6),
                        againtsruns: (currentTeam.againtsruns ?? 0) + (stats.againtsruns ?? 0),
                        againtsballs: (currentTeam.againtsballs ?? 0) + (stats.againtsballs ?? 0),
                        againtsovers: (currentTeam.againtsovers ?? 0) + (stats.againtsovers ?? 0),
                    };
                    state.data[index] = updatedStats;
                } else {
                    console.warn(`Team with ID ${teamId} not found in state`);
                }
            });
        },
        updateAuctionTeamStats: (state, action) => {
            const { teams } = action.payload;
            teams.forEach(stat => {
                const { teamId, ...stats } = stat;
                const index = state.data.findIndex(team => team.id === teamId);
                if (index !== -1) {
                    const currentTeam = state.data[index];
                    const updatedStats = {
                        ...currentTeam,
                        wallet: (stats.wallet ?? 0),
                        players: (stats.players ?? 0),
                    };
                    state.data[index] = updatedStats;
                } else {
                    console.warn(`Team with ID ${teamId} not found in state`);
                }
            });
        }
    }
})

export const { createTeams, updateTeamStats, deleteTeam, deleteMultipleTeams, updateTeam, updateAuctionTeamStats } = teamSlice.actions
export const teamsState = (state) => state.teams
export default teamSlice.reducer