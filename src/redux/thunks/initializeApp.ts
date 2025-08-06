import { createAsyncThunk } from '@reduxjs/toolkit';
import { PreferenceKeys } from '../../constants';
import { setRateTypes } from '../rateTypeSlice';
import { setVehicles } from '../vehicleSlice';
import { setRateTypeId, setVehicleId } from '../lastUsedSlice';
import { type ServiceLocator } from '../../services/ServiceContainer';

export const initializeApp = createAsyncThunk(
  'app/initialize',
  async (getService: ServiceLocator, { dispatch }) => {
    const rateService = getService('rateService');
    const vehicleService = getService('vehicleService');
    const preferenceService = getService('preferenceService');
    const rates = await rateService.list();
    const vehicles = await vehicleService.list();

    const lastUsedRate: number = await preferenceService.get(
      PreferenceKeys.LastUsedRateTypeId,
      'number'
    );

    const lastUsedVehicle: number = await preferenceService.get(
      PreferenceKeys.LastUsedVehicleId,
      'number'
    );

    dispatch(setRateTypes(rates));
    dispatch(setVehicles(vehicles));
    dispatch(setRateTypeId(lastUsedRate));
    dispatch(setVehicleId(lastUsedVehicle));
  }
);
