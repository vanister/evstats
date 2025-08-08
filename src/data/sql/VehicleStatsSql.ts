export class VehicleStatsSql {
  public static readonly GetVehicleStats = `
    SELECT 
      vehicle_id,
      COUNT(*) as totalSessions,
      ROUND(SUM(kwh), 2) as totalKwh,
      MAX(date) as lastChargeDate,
      ROUND(SUM(kwh * COALESCE(rate_override, rate)), 2) as totalCost
    FROM vw_vehicle_charge_summary
    WHERE vehicle_id = ?
    GROUP BY vehicle_id;
  `;

  public static readonly GetAllVehicleStats = `
    SELECT 
      vehicle_id,
      COUNT(*) as totalSessions,
      ROUND(SUM(kwh), 2) as totalKwh,
      MAX(date) as lastChargeDate,
      ROUND(SUM(kwh * COALESCE(rate_override, rate)), 2) as totalCost
    FROM vw_vehicle_charge_summary
    GROUP BY vehicle_id;
  `;
}
