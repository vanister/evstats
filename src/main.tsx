import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import DatabaseManagerProvider from './providers/DatabaseManagerProvider';
import { logToDevServer } from './logger';
import { getInstance } from './data/DatabaseManager';
import { registerAppStateListeners } from './appStateListeners';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ServiceProvider } from './providers/ServiceProvider';
import { getService, initializeServiceContainer } from './services/ServiceContainer';
import { migrations } from './data/migrations';
import AlertableError from './components/AlertableError';

logToDevServer('---------- starting up ----------');

// configure all of the chart components that are used by the app
Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip);

const currentDbVersion = 1;
const databaseManager = getInstance();
const container = document.getElementById('root');
const root = createRoot(container!);

logToDevServer(`app running in "${import.meta.env.MODE}" mode`);
registerAppStateListeners(databaseManager);

databaseManager
  .openConnection({ version: currentDbVersion, migrations })
  .then(() => {
    logToDevServer('rendering the root component');

    root.render(
      <React.StrictMode>
        <ErrorBoundary fallbackRender={({ error }) => <AlertableError message={error.message} />}>
          <Provider store={store}>
            <DatabaseManagerProvider manager={databaseManager}>
              <ServiceProvider
                containerInitializer={initializeServiceContainer}
                serviceLocator={getService}
              >
                <App />
              </ServiceProvider>
            </DatabaseManagerProvider>
          </Provider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    logToDevServer(`error starting app: ${error?.message}`, 'error', error?.stack ?? error, true);
    alert(`Error starting app: ${error?.message}`);
  });
