import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonList,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonNote
} from '@ionic/react';
import { useMemo, useRef } from 'react';
import { Session } from '../../../models/session';
import { IonSlots, ModalRoles } from '../../../constants';

interface AddEditSessionModalProps {
  allowCloseGesture?: boolean;
  isNew?: boolean;
  presentingElement?: HTMLElement;
  session?: Session;
  triggerId?: string;
  onClose?: VoidFunction;
  onSave: (session: Session) => Promise<boolean>;
}

export default function AddEditSessionModal(props: AddEditSessionModalProps) {
  const { allowCloseGesture, isNew, presentingElement, onSave } = props;
  const modal = useRef<HTMLIonModalElement>(null);
  const today = useMemo(() => Date.now(), []);

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
      className="add-edit-session-modal"
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
      <IonContent color="light">
        <IonList inset>
          <IonItem>
            <IonInput
              label="kWh added *"
              labelPlacement="fixed"
              placeholder="Added during charge session"
              min={0}
              max={999}
              maxlength={3}
              type="number"
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Date *"
              labelPlacement="fixed"
              placeholder="Session date"
              type="date"
              defaultValue={today}
            />
          </IonItem>
          {/* todo EvsSelect */}
        </IonList>
        <IonList inset>
          <IonItem>
            <IonSelect
              label="Vehicle"
              labelPlacement="fixed"
              value={1}
              interfaceOptions={{
                header: 'Select a Vehicle'
              }}
            >
              <IonSelectOption value={1}>Mustang Mach-E</IonSelectOption>
              <IonSelectOption value={2}>R1S</IonSelectOption>
              <IonSelectOption value={3}>Model 3</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
        <IonList inset>
          <IonItem>
            <IonSelect
              label="Rate type"
              labelPlacement="fixed"
              value={1}
              interfaceOptions={{
                header: 'Select a Rate Type'
              }}
            >
              <IonSelectOption value={1}>Home</IonSelectOption>
              <IonSelectOption value={2}>Work</IonSelectOption>
              <IonSelectOption value={3}>Other</IonSelectOption>
              <IonSelectOption value={4}>DC</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonInput
              label="Rate override"
              labelPlacement="fixed"
              placeholder="0.32"
              type="number"
              min={0}
              max={99}
              maxlength={2}
            />
          </IonItem>
          <IonNote className="ion-padding-horizontal">
            This will override the preset rate type.
          </IonNote>
        </IonList>
      </IonContent>
    </IonModal>
  );
}
