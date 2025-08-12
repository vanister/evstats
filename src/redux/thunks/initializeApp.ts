import { createAsyncThunk } from '@reduxjs/toolkit';
import { SplashScreen } from '@capacitor/splash-screen';
import { PreferenceKeys } from '../../constants';
import { setRateTypes } from '../rateTypeSlice';
import { setVehicles } from '../vehicleSlice';
import { setRateTypeId, setVehicleId } from '../lastUsedSlice';
import { setDefaultVehicleId } from '../defaultVehicleSlice';
import { RateService } from '../../services/RateService';
import { VehicleService } from '../../services/VehicleService';
import { PreferenceService } from '../../services/PreferenceService';
import { logToDevServer } from '../../logger';

type InitializeAppArgs = {
  rateService: RateService;
  vehicleService: VehicleService;
  preferenceService: PreferenceService;
};

export const initializeApp = createAsyncThunk(
  'app/initialize',
  async ({ rateService, vehicleService, preferenceService }: InitializeAppArgs, { dispatch }) => {
    try {
      logToDevServer('initializing app');
      logToDevServer('loading rates');
      
      const rates = await rateService.list();
      const vehicles = await vehicleService.list();
      const lastUsedRate = await preferenceService.get<number>(
        PreferenceKeys.LastUsedRateTypeId,
        'number'
      );
      const lastUsedVehicle = await preferenceService.get<number>(
        PreferenceKeys.LastUsedVehicleId,
        'number'
      );
      const defaultVehicle = await preferenceService.get<number>(
        PreferenceKeys.DefaultVehicleId,
        'number'
      );

      dispatch(setRateTypes(rates));
      dispatch(setVehicles(vehicles));
      dispatch(setRateTypeId(lastUsedRate));
      dispatch(setVehicleId(lastUsedVehicle));
      dispatch(setDefaultVehicleId(defaultVehicle));

      logToDevServer('app initialized');
      logToDevServer('taking down splash screen');
      await SplashScreen.hide();
    } catch (error) {
      logToDevServer(`error initializing app: ${error?.message}`, 'error', error?.stack ?? error, true);
      throw error;
    }
  }
);
