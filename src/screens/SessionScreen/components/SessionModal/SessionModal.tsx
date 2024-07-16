import { IonContent, IonModal } from '@ionic/react';
import { useRef } from 'react';
import { ModalRoles } from '../../../../constants';
import { useImmerState } from '../../../../hooks/useImmerState';
import { Session } from '../../../../models/session';
import { validateSession } from '../../validator';
import { useVehicles } from '../../../../hooks/useVehicles';
import { useRateTypes } from '../../../../hooks/useRateTypes';
import RequiredFieldSection from './RequiredFieldSection';
import VehicleSection from './VehicleSection';
import RateSection from './RateSection';
import { SessionModalState } from '../../session-types';
import Header from './Header';

export interface SessionModalProps {
  allowCloseGesture?: boolean;
  isNew?: boolean;
  presentingElement?: HTMLElement;
  session?: Session;
  triggerId?: string;
  onCancel?: VoidFunction;
  onSave: (session: Session) => Promise<boolean>;
  onDidDismiss?: VoidFunction;
}

const FORM_STATE: SessionModalState = {
  session: {
    date: new Date().toLocaleString(),
    rateTypeId: 1,
    vehicleId: 1
  }
};

export default function SessionModal(props: SessionModalProps) {
  const { allowCloseGesture, isNew, presentingElement, onSave, onCancel, onDidDismiss } = props;
  const [state, setState] = useImmerState<SessionModalState>(FORM_STATE);
  const modal = useRef<HTMLIonModalElement>(null);
  const { vehicles } = useVehicles();
  const { rateTypes } = useRateTypes();

  const modalCanDismiss = async (_: unknown, role: string | undefined) => {
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
      canDismiss={modalCanDismiss}
      presentingElement={presentingElement}
      onDidDismiss={handleDidDismiss}
    >
      <Header
        title={isNew ? 'New Session' : 'Edit Session'}
        state={state}
        setState={setState}
        onCancelClick={handleCancelClick}
        onSaveClick={handleSaveClick}
      ></Header>
      <IonContent color="light">
        <RequiredFieldSection state={state} setState={setState}></RequiredFieldSection>
        <VehicleSection state={state} setState={setState} vehicles={vehicles}></VehicleSection>
        <RateSection state={state} setState={setState} rateTypes={rateTypes}></RateSection>
      </IonContent>
    </IonModal>
  );
}
