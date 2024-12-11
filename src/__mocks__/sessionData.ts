import { Session } from '../models/session';

export const MOCK_SESSIONS: Partial<Session>[] = [
  {
    id: 1,
    kWh: 43,
    date: '2024-05-22',
    rateTypeId: 1,
    vehicleId: 1
  },
  {
    id: 2,
    kWh: 22,
    date: '2024-04-16',
    rateTypeId: 1,
    vehicleId: 1
  },
  {
    id: 3,
    kWh: 12,
    date: '2024-04-08',
    rateTypeId: 3,
    vehicleId: 2
  }
];
