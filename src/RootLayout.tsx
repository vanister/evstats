import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { carSport, flash, statsChart } from 'ionicons/icons';
import { Route, Redirect } from 'react-router';
import VehiclePage from './pages/vehicles/VehiclePage';
import SessionPage from './pages/sessions/SessionPage';
import ChargeStats from './pages/stats/ChargeStats';

interface RootLayoutProps {
  contentId: string;
}

export default function RootLayout(props: RootLayoutProps) {
  return (
    <IonTabs>
      <IonRouterOutlet id={props.contentId}>
        <Route exact path="/sessions" component={SessionPage} />
        <Route exact path="/">
          <Redirect to="/sessions" />
        </Route>
        <Route exact path="/vehicles" component={VehiclePage} />
        <Route exact path="/stats" component={ChargeStats} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="sessions" href="/sessions">
          <IonIcon icon={flash} />
          <IonLabel>Sessions</IonLabel>
        </IonTabButton>
        <IonTabButton tab="vehicles" href="/vehicles">
          <IonIcon icon={carSport} />
          <IonLabel>Vehicles</IonLabel>
        </IonTabButton>
        <IonTabButton tab="stats" href="/stats">
          <IonIcon icon={statsChart} />
          <IonLabel>Charge Stats</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
