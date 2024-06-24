import { IonList, IonItem, IonLabel } from '@ionic/react';
import { Session } from '../../../models/session';

interface SessionListProps {
  sessions: Session[];
  onSelection: (session: Session) => void;
}

export default function SessionList(props: SessionListProps) {
  const { sessions, onSelection } = props;

  const handleItemClick = (session: Session) => {
    onSelection(session);
  };

  return (
    <IonList>
      {sessions.map((session) => (
        <IonItem
          key={session.id}
          button
          detail={false}
          onClick={() => handleItemClick(session)}
        >
          <IonLabel>
            <h3>{session.rateType}</h3>
            <p>{session.date.toLocaleDateString()}</p>
          </IonLabel>
          <IonLabel slot="end">
            <h3>{`+ ${session.kWhAdded} kWh`}</h3>
            <p>{session.vehicleName}</p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
}
