import { RateRepository, EvsRateRepository } from '../repositories/RateRepository';
import { SessionRepository, EvsSessionRepository } from '../repositories/SessionRepository';
import { VehicleRepository, EvsVehicleRepository } from '../repositories/VehicleRepository';
import { EvsChargeStatsService } from './ChargeStatsService';
import { EvsRateService, RateService } from './RateService';
import { SessionService, EvsSessionService } from './SessionService';
import { VehicleService, EvsVehicleService } from './VehicleService';

type ServiceContainer = typeof serviceContainer;

// repositories
const rateRepository: RateRepository = new EvsRateRepository();
const vehicleRepository: VehicleRepository = new EvsVehicleRepository();
const sessionRepository: SessionRepository = new EvsSessionRepository();

// services
const sessionService: SessionService = new EvsSessionService(sessionRepository);
const rateService: RateService = new EvsRateService(rateRepository);
const vehicleService: VehicleService = new EvsVehicleService(vehicleRepository);
const chargeStatsService = new EvsChargeStatsService();

// register the services here
const serviceContainer = {
  sessionService,
  rateService,
  vehicleService,
  chargeStatsService
};

export function getService<ServiceName extends keyof ServiceContainer>(name: ServiceName) {
  return serviceContainer[name];
}
