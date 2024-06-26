import { useCallback, useEffect, useState } from 'react';
import { Session, SessionViewModal } from '../../models/session';
import { useVehicles } from '../../hooks/useVehicles';
import { useRateTypes } from '../../hooks/useRateTypes';
import { createSessionVm } from './helpers';

const MOCK_SESSIONS: Partial<Session>[] = [
  {
    id: 1,
    kWhAdded: 43,
    date: '2024-05-22',
    rateTypeId: 1,
    vehicleId: 1
  },
  {
    id: 2,
    kWhAdded: 22,
    date: '2024-04-16',
    rateTypeId: 1,
    vehicleId: 1
  },
  {
    id: 3,
    kWhAdded: 12,
    date: '2024-04-08',
    rateTypeId: 3,
    vehicleId: 2
  }
];

export function useSessions() {
  const { vehicles } = useVehicles();
  const { rateTypes } = useRateTypes();
  const [sessionsEntries] = useState(MOCK_SESSIONS);
  const [sessions, setSessions] = useState<SessionViewModal[]>([]);

  useEffect(() => {
    const sessionViewModels = sessionsEntries.map((s) => {
      const vm = createSessionVm(s as Session, vehicles, rateTypes);

      return vm;
    });

    setSessions(sessionViewModels);
  }, []);

  const addSession = useCallback(
    async (session: Session) => {
      const sessionWithId: Session = { ...session, id: sessions.length + 1 };
      const vm = createSessionVm(sessionWithId, vehicles, rateTypes);

      setSessions((s) => [...s, vm]);
    },
    [sessions]
  );

  return { sessions, addSession };
}
