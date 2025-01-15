import { JsonSQLite } from '@capacitor-community/sqlite';
import { SchemaOptions } from './InitTableSql';

export const SeedSql = Object.freeze({
  RateTypes: `
    INSERT INTO rate_types (name, amount, unit)
    SELECT 'Home', 0.13, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
    UNION ALL
    SELECT 'Work', 0.17, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
    UNION ALL
    SELECT 'Other', 0.12, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
    UNION ALL
    SELECT 'DC', 0.32, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
  `
});

export const getSeedData = (options?: SchemaOptions): JsonSQLite => {
  const { database = 'evstats.db', version = 1, encrypted = false, mode = 'full' } = options ?? {};

  return {
    database,
    version,
    encrypted,
    mode,
    tables: [
      {
        name: 'rate_types',
        values: [
          [1, 'Home', 0.11, 'kWh'],
          [2, 'Work', 0.17, 'kWh'],
          [3, 'Other', 0.12, 'kWh'],
          [4, 'DC', 0.32, 'kWh']
        ]
      }
    ]
  };
};
