import { RateTypeDbo } from '../models/rateType';

export const MOCK_RATE_TYPES: RateTypeDbo[] = [
  { id: 1, name: 'Home', amount: 0.12, unit: 'kWh' },
  { id: 2, name: 'Work', amount: 0.18, unit: 'kWh' },
  { id: 3, name: 'Other', amount: 0.13, unit: 'kWh' },
  { id: 4, name: 'DC', amount: 0.32, unit: 'kWh' }
];
