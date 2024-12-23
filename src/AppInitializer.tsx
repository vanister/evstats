import { PropsWithChildren, useEffect, useState } from 'react';
import { logToConsole } from './logger';
import { useHistory } from 'react-router';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonSpinner } from '@ionic/react';
import { useServices } from './providers/ServiceProvider';
import { useAppDispatch } from './hooks';
import { setRateTypes } from './redux/rateTypeSlice';
import { setVehicles } from './redux/vehicleSlice';

type AppInitializerProps = PropsWithChildren;

export function AppInitializer({ children }: AppInitializerProps) {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const rateService = useServices('rateService');
  const vehicleService = useServices('vehicleService');

  useEffect(() => {
    // todo - clean up
    const initializeApp = async () => {
      logToConsole('initializing app');
      logToConsole('loading rates');

      const rates = await rateService.list();
      dispatch(setRateTypes(rates));

      const vehicles = await vehicleService.list();
      dispatch(setVehicles(vehicles));

      logToConsole('taking down splash screen');
      await SplashScreen.hide();

      setLoading(false);
      // todo - check to see if there are vehicles in the db
      history.replace('/vehicles');
      logToConsole('app initialized');
    };

    initializeApp();
  }, []);

  if (loading) {
    return <IonSpinner />;
  }

  return children;
}
