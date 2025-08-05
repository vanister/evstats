import './VehicleList.scss';

import { Vehicle } from '../../../../models/vehicle';
import { VehicleStats } from '../../../../models/vehicleStats';
import VehicleCard from '../VehicleCard/VehicleCard';

type VehicleListProps = {
  vehicles: Vehicle[];
  vehicleStats?: VehicleStats[];
  loading?: boolean;
  defaultVehicleId?: number | null;
  loadingOperations?: {
    adding: boolean;
    editing: boolean;
    deleting: boolean;
    settingDefault: boolean;
  };
  emptyMessage?: string;
  onEditClick: (vehicle: Vehicle) => void;
  onDeleteClick: (vehicle: Vehicle) => void;
  onSetDefaultClick: (vehicle: Vehicle) => void;
};

export default function VehicleList({ vehicles, vehicleStats, loading, defaultVehicleId, loadingOperations, ...props }: VehicleListProps) {
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
      {vehicles.map((vehicle) => {
        const stats = vehicleStats?.find(s => s.vehicleId === vehicle.id);
        const isDefault = vehicle.id === defaultVehicleId;
        return (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            stats={stats}
            loading={loading}
            isDefault={isDefault}
            loadingOperations={loadingOperations}
            onEditClick={props.onEditClick}
            onDeleteClick={props.onDeleteClick}
            onSetDefaultClick={props.onSetDefaultClick}
          />
        );
      })}
    </div>
  );
}
