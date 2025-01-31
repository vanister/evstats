import { PropsWithChildren, useEffect, useState } from 'react';
import { logToServer } from './logger';
import { SplashScreen } from '@capacitor/splash-screen';
import { useServices, useServiceState } from './providers/ServiceProvider';
import { setRateTypes } from './redux/rateTypeSlice';
import { setVehicles } from './redux/vehicleSlice';
import { useAppDispatch } from './redux/hooks';
import { useIonAlert } from '@ionic/react';
import { PreferenceKeys } from './constants';
import { setRateTypeId, setVehicleId } from './redux/lastUsedSlice';

type AppInitializerProps = PropsWithChildren;

export function AppInitializer({ children }: AppInitializerProps) {
  const [showAlert] = useIonAlert();
  const [initialized, setInitialized] = useState(false);
  const dispatch = useAppDispatch();
  const serviceReady = useServiceState();
  const preferenceService = useServices('preferenceService');
  const rateService = useServices('rateService');
  const vehicleService = useServices('vehicleService');

  useEffect(() => {
    if (!serviceReady) {
      logToServer('app already initialized');
      return;
    }

    // todo - create thunk
    const initializeApp = async () => {
      try {
        logToServer('initializing app');
        logToServer('loading rates');

        const rates = await rateService.list();
        const vehicles = await vehicleService.list();
        const lastUsedRate = await preferenceService.get<number>(
          PreferenceKeys.lastUsedRateTypeId,
          'number'
        );
        const lastUsedVehicle = await preferenceService.get<number>(
          PreferenceKeys.LastUsedVehicleId,
          'number'
        );

        dispatch(setRateTypes(rates));
        dispatch(setVehicles(vehicles));
        dispatch(setRateTypeId(lastUsedRate));
        dispatch(setVehicleId(lastUsedVehicle));

        setInitialized(true);

        logToServer('app initialized');
        logToServer('taking down splash screen');
        await SplashScreen.hide();
      } catch (error) {
        logToServer(`error initializing app: ${error}`);
        showAlert('Initialization error');
      }
    };

    initializeApp();
  }, [serviceReady]);

  if (!initialized) {
    return null;
  }

  return children;
}
