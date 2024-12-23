import { IonRouterOutlet } from '@ionic/react';
import VehicleList from './components/VehicleList';
import { Route } from 'react-router';

export default function VehicleScreen() {
  return (
    <IonRouterOutlet>
      <Route exact path="/tabs/vehicles" component={VehicleList} />
    </IonRouterOutlet>
  );
}
