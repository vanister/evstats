import { ExplicitAny } from '@evs-core';
import { ChargeStatsService, EvsChargeStatsService } from './ChargeStatsService';
import { EvsRateService, RateService } from './RateService';
import { SessionService, EvsSessionService } from './SessionService';
import { VehicleService, EvsVehicleService } from './VehicleService';
import { VehicleStatsService, EvsVehicleStatsService } from './VehicleStatsService';
import { VehicleImportService, EvsVehicleImportService } from './VehicleImportService';
import { SessionImportService, EvsSessionImportService } from './SessionImportService';
import { ExportService, EvsExportService } from './ExportService';
import { FileExportService, EvsFileExportService } from '../utilities/fileExport';
// Purchase service imports temporarily disabled
// import { PurchaseService, EvsPurchaseService } from './PurchaseService';
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
import { ContainerContext, ServiceContainer } from './service-types';

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
    rateRepository,
    vehicleRepository
  );
  const databaseBackupService: DatabaseBackupService = new SqliteDbBackupService(databaseManager);
  const preferenceService: PreferenceService = new EvsPreferenceService(Preferences);
  const sessionService: SessionService = new EvsSessionService(sessionRepository);
  const rateService: RateService = new EvsRateService(rateRepository);
  const vehicleService: VehicleService = new EvsVehicleService(
    vehicleRepository,
    sessionRepository,
    preferenceService,
    context
  );
  const vehicleStatsService: VehicleStatsService = new EvsVehicleStatsService(
    vehicleStatsRepository,
    vehicleRepository
  );
  const vehicleImportService: VehicleImportService = new EvsVehicleImportService(vehicleRepository);
  const sessionImportService: SessionImportService = new EvsSessionImportService(sessionRepository);
  const fileExportService: FileExportService = new EvsFileExportService();
  const exportService: ExportService = new EvsExportService(vehicleRepository, sessionRepository, fileExportService);
  // Purchase service temporarily disabled - not registering with container
  // const purchaseService: PurchaseService = new EvsPurchaseService();

  // register the services here
  container
    .set('chargeStatsService', chargeStatsService)
    .set('databaseBackupService', databaseBackupService)
    .set('preferenceService', preferenceService)
    .set('rateService', rateService)
    .set('sessionService', sessionService)
    .set('vehicleService', vehicleService)
    .set('vehicleStatsService', vehicleStatsService)
    .set('vehicleImportService', vehicleImportService)
    .set('sessionImportService', sessionImportService)
    .set('fileExportService', fileExportService)
    .set('exportService', exportService);
    // Purchase service temporarily disabled
    // .set('purchaseService', purchaseService);

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
      error.stack,
      true
    );
    throw error;
  }

  return container.get(name) as ServiceContainer[Service];
}
