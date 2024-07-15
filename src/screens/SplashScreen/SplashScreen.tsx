import './SplashScreen.scss';

import { ReactNode, useEffect, useState } from 'react';
import { useIonRouter } from '@ionic/react';
import { Loading } from '../../components/Loading';

export type SplashScreenProps = {
  minDuration: number;
  children: ReactNode;
};

export function SplashScreen({ children, minDuration }: SplashScreenProps) {
  const [loading, setLoading] = useState(true);
  const _router = useIonRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, minDuration);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return children;
}
