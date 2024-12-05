import { useEffect } from 'react';
import { Session, SessionLog } from '../../models/session';
import { toSessionLogItem } from './helpers';
import { useServices } from '../../providers/ServiceProvider';
import { useImmerState } from '../../hooks/useImmerState';
import { RateType } from '../../models/rateType';
import { Vehicle } from '../../models/vehicle';

export type UseSessionState = {
  sessionLogs: SessionLog[];
  loading: boolean;
  rateTypes: RateType[];
  vehicles: Vehicle[];
};

export type SessionHook = {
  loading: boolean;
  sessionLogs: SessionLog[];
  addSession: (session: Session) => Promise<number>;
  getSession: (id: number) => Promise<Session>;
  updateSession: (session: Session) => Promise<void>;
};

const INITIAL_STATE: UseSessionState = {
  loading: true,
  sessionLogs: [],
  rateTypes: [],
  vehicles: []
};

export function useSessions(): SessionHook {
  const getService = useServices();
  const sessionService = getService('sessionService');
  const rateService = getService('rateService');
  const vehicleService = getService('vehicleService');
  const [state, setState] = useImmerState<UseSessionState>(INITIAL_STATE);

  useEffect(() => {
    const loadSessions = async () => {
      const vehicles = await vehicleService.list();
      const rateTypes = await rateService.list();
      const sessionsEntries = await sessionService.list();
      const sessionLogItems = sessionsEntries.map((s) => toSessionLogItem(s, vehicles, rateTypes));

      setState((d) => {
        d.sessionLogs = sessionLogItems;
        d.rateTypes = rateTypes;
        d.vehicles = vehicles;
        d.loading = false;
      });
    };

    loadSessions();
  }, []);

  const addSession = async (session: Session) => {
    const sessionWithId = await sessionService.add(session);
    const sessionLog = toSessionLogItem(sessionWithId, state.vehicles, state.rateTypes);

    // await updateLastUsedRateAndVehicle(session, dispatch);

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
    // await updateLastUsedRateAndVehicle(session, dispatch);

    // find the session log item and update it with the updated values
    setState((s) => {
      const existingSessionLogId = s.sessionLogs.findIndex((sl) => sl.id === session.id);
      const updatedSessionLog = toSessionLogItem(session, state.vehicles, state.rateTypes);

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
