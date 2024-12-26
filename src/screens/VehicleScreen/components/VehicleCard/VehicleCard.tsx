import './VehicleCard.scss';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle
} from '@ionic/react';
import { Vehicle } from '../../../../models/vehicle';

type VehicleCardProps = {
  vehicle: Vehicle;
  onEditClick?: (vehicle: Vehicle) => void;
  onDeleteClick?: (vehicle: Vehicle) => void;
};

export default function VehicleCard({ vehicle, ...props }: VehicleCardProps) {
  const { make, model, year, range, batterySize, trim, nickname } = vehicle;

  return (
    <IonCard className="vehicle-card">
      <IonCardHeader>
        <IonCardTitle className="vehicle-model">
          {model} {trim}
        </IonCardTitle>
        <IonCardSubtitle>{`${year} ${make}`}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {range && <p>{`Range: ${range} miles`}</p>}
        {batterySize && <p>{`Battery Size: ${vehicle.batterySize} kWh`}</p>}
        {nickname && <p>{`Nickname: ${nickname}`}</p>}
      </IonCardContent>
      <IonButton fill="clear" onClick={() => props.onEditClick?.(vehicle)}>
        Edit
      </IonButton>
      <IonButton fill="clear" color="danger" onClick={() => props.onDeleteClick?.(vehicle)}>
        Delete
      </IonButton>
    </IonCard>
  );
}
