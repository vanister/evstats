// start here by listing the services that can get injected

import { DatabaseManager } from '../data/DatabaseManager';

// then add it to the `initializeServiceContainer` function below
export type ServiceContainer = {
  chargeStatsService: ChargeStatsService;
  databaseBackupService: DatabaseBackupService;
  preferenceService: PreferenceService;
  sessionService: SessionService;
  rateService: RateService;
  vehicleService: VehicleService;
  vehicleStatsService: VehicleStatsService;
};

export type ContainerContext = {
  databaseManager: DatabaseManager;
};

export type PartialPropertyRecord<From, To> = Partial<Record<keyof From, keyof To>>;
