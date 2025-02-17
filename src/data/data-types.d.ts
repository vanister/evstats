import { capSQLiteVersionUpgrade } from '@capacitor-community/sqlite';

export type ConnectionOptions = {
  encrypted?: boolean;
  migrations?: capSQLiteVersionUpgrade[];
  mode?: 'no-encryption';
  readOnly?: boolean;
  version?: number;
};
