export class VehicleStatsSql {
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