import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlightFilters, FlightStatus } from '../../types/flight';

const initialState: FlightFilters = {
  status: '',
  destination: '',
  searchQuery: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<FlightStatus | ''>) => {
      state.status = action.payload;
    },
    setDestinationFilter: (state, action: PayloadAction<string>) => {
      state.destination = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.status = '';
      state.destination = '';
      state.searchQuery = '';
    },
  },
});

export const { setStatusFilter, setDestinationFilter, setSearchQuery, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer; 