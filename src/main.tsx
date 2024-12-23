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
import { logToConsole } from './logger';
import { getInstance } from './data/DatabaseManager';
import { registerAppStateListeners } from './appStateListeners';
import { ErrorBoundary } from 'react-error-boundary';
import RootError from './components/RootError';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// configure all of the chart components that are used by the app
Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip);

const databaseManager = getInstance();
const container = document.getElementById('root');
const root = createRoot(container!);

logToConsole('starting up...');
registerAppStateListeners(databaseManager);

databaseManager
  .openConnection()
  .then(() => databaseManager.initializeDb())
  .then(() => {
    logToConsole('rendering the root component');

    root.render(
      <React.StrictMode>
        <ErrorBoundary fallbackRender={({ error }) => <RootError message={error.message} />}>
          <Provider store={store}>
            <DatabaseManagerProvider manager={databaseManager}>
              <App />
            </DatabaseManagerProvider>
          </Provider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    logToConsole('error starting up...', error);
    alert(`Error starting app: ${error?.message}`);
  });
