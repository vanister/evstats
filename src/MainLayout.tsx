import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { flash, statsChart } from 'ionicons/icons';
import { Route, Redirect } from 'react-router';

import SessionPage from './pages/sessions/SessionPage';
import ChargeStats from './pages/stats/ChargeStats';

export default function MainLayout() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/">
          <Redirect to="/sessions" />
        </Route>
        <Route exact path="/sessions" component={SessionPage} />
        <Route exact path="/stats" component={ChargeStats} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="sessions" href="/sessions">
          <IonIcon icon={flash} />
          <IonLabel>Sessions</IonLabel>
        </IonTabButton>
        <IonTabButton tab="stats" href="/stats">
          <IonIcon icon={statsChart} />
          <IonLabel>Charge Stats</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
