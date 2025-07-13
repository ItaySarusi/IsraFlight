import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isAddFlightModalOpen: boolean;
  isConnected: boolean;
}

const initialState: UIState = {
  isAddFlightModalOpen: false,
  isConnected: false,
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
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { openAddFlightModal, closeAddFlightModal, setConnectionStatus } = uiSlice.actions;
export default uiSlice.reducer; 