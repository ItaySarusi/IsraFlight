import { configureStore } from '@reduxjs/toolkit';
import connectionReducer from './slices/connectionSlice';
import filtersReducer from './slices/filtersSlice';

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 