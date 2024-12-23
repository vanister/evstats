import { IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useRef } from 'react';
import EvsFloatingActionButton from '../../components/EvsFloatingActionButton';
import EvsPage from '../../components/EvsPage';
import { Session, SessionLog } from '../../models/session';
import SessionList from './components/SessionList';
import SessionModal from './components/SessionModal/SessionModal';
import { useSessions } from './useSessions';
import { useImmerState } from '../../hooks/useImmerState';
import { SessionState } from './session-types';
import { useAppSelector } from '../../redux/hooks';

const INITIAL_SESSIONS_STATE: SessionState = {
  showModal: false,
  isNew: false,
  editingSession: null
};

export default function SessionScreen() {
  const presentingElement = useRef<HTMLElement>();
  const hasVehicles = useAppSelector((s) => s.vehicles.vehicles.length > 0);
  const { sessionLogs, addSession, getSession, updateSession } = useSessions();
  const [state, setState] = useImmerState<SessionState>(INITIAL_SESSIONS_STATE);

  const handleAddSessionFabClick = () => {
    setState((s) => {
      s.showModal = true;
      s.isNew = true;
    });
  };

  const handleSessionSave = async (session: Session) => {
    if (state.isNew) {
      await addSession(session);
    }

    await updateSession(session);
  };

  const handleSessionModalDismiss = () => {
    setState((s) => {
      s.showModal = false;
      s.isNew = false;
      s.editingSession = null;
    });
  };

  const handleSessionSelection = async (sessionLog: SessionLog) => {
    // find the session that was selected
    setState((s) => {
      s.showModal = true;
    });

    const session = await getSession(sessionLog.id);

    setState((s) => {
      s.isNew = false;
      s.editingSession = session;
    });
  };

  // a recent list of charge sessions
  return (
    <EvsPage
      ref={presentingElement}
      className="sessions"
      title="Sessions"
      fixedSlotPlacement="before"
      color="light"
      showVehicleModal={!hasVehicles}
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
          onSave={handleSessionSave}
          onDidDismiss={handleSessionModalDismiss}
        />
      )}
    </EvsPage>
  );
}
