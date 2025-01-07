export class SessionSql {
  static readonly List = `SELECT * FROM sessions LIMIT ? OFFSET ?;`;

  static readonly Add = `
    INSERT INTO sessions(date, kwh, rate_override, rate_type_id, vehicle_id)
    VALUES(?, ?, ?, ?, ?);
  `;

  static readonly Get = `
    SELECT * FROM sessions WHERE id = ?;
  `;

  static readonly Update = `
    UPDATE sessions
    SET date = ?, kwh = ?, rate_override = ?, rate_type_id = ?, vehicle_id = ?
    WHERE id = ?;
  `;

  static readonly Delete = `
    DELETE FROM sessions WHERE id = ?;
  `;
}
