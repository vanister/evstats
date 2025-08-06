import { capSQLiteVersionUpgrade } from '@capacitor-community/sqlite';

export type ConnectionOptions = {
  encrypted?: boolean;
  migrations?: capSQLiteVersionUpgrade[];
  mode?: 'no-encryption';
  readOnly?: boolean;
  version?: number;
};

export type DatabaseManager = {
  get context(): DbContext;
  get fullDatabaseName(): string;
  openConnection(options?: ConnectionOptions): Promise<void>;
  closeConnection(): Promise<void>;
  getVersion(): Promise<number>;
};
