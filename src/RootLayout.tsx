import { IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import Home from './pages/Home';
import VehicleSelection from './pages/vehicles/VehicleSelection';

export type RootLayoutProps = {
  contentId: string;
};

export default function RootLayout(props: RootLayoutProps) {
  return (
    <IonRouterOutlet id={props.contentId}>
      <Route exact path="/home" component={Home} />
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      <Route exact path="/vehicles" component={VehicleSelection} />
    </IonRouterOutlet>
  );
}
