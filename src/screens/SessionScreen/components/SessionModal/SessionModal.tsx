import { IonContent, IonModal } from '@ionic/react';
import { useEffect, useRef } from 'react';
import { ModalRoles } from '../../../../constants';
import { useImmerState } from '../../../../hooks/useImmerState';
import { Session } from '../../../../models/session';
import { validateSession } from '../../validator';
import RequiredFieldSection from './RequiredFieldSection';
import VehicleSection from './VehicleSection';
import RateSection from './RateSection';
import { SessionModalState } from '../../session-types';
import Header from './Header';
import { today } from '../../../../utilities/dateUtility';

export type SessionModalProps = {
  allowCloseGesture?: boolean;
  isNew?: boolean;
  presentingElement?: HTMLElement;
  session?: Session | null;
  triggerId?: string;
  onCancel?: VoidFunction;
  onSave: (session: Session) => Promise<boolean>;
  onDidDismiss?: VoidFunction;
};

const INITIAL_FORM_STATE: SessionModalState = {
  session: {
    date: today(),
    rateTypeId: 1,
    vehicleId: 1
  }
};

export default function SessionModal(props: SessionModalProps) {
  const { allowCloseGesture, isNew, presentingElement, session, onSave, onCancel, onDidDismiss } =
    props;
  const [state, setState] = useImmerState<SessionModalState>(INITIAL_FORM_STATE);
  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    if (!isNew) {
      setState((s) => {
        s.session = session!;
      });
    }
  }, []);

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
      // don't raise save if there are errors
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
        <VehicleSection state={state} setState={setState}></VehicleSection>
        <RateSection state={state} setState={setState}></RateSection>
      </IonContent>
    </IonModal>
  );
}
