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
