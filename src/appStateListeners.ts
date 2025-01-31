import { App as IonicApp } from '@capacitor/app';
import { logToDevServer } from './logger';
import { DatabaseManager } from './data/DatabaseManager';

/**
 * Listens for `pause` and `resume` app state changes and response
 * by opening and closing the database connection.
 *
 * @param databaseManager The database manager.
 */
export function registerAppStateListeners(databaseManager: DatabaseManager) {
  logToDevServer('registering app state change listeners');

  IonicApp.addListener('pause', async () => {
    logToDevServer('app paused, closing sqlite connection');

    try {
      await databaseManager.closeConnection();
    } catch (error) {
      logToDevServer(`failed to close the sqlite connection: ${error}`);
    }
  });

  IonicApp.addListener('resume', async () => {
    logToDevServer('app resume, opening sqlite connection');

    try {
      await databaseManager.openConnection();
    } catch (error) {
      logToDevServer('failed to reopen sqlite connection');
    }
  });
}
