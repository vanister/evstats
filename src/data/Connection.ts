import { SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

export interface DatabaseOptions {
  name: string;
  encrypted?: boolean;
  mode?: 'no-encryption';
  version?: number;
  readOnly?: boolean;
}

export interface Connection {
  // todo - abstract SQLiteDBConnection into EvsDbConnection
  openDatabase(): Promise<SQLiteDBConnection>;
  closeDatabase(): Promise<void>;
}

export class EvsConnection implements Connection {
  private readonly defaultDatabaseOptions: DatabaseOptions = {
    name: 'evstats_db',
    mode: 'no-encryption',
    encrypted: false,
    version: 1,
    readOnly: false
  };

  private db?: SQLiteDBConnection;
  private dbIsOpen = false;

  constructor(
    private readonly connection: SQLiteConnection,
    private readonly databaseOptions?: DatabaseOptions
  ) {
    this.databaseOptions = databaseOptions ?? this.defaultDatabaseOptions;
  }

  get isOpen() {
    return this.dbIsOpen && !!this.db;
  }

  async openDatabase(): Promise<SQLiteDBConnection> {
    console.log('opening the db');

    if (this.isOpen) {
      console.log('db already open');
      return this.db!;
    }

    console.log('checking to see if connection is already open');

    const { name, encrypted, mode, version, readOnly } = this.databaseOptions!;
    const { result } = await this.connection.isConnection(name, readOnly!);

    console.log('db already open?:', result);

    this.db = result
      ? await this.connection.retrieveConnection(name, readOnly!)
      : await this.connection.createConnection(name, encrypted!, mode!, version!, readOnly!);

    console.log('db connection established');

    this.dbIsOpen = true;

    return this.db;
  }

  async closeDatabase(): Promise<void> {
    console.log('closing db connction');

    await this.db?.close();
    await this.connection.closeAllConnections();

    this.dbIsOpen = false;
  }
}
