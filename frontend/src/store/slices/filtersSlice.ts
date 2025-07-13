import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlightFilters, FlightStatus } from '../../types/flight';

interface FiltersState {
  filters: FlightFilters;
}

const initialState: FiltersState = {
  filters: {
    status: undefined,
    destination: undefined,
    searchKeyword: undefined,
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<FlightStatus | undefined>) => {
      state.filters.status = action.payload;
    },
    setDestinationFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.destination = action.payload;
    },
    setSearchKeyword: (state, action: PayloadAction<string | undefined>) => {
      state.filters.searchKeyword = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        status: undefined,
        destination: undefined,
        searchKeyword: undefined,
      };
    },
    setFilters: (state, action: PayloadAction<FlightFilters>) => {
      state.filters = action.payload;
    },
  },
});

export const {
  setStatusFilter,
  setDestinationFilter,
  setSearchKeyword,
  clearFilters,
  setFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer; 