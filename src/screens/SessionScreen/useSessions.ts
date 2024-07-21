import { useCallback, useEffect } from 'react';
import { Session, SessionLog } from '../../models/session';
import { createSessionLogItem } from './helpers';
import { useServices } from '../../providers/ServiceProvider';
import { useRootSelector } from '../../hooks/useRootSelector';
import { useImmerState } from '../../hooks/useImmerState';

export type SessionHook = {
  sessions: SessionLog[];
  loading: boolean;
};

export function useSessions() {
  const { sessionService } = useServices();
  const vehicles = useRootSelector((s) => s.vehicles);
  const rateTypes = useRootSelector((s) => s.rateTypes);
  const [state, setState] = useImmerState<SessionHook>({ loading: true, sessions: [] });

  useEffect(() => {
    const loadSessions = async () => {
      const sessionsEntries = await sessionService.list();

      const sessionLogItems = sessionsEntries.map((s) => {
        const vm = createSessionLogItem(s as Session, vehicles, rateTypes);

        return vm;
      });

      setState((d) => {
        d.sessions = sessionLogItems;
      });
    };

    loadSessions();
  }, []);

  const addSession = useCallback(
    async (session: Session) => {
      const sessionWithId = await sessionService.add(session);
      const sessionLog = createSessionLogItem(sessionWithId, vehicles, rateTypes);

      setState((s) => {
        s.sessions.push(sessionLog);
      });
    },
    [state.sessions]
  );

  return { sessions: state.sessions, addSession };
}
