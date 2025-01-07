import { IonIcon, useIonAlert } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useMemo, useRef } from 'react';
import EvsFloatingActionButton from '../../components/EvsFloatingActionButton';
import EvsPage from '../../components/EvsPage';
import { Session, SessionLog } from '../../models/session';
import SessionList from './components/SessionList/SessionList';
import SessionModal from './components/SessionModal/SessionModal';
import { useSessions } from './useSessions';
import { useImmerState } from '../../hooks/useImmerState';
import { SessionState } from './session-types';
import { validateSession } from './validator';
import { toSessionLogItem } from './helpers';
import { useAppSelector } from '../../redux/hooks';

const INITIAL_SESSIONS_STATE: SessionState = {
  showModal: false,
  isNew: false,
  editingSession: null
};

export default function SessionScreen() {
  const presentingElement = useRef<HTMLElement>();
  const [showAlert] = useIonAlert();
  const vehicles = useAppSelector((s) => s.vehicle.vehicles);
  const rateTypes = useAppSelector((s) => s.rateType.rateTypes);
  const { sessions, addSession, updateSession } = useSessions();
  const [state, setState] = useImmerState<SessionState>(INITIAL_SESSIONS_STATE);
  const sessionLogs = useMemo(
    () => sessions.map((s) => toSessionLogItem(s, vehicles, rateTypes)),
    [sessions, vehicles, rateTypes]
  );

  const handleAddSessionFabClick = () => {
    setState((s) => {
      s.showModal = true;
      s.isNew = true;
    });
  };

  const handleSaveSession = async (session: Session) => {
    const validationError = validateSession(session);

    if (validationError) {
      await showAlert(validationError);
      return false;
    }

    const errorMessage = state.isNew ? await addSession(session) : await updateSession(session);

    if (errorMessage) {
      await showAlert(errorMessage);

      return false;
    }

    return true;
  };

  const handleSessionModalDismiss = () => {
    setState((s) => {
      s.showModal = false;
      s.isNew = false;
      s.editingSession = null;
    });
  };

  const handleSessionSelection = async (sessionLog: SessionLog) => {
    const editingSession = sessions.find((s) => s.id === sessionLog.id);

    setState((s) => {
      s.isNew = false;
      s.showModal = true;
      s.editingSession = editingSession;
    });
  };

  return (
    <EvsPage
      ref={presentingElement}
      className="sessions"
      title="Sessions"
      fixedSlotPlacement="before"
    >
      <EvsFloatingActionButton
        horizontal="end"
        vertical="bottom"
        slot="fixed"
        onClick={handleAddSessionFabClick}
      >
        <IonIcon icon={add} />
      </EvsFloatingActionButton>
      <SessionList sessions={sessionLogs} onSelection={handleSessionSelection} />
      {state.showModal && (
        <SessionModal
          isNew={state.isNew}
          session={state.editingSession}
          presentingElement={presentingElement.current}
          onSave={handleSaveSession}
          onDidDismiss={handleSessionModalDismiss}
        />
      )}
    </EvsPage>
  );
}
