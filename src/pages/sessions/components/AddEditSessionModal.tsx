import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent
} from '@ionic/react';
import { useRef } from 'react';
import { Session } from '../../../models/session';
import { IonSlots, ModalRoles } from '../../../constants';

export type AddEditSessionModalProps = {
  allowCloseGesture?: boolean;
  isNew?: boolean;
  presentingElement?: HTMLElement;
  session?: Session;
  triggerId?: string;
  onClose?: VoidFunction;
  onSave: (session: Session) => Promise<boolean>;
};

export default function AddEditSessionModal(props: AddEditSessionModalProps) {
  const { allowCloseGesture, isNew, presentingElement, onSave } = props;
  const modal = useRef<HTMLIonModalElement>(null);

  const modalCanDismiss = async (_: any, role: string | undefined) => {
    if (allowCloseGesture) {
      return true;
    }

    return role !== ModalRoles.gesture;
  };

  const handleModalDismiss = () => {
    modal.current?.dismiss();
  };

  const handleAddSessionClick = async () => {
    const session: Session = {
      date: new Date(),
      kWhAdded: 42,
      vehicleName: 'Mustang Mach-E',
      rateType: 'Home'
    };

    const result = await onSave(session);

    if (result) {
      modal.current?.dismiss();
    }
  };

  return (
    <IonModal
      ref={modal}
      trigger="new-session"
      canDismiss={modalCanDismiss}
      presentingElement={presentingElement}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot={IonSlots.start}>
            <IonButton onClick={handleModalDismiss}>Close</IonButton>
          </IonButtons>
          <IonTitle>{isNew ? 'New Session' : 'Edit Session'}</IonTitle>
          <IonButtons slot={IonSlots.end}>
            <IonButton onClick={handleAddSessionClick}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>
          To close this modal, please use the "Close" button provided. Note that
          swiping the modal will not dismiss it.
        </p>
      </IonContent>
    </IonModal>
  );
}
