import { ExplicitAny } from '@evs-core';
import { RateRepository, EvsRateRepository } from '../repositories/RateRepository';
import { SessionRepository, EvsSessionRepository } from '../repositories/SessionRepository';
import { VehicleRepository, EvsVehicleRepository } from '../repositories/VehicleRepository';
import { ChargeStatsService, EvsChargeStatsService } from './ChargeStatsService';
import { EvsRateService, RateService } from './RateService';
import { SessionService, EvsSessionService } from './SessionService';
import { VehicleService, EvsVehicleService } from './VehicleService';
import { DatabaseManager } from '../data/DatabaseManager';

// list the services that can get injected here
export type ServiceContainer = {
  sessionService: SessionService;
  rateService: RateService;
  vehicleService: VehicleService;
  chargeStatsService: ChargeStatsService;
};

export type ContainerContext = {
  databaseManager: DatabaseManager;
};

let isContainerBuilt = false;

const container = new Map<keyof ServiceContainer, ExplicitAny>();

export function buildServiceContainer({ databaseManager }: ContainerContext) {
  if (isContainerBuilt) {
    return;
  }

  const { context } = databaseManager;

  // repositories
  const rateRepository: RateRepository = new EvsRateRepository(context);
  const vehicleRepository: VehicleRepository = new EvsVehicleRepository();
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
}

export function getService<Service extends keyof ServiceContainer>(name: Service) {
  return container.get(name) as ServiceContainer[Service];
}
