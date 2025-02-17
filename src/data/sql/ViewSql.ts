export class ViewSql {
  public static readonly VehicleChargeSummary = `
    CREATE VIEW IF NOT EXISTS vw_vehicle_charge_summary AS
    SELECT 
      v.id AS vehicle_id, 
      s.date,
      s.rate_type_id,
      s.kwh,
      r.amount AS rate,
      s.rate_override
    FROM sessions s
      JOIN rate_types r ON r.id = s.rate_type_id
      JOIN vehicles v ON v.id = s.vehicle_id;
  `;
}
