import './VehicleModal.scss';

import { IonContent, IonInput, IonItem, IonList, IonListHeader, IonModal } from '@ionic/react';
import { useRef } from 'react';
import { ModalRolesOld } from '../../../../constants';
import { Vehicle } from '../../../../models/vehicle';
import ModalHeader from '../../../SessionScreen/components/SessionModal/ModalHeader';
import { useImmerState } from '../../../../hooks/useImmerState';

type VehicleModalProps = {
  allowCloseGesture?: boolean;
  isNew?: boolean;
  presentingElement?: HTMLElement;
  vehicle?: Vehicle;
  /** Raised when the cancel button is clicked. */
  onCancel?: VoidFunction;
  /** Raised after the modal has been fully dismissed. */
  onDidDismiss?: VoidFunction;
  /** Raised when the save button is clicked. */
  onSave?: (vehicle: Vehicle) => void;
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

export default function VehicleModal({ isNew, ...props }: VehicleModalProps) {
  const modal = useRef<HTMLIonModalElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [vehicle, setVehicle] = useImmerState<Vehicle>({
    ...NEW_VEHICLE,
    ...(props.vehicle ?? {})
  });

  const modalCanDismiss = async (_: unknown, role: string | undefined) => {
    if (props.allowCloseGesture) {
      return true;
    }

    return role !== ModalRolesOld.gesture;
  };

  const handleSaveClick = () => {
    if (!form.current.reportValidity()) {
      return;
    }

    props.onSave(vehicle);
    modal.current.dismiss();
  };

  const handleCancelClick = () => {
    props.onCancel?.();
    modal.current?.dismiss();
  };

  return (
    <IonModal
      ref={modal}
      className="vehicle-modal"
      isOpen
      presentingElement={props.presentingElement}
      canDismiss={modalCanDismiss}
      onDidDismiss={props.onDidDismiss}
    >
      <ModalHeader
        title={isNew ? 'New Vehicle' : 'Edit Vehicle'}
        onCancelClick={handleCancelClick}
        onSaveClick={handleSaveClick}
      />
      <IonContent color="light">
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
                onIonInput={(e) =>
                  setVehicle((s) => {
                    s.vin = e.detail.value;
                  })
                }
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
                onIonInput={(e) =>
                  setVehicle((s) => {
                    s.year = +e.detail.value;
                  })
                }
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
                onIonInput={(e) =>
                  setVehicle((s) => {
                    s.make = e.detail.value;
                  })
                }
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
                onIonInput={(e) =>
                  setVehicle((s) => {
                    s.model = e.detail.value;
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="text"
                label="Trim"
                labelPlacement="fixed"
                maxlength={50}
                value={vehicle.trim}
                onIonInput={(e) =>
                  setVehicle((s) => {
                    s.trim = e.detail.value;
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="text"
                label="Nickname"
                labelPlacement="fixed"
                maxlength={50}
                value={vehicle.nickname}
                onIonInput={(e) =>
                  setVehicle((s) => {
                    s.nickname = e.detail.value;
                  })
                }
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
                onIonInput={(e) =>
                  setVehicle((s) => {
                    s.range = +e.detail.value;
                  })
                }
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
                onIonInput={(e) =>
                  setVehicle((s) => {
                    s.batterySize = +e.detail.value;
                  })
                }
              />
            </IonItem>
          </IonList>
        </form>
      </IonContent>
    </IonModal>
  );
}
