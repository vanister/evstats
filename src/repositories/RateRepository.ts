import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { RateTypeDbo } from '../models/rateType';
import { RateSql } from './sql/RateSql';

export interface RateRepository {
  get(id: number): Promise<RateTypeDbo>;
  list(): Promise<RateTypeDbo[]>;
}

export class EvsRateRepository implements RateRepository {
  constructor(private context: SQLiteDBConnection) {}

  async get(id: number): Promise<RateTypeDbo> {
    const { values } = await this.context.query(RateSql.getById, [id]);
    const rate = values?.[0] as RateTypeDbo;

    return rate;
  }

  async list(): Promise<RateTypeDbo[]> {
    const { values } = await this.context.query(RateSql.list);

    return (values as RateTypeDbo[]) ?? [];
  }
}
