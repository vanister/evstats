import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { logToDevServer } from '../logger';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { createDbContextInstance, DbContext } from './DbContext';
import { migrations } from './migrations';

export interface DatabaseManager {
  get context(): DbContext;
  get fullDatabaseName(): string;
  openConnection(options?: ConnectionOptions): Promise<void>;
  closeConnection(): Promise<void>;
  getVersion(): Promise<number>;
}

export type ConnectionOptions = {
  encrypted?: boolean;
  mode?: 'no-encryption';
  readOnly?: boolean;
  version?: number;
};

const DEFAULT_CONNECTION_OPTIONS: ConnectionOptions = {
  encrypted: false,
  mode: 'no-encryption',
  readOnly: false,
  version: 1
};

let instance: SqliteDatabaseManager;

/** Gets a singleton instance of a DatabaseManager. */
export function getInstance(): DatabaseManager {
  if (!instance) {
    logToDevServer('creating a new instance of the db context');
    instance = new SqliteDatabaseManager();
  }

  return instance;
}

class SqliteDatabaseManager implements DatabaseManager {
  private db: SQLiteDBConnection;
  private dbContext: DbContext;

  constructor(
    private readonly dbName = 'evstats.db',
    private readonly sqlite = new SQLiteConnection(CapacitorSQLite),
    private readonly fileSystem = Filesystem,
    private readonly createDbContext = createDbContextInstance
  ) {}

  get context(): DbContext {
    if (!this.dbContext) {
      this.dbContext = this.createDbContext(this.db);
    }

    return this.dbContext;
  }

  get fullDatabaseName() {
    const fullDbName = `${this.dbName.replace('.db', 'SQLite.db')}`;

    return fullDbName;
  }

  async openConnection(options: ConnectionOptions = DEFAULT_CONNECTION_OPTIONS): Promise<void> {
    const { dbName } = this;
    const { encrypted, mode, readOnly, version } = options;

    try {
      logToDevServer('attempting to open a sqlite connection');

      const isConnConsistent = (await this.sqlite.checkConnectionsConsistency()).result;
      const isConnection = (await this.sqlite.isConnection(dbName, readOnly)).result;

      if (isConnConsistent && isConnection) {
        logToDevServer('sqlite connection exists, retrieving');
        this.db = await this.sqlite.retrieveConnection(dbName, readOnly);
      } else {
        logToDevServer('adding migration scripts');
        await this.sqlite.addUpgradeStatement(dbName, migrations);

        logToDevServer('creating new sqlite connection');
        this.db = await this.sqlite.createConnection(dbName, encrypted, mode, version, readOnly);
      }

      logToDevServer('sqlite connection successful');
      logToDevServer(`opening db: ${dbName}`);

      await this.db.open();
      await this.printDbPath();
    } catch (error) {
      logToDevServer(`Connection error: ${error}`);
      alert(error);

      throw error;
    }
  }

  async closeConnection(): Promise<void> {
    try {
      logToDevServer('attempting to close db connection');

      await this.db?.close();

      this.db = null;
      this.dbContext = null;

      logToDevServer('db connection closed');
    } catch (error) {
      logToDevServer(`Error closing db connection: ${error}`);
    }
  }

  async getVersion(): Promise<number> {
    const { version } = await this.db.getVersion();

    return version;
  }

  private async printDbPath() {
    const dbPath = await this.fileSystem.getUri({
      directory: Directory.Documents,
      path: this.fullDatabaseName
    });

    logToDevServer(`db located at: ${dbPath.uri}`);
  }
}
