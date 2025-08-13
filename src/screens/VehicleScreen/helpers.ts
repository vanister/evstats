import { Vehicle } from '../../models/vehicle';
import { VehicleStats } from '../../models/vehicleStats';

export function getDeleteConfirmationMessage(vehicle: Vehicle, vehicleStats: VehicleStats[]): string {
  const stats = vehicleStats.find((s) => s.vehicleId === vehicle.id);
  const sessionCount = stats?.totalSessions ?? 0;
  const vehicleName = vehicle.nickname ?? vehicle.model;

  let message = `Are you sure you want to delete ${vehicleName}?`;

  if (sessionCount > 0) {
    message += ` This will also delete ${sessionCount} charging ${
      sessionCount === 1 ? 'session' : 'sessions'
    } associated with this vehicle.`;
  }

  return message;
}
