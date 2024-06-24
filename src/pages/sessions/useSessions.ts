import { useState } from 'react';
import { Session } from '../../models/session';

const MOCK_SESSIONS: Session[] = [
  {
    id: 1,
    kWhAdded: 43,
    vehicleName: 'Mustang Mach-E',
    date: new Date(2024, 5, 22),
    rateType: 'Home'
  },
  {
    id: 2,
    kWhAdded: 22,
    vehicleName: 'Mustang Mach-E',
    date: new Date(2024, 4, 16),
    rateType: 'Home'

  },
  {
    id: 3,
    kWhAdded: 12,
    vehicleName: 'Mustang Mach-E',
    date: new Date(2024, 4, 8),
    rateType: 'Other'
  },
];

export function useSessions() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  return { sessions }

}