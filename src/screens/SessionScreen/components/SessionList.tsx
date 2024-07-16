import { IonList, IonItem, IonLabel } from '@ionic/react';
import { SessionListItem } from '../../../models/session';

export interface SessionListProps {
  sessions: SessionListItem[];
  onSelection: (session: SessionListItem) => void;
}

export default function SessionList(props: SessionListProps) {
  const { sessions, onSelection } = props;

  const handleItemClick = (session: SessionListItem) => {
    onSelection(session);
  };

  return (
    <IonList className="session-list" inset>
      {sessions.map((session) => (
        <IonItem key={session.id} button detail={false} onClick={() => handleItemClick(session)}>
          <IonLabel>
            <h3>{session.rateType}</h3>
            <p>{session.date}</p>
            <p>{session.vehicleName}</p>
          </IonLabel>
          <IonLabel slot="end">
            <h3>{`+ ${session.kWh} kWh`}</h3>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
}
