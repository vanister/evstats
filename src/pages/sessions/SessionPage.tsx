import { IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';
import { useRef } from 'react';
import { useSessions } from './useSessions';
import { Session } from '../../models/session';
import AddEditSessionModal from './components/AddEditSessionModal';
import SessionList from './components/SessionList';
import EvsFloatingActionButton from '../../components/EvsFloatingActionButton';

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
      title="Sessions"
      fixedSlotPlacement="before"
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
