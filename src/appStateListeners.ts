import { App as IonicApp } from '@capacitor/app';
import { logToServer } from './logger';
import { DatabaseManager } from './data/DatabaseManager';

/**
 * Listens for `pause` and `resume` app state changes and response
 * by opening and closing the database connection.
 *
 * @param databaseManager The database manager.
 */
export function registerAppStateListeners(databaseManager: DatabaseManager) {
  logToServer('registering app state change listeners');

  IonicApp.addListener('pause', async () => {
    logToServer('app paused, closing sqlite connection');

    try {
      await databaseManager.closeConnection();
    } catch (error) {
      logToServer(`failed to close the sqlite connection: ${error}`);
    }
  });

  IonicApp.addListener('resume', async () => {
    logToServer('app resume, opening sqlite connection');

    try {
      await databaseManager.openConnection();
    } catch (error) {
      logToServer('failed to reopen sqlite connection');
    }
  });
}
