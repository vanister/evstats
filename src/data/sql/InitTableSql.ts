export class InitTableSql {
  static readonly CREATE_VEHICLES_TABLE = `
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      trim TEXT NULL,
      vin TEXT LENGTH(17) NULL,
      nickname TEXT NULL,
      battery_capacity REAL NULL,
      range INTEGER NULL
    );
  `;

  static readonly CREATE_RATE_TYPE_TABLE = `
    CREATE TABLE IF NOT EXISTS rate_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      unit TEXT LENGTH(5) NOT NULL
    );
  `;

  static readonly CREATE_SESSIONS_TABLE = `
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
  `;
}
