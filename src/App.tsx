/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */

// todo - revert back to system theme
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.scss';

import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import MainLayout from './MainLayout';
import { Route } from 'react-router';
import VehicleScreen from './screens/vehicles/VehicleScreen';
import { ServiceProvider } from './providers/ServiceProvider';

// todo - remove
setupIonicReact({ mode: 'ios' });

export default function App() {
  return (
    <IonApp>
      {/* <DatabaseProvider name="evstats_db"> */}
      <ServiceProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" render={() => <MainLayout />} />
            <Route exact path="/vehicles" render={() => <VehicleScreen />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </ServiceProvider>
      {/* </DatabaseProvider> */}
    </IonApp>
  );
}
