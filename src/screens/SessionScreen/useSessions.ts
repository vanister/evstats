import { useCallback } from 'react';
import { Session } from '../../models/session';
import { useServices } from '../../providers/ServiceProvider';
import { useImmerState } from '../../hooks/useImmerState';
import { useAppDispatch } from '../../redux/hooks';
import { updateLastUsed } from '../../redux/thunks/updateLastUsed';
import { logToDevServer } from '../../logger';

export type UseSessionState = {
  loading: boolean;
  sessions: Session[];
  operationLoading: boolean;
};

const INITIAL_STATE: UseSessionState = {
  loading: true,
  sessions: [],
  operationLoading: false
};

export function useSessions() {
  const dispatch = useAppDispatch();
  const sessionService = useServices('sessionService');
  const [state, setState] = useImmerState<UseSessionState>(INITIAL_STATE);

  const loadSessions = useCallback(async (): Promise<void> => {
    setState((d) => {
      d.loading = true;
    });

    const sessions = await sessionService.list();

    setState((d) => {
      d.sessions = sessions;
      d.loading = false;
    });
  }, [sessionService, setState]);

  const addSession = useCallback(
    async (session: Session): Promise<string | null> => {
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
        logToDevServer(`Failed to add session: ${error.message}`, 'error', error.stack);
        setState((s) => {
          s.operationLoading = false;
        });
        return error.message;
      }
    },
    [sessionService, dispatch, setState]
  );

  const getSession = useCallback(
    async (id: number): Promise<Session | null> => {
      try {
        const session = await sessionService.get(id);
        return session;
      } catch (error) {
        logToDevServer(`Failed to get session: ${error.message}`, 'error', error.stack);
        return null;
      }
    },
    [sessionService]
  );

  const updateSession = useCallback(
    async (session: Session): Promise<string | null> => {
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
        logToDevServer(`Failed to update session: ${error.message}`, 'error', error.stack);
        setState((s) => {
          s.operationLoading = false;
        });
        return error.message;
      }
    },
    [sessionService, dispatch, setState]
  );

  return {
    ...state,
    loadSessions,
    addSession,
    getSession,
    updateSession
  };
}
