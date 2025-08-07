import { SetImmerState } from '../../hooks/useImmerState';
import { Session } from '../../models/session';

export type SessionModalStateProps = {
  state: SessionModalState;
  setState: SetImmerState<SessionModalState>;
};

export type SessionState = {
  showModal: boolean;
  isNew: boolean;
  editingSession: Session | null;
};

// Form state type - use null instead of optional for required fields
export type SessionFormState = {
  id?: number;
  date: string;
  kWh: number | null;
  rateTypeId: number | null;
  rateOverride?: number;
  vehicleId: number | null;
};

export type UseSessionState = {
  loading: boolean;
  sessions: Session[];
  operationLoading: boolean;
};

export type SessionHook = UseSessionState & {
  lastUsedRateTypeId?: number;
  selectedVehicleId?: number;
  loadSessions: () => Promise<void>;
  addSession: (session: Session) => Promise<string | null>;
  getSession: (id: number) => Promise<Session | null>;
  updateSession: (session: Session) => Promise<string | null>;
};
