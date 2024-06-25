import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { useMemo, useRef, useState } from 'react';
import EvsSelect from '../../../../components/EvsSelect';
import { IonSlots, ModalRoles } from '../../../../constants';
import { useImmerState } from '../../../../hooks/useImmerState';
import { Session } from '../../../../models/session';
import { validateSession } from '../../validator';

interface AddEditSessionState {
  session: Partial<Session>;
  errorMsg?: string | null;
  showError?: boolean;
}

interface AddEditSessionModalProps {
  allowCloseGesture?: boolean;
  isNew?: boolean;
  presentingElement?: HTMLElement;
  session?: Session;
  triggerId?: string;
  onCancel?: VoidFunction;
  onSave: (session: Session) => Promise<boolean>;
  onDidDismiss?: VoidFunction;
}

const FORM_STATE: AddEditSessionState = {
  session: {
    date: new Date(),
    rateTypeId: 1,
    vehicleId: 1
  }
};

export default function AddEditSessionModal(props: AddEditSessionModalProps) {
  const {
    allowCloseGesture,
    isNew,
    presentingElement,
    onSave,
    onCancel,
    onDidDismiss
  } = props;
  const [state, setState] = useImmerState<AddEditSessionState>(FORM_STATE);
  const modal = useRef<HTMLIonModalElement>(null);
  const today = useMemo(() => Date.now(), []);

  const modalCanDismiss = async (_: any, role: string | undefined) => {
    if (allowCloseGesture) {
      return true;
    }

    return role !== ModalRoles.gesture;
  };

  const handleDidDismiss = () => {
    onDidDismiss?.();
  };

  const handleCancelClick = () => {
    modal.current?.dismiss();
    onCancel?.();
  };

  const handleAddClick = async () => {
    const errorMsg = validateSession(state.session);

    setState((s) => {
      s.errorMsg = errorMsg;
      s.showError = !!errorMsg;
    });

    if (errorMsg) {
      // do raise if there are errors
      return;
    }

    const result = await onSave(state.session as Session);

    if (result) {
      modal.current?.dismiss();
    }
  };

  return (
    <IonModal
      isOpen
      ref={modal}
      className="add-edit-session-modal"
      trigger="new-session"
      canDismiss={modalCanDismiss}
      presentingElement={presentingElement}
      onDidDismiss={handleDidDismiss}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot={IonSlots.start}>
            <IonButton onClick={handleCancelClick}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>{isNew ? 'New Session' : 'Edit Session'}</IonTitle>
          <IonButtons slot={IonSlots.end}>
            <IonButton onClick={handleAddClick}>Save</IonButton>
            <IonAlert
              isOpen={!!state.showError}
              header="Error"
              subHeader="Please fix the following error(s)"
              message={state.errorMsg ? state.errorMsg : ''}
              buttons={['OK']}
              onDidDismiss={() =>
                setState((s) => {
                  s.showError = false;
                })
              }
            ></IonAlert>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light">
        <IonList inset>
          <IonItem>
            <IonInput
              label="kWh *"
              labelPlacement="fixed"
              placeholder="Added during charge session"
              min={0}
              max={999}
              maxlength={3}
              type="number"
              value={state.session.kWhAdded}
              onIonChange={(e) =>
                setState((s) => {
                  s.session.kWhAdded = +e.detail.value! || undefined;
                })
              }
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Date *"
              labelPlacement="fixed"
              placeholder="Session date"
              type="date"
              defaultValue={today}
              value={state.session.date?.getDate()}
              onIonChange={(e) =>
                setState((s) => {
                  s.session.date = new Date(Date.parse(e.detail.value!));
                })
              }
            />
          </IonItem>
        </IonList>
        <IonList inset>
          <IonItem>
            <EvsSelect
              inset
              label="Vehicles"
              labelPlacement="fixed"
              header="Select a Vehicle"
              value={state.session.vehicleId}
              onSelect={(value) =>
                setState((s) => {
                  s.session.vehicleId = value;
                })
              }
            >
              <IonSelectOption value={1}>Mustang Mach-E</IonSelectOption>
              <IonSelectOption value={2}>R1S</IonSelectOption>
              <IonSelectOption value={3}>Model 3</IonSelectOption>
            </EvsSelect>
          </IonItem>
        </IonList>

        <IonList inset>
          <IonItem>
            <EvsSelect
              label="Rate type"
              labelPlacement="fixed"
              header="Select a Rate Type"
              value={state.session.rateTypeId}
              onSelect={(value) =>
                setState((s) => {
                  s.session.rateTypeId = value;
                })
              }
            >
              <IonSelectOption value={1}>Home</IonSelectOption>
              <IonSelectOption value={2}>Work</IonSelectOption>
              <IonSelectOption value={3}>Other</IonSelectOption>
              <IonSelectOption value={4}>DC</IonSelectOption>
            </EvsSelect>
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
              value={state.session.rateOverride}
              onIonChange={(e) =>
                setState((s) => {
                  s.session.rateOverride = +e.detail.value! || undefined;
                })
              }
            />
          </IonItem>
          <IonNote className="ion-padding">
            This will override the preset rate type.
          </IonNote>
        </IonList>
      </IonContent>
    </IonModal>
  );
}
