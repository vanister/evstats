import { configureStore } from '@reduxjs/toolkit';
import rateTypeReducer from './rateTypeSlice';
import vehicleReducer from './vehicleSlice';

export const store = configureStore({
  reducer: {
    rateTypes: rateTypeReducer,
    vehicles: vehicleReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
