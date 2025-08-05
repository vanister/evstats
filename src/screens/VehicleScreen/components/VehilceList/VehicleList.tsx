import './VehicleList.scss';

import { Vehicle } from '../../../../models/vehicle';
import { VehicleStats } from '../../../../models/vehicleStats';
import VehicleCard from '../VehicleCard/VehicleCard';

type VehicleListProps = {
  vehicles: Vehicle[];
  vehicleStats?: VehicleStats[];
  loading?: boolean;
  emptyMessage?: string;
  onEditClick: (vehicle: Vehicle) => void;
  onDeleteClick: (vehicle: Vehicle) => void;
};

export default function VehicleList({ vehicles, vehicleStats, loading, ...props }: VehicleListProps) {
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
      {vehicles.map((vehicle, index) => {
        const stats = vehicleStats?.find(s => s.vehicleId === vehicle.id);
        const isDefault = index === 0; // First vehicle is default for now
        return (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            stats={stats}
            loading={loading}
            isDefault={isDefault}
            onEditClick={props.onEditClick}
            onDeleteClick={props.onDeleteClick}
          />
        );
      })}
    </div>
  );
}
