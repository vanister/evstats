import { IonIcon, IonButton, useIonRouter } from '@ionic/react';
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
  const { sessions } = useSessions();
  const vehicles = useAppSelector((s) => s.vehicles);
  const rateTypes = useAppSelector((s) => s.rateType.rateTypes);
  const sessionLogs = useMemo(
    () => sessions.map((s) => toSessionLogItem(s, vehicles, rateTypes)),
    [sessions, vehicles, rateTypes]
  );

  const handleAddSessionClick = () => {
    router.push('/sessions/new');
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
