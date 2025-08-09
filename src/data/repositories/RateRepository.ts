import { RateSql } from '../sql/RateSql';
import { BaseRepository } from './BaseRepository';
import { RateTypeDbo } from '../../models/rateType';
import { DbContext } from '../DbContext';

export interface RateRepository {
  get(id: number): Promise<RateTypeDbo>;
  list(): Promise<RateTypeDbo[]>;
  update(rate: RateTypeDbo): Promise<void>;
}

export class EvsRateRepository extends BaseRepository<RateTypeDbo> implements RateRepository {
  constructor(context: DbContext) {
    super(context);
  }

  async get(id: number): Promise<RateTypeDbo> {
    const values = await this.context.query<RateTypeDbo>(RateSql.GetById, [id]);
    const rate = values?.[0];

    return rate;
  }

  async list(): Promise<RateTypeDbo[]> {
    const values = await this.context.query<RateTypeDbo>(RateSql.List);

    return values ?? [];
  }

  async update(rate: RateTypeDbo): Promise<void> {
    await this.context.run(RateSql.Update, [
      rate.amount,
      rate.name,
      rate.unit,
      rate.color,
      rate.id
    ]);
  }
}
