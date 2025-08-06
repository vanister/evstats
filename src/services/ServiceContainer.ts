import { ExplicitAny } from '@evs-core';
import { ChargeStatsService, EvsChargeStatsService } from './ChargeStatsService';
import { EvsRateService, RateService } from './RateService';
import { SessionService, EvsSessionService } from './SessionService';
import { VehicleService, EvsVehicleService } from './VehicleService';
import { VehicleStatsService, EvsVehicleStatsService } from './VehicleStatsService';
import { logToDevServer } from '../logger';
import { DatabaseBackupService, SqliteDbBackupService } from './DatabaseBackupService';
import { RateRepository, EvsRateRepository } from '../data/repositories/RateRepository';
import { EvsSessionRepository, SessionRepository } from '../data/repositories/SessionRepository';
import { EvsVehicleRepository, VehicleRepository } from '../data/repositories/VehicleRepository';
import { EvsPreferenceService, PreferenceService } from './PreferenceService';
import { Preferences } from '@capacitor/preferences';
import {
  ChargeStatsRepository,
  EvsChargeStatsRepository
} from '../data/repositories/ChargeStatsRepository';
import {
  VehicleStatsRepository,
  EvsVehicleStatsRepository
} from '../data/repositories/VehicleStatsRepository';
import { ContainerContext, ServiceContainer, ServiceLocator, ServiceContainerIntializer } from './service-types';

export { type ServiceLocator, type ServiceContainerIntializer };

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
    logToDevServer('service container already initialized');
    return;
  }

  logToDevServer('initializing service container');

  const { context } = databaseManager;

  // todo - if this list gets too large, introduce a RepositoryContainer for injection
  // repositories
  const rateRepository: RateRepository = new EvsRateRepository(context);
  const sessionRepository: SessionRepository = new EvsSessionRepository(context);
  const vehicleRepository: VehicleRepository = new EvsVehicleRepository(context);
  const chargeStatsRepository: ChargeStatsRepository = new EvsChargeStatsRepository(context);
  const vehicleStatsRepository: VehicleStatsRepository = new EvsVehicleStatsRepository(context);

  // services
  const chargeStatsService: ChargeStatsService = new EvsChargeStatsService(
    chargeStatsRepository,
    rateRepository
  );
  const databaseBackupService: DatabaseBackupService = new SqliteDbBackupService(databaseManager);
  const preferenceService: PreferenceService = new EvsPreferenceService(Preferences);
  const sessionService: SessionService = new EvsSessionService(sessionRepository);
  const rateService: RateService = new EvsRateService(rateRepository);
  const vehicleService: VehicleService = new EvsVehicleService(
    vehicleRepository,
    preferenceService
  );
  const vehicleStatsService: VehicleStatsService = new EvsVehicleStatsService(
    vehicleStatsRepository
  );

  // register the services here
  container
    .set('chargeStatsService', chargeStatsService)
    .set('databaseBackupService', databaseBackupService)
    .set('preferenceService', preferenceService)
    .set('rateService', rateService)
    .set('sessionService', sessionService)
    .set('vehicleService', vehicleService)
    .set('vehicleStatsService', vehicleStatsService);

  isContainerBuilt = true;
  logToDevServer('service container initialized');
}

/**
 * Gets a service from the service container.
 *
 * @param name The name of the service.
 */
export function getService<Service extends keyof ServiceContainer>(name: Service) {
  if (!isContainerBuilt) {
    const error = new Error('Service container is not built');

    logToDevServer(
      `something is trying to get "${name}" from a container that is not built: ${error.message}`,
      'error',
      error.stack
    );
    throw error;
  }

  return container.get(name) as ServiceContainer[Service];
}
