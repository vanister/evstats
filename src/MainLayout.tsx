import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { car, flash, settings, statsChart } from 'ionicons/icons';
import { Route } from 'react-router';
import ChargeStatsScreen from './screens/ChargeStatsScreen/ChargeStatsScreen';
import SessionScreen from './screens/SessionScreen/SessionScreen';
import SettingsScreen from './screens/SettingsScreen/SettingsScreen';
import { useAppSelector } from './redux/hooks';
import VehicleScreen from './screens/VehicleScreen/VehicleScreen';
import MainRouteRedirect from './MainRouteRedirect';

export default function MainLayout() {
  const hasVehicles = useAppSelector((s) => s.vehicle.vehicles.length > 0);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/sessions" component={SessionScreen} />
        <Route exact path="/chargestats" component={ChargeStatsScreen} />
        <Route exact path="/vehicles" component={VehicleScreen} />
        <Route exact path="/settings" component={SettingsScreen} />
        <Route exact path="/">
          <MainRouteRedirect />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="sessions" href="/sessions" disabled={!hasVehicles}>
          <IonIcon icon={flash} />
          <IonLabel>Sessions</IonLabel>
        </IonTabButton>
        <IonTabButton tab="chargestats" href="/chargestats" disabled={!hasVehicles}>
          <IonIcon icon={statsChart} />
          <IonLabel>Charge Stats</IonLabel>
        </IonTabButton>
        <IonTabButton tab="vehicles" href="/vehicles">
          <IonIcon icon={car} />
          <IonLabel>Vehicles</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/settings" disabled={!hasVehicles}>
          <IonIcon icon={settings} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
