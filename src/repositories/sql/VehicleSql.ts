export class VehicleSql {
  static readonly list = `SELECT * FROM vehicles;`;
  static readonly getById = `SELECT * FROM vehicles WHERE id = ?;`;
  static readonly add = ``;
  static readonly update = ``;
  static readonly delete = `DELETE FROM vehicles WHERE id = ?;`;
}
