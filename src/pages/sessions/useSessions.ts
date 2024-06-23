import { useState } from 'react';

export type Session = {
  id: number,
  kWhAdded: number,
  vehicleName: string,
  date: Date
}

const MOCK_SESSIONS: Session[] = [
  {
    id: 1,
    kWhAdded: 43,
    vehicleName: 'Mustang Mach-E',
    date: new Date(2024, 5, 22),
  },
  {
    id: 2,
    kWhAdded: 22,
    vehicleName: 'Mustang Mach-E',
    date: new Date(2024, 4, 16),
  },
  {
    id: 3,
    kWhAdded: 12,
    vehicleName: 'Mustang Mach-E',
    date: new Date(2024, 4, 8),
  },
];

export function useSessions() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  return { sessions }

}