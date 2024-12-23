import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { car, flash, statsChart } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';
import ChargeStatsScreen from './screens/ChargeStatsScreen/ChargeStatsScreen';
import SessionScreen from './screens/SessionScreen/SessionScreen';
import VehicleScreen from './screens/VehicleScreen/VehicleScreen';

export default function MainLayout() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/sessions" component={SessionScreen} />
        <Route exact path="/tabs/chargestats" component={ChargeStatsScreen} />
        <Route exact path="/tabs/vehicles" component={VehicleScreen} />
        <Redirect to="/tabs/sessions" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="sessions" href="/tabs/sessions">
          <IonIcon icon={flash} />
          <IonLabel>Sessions</IonLabel>
        </IonTabButton>
        <IonTabButton tab="chargestats" href="/tabs/chargestats">
          <IonIcon icon={statsChart} />
          <IonLabel>Charge Stats</IonLabel>
        </IonTabButton>
        <IonTabButton tab="vehicles" href="/tabs/vehicles">
          <IonIcon icon={car} />
          <IonLabel>Vehicles</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
