import { Vehicle } from '../../models/vehicle';

export type VehicleUpdater = (vehicle: Vehicle) => Promise<string | null>;
