import './VehicleList.scss';

import { Vehicle } from '../../../../models/vehicle';
import VehicleCard from '../VehicleCard/VehicleCard';

type VehicleListProps = {
  vehicles: Vehicle[];
  emptyMessage?: string;
  onEditClick: (vehicle: Vehicle) => void;
  onDeleteClick: (vehicle: Vehicle) => void;
};

export default function VehicleList({ vehicles, ...props }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="vehicle-list">
        <div className="empty-list-message">
          <h3>{props.emptyMessage ?? 'Add a vehicle to get started'}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-list">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onEditClick={props.onEditClick}
          onDeleteClick={props.onDeleteClick}
        />
      ))}
    </div>
  );
}
