export const SessionSql = Object.freeze({
  List: `SELECT * FROM sessions LIMIT ? OFFSET ?;`,
  Add: `
    INSERT INTO sessions(date, kwh, rate_override, rate_type_id, vehicle_id)
    VALUES(?, ?, ?, ?, ?);
  `,
  Get: `
    SELECT * FROM sessions WHERE id = ?;
  `,
  Update: `
    UPDATE sessions
    SET date = ?, kwh = ?, rate_override = ?, rate_type_id = ?, vehicle_id = ?
    WHERE id = ?;
  `,
  Delete: `
    DELETE FROM sessions WHERE id = ?;
  `
});
