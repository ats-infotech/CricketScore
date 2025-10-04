import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import auctionSlice from './slices/auctionSlice';
import matchSlice from './slices/matchSlice';
import playerScoreBoardSlice from './slices/playerScoreBoardSlice';
import playersSlice from './slices/playersSlice';
import teamSlice from './slices/teamSlice';
import tournamentSlice from './slices/tournamentSlice';
import matchesSlice from './internationalMatchesSlices/matchesSlice';
import footballMatchesSlice from './footballMatchesSlices/footballSlice';
import storage from './storage';

const persistConfig = {
    key: 'root',
    storage,
    // whitelist: ['tournament', 'teams', 'players', 'matches', 'playerscoreboard', 'auction'],
}

const rootReducer = combineReducers({
    tournament: tournamentSlice,
    teams: teamSlice,
    players: playersSlice,
    matches: matchSlice,
    playerscoreboard: playerScoreBoardSlice,
    auction: auctionSlice,
    matchData: matchesSlice,
    footballData: footballMatchesSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
