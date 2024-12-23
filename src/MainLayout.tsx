import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { car, flash, statsChart } from 'ionicons/icons';
import { Route, Redirect } from 'react-router';

import ChargeStatsScreen from './screens/ChargeStatsScreen/ChargeStatsScreen';
import SessionScreen from './screens/SessionScreen/SessionScreen';
import VehicleScreen from './screens/VehicleScreen/VehicleScreen';

export default function MainLayout() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/">
          <Redirect to="/sessions" />
        </Route>
        <Route exact path="/sessions" component={SessionScreen} />
        <Route exact path="/chargestats" component={ChargeStatsScreen} />
        <Route exact path="/vehicles" component={VehicleScreen} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="sessions" href="/sessions">
          <IonIcon icon={flash} />
          <IonLabel>Sessions</IonLabel>
        </IonTabButton>
        <IonTabButton tab="chargestats" href="/chargestats" disabled>
          <IonIcon icon={statsChart} />
          <IonLabel>Charge Stats</IonLabel>
        </IonTabButton>
        <IonTabButton tab="vehicles" href="/vehicles">
          <IonIcon icon={car} />
          <IonLabel>Vehicles</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
