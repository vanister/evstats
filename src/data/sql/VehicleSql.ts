export class VehicleSql {
  public static readonly List = `SELECT * FROM vehicles;`;

  public static readonly GetById = `SELECT * FROM vehicles WHERE id = ?;`;

  public static readonly Add = `
    INSERT INTO vehicles(battery_size, make, model, nickname, range, trim, vin, year)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
  `;

  public static readonly Update = `
    UPDATE vehicles
    SET battery_size = ?, make = ?, model = ?, nickname = ?, range = ?, trim = ?, vin = ?, year = ?
    WHERE id = ?
  `;

  public static readonly Delete = `DELETE FROM vehicles WHERE id = ?;`;
}
