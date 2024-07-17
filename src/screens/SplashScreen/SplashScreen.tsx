import './SplashScreen.scss';

import { ReactNode, useEffect, useState } from 'react';
import { useIonRouter } from '@ionic/react';
import { SplashScreen as IonicSplashScreen } from '@capacitor/splash-screen';
import { Loading } from '../../components/Loading';

export type SplashScreenProps = {
  minDuration: number;
  children: ReactNode;
};

export function SplashScreen({ children, minDuration }: SplashScreenProps) {
  const [loading, setLoading] = useState(true);
  const _router = useIonRouter();

  useEffect(() => {
    const closeSplashScreen = async () => {
      await IonicSplashScreen.hide();
    };

    const id = setTimeout(() => {
      setLoading(false);
      closeSplashScreen();
    }, minDuration);

    return () => clearTimeout(id);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return children;
}
