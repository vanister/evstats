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

import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ServiceProvider } from './providers/ServiceProvider';
import Routes from './Routes';
import { logToConsole } from './logger';
import { useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';

// todo - remove once andriod is supported
setupIonicReact({ mode: 'ios' });

export default function App() {
  useEffect(() => {
    const hideSplashScreen = async () => {
      logToConsole('app initialized, taking down splash screen');
      await SplashScreen.hide();
    };

    hideSplashScreen();
  }, []);

  return (
    <ServiceProvider>
      <IonApp>
        <IonReactRouter>
          <Routes />
        </IonReactRouter>
      </IonApp>
    </ServiceProvider>
  );
}
