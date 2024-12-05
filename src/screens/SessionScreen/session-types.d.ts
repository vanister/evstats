import { SetImmerState } from '../../hooks/useImmerState';
import { RateType } from '../../models/rateType';
import { Session } from '../../models/session';
import { Vehicle } from '../../models/vehicle';
import { SessionModalState } from './components/SessionModal/SessionModal';

export type SessionModalStateProps = {
  state: SessionModalState;
  setState: SetImmerState<SessionModalState>;
};

export type SessionModalState = {
  rateTypes: RateType[];
  session: Partial<Session>;
  vehicles: Vehicle[];
  errorMsg?: string | null;
};

export type SessionState = {
  showModal: boolean;
  isNew: boolean;
  loadingSession: boolean;
  editingSession: Session | null;
};
