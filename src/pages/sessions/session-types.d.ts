import { SetImmerState } from '../../hooks/useImmerState';
import { SessionModalState } from './components/SessionModal/SessionModal';

export interface CommonSessionModalSectionProps {
  state: SessionModalState;
  setState: SetImmerState<SessionModalState>;
}

export interface SessionModalState {
  session: Partial<Session>;
  errorMsg?: string | null;
}
