import { configureStore } from '@reduxjs/toolkit';
import rateTypeReducer from './rateTypeSlice';
import vehicleReducer from './vehicleSlice';
import lastUsedReducer from './lastUsedSlice';
import defaultVehicleReducer from './defaultVehicleSlice';

export const store = configureStore({
  reducer: {
    lastUsed: lastUsedReducer,
    rateType: rateTypeReducer,
    vehicles: vehicleReducer,
    defaultVehicle: defaultVehicleReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
