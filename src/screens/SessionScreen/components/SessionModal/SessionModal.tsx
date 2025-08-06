import { IonContent, IonModal } from '@ionic/react';
import { useRef } from 'react';
import { ModalRoles } from '../../../../constants';
import { useImmerState } from '../../../../hooks/useImmerState';
import { Session } from '../../../../models/session';
import { today } from '../../../../utilities/dateUtility';
import SessionForm from '../SessionForm';
import ModalHeader from '../../../../components/ModalHeader';
import { Vehicle } from '../../../../models/vehicle';
import { RateType } from '../../../../models/rateType';

// Form state type allows undefined values during editing
type SessionFormState = {
  id?: number;
  date: string;
  kWh?: number;
  rateTypeId?: number;
  rateOverride?: number;
  vehicleId?: number;
};

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
  onSave: (session: Session) => Promise<boolean>;
  onDidDismiss?: (canceled?: boolean) => void;
};

// Form initial state - allows undefined for form editing before validation
const NEW_SESSION: SessionFormState = {
  date: today()
};

export default function SessionModal({ isNew, onSave, onDidDismiss, ...props }: SessionModalProps) {
  const modal = useRef<HTMLIonModalElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [session, setSession] = useImmerState<SessionFormState>({
    ...NEW_SESSION,
    rateTypeId: props.selectedRateTypeId,
    vehicleId: props.selectedVehicleId,
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
    const isValid = form.current.reportValidity();

    if (!isValid) {
      return;
    }

    const successful = onSave ? await onSave(session as Session) : true;

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
