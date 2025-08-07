import { IonIcon, IonButton, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useMemo } from 'react';
import EvsPage from '../../components/EvsPage';
import { SessionLog } from '../../models/session';
import SessionList from './components/SessionList/SessionList';
import { useSessions } from './useSessions';
import { toSessionLogItem } from './helpers';
import { useAppSelector } from '../../redux/hooks';

export default function SessionScreen() {
  const router = useIonRouter();
  const { sessions, loadSessions } = useSessions();
  const vehicles = useAppSelector((s) => s.vehicles);
  const rateTypes = useAppSelector((s) => s.rateType.rateTypes);
  // Load sessions whenever we enter this screen
  useIonViewWillEnter(() => {
    loadSessions();
  });

  const sessionLogs = useMemo(
    () => sessions.map((s) => toSessionLogItem(s, vehicles, rateTypes)),
    [sessions, vehicles, rateTypes]
  );

  const handleAddSessionClick = () => {
    // Explicitly pass state to indicate this is a new session
    router.push('/sessions/-1', 'forward', 'push');
    // Alternative approach using history directly if state is needed
    // history.push('/sessions/-1', { isNew: true });
  };

  const handleSessionSelection = (sessionLog: SessionLog) => {
    router.push(`/sessions/${sessionLog.id}`);
  };

  // Create header add button
  const addButton = (
    <IonButton fill="clear" onClick={handleAddSessionClick}>
      <IonIcon icon={add} />
    </IonButton>
  );

  const headerButtons = [
    {
      key: 'add',
      button: addButton,
      slot: 'end'
    }
  ];

  return (
    <EvsPage
      className="sessions"
      title="Sessions"
      fixedSlotPlacement="before"
      headerButtons={headerButtons}
    >
      <SessionList sessions={sessionLogs} onSelection={handleSessionSelection} />
    </EvsPage>
  );
}
