export const RateSql = Object.freeze({
  GetById: `SELECT * FROM rate_types WHERE id = ?;`,
  List: `SELECT * FROM rate_types;`,
  Update: `
    UPDATE rate_types
    SET amount = ?, name = ?, unit = ?
    WHERE id = ?;
  `
});
