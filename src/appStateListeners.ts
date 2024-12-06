import { App as IonicApp } from '@capacitor/app';
import { logToConsole } from './logger';
import { DatabaseManager } from './data/DatabaseManager';

/**
 * Listens for `pause` and `resume` app state changes and response
 * by opening and closing the database connection.
 *
 * @param databaseManager The database manager.
 */
export function registerAppStateListeners(databaseManager: DatabaseManager) {
  logToConsole('registering app state change listeners');

  IonicApp.addListener('pause', async () => {
    logToConsole('app paused, closing sqlite connection');

    try {
      await databaseManager.closeConnection();
    } catch (error) {
      logToConsole('failed to close the sqlite connection:', error);
    }
  });

  IonicApp.addListener('resume', async () => {
    logToConsole('app resume, opening sqlite connection');

    try {
      await databaseManager.openConnection();
    } catch (error) {
      logToConsole('failed to reopen sqlite connection');
    }
  });
}
