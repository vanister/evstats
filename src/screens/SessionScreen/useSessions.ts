import { useEffect } from 'react';
import { Session } from '../../models/session';
import { useServices } from '../../providers/ServiceProvider';
import { useImmerState } from '../../hooks/useImmerState';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateLastUsed } from '../../redux/thunks/updateLastUsed';

type UseSessionState = {
  loading: boolean;
  sessions: Session[];
  operationLoading: boolean;
};

export type SessionHook = UseSessionState & {
  lastUsedRateTypeId?: number;
  selectedVehicleId?: number;
  addSession: (session: Session) => Promise<string | null>;
  getSession: (id: number) => Promise<Session | null>;
  updateSession: (session: Session) => Promise<string | null>;
};

const INITIAL_STATE: UseSessionState = {
  loading: true,
  sessions: [],
  operationLoading: false
};

export function useSessions(): SessionHook {
  const dispatch = useAppDispatch();
  const sessionService = useServices('sessionService');
  const [state, setState] = useImmerState<UseSessionState>(INITIAL_STATE);
  const lastUsedRateTypeId = useAppSelector((s) => s.lastUsed.rateTypeId);
  const lastUsedVehicleId = useAppSelector((s) => s.lastUsed.vehicleId);
  const defaultVehicleId = useAppSelector((s) => s.defaultVehicle.vehicleId);

  // Compute selected vehicle ID: lastUsed takes precedence, then default
  const selectedVehicleId = lastUsedVehicleId || defaultVehicleId;

  // Load sessions on mount
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
    setState((s) => {
      s.operationLoading = true;
    });

    try {
      const sessionWithId = await sessionService.add(session);

      await dispatch(
        updateLastUsed({ rateTypeId: session.rateTypeId, vehicleId: session.vehicleId })
      );

      // add the new session with its id
      setState((s) => {
        s.sessions.push(sessionWithId);
        s.operationLoading = false;
      });

      return null;
    } catch (error) {
      setState((s) => {
        s.operationLoading = false;
      });
      return error.message;
    }
  };

  const getSession = async (id: number): Promise<Session | null> => {
    try {
      const session = await sessionService.get(id);
      return session;
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return null;
      }
      throw error;
    }
  };

  const updateSession = async (session: Session) => {
    setState((s) => {
      s.operationLoading = true;
    });

    try {
      await sessionService.update(session);

      await dispatch(
        updateLastUsed({ rateTypeId: session.rateTypeId, vehicleId: session.vehicleId })
      );

      // find the session log item and update it with the updated values
      setState((s) => {
        const existingSessionLogId = s.sessions.findIndex((sl) => sl.id === session.id);
        s.sessions[existingSessionLogId] = session;
        s.operationLoading = false;
      });

      return null;
    } catch (error) {
      setState((s) => {
        s.operationLoading = false;
      });
      return error.message;
    }
  };

  return {
    ...state,
    lastUsedRateTypeId,
    selectedVehicleId,
    addSession,
    getSession,
    updateSession
  };
}
