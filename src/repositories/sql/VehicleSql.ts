export class VehicleSql {
  static readonly list = `SELECT * FROM vehicles;`;
  static readonly getById = `SELECT * FROM vehicles WHERE id = ?;`;

  static readonly add = `
    INSERT INTO vehicles(battery_size, make, model, nickname, range, trim, vin, year)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
    `;

  static readonly update = ``;
  static readonly delete = `DELETE FROM vehicles WHERE id = ?;`;
}
