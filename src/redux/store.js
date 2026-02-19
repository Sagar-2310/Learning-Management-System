import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 1. Create the root reducer by combining all slices
const rootReducer = combineReducers({
    auth: authSlice,
    // Add other slices here as your LMS grows (e.g., courses: courseSlice)
});

// 2. Setup Persistence Configuration
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

// 3. Create the persisted reducer (This was missing!)
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
export default store;