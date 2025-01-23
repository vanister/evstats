export const ChargeStatSql = Object.freeze({
  Last31Days: `
    SELECT 
      v.id AS vehicle_id, 
      s.date,
      s.rate_type_id,
      s.kwh,
      r.amount AS rate,
      s.rate_override
    FROM sessions s
      JOIN rate_types r ON r.id = s.rate_type_id
      JOIN vehicles v ON v.id = s.vehicle_id
    WHERE date(s.date) >= date('now', '-31 days');
  `
});
