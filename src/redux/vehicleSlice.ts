import { createSlice } from '@reduxjs/toolkit';
import { Vehicle } from '../models/vehicle';

const initialState: Vehicle[] = [];

export const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setVehicles: (_, action: { payload: Vehicle[] }) => {
      // todo - turn into a map of vehicles by id
      return action.payload;
    },
    deleteVehicle: (state, action: { payload: Vehicle }) => {
      return state.filter((v) => v.id !== action.payload.id);
    },
    updateVehicle: (state, action: { payload: Vehicle }) => {
      const idx = state.findIndex((v) => v.id === action.payload.id);
      const existing = state[idx];

      state[idx] = { ...existing, ...action.payload };
    },
    addVehicle: (state, action: { payload: Vehicle }) => {
      state.push(action.payload);
    }
  }
});

export const { setVehicles, deleteVehicle, addVehicle, updateVehicle } = vehicleSlice.actions;

export default vehicleSlice.reducer;
