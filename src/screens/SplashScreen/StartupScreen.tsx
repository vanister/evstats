import './StartupScreen.scss';

import { ReactNode, useEffect, useState } from 'react';
import { SplashScreen as IonicSplashScreen } from '@capacitor/splash-screen';
import { Loading } from '../../components/Loading';

export type StartupScreenProps = {
  minDuration: number;
  children: ReactNode;
};

// todo - rename to something other than screen
export function StartupScreen({ children, minDuration }: StartupScreenProps) {
  const [splashLoaded, setSplashLoaded] = useState(false);

  // look up the last selected rate type and vehicle
  // and set those on the root state

  useEffect(() => {
    console.log('splash timeout:', minDuration);

    const id = setTimeout(() => {
      console.log('splash timed out');
      setSplashLoaded(true);
    }, minDuration);

    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!(splashLoaded)) {
      return;
    }

    const closeSplashScreen = async () => {
      await IonicSplashScreen.hide();
    };

    closeSplashScreen();
  }, [splashLoaded]);

  if (!(splashLoaded)) {
    return <Loading />;
  }

  return children;
}
