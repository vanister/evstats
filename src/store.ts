import { configureStore } from '@reduxjs/toolkit';
import rateTypeReducer from './rateTypes/rateTypeSlice';

export const store = configureStore({
  reducer: {
    rateTypes: rateTypeReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
