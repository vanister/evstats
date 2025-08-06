import { Vehicle } from '../../models/vehicle';
import { VehicleStats } from '../../models/vehicleStats';

export type VehicleUpdater = (vehicle: Vehicle) => Promise<string | null>;

export type VehicleLocalState = {
  vehicleStats: VehicleStats[];
  loadingStats: boolean;
  refreshTrigger: number;
};

export type UseVehicleHook = {
  vehicles: Vehicle[];
  vehicleStats: VehicleStats[];
  loadingStats: boolean;
  defaultVehicleId: number | null;
  refreshStats: () => void;
  addNewVehicle: VehicleUpdater;
  editVehicle: VehicleUpdater;
  removeVehicle: VehicleUpdater;
  setDefaultVehicle: (vehicle: Vehicle) => Promise<void>;
};