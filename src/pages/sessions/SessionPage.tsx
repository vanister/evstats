import './SessionPage.scss';

import { IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useRef } from 'react';
import EvsFloatingActionButton from '../../components/EvsFloatingActionButton';
import EvsPage from '../../components/EvsPage';
import { Session } from '../../models/session';
import AddEditSessionModal from './components/AddEditSessionModal';
import SessionList from './components/SessionList';
import { useSessions } from './useSessions';

export default function SessionPage() {
  const presentingElement = useRef<HTMLElement>();
  const { sessions } = useSessions();

  const handleSessionSave = async (session: Session) => {
    console.log('Session saved:', session);
    return true;
  };

  const handleSessionSelection = (session: Session) => {
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
        id="new-session"
        horizontal="end"
        vertical="bottom"
        slot="fixed"
      >
        <IonIcon icon={add} />
      </EvsFloatingActionButton>
      <SessionList sessions={sessions} onSelection={handleSessionSelection} />
      <AddEditSessionModal
        isNew
        presentingElement={presentingElement.current}
        triggerId="new-session"
        onSave={handleSessionSave}
      />
    </EvsPage>
  );
}
