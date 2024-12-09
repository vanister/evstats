import { PropsWithChildren, useEffect, useState } from 'react';
import { logToConsole } from './logger';
import { useHistory } from 'react-router';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonSpinner } from '@ionic/react';

type AppInitializerProps = PropsWithChildren;

export function AppInitializer({ children }: AppInitializerProps) {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const hideSplashScreen = async () => {
      logToConsole('taking down splash screen');
      await SplashScreen.hide();
    };

    const initializeApp = async () => {
      await hideSplashScreen();
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
