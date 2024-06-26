import { useState } from 'react';
import { RateType } from '../models/rateType';

const MOCK_RATE_TYPES: RateType[] = [
  { id: 1, name: 'Home', amount: 0.12, unit: 'kWh' },
  { id: 2, name: 'Work', amount: 0.18, unit: 'kWh' },
  { id: 3, name: 'Other', amount: 0.13, unit: 'kWh' },
  { id: 4, name: 'DC', amount: 0.32, unit: 'kWh' }
];

export function useRateTypes() {
  const [rateTypes] = useState<RateType[]>(MOCK_RATE_TYPES);

  return { rateTypes };
}
