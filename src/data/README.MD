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