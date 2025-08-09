import { IonContent, IonModal, useIonAlert } from '@ionic/react';
import { useRef } from 'react';
import { ModalRoles, ChargeColors } from '../../../../constants';
import { RateType } from '../../../../models/rateType';
import { useImmerState } from '../../../../hooks/useImmerState';
import RateForm from './RateForm';
import ModalHeader from '../../../../components/ModalHeader';

type RateModalProps = {
  allowSwipeToClose?: boolean;
  isNew?: boolean;
  presentingElement?: HTMLElement;
  /** The editing rate. */
  rate?: RateType;
  /** Raised after the modal has been fully dismissed. */
  onDidDismiss: (canceled?: boolean) => void;
  /** Raised when the save button is clicked. If successful, the modal will dismiss. */
  onSave: (rate: RateType) => boolean | Promise<boolean>;
};

type RateFormState = {
  rate: RateType;
  isDirty?: boolean;
  isValid?: boolean;
};

const NEW_RATE: RateType = {
  id: 0,
  name: '',
  amount: 0,
  unit: 'kWh',
  color: ChargeColors.Home
};

export default function RateModal({ isNew, onDidDismiss, onSave, ...props }: RateModalProps) {
  const [formState, setFormState] = useImmerState<RateFormState>({
    isValid: true,
    isDirty: false,
    rate: {
      ...NEW_RATE,
      ...(props.rate ?? {})
    }
  });
  const modal = useRef<HTMLIonModalElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [showAlert] = useIonAlert();
  const { rate } = formState;

  const modalCanDismiss = async (_: unknown, role: string | undefined) => {
    if (props.allowSwipeToClose) {
      return true;
    }

    return role !== ModalRoles.Gesture;
  };

  const handleSaveClick = async () => {
    // Basic validation
    if (!rate.name.trim()) {
      await showAlert('Rate name is required', [{ text: 'OK', role: 'cancel' }]);
      return;
    }

    if (rate.amount <= 0) {
      await showAlert('Rate amount must be greater than 0', [{ text: 'OK', role: 'cancel' }]);
      return;
    }

    // Validate hex color format
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!rate.color || !hexColorRegex.test(rate.color)) {
      await showAlert('Color must be a valid hex code (e.g., #004D80)', [{ text: 'OK', role: 'cancel' }]);
      return;
    }

    const successful = onSave ? await onSave(rate) : true;

    if (successful) {
      await modal.current.dismiss();
      onDidDismiss?.();
    }
  };

  const handleCancelClick = async () => {
    await modal.current?.dismiss();
    onDidDismiss?.(true);
  };

  const handleRateFieldChange = (field: keyof RateType, value: string | number) => {
    setFormState((f) => {
      f.isDirty = true;
      f.rate[field as string] = value;
    });
  };

  return (
    <IonModal
      ref={modal}
      className="rate-modal"
      isOpen
      presentingElement={props.presentingElement}
      canDismiss={modalCanDismiss}
    >
      <ModalHeader
        title={isNew ? 'New Rate' : 'Edit Rate'}
        onSecondaryClick={handleCancelClick}
        onPrimaryClick={handleSaveClick}
      />
      <IonContent color="light">
        <RateForm ref={form} rate={rate} onFieldValueChange={handleRateFieldChange} />
      </IonContent>
    </IonModal>
  );
}