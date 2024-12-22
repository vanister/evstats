import { ExplicitAny } from '@evs-core';
import { RateRepository, EvsRateRepository } from '../repositories/RateRepository';
import { SessionRepository, EvsSessionRepository } from '../repositories/SessionRepository';
import { VehicleRepository } from '../repositories/VehicleRepository';
import { ChargeStatsService, EvsChargeStatsService } from './ChargeStatsService';
import { EvsRateService, RateService } from './RateService';
import { SessionService, EvsSessionService } from './SessionService';
import { VehicleService, EvsVehicleService } from './VehicleService';
import { DatabaseManager } from '../data/DatabaseManager';
import { logToConsole } from '../logger';
import { MockVehicleRepository } from '../__mocks__/MockVehicleRepository';

// start here by listing the services that can get injected
// then add it to the `initializeServiceContainer` function below
export type ServiceContainer = {
  sessionService: SessionService;
  rateService: RateService;
  vehicleService: VehicleService;
  chargeStatsService: ChargeStatsService;
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
  // const vehicleRepository: VehicleRepository = new EvsVehicleRepository(context);
  const vehicleRepository: VehicleRepository = new MockVehicleRepository();
  const sessionRepository: SessionRepository = new EvsSessionRepository();

  // services
  const sessionService: SessionService = new EvsSessionService(sessionRepository);
  const rateService: RateService = new EvsRateService(rateRepository);
  const vehicleService: VehicleService = new EvsVehicleService(vehicleRepository);
  const chargeStatsService: ChargeStatsService = new EvsChargeStatsService();

  // register the services here
  container
    .set('chargeStatsService', chargeStatsService)
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
