export class SessionSql {
  public static readonly List = `SELECT * FROM sessions ORDER BY date DESC LIMIT ? OFFSET ?;`;

  public static readonlyAdd = `
    INSERT INTO sessions(date, kwh, rate_override, rate_type_id, vehicle_id)
    VALUES(?, ?, ?, ?, ?);
  `;

  public static readonlyGet = `
    SELECT * FROM sessions WHERE id = ?;
  `;

  public static readonlyUpdate = `
    UPDATE sessions
    SET date = ?, kwh = ?, rate_override = ?, rate_type_id = ?, vehicle_id = ?
    WHERE id = ?;
  `;

  public static readonlyDelete = `
    DELETE FROM sessions WHERE id = ?;
  `;
}
