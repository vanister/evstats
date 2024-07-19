import { useCallback, useEffect, useState } from 'react';
import { Session, SessionListItem } from '../../models/session';
import { createSessionLogItem } from './helpers';
import { useServices } from '../../providers/ServiceProvider';
import { useRootSelector } from '../../hooks/useRootSelector';

export function useSessions() {
  const { sessionService } = useServices();
  const vehicles = useRootSelector((s) => s.vehicles);
  const rateTypes = useRootSelector((s) => s.rateTypes);
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
