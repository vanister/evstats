import { IonContent, IonModal, useIonAlert } from '@ionic/react';
import { useRef } from 'react';
import { ModalRoles } from '../../../../constants';
import { useImmerState } from '../../../../hooks/useImmerState';
import { Session } from '../../../../models/session';
import { today } from '../../../../utilities/dateUtility';
import SessionForm from '../SessionForm';
import ModalHeader from '../../../../components/ModalHeader';
import { Vehicle } from '../../../../models/vehicle';
import { RateType } from '../../../../models/rateType';
import { SessionFormState } from '../../session-types';
import { validateSession, isValidSession } from '../../validator';

type SessionModalProps = {
  allowCloseGesture?: boolean;
  isNew?: boolean;
  loading?: boolean;
  presentingElement?: HTMLElement;
  rates: RateType[];
  selectedVehicleId?: number;
  selectedRateTypeId?: number;
  session?: Session;
  triggerId?: string;
  vehicles: Vehicle[];
  onSave: (session: SessionFormState) => Promise<boolean>;
  onDidDismiss?: (canceled?: boolean) => void;
};

// Form initial state - use null for unset values
const NEW_SESSION: SessionFormState = {
  date: today(),
  kWh: null,
  rateTypeId: null,
  vehicleId: null
};

export default function SessionModal({ isNew, onSave, onDidDismiss, ...props }: SessionModalProps) {
  const modal = useRef<HTMLIonModalElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [showAlert] = useIonAlert();
  const [session, setSession] = useImmerState<SessionFormState>({
    ...NEW_SESSION,
    rateTypeId: props.selectedRateTypeId ?? null,
    vehicleId: props.selectedVehicleId ?? (props.vehicles.length > 0 ? props.vehicles[0].id : null),
    ...(props.session ?? {})
  });

  const modalCanDismiss = async (_: unknown, role: string | undefined) => {
    if (props.allowCloseGesture) {
      return true;
    }

    return role !== ModalRoles.Gesture;
  };

  const handleCancelClick = async () => {
    await modal.current?.dismiss();
    onDidDismiss?.(true);
  };

  const handleSaveClick = async () => {
    const validationError = validateSession(session);

    if (validationError) {
      await showAlert(validationError, [{ text: 'OK', role: 'cancel' }]);
      return;
    }

    if (!isValidSession(session)) {
      await showAlert('Invalid session data', [{ text: 'OK', role: 'cancel' }]);
      return;
    }

    const successful = onSave ? await onSave(session) : true;

    if (successful) {
      await modal.current.dismiss();
      onDidDismiss?.();
    }
  };

  const handleSessionFieldValueChange = (field: keyof SessionFormState, value: string | number | undefined) => {
    setSession((s) => {
      s[field as string] = value;
    });
  };

  return (
    <IonModal
      isOpen
      ref={modal}
      className="session-modal"
      canDismiss={modalCanDismiss}
      presentingElement={props.presentingElement}
    >
      <ModalHeader
        title={isNew ? 'New Session' : 'Edit Session'}
        actionOptions={{ disablePrimary: props.loading }}
        onSecondaryClick={handleCancelClick}
        onPrimaryClick={handleSaveClick}
      ></ModalHeader>
      <IonContent color="light">
        <SessionForm
          ref={form}
          session={session}
          vehicles={props.vehicles}
          rateTypes={props.rates}
          onSessionFieldChange={handleSessionFieldValueChange}
        />
      </IonContent>
    </IonModal>
  );
}
