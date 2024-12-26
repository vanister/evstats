import { ExplicitAny } from '@evs-core';
import { ChargeStatsService, EvsChargeStatsService } from './ChargeStatsService';
import { EvsRateService, RateService } from './RateService';
import { SessionService, EvsSessionService } from './SessionService';
import { VehicleService, EvsVehicleService } from './VehicleService';
import { DatabaseManager } from '../data/DatabaseManager';
import { logToConsole } from '../logger';
import { DatabaseBackupService, SqliteDbBackupService } from './DatabaseBackupService';
import { RateRepository, EvsRateRepository } from '../data/repositories/RateRepository';
import { EvsSessionRepository, SessionRepository } from '../data/repositories/SessionRepository';
import { EvsVehicleRepository, VehicleRepository } from '../data/repositories/VehicleRepository';

// start here by listing the services that can get injected
// then add it to the `initializeServiceContainer` function below
export type ServiceContainer = {
  chargeStatsService: ChargeStatsService;
  databaseBackupService: DatabaseBackupService;
  sessionService: SessionService;
  rateService: RateService;
  vehicleService: VehicleService;
};

export type ContainerContext = {
  databaseManager: DatabaseManager;
};

export type ServiceLocator = typeof getService;
export type ServiceContainerIntializer = typeof initializeServiceContainer;

const container = new Map<keyof ServiceContainer, ExplicitAny>();
let isContainerBuilt = false;

/**
 * Initializes the services needed throughout the app.
 *
 * Register more services directly in this function.
 * It will be called by the `ServiceProvider` when it is mounted
 *
 * @param context The context that will be used to initialize the service container.
 */
export function initializeServiceContainer({ databaseManager }: ContainerContext) {
  if (isContainerBuilt) {
    logToConsole('service container already initialized');
    return;
  }

  logToConsole('initializing service container');

  const { context } = databaseManager;

  // repositories
  const rateRepository: RateRepository = new EvsRateRepository(context);
  // const rateRepository: RateRepository = new MockRateRepository();
  const sessionRepository: SessionRepository = new EvsSessionRepository(context);
  // const sessionRepository: SessionRepository = new MockSessionRepository();
  const vehicleRepository: VehicleRepository = new EvsVehicleRepository(context);
  // const vehicleRepository: VehicleRepository = new MockVehicleRepository();

  // services
  const chargeStatsService: ChargeStatsService = new EvsChargeStatsService();
  const databaseBackupService: DatabaseBackupService = new SqliteDbBackupService(databaseManager);
  const sessionService: SessionService = new EvsSessionService(sessionRepository);
  const rateService: RateService = new EvsRateService(rateRepository);
  const vehicleService: VehicleService = new EvsVehicleService(vehicleRepository);

  // register the services here
  container
    .set('chargeStatsService', chargeStatsService)
    .set('databaseBackupService', databaseBackupService)
    .set('rateService', rateService)
    .set('sessionService', sessionService)
    .set('vehicleService', vehicleService);

  isContainerBuilt = true;
  logToConsole('service container initialized');
}

/**
 * Gets a service from the service container.
 *
 * @param name The name of the service.
 */
export function getService<Service extends keyof ServiceContainer>(name: Service) {
  return container.get(name) as ServiceContainer[Service];
}
