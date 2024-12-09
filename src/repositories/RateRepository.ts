import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { RateType } from '../models/rateType';
import { RateSql } from './sql/RateSql';

export interface RateRepository {
  get(id: number): Promise<RateType>;
  list(): Promise<RateType[]>;
}

export class EvsRateRepository implements RateRepository {
  constructor(private context: SQLiteDBConnection) {}

  async get(id: number): Promise<RateType> {
    const { values } = await this.context.query(RateSql.getById, [id]);
    const rate = values?.[0] as RateType;

    return rate;
  }

  async list(): Promise<RateType[]> {
    const { values } = await this.context.query(RateSql.list);

    return values ?? [];
  }
}
