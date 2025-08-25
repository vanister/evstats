import { PropsWithChildren, useEffect } from 'react';
import { logToDevServer } from './logger';
import { useServices, useServiceState } from './providers/ServiceProvider';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { useIonAlert } from '@ionic/react';
import { initializeApp } from './redux/thunks/initializeApp';

type AppInitializerProps = PropsWithChildren;

export function AppInitializer({ children }: AppInitializerProps) {
  const [showAlert] = useIonAlert();
  const dispatch = useAppDispatch();
  const serviceReady = useServiceState();
  const rateService = useServices('rateService');
  const vehicleService = useServices('vehicleService');
  const preferenceService = useServices('preferenceService');
  const purchaseService = useServices('purchaseService');
  const appState = useAppSelector((state) => state.app);

  useEffect(() => {
    if (!serviceReady || appState.initialized) {
      if (!serviceReady) {
        logToDevServer('waiting for services to be ready');
      }
      return;
    }

    const initialize = async () => {
      try {
        await dispatch(initializeApp({ rateService, vehicleService, preferenceService, purchaseService })).unwrap();
      } catch (error) {
        logToDevServer(`error initializing app: ${error?.message}`, 'error', error?.stack ?? error, true);
        showAlert('Initialization error');
      }
    };

    initialize();
  }, [serviceReady, dispatch, rateService, vehicleService, preferenceService, purchaseService, showAlert, appState.initialized]);

  if (!appState.initialized) {
    // todo consider showing a loading spinner
    return null;
  }

  return children;
}
