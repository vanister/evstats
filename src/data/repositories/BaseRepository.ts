import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DboKeys } from './repositories-types';

export abstract class BaseRepository<T> {
  constructor(protected readonly context: SQLiteDBConnection) {}

  /**
   * Gets an alphabetized, sorted, array of value parameters based off of the given dbo.
   *
   * @param dbo The dbo to extract the values from.
   * @param except Optional: array of dbo properties to exclude.
   */
  protected getValues(dbo: T, except: DboKeys<T>[] = []): unknown[] {
    const values = Object.keys(dbo)
      .filter((key) => !except.includes(key as DboKeys<T>))
      .sort()
      .map((key) => dbo[key]);

    return values;
  }
}
