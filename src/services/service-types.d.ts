// start here by listing the services that can get injected

import { DatabaseManager } from '../data/DatabaseManager';
import { ChargeStatsService } from './ChargeStatsService';
import { DatabaseBackupService } from './DatabaseBackupService';
import { PreferenceService } from './PreferenceService';
import { SessionService } from './SessionService';
import { RateService } from './RateService';
import { VehicleService } from './VehicleService';
import { VehicleStatsService } from './VehicleStatsService';

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

export type ServiceLocator = <Service extends keyof ServiceContainer>(name: Service) => ServiceContainer[Service];

export type ServiceContainerIntializer = (context: ContainerContext) => void;

export type PartialPropertyRecord<From, To> = Partial<Record<keyof From, keyof To>>;
