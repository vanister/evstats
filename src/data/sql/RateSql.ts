export class RateSql {
  static readonly GetById = `SELECT * FROM rate_types WHERE id = ?;`;
  static readonly List = `SELECT * FROM rate_types;`;

  static readonly Update = `
    UPDATE rate_types
    SET name = ?, amount = ?, unit = ?
    WHERE id = ?;
  `;
}
