import './SessionList.scss';

import { IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
import { SessionLog } from '../../../../models/session';
import EvsNote from '../../../../components/EvsNote/EvsNote';

type SessionListProps = {
  sessions: SessionLog[];
  totalSessionCount: number;
  isFiltered: boolean;
  onSelection: (session: SessionLog) => void;
  onDelete: (session: SessionLog) => void;
};

export default function SessionList(props: SessionListProps) {
  const { sessions, totalSessionCount, isFiltered, onSelection, onDelete } = props;

  const handleItemClick = (session: SessionLog) => {
    onSelection(session);
  };

  const handleDeleteClick = (session: SessionLog) => {
    onDelete(session);
  };

  // Create header text based on filter state
  const getHeaderText = () => {
    if (isFiltered) {
      return `Showing ${sessions.length} of ${totalSessionCount} sessions`;
    }

    if (totalSessionCount === 0) {
      return 'No sessions';
    }

    return `Last ${totalSessionCount} ${totalSessionCount > 1 ? 'sessions' : 'session'}`;
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
    <div className="session-list">
      <EvsNote className="session-list-header">{getHeaderText()}</EvsNote>
      <IonList inset>
        {sessions.map((session) => (
          <IonItemSliding key={session.id}>
            <IonItem button detail={true} onClick={() => handleItemClick(session)}>
              <IonLabel>
                <h3>{session.rateType}</h3>
                <p>{session.date}</p>
                <p>
                  <em>{session.vehicleName}</em>
                </p>
              </IonLabel>
              <IonLabel slot="end">
                <h3>{`+${Math.round(session.kWh)} kWh`}</h3>
              </IonLabel>
            </IonItem>
            <IonItemOptions side="end" onIonSwipe={() => handleDeleteClick(session)}>
              <IonItemOption color="danger" expandable onClick={() => handleDeleteClick(session)}>
                Delete
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        ))}
      </IonList>
    </div>
  );
}
