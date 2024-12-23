import { IonRouterOutlet } from '@ionic/react';
import { Route } from 'react-router';
import MainLayout from './MainLayout';

export default function Routes() {
  return (
    <IonRouterOutlet>
      <Route path="/" component={MainLayout} />
    </IonRouterOutlet>
  );
}
