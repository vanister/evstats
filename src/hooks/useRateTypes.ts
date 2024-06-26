import { useState } from 'react';

export interface RateType {
  id: number;
  name: string;
  rate: number;
  unit: 'kWh';
}

const MOCK_RATE_TYPES: RateType[] = [
  { id: 1, name: 'Home', rate: 0.12, unit: 'kWh' },
  { id: 2, name: 'Work', rate: 0.18, unit: 'kWh' },
  { id: 3, name: 'Other', rate: 0.13, unit: 'kWh' },
  { id: 4, name: 'DC', rate: 0.32, unit: 'kWh' }
];

export function useRateTypes() {
  const [rateTypes] = useState<RateType[]>(MOCK_RATE_TYPES);

  return { rateTypes };
}
