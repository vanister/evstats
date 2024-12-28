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
