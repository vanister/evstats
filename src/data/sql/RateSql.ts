export class RateSql {
  public static readonly GetById = `SELECT * FROM rate_types WHERE id = ?;`;

  public static readonly List = `SELECT * FROM rate_types ORDER BY name;`;

  public static readonly Update = `
    UPDATE rate_types
    SET amount = ?, name = ?, unit = ?, color = ?, default_color = ?
    WHERE id = ?;
  `;
}
