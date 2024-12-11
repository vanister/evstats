export class PragmaSql {
  static readonly GET_DB_VERSION = 'PRAGMA user_version;';
  static readonly UPDATE_DB_VERSION = `PRAGMA user_version = ?;`;
}
