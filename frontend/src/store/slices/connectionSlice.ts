import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectionStatus } from '../../types/flight';

interface ConnectionState {
  status: ConnectionStatus;
}

const initialState: ConnectionState = {
  status: {
    isConnected: false,
    connectionId: undefined,
  },
};

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<string>) => {
      state.status.isConnected = true;
      state.status.connectionId = action.payload;
    },
    setDisconnected: (state) => {
      state.status.isConnected = false;
      state.status.connectionId = undefined;
    },
  },
});

export const { setConnected, setDisconnected } = connectionSlice.actions;
export default connectionSlice.reducer; 