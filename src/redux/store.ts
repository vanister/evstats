import { configureStore } from '@reduxjs/toolkit';
import rateTypeReducer from './rateTypeSlice';
import vehicleReducer from './vehicleSlice';

export const store = configureStore({
  reducer: {
    // todo - break out last used into its own slice
    rateTypes: rateTypeReducer,
    vehicles: vehicleReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
