import { useEffect } from 'react';
import { Session, SessionLog } from '../../models/session';
import { toSessionLogItem } from './helpers';
import { useServices } from '../../providers/ServiceProvider';
import { useImmerState } from '../../hooks/useImmerState';
import { useAppSelector } from '../../redux/hooks';

export type UseSessionState = {
  sessionLogs: SessionLog[];
  loading: boolean;
};

export type SessionHook = {
  loading: boolean;
  sessionLogs: SessionLog[];
  addSession: (session: Session) => Promise<string | null>;
  getSession: (id: number) => Promise<Session | null>;
  updateSession: (session: Session) => Promise<string | null>;
};

const INITIAL_STATE: UseSessionState = {
  loading: true,
  sessionLogs: []
};

export function useSessions(): SessionHook {
  const sessionService = useServices('sessionService');
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);
  const rateTypes = useAppSelector((state) => state.rateTypes.rateTypes);
  const [state, setState] = useImmerState<UseSessionState>(INITIAL_STATE);

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
    try {
      const sessionWithId = await sessionService.add(session);
      const sessionLog = toSessionLogItem(sessionWithId, vehicles, rateTypes);

      setState((s) => {
        // todo - sort by date
        s.sessionLogs.push(sessionLog);
      });

      return null;
    } catch (error) {
      return error.message;
    }
  };

  const getSession = async (id: number): Promise<Session | null> => {
    try {
      const session = await sessionService.get(id);

      return session;
    } catch (error) {
      // todo - check for not found error
      return null;
    }
  };

  const updateSession = async (session: Session) => {
    try {
      await sessionService.update(session);

      // find the session log item and update it with the updated values
      setState((s) => {
        const existingSessionLogId = s.sessionLogs.findIndex((sl) => sl.id === session.id);
        const updatedSessionLog = toSessionLogItem(session, vehicles, rateTypes);

        s.sessionLogs[existingSessionLogId] = updatedSessionLog;
      });
    } catch (error) {
      return error.message;
    }
  };

  return {
    loading: state.loading,
    sessionLogs: state.sessionLogs,
    addSession,
    getSession,
    updateSession
  };
}
