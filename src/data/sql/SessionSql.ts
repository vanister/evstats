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

  public static readonly GetByVehicleId = `
    SELECT * FROM sessions WHERE vehicle_id = ? ORDER BY date DESC;
  `;

  public static readonly GetVehicleStats = `
    SELECT 
      vehicle_id,
      COUNT(*) as totalSessions,
      ROUND(SUM(kwh), 2) as totalKwh,
      MAX(date) as lastChargeDate,
      ROUND(AVG(kwh), 2) as averageKwhPerSession
    FROM sessions 
    WHERE vehicle_id = ?
    GROUP BY vehicle_id;
  `;

  public static readonly GetAllVehicleStats = `
    SELECT 
      vehicle_id,
      COUNT(*) as totalSessions,
      ROUND(SUM(kwh), 2) as totalKwh,
      MAX(date) as lastChargeDate,
      ROUND(AVG(kwh), 2) as averageKwhPerSession
    FROM sessions 
    GROUP BY vehicle_id;
  `;
}
