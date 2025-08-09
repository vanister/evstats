import './VehicleModal.scss';

import { IonContent, IonModal, useIonAlert } from '@ionic/react';
import { useRef } from 'react';
import { ModalRoles } from '../../../../constants';
import { Vehicle } from '../../../../models/vehicle';
import { useImmerState } from '../../../../hooks/useImmerState';
import VehicleForm from './VehicleForm';
import ModalHeader from '../../../../components/ModalHeader';
import { sanitizeVehicle, validateVehicle } from '../../../../utilities/vehicleValidation';

type VehicleModalProps = {
  allowSwipeToClose?: boolean;
  isNew?: boolean;
  presentingElement?: HTMLElement;
  /** The editing vehicle. */
  vehicle?: Vehicle;
  /** Raised after the modal has been fully dismissed. */
  onDidDismiss: (canceled?: boolean) => void;
  /** Raised when the save button is clicked. If successful, the modal will dismiss. */
  onSave: (vehicle: Vehicle) => boolean | Promise<boolean>;
};

type VehicleFormState = {
  vehicle: Vehicle;
  isDirty?: boolean;
  isValid?: boolean;
};

const NEW_VEHICLE: Vehicle = {
  vin: '',
  year: null,
  make: '',
  model: '',
  trim: '',
  nickname: '',
  range: null,
  batterySize: null
};

export default function VehicleModal({ isNew, onDidDismiss, onSave, ...props }: VehicleModalProps) {
  const [formState, setFormState] = useImmerState<VehicleFormState>({
    isValid: true,
    isDirty: false,
    vehicle: {
      ...NEW_VEHICLE,
      ...(props.vehicle ?? {})
    }
  });
  const modal = useRef<HTMLIonModalElement>(null);
  const [showAlert] = useIonAlert();
  const { vehicle } = formState;

  const modalCanDismiss = async (_: unknown, role: string | undefined) => {
    if (props.allowSwipeToClose) {
      return true;
    }

    return role !== ModalRoles.Gesture;
  };

  const handleSaveClick = async () => {
    // Sanitize the vehicle data first
    const sanitizedVehicle = sanitizeVehicle(vehicle);
    
    // Validate the sanitized data
    const validationError = validateVehicle(sanitizedVehicle);
    
    setFormState((f) => {
      f.isValid = validationError === null;
      f.vehicle = sanitizedVehicle;
    });

    if (validationError) {      
      await showAlert({
        header: 'Validation Error',
        message: validationError,
        buttons: [{ text: 'OK', role: 'cancel' }]
      });
      return;
    }

    const successful = onSave ? await onSave(sanitizedVehicle) : true;

    if (successful) {
      await modal.current.dismiss();
      onDidDismiss?.();
    }
  };

  const handleCancelClick = async () => {
    await modal.current?.dismiss();
    onDidDismiss?.(true);
  };

  const handleVehicleFieldChange = (field: keyof Vehicle, value: string | number) => {
    setFormState((f) => {
      f.isDirty = true;
      f.vehicle[field as string] = value;
    });
  };

  return (
    <IonModal
      ref={modal}
      className="vehicle-modal"
      isOpen
      presentingElement={props.presentingElement}
      canDismiss={modalCanDismiss}
    >
      <ModalHeader
        title={isNew ? 'New Vehicle' : 'Edit Vehicle'}
        onSecondaryClick={handleCancelClick}
        onPrimaryClick={handleSaveClick}
      />
      <IonContent color="light">
        <VehicleForm vehicle={vehicle} onFieldValueChange={handleVehicleFieldChange} />
      </IonContent>
    </IonModal>
  );
}
