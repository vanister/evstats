import { useEffect } from 'react';
import { Session, SessionLog } from '../../models/session';
import { toSessionLogItem, updateLastUsedRateAndVehicle } from './helpers';
import { useServices } from '../../providers/ServiceProvider';
import { useRootSelector } from '../../hooks/useRootSelector';
import { useImmerState } from '../../hooks/useImmerState';
import { useRootDispatch } from '../../hooks/useRootDispatch';

export type UseSessionState = {
  sessionLogs: SessionLog[];
  loading: boolean;
};

export type SessionHook = {
  loading: boolean;
  sessionLogs: SessionLog[];
  addSession: (session: Session) => Promise<number>;
  getSession: (id: number) => Promise<Session>;
  updateSession: (session: Session) => Promise<void>;
};

export function useSessions(): SessionHook {
  const [state, setState] = useImmerState<UseSessionState>({ loading: true, sessionLogs: [] });
  const { sessionService } = useServices();
  const dispatch = useRootDispatch();
  const vehicles = useRootSelector((s) => s.vehicles);
  const rateTypes = useRootSelector((s) => s.rateTypes);

  // todo - useReducer

  useEffect(() => {
    const loadSessions = async () => {
      const sessionsEntries = await sessionService.list();
      const sessionLogItems = sessionsEntries.map((s) => toSessionLogItem(s, vehicles, rateTypes));

      setState((d) => {
        d.sessionLogs = sessionLogItems;
        d.loading = false;
      });
    };

    loadSessions();
  }, []);

  const addSession = async (session: Session) => {
    const sessionWithId = await sessionService.add(session);
    const sessionLog = toSessionLogItem(sessionWithId, vehicles, rateTypes);

    await updateLastUsedRateAndVehicle(session, dispatch);

    setState((s) => {
      s.sessionLogs.push(sessionLog);
    });

    return sessionWithId.id!;
  };

  const getSession = async (id: number) => {
    const session = await sessionService.get(id);

    return session;
  };

  const updateSession = async (session: Session) => {
    await sessionService.update(session);
    await updateLastUsedRateAndVehicle(session, dispatch);

    // find the session log item and update it with the updated values
    setState((s) => {
      const existingSessionLogId = s.sessionLogs.findIndex((sl) => sl.id === session.id);
      const updatedSessionLog = toSessionLogItem(session, vehicles, rateTypes);

      s.sessionLogs[existingSessionLogId] = updatedSessionLog;
    });
  };

  return {
    loading: state.loading,
    sessionLogs: state.sessionLogs,
    addSession,
    getSession,
    updateSession
  };
}
