import { useLocation } from 'react-router';
import EvsPage from '../../../components/EvsPage';
import { Vehicle } from '../../../models/vehicle';
import { useImmerState } from '../../../hooks/useImmerState';
import { useRef } from 'react';
import { IonList, IonListHeader, IonItem, IonInput } from '@ionic/react';

type VehicleDetailsState = {
  isValid?: boolean;
  isNew?: boolean;
  vehicle: Vehicle;
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

export default function VehicleDetails() {
  const form = useRef<HTMLFormElement>();
  const location = useLocation<{ isNew: boolean; vehicle?: Vehicle }>();
  const { isNew: isNewVehicle, vehicle: editingVehicle } = location.state ?? {};
  const [state, setState] = useImmerState<VehicleDetailsState>({
    isNew: isNewVehicle,
    vehicle: {
      ...NEW_VEHICLE,
      ...(editingVehicle ?? {})
    }
  });

  const { isNew, vehicle } = state;

  const handleVehicleFieldChange = (field: keyof Vehicle, value: string | number) => {
    setState((s) => {
      s.vehicle[field as string] = value;
    });
  };

  // const handlePrimaryAction = () => {
  //   const isValid = form.current?.reportValidity();

  //   setState((s) => {
  //     s.isValid = isValid;
  //   });

  //   if (!isValid) {
  //     return;
  //   }
  // };

  return (
    <EvsPage title={isNew ? 'New Vehicle' : 'Edit Vehicle'} staticHeader>
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
              onIonInput={(e) => handleVehicleFieldChange('make', +e.detail.value)}
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
    </EvsPage>
  );
}
