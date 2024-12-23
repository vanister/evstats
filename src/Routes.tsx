import { IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from 'react-router';
import MainLayout from './MainLayout';

export default function Routes() {
  return (
    <IonRouterOutlet>
      <Route path="/tabs" component={MainLayout} />
      <Route exact path="/">
        <Redirect to="/tabs" />
      </Route>
    </IonRouterOutlet>
  );
}
