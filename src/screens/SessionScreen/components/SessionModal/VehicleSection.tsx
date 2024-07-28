import { IonList, IonItem, IonSelectOption } from '@ionic/react';
import EvsSelect from '../../../../components/EvsSelect';
import { SessionModalStateProps } from '../../session-types';
import { useRootSelector } from '../../../../hooks/useRootSelector';

export type VehicleSectionProps = SessionModalStateProps;

export default function VehicleSection({ state, setState }: VehicleSectionProps) {
  const vehicles = useRootSelector((s) => s.vehicles);

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
