import {
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonNote,
  IonSelectOption
} from '@ionic/react';
import { useMemo, useRef } from 'react';
import EvsSelect from '../../../../components/EvsSelect';
import { ModalRoles } from '../../../../constants';
import { useImmerState } from '../../../../hooks/useImmerState';
import { Session } from '../../../../models/session';
import { validateSession } from '../../validator';
import AddEditSessionModalHeader from './SessionModalHeader';
import { useVehicles } from '../../../../hooks/useVehicles';
import { useRateTypes } from '../../../../hooks/useRateTypes';

interface AddEditSessionState {
  session: Partial<Session>;
  errorMsg?: string | null;
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
    date: new Date().toLocaleString(),
    rateTypeId: 1,
    vehicleId: 1
  }
};

export default function AddEditSessionModal(props: AddEditSessionModalProps) {
  const { allowCloseGesture, isNew, presentingElement, onSave, onCancel, onDidDismiss } = props;
  const [state, setState] = useImmerState<AddEditSessionState>(FORM_STATE);
  const modal = useRef<HTMLIonModalElement>(null);
  const today = useMemo(() => Date.now(), []);
  const { vehicles } = useVehicles();
  const { rateTypes } = useRateTypes();

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

  const handleSaveClick = async () => {
    const errorMsg = validateSession(state.session);

    setState((s) => {
      s.errorMsg = errorMsg;
    });

    if (errorMsg) {
      // don't raise if there are errors
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
      <AddEditSessionModalHeader
        title={isNew ? 'New Session' : 'Edit Session'}
        errorMsg={state.errorMsg ?? ''}
        onCancelClick={handleCancelClick}
        onSaveClick={handleSaveClick}
        onErrorMsgDismiss={() =>
          setState((s) => {
            s.errorMsg = null;
          })
        }
      ></AddEditSessionModalHeader>
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
              value={state.session.date}
              onIonChange={(e) =>
                setState((s) => {
                  s.session.date = e.detail.value!;
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
              {vehicles.map((v) => (
                <IonSelectOption key={v.id} value={v.id}>
                  {v.model}
                </IonSelectOption>
              ))}
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
              {rateTypes.map((r) => (
                <IonSelectOption key={r.id} value={r.id}>
                  {r.name}
                </IonSelectOption>
              ))}
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
          <IonNote className="ion-padding">This will override the preset rate type.</IonNote>
        </IonList>
      </IonContent>
    </IonModal>
  );
}
