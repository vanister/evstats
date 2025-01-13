import { IonInput, IonItem, IonList, IonListHeader, IonNote } from '@ionic/react';
import { forwardRef, MutableRefObject } from 'react';
import { Vehicle } from '../../../../models/vehicle';

type VehicleFormProps = {
  vehicle: Vehicle;
  onFieldValueChange: (field: keyof Vehicle, value: string | number) => void;
};

function VehicleForm(
  { vehicle, onFieldValueChange }: VehicleFormProps,
  ref: MutableRefObject<HTMLFormElement>
) {
  return (
    <form ref={ref}>
      <IonList inset>
        <IonListHeader>Details</IonListHeader>
        <IonItem>
          <IonInput
            type="text"
            label="VIN"
            labelPlacement="fixed"
            maxlength={17}
            value={vehicle.vin}
            onIonInput={(e) => onFieldValueChange('vin', e.detail.value)}
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
            onIonInput={(e) => onFieldValueChange('year', +e.detail.value)}
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
            onIonInput={(e) => onFieldValueChange('make', e.detail.value)}
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
            onIonInput={(e) => onFieldValueChange('model', e.detail.value)}
          />
        </IonItem>
        <IonItem>
          <IonInput
            type="text"
            label="Trim"
            labelPlacement="fixed"
            maxlength={50}
            value={vehicle.trim}
            onIonInput={(e) => onFieldValueChange('trim', e.detail.value)}
          />
        </IonItem>
        <IonItem>
          <IonInput
            type="text"
            label="Nickname"
            labelPlacement="fixed"
            maxlength={50}
            value={vehicle.nickname}
            onIonInput={(e) => onFieldValueChange('nickname', e.detail.value)}
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
            onIonInput={(e) => onFieldValueChange('range', +e.detail.value)}
          />
        </IonItem>
        <IonItem>
          <IonInput
            type="number"
            label="Battery size"
            labelPlacement="fixed"
            min={1}
            max={500}
            value={vehicle.batterySize}
            onIonInput={(e) => onFieldValueChange('batterySize', +e.detail.value)}
          />
        </IonItem>
      </IonList>
      <IonNote color="medium" className="ion-margin-horizontal">
        Range should in be miles and Battery Size should be in kWh
      </IonNote>
    </form>
  );
}

export default forwardRef(VehicleForm);
