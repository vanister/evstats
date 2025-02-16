# SQL Notes

## SQL Statements

When using parameterized statements, remember to list the columns you are referencing in alphabetical order.

This is needed because the BaseRepository will sort the dbo's properties when turning it into a value array.

```
-- alphabetize the columns
INSERT INTO vehicles(battery_size, make, model, nickname, range, trim, vin, year)
-- `?` count must whatch the columns above
VALUES(?, ?, ?, ?, ?, ?, ?, ?);
```

## Migrations

Migrations are run through the built-in capacitor/sqlite plugin [Capacitor/Sqlite Migration](https://github.com/capacitor-community/sqlite/blob/master/docs/UpgradeDatabaseVersion.md).

1. Open the `data/migrations.ts` file and add an entry with the next `toVersion` and the `statements` to execute.
2. Go to the `main.tsx` file and incrememt the `currentDbVersion` to the version you want to migrate the database to in the `migrations.ts` file.