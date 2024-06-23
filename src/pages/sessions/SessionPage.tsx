import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';
import { useRef } from 'react';
import { Session, useSessions } from './useSessions';

export default function SessionPage() {
  const modal = useRef<HTMLIonModalElement>(null);
  const presentingElement = useRef<HTMLElement>();
  const { sessions } = useSessions();

  const modalCanDismiss = async (_: any, role: string | undefined) => {
    return role !== 'gesture';
  };

  const handleModalDismiss = () => {
    modal.current?.dismiss();
  };

  const handleAddSessionClick = (session: Session | null) => {
    // todo
    modal.current?.dismiss();
  };

  // a recent list of charge sessions
  return (
    <EvsPage
      ref={presentingElement}
      title="Sessions"
      fixedSlotPlacement="before"
    >
      {/* todo - turn into EvsFloatingAddButton */}
      <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton id="new-session">
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      {/* todo - SessionList */}
      <IonList>
        {sessions.map((session) => (
          <IonItem key={session.id} button>
            <IonLabel>
              <h3>{session.vehicleName}</h3>
              <p>{session.date.toLocaleDateString()}</p>
            </IonLabel>
            <IonLabel slot="end">
              <h3>{session.kWhAdded} kWh</h3>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
      {/* todo - AddSessionModal */}
      <IonModal
        ref={modal}
        trigger="new-session"
        canDismiss={modalCanDismiss}
        presentingElement={presentingElement.current}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={handleModalDismiss}>Close</IonButton>
            </IonButtons>
            <IonTitle>New Session</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => handleAddSessionClick(null)}>
                Add
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>
            To close this modal, please use the "Close" button provided. Note
            that swiping the modal will not dismiss it.
          </p>
        </IonContent>
      </IonModal>
    </EvsPage>
  );
}
