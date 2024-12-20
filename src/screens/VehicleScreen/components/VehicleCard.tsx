import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle
} from '@ionic/react';
import { Vehicle } from '../../../models/vehicle';

type VehicleCardProps = {
  key?: React.Key;
  vehicle: Vehicle;
};

export default function VehicleCard({ key, vehicle }: VehicleCardProps) {
  const { make, model, year } = vehicle;

  return (
    <IonCard key={key} className="vehicle-card">
      <IonCardHeader>
        <IonCardTitle>{model}</IonCardTitle>
        <IonCardSubtitle>{`${year} ${make}`}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        {"Here's a small text description for the card content. Nothing more, nothing less."}
      </IonCardContent>

      <IonButton fill="clear">Edit</IonButton>
      <IonButton fill="clear" color="danger">
        Delete
      </IonButton>
    </IonCard>
  );
}
