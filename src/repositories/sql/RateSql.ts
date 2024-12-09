export class RateSql {
  static readonly getById = `SELECT * FROM rate_types WHERE id = ?;`;
  static readonly list = `SELECT * FROM rate_types;`;
}
