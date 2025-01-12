import { configureStore } from '@reduxjs/toolkit';
import rateTypeReducer from './rateTypeSlice';
import vehicleReducer from './vehicleSlice';
import lastUsedReducer from './lastUsedSlice';

export const store = configureStore({
  reducer: {
    lastUsed: lastUsedReducer,
    rateType: rateTypeReducer,
    vehicles: vehicleReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
