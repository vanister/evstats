import './VehicleModal.scss';

import { IonContent, IonInput, IonItem, IonList, IonListHeader, IonModal } from '@ionic/react';
import { useRef } from 'react';
import { ModalRoles } from '../../../../constants';
import { Vehicle } from '../../../../models/vehicle';
import ModalHeader from '../../../SessionScreen/components/SessionModal/ModalHeader';
import { useImmerState } from '../../../../hooks/useImmerState';

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
  const form = useRef<HTMLFormElement>(null);
  const { vehicle } = formState;

  const modalCanDismiss = async (_: unknown, role: string | undefined) => {
    if (props.allowSwipeToClose) {
      return true;
    }

    return role !== ModalRoles.Gesture;
  };

  const handleSaveClick = async () => {
    const isValid = form.current.reportValidity();

    setFormState((f) => {
      f.isValid = isValid;
    });

    if (!isValid) {
      return;
    }

    const successful = (await onSave?.(vehicle)) ?? true;

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
        {/* todo - clean up */}
        <form ref={form}>
          <IonList inset>
            <IonListHeader>Details</IonListHeader>
            <IonItem>
              <IonInput
                type="text"
                label="VIN"
                labelPlacement="fixed"
                maxlength={17}
                value={vehicle.vin}
                onIonInput={(e) => handleVehicleFieldChange('vin', e.detail.value)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="number"
                label="Year"
                placeholder="required"
                labelPlacement="fixed"
                min={1900}
                max={2100}
                value={vehicle.year}
                required
                onIonInput={(e) => handleVehicleFieldChange('year', +e.detail.value)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="text"
                label="Make"
                placeholder="required"
                labelPlacement="fixed"
                value={vehicle.make}
                maxlength={50}
                required
                onIonInput={(e) => handleVehicleFieldChange('make', e.detail.value)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="text"
                placeholder="required"
                label="Model"
                labelPlacement="fixed"
                value={vehicle.model}
                maxlength={50}
                required
                onIonInput={(e) => handleVehicleFieldChange('model', e.detail.value)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="text"
                label="Trim"
                labelPlacement="fixed"
                maxlength={50}
                value={vehicle.trim}
                onIonInput={(e) => handleVehicleFieldChange('trim', e.detail.value)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="text"
                label="Nickname"
                labelPlacement="fixed"
                maxlength={50}
                value={vehicle.nickname}
                onIonInput={(e) => handleVehicleFieldChange('nickname', e.detail.value)}
              />
            </IonItem>
          </IonList>
          <IonList inset>
            <IonListHeader>Features</IonListHeader>
            <IonItem>
              <IonInput
                type="number"
                label="Range"
                labelPlacement="fixed"
                min={1}
                max={1000}
                value={vehicle.range}
                onIonInput={(e) => handleVehicleFieldChange('range', +e.detail.value)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="number"
                label="Battery Size"
                labelPlacement="fixed"
                min={1}
                max={500}
                value={vehicle.batterySize}
                onIonInput={(e) => handleVehicleFieldChange('batterySize', +e.detail.value)}
              />
            </IonItem>
          </IonList>
        </form>
      </IonContent>
    </IonModal>
  );
}
