export class SessionSql {
  static readonly List = `SELECT * FROM sessions;`;

  static readonly Add = `
    INSERT INTO sessions(date, kwh, rate_override, rate_type_id, vehicle_id)
    VALUES(?, ?, ?, ?, ?);
  `;
}
