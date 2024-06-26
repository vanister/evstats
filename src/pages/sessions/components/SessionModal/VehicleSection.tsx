import { IonList, IonItem, IonSelectOption } from '@ionic/react';
import React from 'react';
import EvsSelect from '../../../../components/EvsSelect';
import { SessionModalState } from './SessionModal';
import { SetImmerState } from '../../../../hooks/useImmerState';
import { Vehicle } from '../../../../hooks/useVehicles';

export interface VehicleSectionProps {
  vehicles: Vehicle[];
  state: SessionModalState;
  setState: SetImmerState<SessionModalState>;
}

export default function VehicleSection({ state, vehicles, setState }: VehicleSectionProps) {
  return (
    <IonList inset>
      <IonItem>
        <EvsSelect
          inset
          label="Vehicles"
          labelPlacement="fixed"
          header="Select a Vehicle"
          value={state.session.vehicleId}
          onSelect={(value) =>
            setState((s) => {
              s.session.vehicleId = value;
            })
          }
        >
          {vehicles.map((v) => (
            <IonSelectOption key={v.id} value={v.id}>
              {v.model}
            </IonSelectOption>
          ))}
        </EvsSelect>
      </IonItem>
    </IonList>
  );
}
