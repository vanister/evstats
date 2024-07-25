import { SetImmerState } from '../../hooks/useImmerState';
import { SessionLog as Session } from '../../models/session';
import { SessionModalState } from './components/SessionModal/SessionModal';

export type CommonSessionModalSectionProps = {
  state: SessionModalState;
  setState: SetImmerState<SessionModalState>;
};

export type SessionModalState = {
  session: Partial<Session>;
  errorMsg?: string | null;
};
