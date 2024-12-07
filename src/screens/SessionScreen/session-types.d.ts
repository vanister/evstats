import { SetImmerState } from '../../hooks/useImmerState';
import { RateType } from '../../models/rateType';
import { Session } from '../../models/session';
import { Vehicle } from '../../models/vehicle';

export type SessionModalStateProps = {
  state: SessionModalState;
  setState: SetImmerState<SessionModalState>;
};

export type SessionModalState = {
  loading: boolean;
  rateTypes: RateType[];
  session: Partial<Session>;
  vehicles: Vehicle[];
  errorMsg?: string | null;
};

export type SessionState = {
  showModal: boolean;
  isNew: boolean;
  editingSession: Session | null;
};
