import { useEffect } from 'react';
import { Session } from '../../models/session';
import { useServices } from '../../providers/ServiceProvider';
import { useImmerState } from '../../hooks/useImmerState';

export type UseSessionState = {
  sessions: Session[];
  loading: boolean;
};

export type SessionHook = {
  loading: boolean;
  sessions: Session[];
  addSession: (session: Session) => Promise<string | null>;
  getSession: (id: number) => Promise<Session | null>;
  updateSession: (session: Session) => Promise<string | null>;
};

const INITIAL_STATE: UseSessionState = {
  loading: true,
  sessions: []
};

export function useSessions(): SessionHook {
  const sessionService = useServices('sessionService');
  const [state, setState] = useImmerState<UseSessionState>(INITIAL_STATE);

  useEffect(() => {
    const loadSessions = async () => {
      const sessions = await sessionService.list();

      setState((d) => {
        d.sessions = sessions;
        d.loading = false;
      });
    };

    loadSessions();
  }, []);

  const addSession = async (session: Session) => {
    try {
      const sessionWithId = await sessionService.add(session);
      // const sessionLog = toSessionLogItem(sessionWithId, vehicles, rateTypes);

      setState((s) => {
        // todo - sort by date
        s.sessions.push(sessionWithId);
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
        const existingSessionLogId = s.sessions.findIndex((sl) => sl.id === session.id);
        // const updatedSessionLog = toSessionLogItem(session, vehicles, rateTypes);

        s.sessions[existingSessionLogId] = session;
      });
    } catch (error) {
      return error.message;
    }
  };

  return {
    loading: state.loading,
    sessions: state.sessions,
    addSession,
    getSession,
    updateSession
  };
}
