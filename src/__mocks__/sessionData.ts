import { SessionDbo } from '../models/session';

export const MOCK_SESSIONS: SessionDbo[] = [
  {
    id: 1,
    kWh: 43,
    date: '2024-05-22',
    rate_type_id: 1,
    vehicle_id: 1
  },
  {
    id: 2,
    kWh: 22,
    date: '2024-04-16',
    rate_type_id: 1,
    vehicle_id: 1
  },
  {
    id: 3,
    kWh: 12,
    date: '2024-04-08',
    rate_type_id: 3,
    vehicle_id: 2
  }
];
