import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { RateType } from '../models/rateType';

const MOCK_RATE_TYPES: RateType[] = [
  { id: 1, name: 'Home', amount: 0.12, unit: 'kWh' },
  { id: 2, name: 'Work', amount: 0.18, unit: 'kWh' },
  { id: 3, name: 'Other', amount: 0.13, unit: 'kWh' },
  { id: 4, name: 'DC', amount: 0.32, unit: 'kWh' }
];

export interface RateRepository {
  get(id: number): Promise<RateType>;
  list(): Promise<RateType[]>;
}

export class EvsRateRepository implements RateRepository {
  private rateTypes: RateType[] = [...MOCK_RATE_TYPES];

  constructor(private context: SQLiteDBConnection) {}

  async get(id: number): Promise<RateType> {
    const rate = this.rateTypes.find((r) => r.id === id);

    return rate;
  }

  async list(): Promise<RateType[]> {
    return this.rateTypes.slice();
  }
}
