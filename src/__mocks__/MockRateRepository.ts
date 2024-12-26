import { RateRepository } from '../data/repositories/RateRepository';
import { RateTypeDbo } from '../models/rateType';
import { MOCK_RATE_TYPES } from './rateData';

export class MockRateRepository implements RateRepository {
  private readonly rateTypes: RateTypeDbo[] = [...MOCK_RATE_TYPES];

  async get(id: number): Promise<RateTypeDbo> {
    const rate = this.rateTypes.find((r) => r.id === id);

    return rate;
  }

  async list(): Promise<RateTypeDbo[]> {
    return this.rateTypes;
  }
}
