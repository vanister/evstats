import { IonContent, IonModal } from '@ionic/react';
import { useRef } from 'react';
import { ModalRoles } from '../../../../constants';
import { useImmerState } from '../../../../hooks/useImmerState';
import { Session } from '../../../../models/session';
import { today } from '../../../../utilities/dateUtility';
import { useAppSelector } from '../../../../redux/hooks';
import SessionForm from '../SessionForm';
import ModalHeader from '../../../../components/ModalHeader';

type SessionModalProps = {
  allowCloseGesture?: boolean;
  isNew?: boolean;
  presentingElement?: HTMLElement;
  session?: Session;
  triggerId?: string;
  onSave: (session: Session) => Promise<boolean>;
  onDidDismiss?: (canceled?: boolean) => void;
};

// make sure all non-id properties are defined
const NEW_SESSION: Session = {
  date: today(),
  kWh: null,
  rateTypeId: null,
  vehicleId: null,
  rateOverride: null
};

export default function SessionModal({ isNew, onSave, onDidDismiss, ...props }: SessionModalProps) {
  const modal = useRef<HTMLIonModalElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const vehicles = useAppSelector((s) => s.vehicles.vehicles);
  const rateTypes = useAppSelector((s) => s.rateTypes.rateTypes);
  const [session, setSession] = useImmerState<Session>({
    ...NEW_SESSION,
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

    const successful = onSave ? await onSave(session) : true;

    if (successful) {
      await modal.current.dismiss();
      onDidDismiss?.();
    }
  };

  const handleSessionFieldValueChange = (field: keyof Session, value: string | number) => {
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
        onSecondaryClick={handleCancelClick}
        onPrimaryClick={handleSaveClick}
      ></ModalHeader>
      <IonContent color="light">
        <SessionForm
          ref={form}
          session={session}
          vehicles={vehicles}
          rateTypes={rateTypes}
          onSessionFieldChange={handleSessionFieldValueChange}
        />
      </IonContent>
    </IonModal>
  );
}
