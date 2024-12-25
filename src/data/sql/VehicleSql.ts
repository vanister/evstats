export class VehicleSql {
  static readonly List = `SELECT * FROM vehicles;`;
  static readonly GetById = `SELECT * FROM vehicles WHERE id = ?;`;

  static readonly Add = `
    INSERT INTO vehicles(battery_size, make, model, nickname, range, trim, vin, year)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
  `;

  static readonly Update = `
    UPDATE vehicles
    SET battery_size = ?, make = ?, model = ?, nickname = ?, range = ?, trim = ?, vin = ?, year = ?
    WHERE id = ?
  `;

  static readonly Delete = `DELETE FROM vehicles WHERE id = ?;`;
}
