import { createSlice } from "@reduxjs/toolkit"

const initialState = {
   data:[]
}

const tournamentSlice = createSlice({
    name:'tournament',
    initialState,
    reducers:{
        createTornament: (state, action) => {
            state.data.push(action.payload)
        },
        editTournament: (state, action) => {
            const { id, updatedFields } = action.payload;
            const index = state.data.findIndex(tournament => tournament.id === id);
            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index], 
                    ...updatedFields,
                };
            }
        },
        deleteTournament: (state, action) => {
            const { tournamentId } = action.payload;
            const index = state.data.findIndex(item => item.id === tournamentId);
            if (index !== -1) {
                state.data.splice(index, 1);
            }
        },
        ReplaceTournamentGroups: (state, action) => {
            const { id } = action.payload
            state.data = state.data.map((item) =>
                item.id === id ? { ...item, ...action.payload } : item
            );
        },
        UpdateTournamentGroups: (state, action) => {
            const { id, group_id, updatedGroup } = action.payload;
            state.data = state.data.map((item) => {
                if (item.id === id) {
                    item.Group = item.Group.map((group) =>
                        group.id === group_id 
                            ? { ...group, ...updatedGroup }
                            : group
                    );
                }
                return item;
            });
        },
        updateTournamentStats: (state, action) => {
            const { id, matches } = action.payload;
            const tournament = state.data.find(t => t.id === id);
            if (tournament) {
                tournament.matches += matches.matches ?? 0;
                tournament.innings += matches.innings ?? 0;
                tournament.runs += matches.runs ?? 0;
                tournament.wickets += matches.wickets ?? 0;
                tournament.balls += matches.balls ?? 0;
                tournament.extras += matches.extras ?? 0;
                tournament.fours += matches.fours ?? 0;
                tournament.sixes += matches.sixes ?? 0;
                tournament.fiftys += matches.fiftys ?? 0;
                tournament.hundreds += matches.hundreds ?? 0;
                tournament.fiftypartnerships += matches.fiftypartnerships ?? 0;
                tournament.hundredspartnerships += matches.hundredspartnerships ?? 0;
                tournament.maidens += matches.maidens ?? 0;
                tournament.dotballs += matches.dotballs ?? 0;
                tournament.catches += matches.catches ?? 0;
                tournament.stumpings += matches.stumpings ?? 0;
            }
        }
    }
})

export const { createTornament, editTournament, deleteTournament, ReplaceTournamentGroups, UpdateTournamentGroups, updateTournamentStats } = tournamentSlice.actions
export const tournamentState = (state) => state.tournament
export default tournamentSlice.reducer