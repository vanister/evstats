import { IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useRef, useState } from 'react';
import EvsFloatingActionButton from '../../components/EvsFloatingActionButton';
import EvsPage from '../../components/EvsPage';
import { Session, SessionListItem } from '../../models/session';
import SessionList from './components/SessionList';
import SessionModal from './components/SessionModal/SessionModal';
import { useSessions } from './useSessions';

export default function SessionScreen() {
  const presentingElement = useRef<HTMLElement>();
  const { sessions, addSession } = useSessions();
  const [showModal, setShowModal] = useState(false);

  const handleSessionFabClick = () => {
    setShowModal(true);
  };

  const handleSessionSave = async (session: Session) => {
    addSession(session);

    return true;
  };

  const handleSessionModalDismiss = () => {
    setShowModal(false);
  };

  const handleSessionSelection = (session: SessionListItem) => {
    console.log('Session selected:', session);
  };

  // a recent list of charge sessions
  return (
    <EvsPage
      ref={presentingElement}
      className="sessions"
      title="Sessions"
      fixedSlotPlacement="before"
      color="light"
    >
      <EvsFloatingActionButton
        horizontal="end"
        vertical="bottom"
        slot="fixed"
        onClick={handleSessionFabClick}
      >
        <IonIcon icon={add} />
      </EvsFloatingActionButton>
      <SessionList sessions={sessions} onSelection={handleSessionSelection} />
      {showModal && (
        <SessionModal
          isNew
          presentingElement={presentingElement.current}
          onSave={handleSessionSave}
          onDidDismiss={handleSessionModalDismiss}
        />
      )}
    </EvsPage>
  );
}
