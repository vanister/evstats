import { createSlice } from '@reduxjs/toolkit';
import { initializeApp } from './thunks/initializeApp';

export type AppState = {
  initialized: boolean;
  error?: string;
};

const initialState: AppState = {
  initialized: false
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeApp.fulfilled, (state) => {
      state.initialized = true;
    });
    builder.addCase(initializeApp.rejected, (state, action) => {
      state.initialized = false;
      state.error = action.error.message;
    });
  }
});

export default appSlice.reducer;
