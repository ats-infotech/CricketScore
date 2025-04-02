import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: []
}

const matchSlice = createSlice({
    name: 'matches',
    initialState,
    reducers: {
        createMatchSchedule: (state, action) => {
            state.data.push(action.payload)
        },
        editMatchSchedule: (state, action) => {
            const { id, ...updatedMatchData } = action.payload;
            const index = state.data.findIndex((match) => match.id === id);
            if (index !== -1) {
                state.data[index] = { ...state.data[index], ...updatedMatchData };
            }
        },
        deleteMatchSchedule: (state, action) => {
            const { matchId } = action.payload;
            const index = state.data.findIndex(item => item?.id === matchId)
            if (index !== -1) {
                state.data.splice(index, 1)
            }
        },
        deleteAllMatchesForTournament: (state, action) => {
            const { tournamentId } = action.payload;
            const remainingMatches = state.data.filter(item => item?.tournamentId !== tournamentId);
            state.data = remainingMatches;
        },
        autoMatchSchedule: (state, action) => {
            let data = action.payload
            data.length > 0 && data.forEach(element => {
                state.data.push(element)
            });
        },
        ReplaceMatchSchedule: (state, action) => {
            const { id , ...rest} = action.payload
            state.data = state.data.map((item) =>
                item.id === id ? { ...item, ...rest } : item
            );
        },
        MatchBreakSchedule: (state, action) => {
            const { id, ...rest } = action.payload
            state.data = state.data.map((item) =>
                item.id === id ? { ...item, ...rest } : item
            );
        },
        ChangeStatus: (state, action) => {
            const { id, status } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    status
                } : item)
        },
        UpdatePartnership: (state, action) => {
            const { id, partnership } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    partnership
                } : item)
        },
        MatchTerminate: (state, action) => {
            const { id, terminate } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    terminate
                } : item)
        },
        DescreaseMatchOvers: (state, action) => {
            const { id, totalovers } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    totalovers
                } : item)
        },
        ChangeMatchTarget: (state, action) => {
            const { id, target } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    target
                } : item)
        },
        ChangeMatchOver: (state, action) => {
            const { id, targetedOver } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    targetedOver
                } : item)
        },
        ChangePlayer: (state, action) => {
            const { id, striker, nonStriker, bowler } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    playerselection: {
                        ...item.playerselection,
                        striker,
                        nonStriker,
                        bowler,
                    }
                } : item)
        },
        ChangeOverPerDay: (state, action) => {
            const { id, day1, day2, day3, day4, day5 } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    perDayOver: {
                        ...item.perDayOver,
                        day1,
                        day2,
                        day3,
                        day4,
                        day5
                    }
                } : item)
        },
        ChangeInnings: (state, action) => {
            const { id, currentInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    currentInnings
                } : item)
        },
        AddCommentary: (state, action) => {
            const { id, Commentary } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    Commentary: [
                        ...(item.Commentary || []),
                        Commentary,
                    ]
                } : item
            );
        },
        AddInnings: (state, action) => {
            const { id, firstInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    firstInnings: {
                        ...item.firstInnings,
                        Currentover: [
                            firstInnings.Currentover,
                        ]
                    }
                } : item
            );
        },
        AddOver: (state, action) => {
            const { id, firstInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    firstInnings: {
                        ...item.firstInnings,
                        Completedovers: [
                            ...(item.firstInnings.Completedovers || []),
                            firstInnings.Completedovers,
                        ]
                    }
                } : item
            );
        },
        AddDeclareStatus: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    firstInnings: {
                        ...item.firstInnings,
                        declare: "yes"
                    }
                } : item
            );
        },
        AddWicket: (state, action) => {
            const { id, firstInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    firstInnings: {
                        ...item.firstInnings,
                        Wickets: [
                            ...(item.firstInnings.Wickets || []),
                            firstInnings.Wickets,
                        ]
                    }
                } : item
            );
        },
        RemoveWicket: (state, action) => {
            const { id, BatterId } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    firstInnings: {
                        ...item.firstInnings,
                        Wickets: item.firstInnings.Wickets
                            .filter(wicket => wicket.BatterId !== BatterId)
                    }
                } : item
            );
        },
        ReplaceBattingOrder: (state, action) => {
            const { id, firstInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    firstInnings: {
                        ...item.firstInnings,
                        BattingOrder: [
                            firstInnings.BattingOrder,
                        ]
                    }
                } : item
            );
        },
        AddExtra: (state, action) => {
            const { id, firstInnings } = action.payload;

            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    firstInnings: {
                        ...item.firstInnings,
                        Extras: [
                            ...(item.firstInnings.Extras || []),
                            firstInnings.Extras,
                        ]
                    }
                } : item
            );
        },
        RemoveExtra: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    firstInnings: {
                        ...item.firstInnings,
                        Extras: item.firstInnings.Extras.slice(0, -1)
                    }
                } : item
            );
        },
        AddSecondInnings: (state, action) => {
            const { id, secondInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    secondInnings: {
                        ...item.secondInnings,
                        Currentover: [
                            secondInnings.Currentover,
                        ]
                    }
                } : item
            );
        },
        AddSecondInningsOver: (state, action) => {
            const { id, secondInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    secondInnings: {
                        ...item.secondInnings,
                        Completedovers: [
                            ...(item.secondInnings.Completedovers || []),
                            secondInnings.Completedovers,
                        ]
                    }
                } : item
            );
        },
        AddSecondInningsDeclareStatus: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    secondInnings: {
                        ...item.secondInnings,
                        declare: "yes"
                    }
                } : item
            );
        },
        RemoveOver: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    secondInnings: {
                        ...item.secondInnings,
                        Completedovers: item.secondInnings.Completedovers.filter((_, index, arr) => index < arr.length - 1)
                    }
                } : item
            );
        },
        AddSecondInningsWicket: (state, action) => {
            const { id, secondInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    secondInnings: {
                        ...item.secondInnings,
                        Wickets: [
                            ...(item.secondInnings.Wickets || []),
                            secondInnings.Wickets,
                        ]
                    }
                } : item
            );
        },
        AddSecondInningsExtra: (state, action) => {
            const { id, secondInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    secondInnings: {
                        ...item.secondInnings,
                        Extras: [
                            ...(item.secondInnings.Extras || []),
                            secondInnings.Extras,
                        ]
                    }
                } : item
            );
        },
        RemoveSecondInningsExtra: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    secondInnings: {
                        ...item.secondInnings,
                        Extras: item.secondInnings.Extras.slice(0, -1)
                    }
                } : item
            );
        },
        RemoveSecondInningsWicket: (state, action) => {
            const { id, BatterId } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    secondInnings: {
                        ...item.secondInnings,
                        Wickets: item.secondInnings.Wickets
                            .filter(wicket => wicket.BatterId !== BatterId)
                    }
                } : item
            );
        },
        ReplaceSecondInningsBattingOrder: (state, action) => {
            const { id, secondInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    secondInnings: {
                        ...item.secondInnings,
                        BattingOrder: [
                            secondInnings.BattingOrder,
                        ]
                    }
                } : item
            );
        },
        AddSuperOverInnings: (state, action) => {
            const { id, superOverFirstInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverFirstInnings: {
                        ...item.superOverFirstInnings,
                        Currentover: [
                            superOverFirstInnings.Currentover,
                        ]
                    }
                } : item
            );
        },
        AddSuperOverCompletedOver: (state, action) => {
            const { id, superOverFirstInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverFirstInnings: {
                        ...item.superOverFirstInnings,
                        Completedovers: [
                            ...(item.superOverFirstInnings.Completedovers || []),
                            superOverFirstInnings.Completedovers,
                        ]
                    }
                } : item
            );
        },
        AddSuperOverDeclareStatus: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverFirstInnings: {
                        ...item.superOverFirstInnings,
                        declare: "yes"
                    }
                } : item
            );
        },
        RemoveSuperOverCompletedOver: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverFirstInnings: {
                        ...item.superOverFirstInnings,
                        Completedovers: item.superOverFirstInnings.Completedovers.filter((_, index, arr) => index < arr.length - 1)
                    }
                } : item
            );
        },
        AddSuperOverWicket: (state, action) => {
            const { id, superOverFirstInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverFirstInnings: {
                        ...item.superOverFirstInnings,
                        Wickets: [
                            ...(item.superOverFirstInnings.Wickets || []),
                            superOverFirstInnings.Wickets,
                        ]
                    }
                } : item
            );
        },
        AddSuperOverExtra: (state, action) => {
            const { id, superOverFirstInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverFirstInnings: {
                        ...item.superOverFirstInnings,
                        Extras: [
                            ...(item.superOverFirstInnings.Extras || []),
                            superOverFirstInnings.Extras,
                        ]
                    }
                } : item
            );
        },
        RemoveSuperOverExtra: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverFirstInnings: {
                        ...item.superOverFirstInnings,
                        Extras: item.superOverFirstInnings.Extras.slice(0, -1)
                    }
                } : item
            );
        },
        RemoveSuperOverWicket: (state, action) => {
            const { id, BatterId } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverFirstInnings: {
                        ...item.superOverFirstInnings,
                        Wickets: item.superOverFirstInnings.Wickets
                            .filter(wicket => wicket.BatterId !== BatterId)
                    }
                } : item
            );
        },
        ReplaceSuperOverBattingOrder: (state, action) => {
            const { id, superOverFirstInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverFirstInnings: {
                        ...item.superOverFirstInnings,
                        BattingOrder: [
                            superOverFirstInnings.BattingOrder,
                        ]
                    }
                } : item
            );
        },
        AddSuperOverSecondInnings: (state, action) => {
            const { id, superOverSecondInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverSecondInnings: {
                        ...item.superOverSecondInnings,
                        Currentover: [
                            superOverSecondInnings.Currentover,
                        ]
                    }
                } : item
            );
        },
        AddSuperOverSecondInningsCompletedOver: (state, action) => {
            const { id, superOverSecondInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverSecondInnings: {
                        ...item.superOverSecondInnings,
                        Completedovers: [
                            ...(item.superOverSecondInnings.Completedovers || []),
                            superOverSecondInnings.Completedovers,
                        ]
                    }
                } : item
            );
        },
        RemoveSuperOverSecondInningsCompletedOver: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverSecondInnings: {
                        ...item.superOverSecondInnings,
                        Completedovers: item.superOverSecondInnings.Completedovers.filter((_, index, arr) => index < arr.length - 1)
                    }
                } : item
            );
        },
        AddSuperOverSecondInningsWicket: (state, action) => {
            const { id, superOverSecondInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverSecondInnings: {
                        ...item.superOverSecondInnings,
                        Wickets: [
                            ...(item.superOverSecondInnings.Wickets || []),
                            superOverSecondInnings.Wickets,
                        ]
                    }
                } : item
            );
        },
        AddSuperOverSecondInningsExtra: (state, action) => {
            const { id, superOverSecondInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverSecondInnings: {
                        ...item.superOverSecondInnings,
                        Extras: [
                            ...(item.superOverSecondInnings.Extras || []),
                            superOverSecondInnings.Extras,
                        ]
                    }
                } : item
            );
        },
        RemoveSuperOverSecondInningsExtra: (state, action) => {
            const { id } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverSecondInnings: {
                        ...item.superOverSecondInnings,
                        Extras: item.superOverSecondInnings.Extras.slice(0, -1)
                    }
                } : item
            );
        },
        RemoveSuperOverSecondInningsWicket: (state, action) => {
            const { id, BatterId } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverSecondInnings: {
                        ...item.superOverSecondInnings,
                        Wickets: item.superOverSecondInnings.Wickets
                            .filter(wicket => wicket.BatterId !== BatterId)
                    }
                } : item
            );
        },
        ReplaceSuperOverSecondInningsBattingOrder: (state, action) => {
            const { id, superOverSecondInnings } = action.payload;
            state.data = state.data.map((item) =>
                item.id === id ? {
                    ...item,
                    superOverSecondInnings: {
                        ...item.superOverSecondInnings,
                        BattingOrder: [
                            superOverSecondInnings.BattingOrder,
                        ]
                    }
                } : item
            );
        },
    }
})

export const { createMatchSchedule, editMatchSchedule, deleteMatchSchedule, deleteAllMatchesForTournament, autoMatchSchedule, ReplaceMatchSchedule, AddInnings, AddOver, ChangeMatchOver, ChangeMatchTarget,
    AddWicket, RemoveExtra, AddExtra, RemoveWicket, ChangePlayer, ChangeInnings, AddSecondInnings, AddSecondInningsOver, AddSecondInningsWicket, AddSecondInningsExtra, MatchTerminate, UpdatePartnership,
    RemoveSecondInningsExtra, RemoveSecondInningsWicket, AddSuperOverInnings, AddSuperOverSecondInnings, RemoveSuperOverWicket, ChangeStatus, AddSuperOverWicket, AddSuperOverExtra, DescreaseMatchOvers,
    RemoveSuperOverExtra, AddSuperOverSecondInningsWicket, AddSuperOverSecondInningsExtra, RemoveSuperOverSecondInningsExtra, RemoveSuperOverSecondInningsWicket, AddCommentary, RemoveOver,
    ReplaceBattingOrder, ReplaceSecondInningsBattingOrder, ReplaceSuperOverBattingOrder, ReplaceSuperOverSecondInningsBattingOrder, AddSuperOverCompletedOver, AddSuperOverSecondInningsCompletedOver,
    RemoveSuperOverCompletedOver, RemoveSuperOverSecondInningsCompletedOver, MatchBreakSchedule, ChangeOverPerDay, AddDeclareStatus, AddSecondInningsDeclareStatus, AddSuperOverDeclareStatus } = matchSlice.actions
export const matchesState = (state) => state.matches
export default matchSlice.reducer