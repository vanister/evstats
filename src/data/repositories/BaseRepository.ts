import { DboKeys } from './repositories-types';

export abstract class BaseRepository<T> {
  protected getValues(dbo: T, except: DboKeys<T>[] = []): unknown[] {
    const values = Object.entries(dbo)
      .filter(([key, _]) => !except.includes(key as DboKeys<T>))
      .sort()
      .map(([_, value]) => value);

    return values;
  }
}
