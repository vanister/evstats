import { createAsyncThunk } from '@reduxjs/toolkit';
import { LastUsedState, setLastUsed } from '../lastUsedSlice';
import { getService } from '../../services/ServiceContainer';
import { PreferenceKeys } from '../../constants';

export const updateLastUsed = createAsyncThunk(
  'lastUsed',
  async (lastUsed: LastUsedState, { dispatch }) => {
    const preferenceService = getService('preferenceService');
    // update the preferences
    await preferenceService.set(PreferenceKeys.lastUsedRateTypeId, lastUsed.rateTypeId?.toString());
    await preferenceService.set(PreferenceKeys.LastUsedVehicleId, lastUsed.vehicleId?.toString());

    dispatch(setLastUsed(lastUsed));
  }
);
