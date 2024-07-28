import { SetImmerState } from '../../hooks/useImmerState';
import { Session } from '../../models/session';
import { SessionModalState } from './components/SessionModal/SessionModal';

export type SessionModalStateProps = {
  state: SessionModalState;
  setState: SetImmerState<SessionModalState>;
};

export type SessionModalState = {
  session: Partial<Session>;
  errorMsg?: string | null;
};

export type SessionState = {
  showModal: boolean;
  isNew: boolean;
  loadingSession: boolean;
  editingSession: Session | null;
};
