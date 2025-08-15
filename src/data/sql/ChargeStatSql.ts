export class ChargeStatSql {
  public static readonly Last31DaysByVehicle = `
    SELECT *
    FROM vw_vehicle_charge_summary cs
    WHERE date(cs.date) >= date('now', '-30 days')
      AND cs.vehicle_id = ?
    ORDER BY date DESC;
  `;

  public static readonly Last31DaysAllVehicles = `
    SELECT *
    FROM vw_vehicle_charge_summary cs
    WHERE date(cs.date) >= date('now', '-30 days')
    ORDER BY date DESC;
  `;

  public static readonly MonthByVehicle = `
    SELECT *
    FROM vw_vehicle_charge_summary cs
    WHERE strftime('%Y-%m', cs.date) = ?
      AND cs.vehicle_id = ?
    ORDER BY date DESC;
  `;

  public static readonly MonthAllVehicles = `
    SELECT *
    FROM vw_vehicle_charge_summary cs
    WHERE strftime('%Y-%m', cs.date) = ?
    ORDER BY date DESC;
  `;

  public static readonly YearByVehicle = `
    SELECT *
    FROM vw_vehicle_charge_summary cs
    WHERE strftime('%Y', cs.date) = ?
      AND cs.vehicle_id = ?
    ORDER BY date DESC;
  `;

  public static readonly YearAllVehicles = `
    SELECT *
    FROM vw_vehicle_charge_summary cs
    WHERE strftime('%Y', cs.date) = ?
    ORDER BY date DESC;
  `;
}
