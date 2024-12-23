import './VehicleCard.scss';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon
} from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { Vehicle } from '../../../models/vehicle';

type VehicleCardProps = {
  selected?: boolean;
  vehicle: Vehicle;
  onSelectClick?: (vehicle: Vehicle) => void;
  onEditClick?: (vehicle: Vehicle) => void;
  onDeleteClick?: (vehicle: Vehicle) => void;
};

export default function VehicleCard({ vehicle, selected, ...props }: VehicleCardProps) {
  const { make, model, year, range, batterySize, trim } = vehicle;

  return (
    <IonCard className="vehicle-card">
      <IonCardHeader>
        <IonCardTitle className="vehicle-model">
          {model} {trim}
          {selected && <IonIcon icon={checkmark} />}
        </IonCardTitle>
        <IonCardSubtitle>{`${year} ${make}`}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {range && <p>{`Range: ${range} miles`}</p>}
        {batterySize && <p>{`Battery Size: ${vehicle.batterySize} kWh`}</p>}
      </IonCardContent>
      <IonButton fill="clear" onClick={() => props.onSelectClick?.(vehicle)}>
        Select
      </IonButton>
      <IonButton fill="clear" onClick={() => props.onEditClick?.(vehicle)}>
        Edit
      </IonButton>
      <IonButton fill="clear" color="danger" onClick={() => props.onDeleteClick?.(vehicle)}>
        Delete
      </IonButton>
    </IonCard>
  );
}
