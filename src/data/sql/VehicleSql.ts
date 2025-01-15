export const VehicleSql = Object.freeze({
  List: `SELECT * FROM vehicles;`,
  GetById: `SELECT * FROM vehicles WHERE id = ?;`,
  Add: `
    INSERT INTO vehicles(battery_size, make, model, nickname, range, trim, vin, year)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
  `,
  Update: `
    UPDATE vehicles
    SET battery_size = ?, make = ?, model = ?, nickname = ?, range = ?, trim = ?, vin = ?, year = ?
    WHERE id = ?
  `,
  Delete: `DELETE FROM vehicles WHERE id = ?;`
});
