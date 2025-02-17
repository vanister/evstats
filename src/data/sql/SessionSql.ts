export class SessionSql {
  public static readonly List = `SELECT * FROM sessions ORDER BY date DESC LIMIT ? OFFSET ?;`;

  public static readonly Add = `
    INSERT INTO sessions(date, kwh, rate_override, rate_type_id, vehicle_id)
    VALUES(?, ?, ?, ?, ?);
  `;

  public static readonly Get = `
    SELECT * FROM sessions WHERE id = ?;
  `;

  public static readonly Update = `
    UPDATE sessions
    SET date = ?, kwh = ?, rate_override = ?, rate_type_id = ?, vehicle_id = ?
    WHERE id = ?;
  `;

  public static readonly Delete = `
    DELETE FROM sessions WHERE id = ?;
  `;
}
