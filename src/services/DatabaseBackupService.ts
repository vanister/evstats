import { Directory, Filesystem } from '@capacitor/filesystem';
import { DatabaseManager } from '../data/DatabaseManager';
import { logToDevServer } from '../logger';

export interface DatabaseBackupService {
  share(): Promise<string | null>;
}

export class SqliteDbBackupService implements DatabaseBackupService {
  constructor(private readonly databaseManager: DatabaseManager) {}

  async share(): Promise<string | null> {
    logToDevServer('starting db sharing');

    try {
      const dbPath = await Filesystem.getUri({
        directory: Directory.Documents,
        path: this.databaseManager.fullDatabaseName
      });

      logToDevServer(`db uri: ${dbPath.uri}`);

      // close the existing connection
      // copy the file to the cache directory
      // share via the share sheet
      // delete the temp file

      return null;
    } catch (error) {
      logToDevServer(`error sharing database: ${error}`);

      return error.message;
    } finally {
      // open the connection again
      // logToServer('opening the connection to the db again');
      // await this.databaseManager.openConnection();
    }
  }
}
