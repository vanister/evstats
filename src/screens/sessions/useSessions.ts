import { useCallback, useEffect, useState } from 'react';
import { Session, SessionListItem } from '../../models/session';
import { useVehicles } from '../../hooks/useVehicles';
import { useRateTypes } from '../../hooks/useRateTypes';
import { createSessionLogItem } from './helpers';
import { useServices } from '../../providers/ServiceProvider';

export function useSessions() {
  const { session: sessionService } = useServices();
  const { vehicles } = useVehicles();
  const { rateTypes } = useRateTypes();
  const [sessions, setSessions] = useState<SessionListItem[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const sessionsEntries = await sessionService.list();

      const sessionViewModels = sessionsEntries.map((s) => {
        const vm = createSessionLogItem(s as Session, vehicles, rateTypes);

        return vm;
      });

      setSessions(sessionViewModels);
    };

    loadSessions();
  }, []);

  const addSession = useCallback(
    async (session: Session) => {
      const sessionWithId = await sessionService.add(session);
      const vm = createSessionLogItem(sessionWithId, vehicles, rateTypes);

      setSessions((s) => [...s, vm]);
    },
    [sessions]
  );

  return { sessions, addSession };
}
