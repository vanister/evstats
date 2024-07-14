import { Changes, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Connection } from './Connection';
import { ExplicitAny } from 'evs-types';

export type BatchStatement = {
  /** The sql statement to run. */
  statement?: string;
  /** The sql params for the statement. */
  values?: ExplicitAny[];
};

export interface DbContext {
  get isInitialized(): boolean;

  /**
   * Initialize the context and opens a connection to the database.
   *
   * @param tableInitStatements The create table statements to run.
   * @param seedStatements The table seed statements to run.
   */
  init(tableInitStatements?: BatchStatement[], seedStatements?: BatchStatement[]): Promise<void>;

  /** Disposes the context and closes the connection to the database. */
  dispose(): Promise<void>;

  execute(sql: string, ...params: ExplicitAny[]): Promise<Changes | undefined>;
  query<T>(sql: string, ...params: ExplicitAny[]): Promise<T[]>;
}

export class SqliteDbContext implements DbContext {
  private isDbOpen = false;
  private db!: SQLiteDBConnection;

  constructor(private readonly sqliteConnection: Connection) {}

  get isInitialized(): boolean {
    return this.isDbOpen;
  }

  // todo - take in init db function for creating the tables if they don't exists
  async init(tableInitStatements: BatchStatement[] = [], seedStatements: BatchStatement[] = []) {
    this.db = await this.sqliteConnection.openDatabase();

    console.log('creating tables');

    if (tableInitStatements.length > 0) {
      await this.db.executeSet(tableInitStatements);
    }

    console.log('seeding tables');

    if (seedStatements.length > 0) {
      await this.db.executeSet(seedStatements);
    }

    this.isDbOpen = true;
  }

  async dispose() {
    await this.sqliteConnection.closeDatabase();
    this.isDbOpen = false;
  }

  async query<T>(sql: string, ...params: ExplicitAny[]): Promise<T[]> {
    this.ensureDbIsInitialized();

    const result = await this.db.query(sql, params);

    return result.values as T[];
  }

  async execute(sql: string, ...params: ExplicitAny[]): Promise<Changes | undefined> {
    this.ensureDbIsInitialized();

    const result = await this.db.run(sql, params);

    return result.changes;
  }

  /**
   * Ensures that the connection is open.
   *
   * @param throwError True, to throw if connection is closed, false otherwise. Default: `true`.
   */
  private ensureDbIsInitialized(throwError = true) {
    if (!this.isDbOpen && throwError) {
      throw Error('Database connection closed');
    }
  }
}
