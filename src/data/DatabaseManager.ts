import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { logToConsole } from '../logger';
import { InitTableSql } from './sql/InitTableSql';
import { SeedSql } from './sql/SeedSql';

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

let instance: DatabaseManager;

/** Gets a singleton instance of a DatabaseManager. */
export function getInstance(): DatabaseManager {
  if (!instance) {
    instance = new DatabaseManager();
  }

  return instance;
}

export class DatabaseManager {
  private readonly sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null;

  constructor(sqlite?: SQLiteConnection) {
    this.sqlite = sqlite ?? new SQLiteConnection(CapacitorSQLite);
  }

  get context(): SQLiteDBConnection | null {
    return this.db;
  }

  async initializeDb(): Promise<void> {
    try {
      logToConsole('inializing db');

      const tableResults = await this.db.executeSet([
        { statement: InitTableSql.CREATE_RATE_TYPE_TABLE, values: [] },
        { statement: InitTableSql.CREATE_VEHICLES_TABLE, values: [] },
        { statement: InitTableSql.CREATE_SESSIONS_TABLE, values: [] }
      ]);

      logToConsole('table created:', tableResults.changes);

      const seedResults = await this.db.execute(SeedSql.SEED_RATE_TYPES);

      logToConsole('seeding tables:', seedResults.changes);
      logToConsole('db initalized');
    } catch (error) {
      logToConsole('error initializing db', error);
      alert(error);

      throw error;
    }
  }

  async openConnection(
    dbName: string = 'evstats.db',
    options: ConnectionOptions = DEFAULT_CONNECTION_OPTIONS
  ): Promise<SQLiteDBConnection> {
    const { encrypted, mode, readOnly, version } = options;

    try {
      logToConsole('attempting to open a sqlite connection');

      const isConnConsistent = (await this.sqlite.checkConnectionsConsistency()).result;
      const isConnection = (await this.sqlite.isConnection(dbName, readOnly)).result;

      if (isConnConsistent && isConnection) {
        this.db = await this.sqlite.retrieveConnection(dbName, readOnly);
      } else {
        this.db = await this.sqlite.createConnection(dbName, encrypted, mode, version, readOnly);
      }

      logToConsole('sqlite connection successful');
      logToConsole('opening db:', dbName);

      await this.db.open();

      return this.db;
    } catch (error) {
      logToConsole('Connection error:', error);
      alert(error);

      throw error;
    }
  }

  async closeConnection(): Promise<void> {
    try {
      logToConsole('attempting to close db connection');

      await this.db?.close();
      this.db = null;

      logToConsole('db connection closed');
    } catch (error) {
      logToConsole('Error closing db connection', error);
    }
  }
}
