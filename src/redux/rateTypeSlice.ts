import { createSlice } from '@reduxjs/toolkit';
import { RateType } from '../models/rateType';

type RateTypeState = {
  rateTypes: RateType[];
  lastUsed?: number;
};

const initialState: RateTypeState = {
  rateTypes: []
};

export const rateTypeSlice = createSlice({
  name: 'rateTypes',
  initialState,
  reducers: {
    setRateTypes: (state, action: { payload: RateType[] }) => {
      state.rateTypes = action.payload;
    },
    setLastUsed: (state, action: { payload: number }) => {
      state.lastUsed = action.payload;
    }
  }
});

export const { setRateTypes, setLastUsed } = rateTypeSlice.actions;

export default rateTypeSlice.reducer;
