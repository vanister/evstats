import { Vehicle } from '../../../models/vehicle';
import VehicleCard from './VehicleCard/VehicleCard';

type VehicleListProps = {
  vehicles: Vehicle[];
  emptyMessage?: string;
  onEditClick: (vehicle: Vehicle) => void;
  onDeleteClick: (vehicle: Vehicle) => void;
};

export default function VehicleList({ vehicles, ...props }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="no-vehicles-container">
        <h5>{props.emptyMessage ?? 'Click the + button to add a vehicle'}</h5>
      </div>
    );
  }

  return vehicles.map((vehicle) => (
    <VehicleCard
      key={vehicle.id}
      vehicle={vehicle}
      onEditClick={props.onEditClick}
      onDeleteClick={props.onDeleteClick}
    />
  ));
}
