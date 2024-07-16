import { IonList, IonItem, IonSelectOption } from '@ionic/react';
import EvsSelect from '../../../../components/EvsSelect';
import { Vehicle } from '../../../../hooks/useVehicles';
import { CommonSessionModalSectionProps } from '../../session-types';

export interface VehicleSectionProps extends CommonSessionModalSectionProps {
  vehicles: Vehicle[];
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
