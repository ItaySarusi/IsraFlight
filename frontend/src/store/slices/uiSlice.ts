import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  isAddFlightModalOpen: boolean;
}

const initialState: UIState = {
  isAddFlightModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddFlightModal: (state) => {
      state.isAddFlightModalOpen = true;
    },
    closeAddFlightModal: (state) => {
      state.isAddFlightModalOpen = false;
    },
  },
});

export const { openAddFlightModal, closeAddFlightModal } = uiSlice.actions;
export default uiSlice.reducer; 