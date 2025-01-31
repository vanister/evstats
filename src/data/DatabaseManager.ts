import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { logToServer } from '../logger';
import { InitTableSql } from './sql/InitTableSql';
import { PragmaSql } from './sql/PragmaSql';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { SeedSql } from './sql/seedData';
import { ViewSql } from './sql/ViewSql';
import { createDbContextInstance, DbContext } from './DbContext';

export interface DatabaseManager {
  get context(): DbContext;
  get fullDatabaseName(): string;
  openConnection(options?: ConnectionOptions): Promise<void>;
  closeConnection(): Promise<void>;
  initializeDb(): Promise<void>;
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
    logToServer('creating a new instance of the db context');
    instance = new SqliteDatabaseManager();
  }

  return instance;
}

class SqliteDatabaseManager implements DatabaseManager {
  private db: SQLiteDBConnection;
  private dbContext: DbContext;
  private currentVersion: number;

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
      logToServer('attempting to open a sqlite connection');

      const isConnConsistent = (await this.sqlite.checkConnectionsConsistency()).result;
      const isConnection = (await this.sqlite.isConnection(dbName, readOnly)).result;

      if (isConnConsistent && isConnection) {
        logToServer('sqlite connection exists, retrieving');
        this.db = await this.sqlite.retrieveConnection(dbName, readOnly);
      } else {
        logToServer('creating new sqlite connection');
        this.db = await this.sqlite.createConnection(dbName, encrypted, mode, version, readOnly);
      }

      logToServer('sqlite connection successful');
      logToServer(`opening db: ${dbName}`);

      await this.db.open();
    } catch (error) {
      logToServer(`Connection error: ${error}`);
      alert(error);

      throw error;
    }
  }

  async closeConnection(): Promise<void> {
    try {
      logToServer('attempting to close db connection');

      await this.db?.close();

      this.db = null;
      this.dbContext = null;

      logToServer('db connection closed');
    } catch (error) {
      logToServer(`Error closing db connection: ${error}`);
    }
  }

  async initializeDb(): Promise<void> {
    // todo - look into versioning/migrations
    try {
      logToServer('inializing db');
      await this.printDbPath();

      const dbVersion = await this.getVersion();

      if (dbVersion > 0) {
        logToServer(`db already initalized, current version: ${dbVersion}`);
        return;
      }

      const tableResults = await this.db.executeSet([
        { statement: InitTableSql.CreateRateTypeTable, values: [] },
        { statement: InitTableSql.CreateVehiclesTable, values: [] },
        { statement: InitTableSql.CreateSessionsTable, values: [] },
        { statement: InitTableSql.SetInitialVersion, values: [] },
        { statement: ViewSql.VehicleChargeSummary, values: [] }
      ]);

      logToServer(`table created: ${tableResults.changes}`);

      const seedResults = await this.db.execute(SeedSql.RateTypes);

      logToServer(`seeding tables: ${seedResults.changes}`);
      logToServer('db initalized');
    } catch (error) {
      logToServer('error initializing db', error);
      alert(error);

      throw error;
    }
  }

  async getVersion(): Promise<number> {
    if (this.currentVersion != null) {
      return this.currentVersion;
    }

    const { values } = await this.db.query(PragmaSql.GetDbVersion);
    const result = values?.[0];
    const version = result?.user_version ?? 0;

    this.currentVersion = version;

    return version;
  }

  private async printDbPath() {
    const dbPath = await this.fileSystem.getUri({
      directory: Directory.Documents,
      path: this.fullDatabaseName
    });

    logToServer(`db located at: ${dbPath.uri}`);
  }
}
