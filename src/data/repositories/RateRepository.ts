import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { RateSql } from '../sql/RateSql';
import { BaseRepository } from './BaseRepository';
import { RateTypeDbo } from '../../models/rateType';

export interface RateRepository {
  get(id: number): Promise<RateTypeDbo>;
  list(): Promise<RateTypeDbo[]>;
}

export class EvsRateRepository extends BaseRepository<RateTypeDbo> implements RateRepository {
  constructor(context: SQLiteDBConnection) {
    super(context);
  }

  async get(id: number): Promise<RateTypeDbo> {
    const { values } = await this.context.query(RateSql.GetById, [id]);
    const rate = values?.[0] as RateTypeDbo;

    return rate;
  }

  async list(): Promise<RateTypeDbo[]> {
    const { values } = await this.context.query(RateSql.List);

    return (values as RateTypeDbo[]) ?? [];
  }
}
