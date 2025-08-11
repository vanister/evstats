import './SessionList.scss';

import { IonList, IonItem, IonLabel } from '@ionic/react';
import { SessionLog } from '../../../../models/session';

type SessionListProps = {
  sessions: SessionLog[];
  onSelection: (session: SessionLog) => void;
};

export default function SessionList(props: SessionListProps) {
  const { sessions, onSelection } = props;

  const handleItemClick = (session: SessionLog) => {
    onSelection(session);
  };

  if (sessions.length === 0) {
    return (
      <div className="session-list">
        <div className="empty-list-message">
          <h3>No charging sessions found</h3>
          <p>Adjust your search criteria or add a new charging session to get started</p>
        </div>
      </div>
    );
  }

  return (
    <IonList className="session-list" inset>
      {sessions.map((session) => (
        <IonItem key={session.id} button detail={true} onClick={() => handleItemClick(session)}>
          <IonLabel>
            <h3>{session.rateType}</h3>
            <p>{session.date}</p>
            <p>{session.vehicleName}</p>
          </IonLabel>
          <IonLabel slot="end">
            <h3>{`+${session.kWh} kWh`}</h3>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
}
