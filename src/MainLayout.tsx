import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { car, flash, statsChart } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';
import ChargeStatsScreen from './screens/ChargeStatsScreen/ChargeStatsScreen';
import SessionScreen from './screens/SessionScreen/SessionScreen';
import VehicleDetails from './screens/VehicleScreen/components/VehicleDetails';
import VehicleList from './screens/VehicleScreen/components/VehicleList';

export default function MainLayout() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/sessions" />
        <Route exact path="/sessions" component={SessionScreen} />
        <Route exact path="/chargestats" component={ChargeStatsScreen} />
        <Route exact path="/vehicles" component={VehicleList} />
        <Route exact path="/vehicles/details" component={VehicleDetails} />
        <Route exact path="/">
          <Redirect to="/sessions" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="sessions" href="/sessions">
          <IonIcon icon={flash} />
          <IonLabel>Sessions</IonLabel>
        </IonTabButton>
        <IonTabButton tab="chargestats" href="/chargestats">
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
