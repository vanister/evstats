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
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.scss';

import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Routes from './Routes';
import { AppInitializer } from './AppInitializer';
import { ServiceProvider } from './providers/ServiceProvider';
import { getService, initializeServiceContainer } from './services/ServiceContainer';

setupIonicReact({ mode: 'ios' });

export default function App() {
  return (
    <IonApp>
      <ServiceProvider
        containerInitializer={initializeServiceContainer}
        serviceLocator={getService}
      >
        <IonReactRouter>
          <AppInitializer>
            <Routes />
          </AppInitializer>
        </IonReactRouter>
      </ServiceProvider>
    </IonApp>
  );
}
