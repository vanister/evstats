import { PropsWithChildren, useEffect, useState } from 'react';
import { logToConsole } from './logger';
import { SplashScreen } from '@capacitor/splash-screen';
import { useServices, useServiceState } from './providers/ServiceProvider';
import { setRateTypes } from './redux/rateTypeSlice';
import { setVehicles } from './redux/vehicleSlice';
import { useAppDispatch } from './redux/hooks';

type AppInitializerProps = PropsWithChildren;

export function AppInitializer({ children }: AppInitializerProps) {
  const [initialized, setInitialized] = useState(false);
  const dispatch = useAppDispatch();
  const serviceReady = useServiceState();
  const rateService = useServices('rateService');
  const vehicleService = useServices('vehicleService');

  useEffect(() => {
    if (!serviceReady) {
      return;
    }

    // todo - clean up
    const initializeApp = async () => {
      try {
        logToConsole('initializing app');
        logToConsole('loading rates');

        const rates = await rateService.list();
        dispatch(setRateTypes(rates));

        const vehicles = await vehicleService.list();
        dispatch(setVehicles(vehicles));

        setInitialized(true);

        logToConsole('app initialized');
        logToConsole('taking down splash screen');
        await SplashScreen.hide();
      } catch (error) {
        logToConsole('error initializing app:', error);
        alert('Error initializing');
      }
    };

    initializeApp();
  }, [serviceReady]);

  if (!initialized) {
    return null;
  }

  return children;
}
