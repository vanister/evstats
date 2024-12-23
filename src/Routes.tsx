import { IonRouterOutlet } from '@ionic/react';
import { Route } from 'react-router';
import MainLayout from './MainLayout';
// import VehicleScreen from './screens/VehicleScreen/VehicleScreen';

export default function Routes() {
  return (
    <IonRouterOutlet>
      <Route path="/" render={() => <MainLayout />} />
      {/* <Route exact path="/vehicles" render={() => <VehicleScreen />} /> */}
    </IonRouterOutlet>
  );
}
