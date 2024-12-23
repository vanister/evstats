import { createSlice } from '@reduxjs/toolkit';
import { Vehicle } from '../models/vehicle';

type VehicleState = {
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle;
};

const initialState: VehicleState = {
  vehicles: []
};

export const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setVehicles: (state, action: { payload: Vehicle[] }) => {
      state.vehicles = action.payload;
    },
    setSelectedVehicle: (state, action: { payload: Vehicle }) => {
      state.selectedVehicle = action.payload;
    },
    deleteVehicle: (state, action: { payload: Vehicle }) => {
      state.vehicles = state.vehicles.filter((v) => v.id !== action.payload.id);
    },
    updateVehicle: (state, action: { payload: Vehicle }) => {
      const idx = state.vehicles.findIndex((v) => v.id === action.payload.id);
      const existing = state.vehicles[idx];

      state.vehicles[idx] = { ...existing, ...action.payload };
    },
    addVehicle: (state, action: { payload: Vehicle }) => {
      state.vehicles.push(action.payload);
    }
  }
});

export const { setVehicles, setSelectedVehicle, deleteVehicle, addVehicle, updateVehicle } =
  vehicleSlice.actions;

export default vehicleSlice.reducer;
