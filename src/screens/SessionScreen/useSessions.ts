import { useEffect } from 'react';
import { Session } from '../../models/session';
import { useServices } from '../../providers/ServiceProvider';
import { useImmerState } from '../../hooks/useImmerState';

type UseSessionState = {
  lastUsedRateTypeId?: number;
  lastUsedVehicleId?: number;
  loading: boolean;
  sessions: Session[];
};

export type SessionHook = UseSessionState & {
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

      // add the new session with its id
      setState((s) => {
        s.sessions.push(sessionWithId);
        s.lastUsedRateTypeId = session.rateTypeId;
        s.lastUsedVehicleId = session.vehicleId;
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

        s.sessions[existingSessionLogId] = session;
        s.lastUsedRateTypeId = session.rateTypeId;
        s.lastUsedVehicleId = session.vehicleId;
      });
    } catch (error) {
      return error.message;
    }
  };

  return {
    ...state,
    addSession,
    getSession,
    updateSession
  };
}
