import { RateType } from '../models/rateType';

export interface RateService {
  list(cache?: boolean): Promise<RateType[]>;
  get(id: number): Promise<RateType>;
}

export class EvsRateService implements RateService {
  private rateTypes: RateType[] = [
    { id: 1, name: 'Home', amount: 0.12, unit: 'kWh' },
    { id: 2, name: 'Work', amount: 0.18, unit: 'kWh' },
    { id: 3, name: 'Other', amount: 0.13, unit: 'kWh' },
    { id: 4, name: 'DC', amount: 0.32, unit: 'kWh' }
  ];

  async list(_cache = true): Promise<RateType[]> {
    return this.rateTypes;
  }

  async get(id: number): Promise<RateType> {
    const rate = this.rateTypes.find((r) => r.id === id);

    if (!rate) {
      throw new Error('not found');
    }

    return rate;
  }
}
