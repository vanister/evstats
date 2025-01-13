import { createSlice } from '@reduxjs/toolkit';

export type LastUsedState = {
  vehicleId?: number;
  rateTypeId?: number;
};

const initialState: LastUsedState = {};

const lastUsedSlice = createSlice({
  name: 'lastUsed',
  initialState,
  reducers: {
    setVehicleId: (state: LastUsedState, action: { payload: number }) => {
      state.vehicleId = action.payload;
    },
    setRateTypeId: (state: LastUsedState, action: { payload: number }) => {
      state.rateTypeId = action.payload;
    },
    setLastUsed: (state: LastUsedState, action: { payload: Partial<LastUsedState> }) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { setLastUsed, setRateTypeId, setVehicleId } = lastUsedSlice.actions;

export default lastUsedSlice.reducer;
