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
import { DatabaseManager } from './DatabaseManager';
import DatabaseManagerProvider from './DatabaseManagerProvider';
import { App as IonicApp } from '@capacitor/app';
import { logToConsole } from './logger';

// configure all of the chart components that are used by the app
Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip);

const databaseManager = new DatabaseManager();
const container = document.getElementById('root');
const root = createRoot(container!);

// todo - clean up
IonicApp.addListener('pause', async () => {
  logToConsole('app paused');

  try {
    await databaseManager.closeConnection();
  } catch (error) {
    logToConsole('failed to close the sqlite connection:', error);
  }
});

IonicApp.addListener('resume', async () => {
  logToConsole('app resume');

  try {
    await databaseManager.openConnection();
  } catch (error) {
    logToConsole('failed to reopen sqlite connection');
  }
});

logToConsole('starting up...');

databaseManager
  .openConnection()
  .then(() => databaseManager.initializeDb())
  .then(() => {
    logToConsole('rendering the root component');

    root.render(
      <React.StrictMode>
        <DatabaseManagerProvider manager={databaseManager}>
          <App />
        </DatabaseManagerProvider>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    logToConsole('error starting up...', error);
    alert(`Error starting app: ${error?.message}`);
  });
