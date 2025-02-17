import { capSQLiteVersionUpgrade } from '@capacitor-community/sqlite';

export const migrations: capSQLiteVersionUpgrade[] = [
  {
    // initial
    toVersion: 1,
    statements: [
      `
      CREATE TABLE IF NOT EXISTS rate_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        unit TEXT LENGTH(5) NOT NULL
      );
      `,
      `
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
      `
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
      `
      CREATE VIEW IF NOT EXISTS vw_vehicle_charge_summary AS
      SELECT 
        v.id AS vehicle_id, 
        s.rate_type_id,
        s.date,
        s.kwh,
        r.amount AS rate,
        r.name as rate_name,
        s.rate_override
      FROM sessions s
        JOIN rate_types r ON r.id = s.rate_type_id
        JOIN vehicles v ON v.id = s.vehicle_id;
      `,
      // seed the initial rate types
      `
      INSERT INTO rate_types (name, amount, unit)
      SELECT 'Home', 0.13, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
      UNION ALL
      SELECT 'Work', 0.17, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
      UNION ALL
      SELECT 'Other', 0.12, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
      UNION ALL
      SELECT 'DC', 0.32, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types);
      `
    ]
  }
];
