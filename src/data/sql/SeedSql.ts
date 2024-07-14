export class SeedSql {
  static readonly SEED_RATE_TYPES = `
    INSERT INTO rate_types (name, amount, unit)
    SELECT 'Home', 0.13, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
    UNION ALL
    SELECT 'Work', 0.17, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
    UNION ALL
    SELECT 'Other', 0.12, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
    UNION ALL
    SELECT 'DC', 0.32, 'kWh' WHERE NOT EXISTS (SELECT 1 FROM rate_types)
  `;
}
