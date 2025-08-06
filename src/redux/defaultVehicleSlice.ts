import { createSlice } from '@reduxjs/toolkit';

export type DefaultVehicleState = {
  vehicleId?: number;
};

const initialState: DefaultVehicleState = {};

const defaultVehicleSlice = createSlice({
  name: 'defaultVehicle',
  initialState,
  reducers: {
    setDefaultVehicleId: (state: DefaultVehicleState, action: { payload: number }) => {
      state.vehicleId = action.payload;
    },
    clearDefaultVehicleId: (state: DefaultVehicleState) => {
      state.vehicleId = undefined;
    }
  }
});

export const { setDefaultVehicleId, clearDefaultVehicleId } = defaultVehicleSlice.actions;

export default defaultVehicleSlice.reducer;