import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 