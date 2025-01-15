import { JsonSQLite } from '@capacitor-community/sqlite';

export const InitTableSql = Object.freeze({
  CreateVehiclesTable: `
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      trim TEXT NULL,
      vin TEXT LENGTH(17) NULL,
      nickname TEXT NULL,
      battery_size REAL NULL,
      range INTEGER NULL
    );
  `,
  CreateRateTypeTable: `
    CREATE TABLE IF NOT EXISTS rate_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      unit TEXT LENGTH(5) NOT NULL
    );
  `,
  CreateSessionsTable: `
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      rate_type_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      kwh INTEGER NOT NULL,
      rate_override REAL NULL,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
      FOREIGN KEY (rate_type_id) REFERENCES rate_types(Id)
    );
  `,
  SetInitialVersion: `PRAGMA user_version = 1;`
});

export type SchemaOptions = {
  database?: string;
  version?: number;
  encrypted?: boolean;
  mode?: 'full' | 'partial';
};

export const getSchema = (options?: SchemaOptions): JsonSQLite => {
  const { database = 'evstats.db', version = 1, encrypted = false, mode = 'full' } = options ?? {};

  return {
    database,
    version,
    encrypted,
    mode,
    tables: [
      {
        name: 'vehicles',
        schema: [
          { column: 'id', value: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
          { column: 'year', value: 'INTEGER NOT NULL' },
          { column: 'make', value: 'TEXT NOT NULL' },
          { column: 'model', value: 'TEXT NOT NULL' },
          { column: 'trim', value: 'TEXT NULL' },
          { column: 'vin', value: 'TEXT LENGTH(17) NULL' },
          { column: 'nickname', value: 'TEXT NULL' },
          { column: 'battery_capacity', value: 'REAL NULL' },
          { column: 'range', value: 'INTEGER NULL' }
        ]
      },
      {
        name: 'rate_types',
        schema: [
          { column: 'id', value: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
          { column: 'name', value: 'TEXT NOT NULL' },
          { column: 'amount', value: 'REAL NOT NULL' },
          { column: 'unit', value: 'TEXT LENGTH(5) NOT NULL' }
        ]
      },
      {
        name: 'sessions',
        schema: [
          { column: 'id', value: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
          { column: 'vehicle_id', value: 'INTEGER NOT NULL' },
          { column: 'rate_type_id', value: 'INTEGER NOT NULL' },
          { column: 'date', value: 'TEXT NOT NULL' },
          { column: 'kwh', value: 'INTEGER NOT NULL' },
          { column: 'rate_override', value: 'REAL NULL' },
          { foreignkey: 'vehicle_id', value: 'REFERENCES vehicles(id)' },
          { foreignkey: 'rate_type_id', value: 'REFERENCES rate_types(id)' }
        ]
      }
    ]
  };
};
