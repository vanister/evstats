import { createContext, ReactNode, useContext, useMemo } from 'react';
import { EvsSessionService, SessionService } from '../services/SessionService';
import { EvsRateService, RateService } from '../services/RateService';
import { EvsVehicleService, VehicleService } from '../services/VehicleService';
import { EvsRateRepository, RateRepository } from '../repositories/RateRepository';
import { EvsVehicleRepository, VehicleRepository } from '../repositories/VehicleRepository';
import { EvsSessionRepository, SessionRepository } from '../repositories/SessionRepository';
import { ChargeStatsService, EvsChargeStatsService } from '../services/ChargeStatsService';

export type Services = {
  sessionService: SessionService;
  rateService: RateService;
  vehicleService: VehicleService;
  chargeStatsService: ChargeStatsService;
};

export type ServiceProviderProps = {
  children: ReactNode;
};

const ServiceContext = createContext<Services | null>(null);

/** Provides the services used throughout the app */
export function ServiceProvider({ children }: ServiceProviderProps) {
  const services: Services = useMemo(() => {
    // repositories
    const rateRepository: RateRepository = new EvsRateRepository();
    const vehicleRepository: VehicleRepository = new EvsVehicleRepository();
    const sessionRepository: SessionRepository = new EvsSessionRepository();

    // services
    const sessionService: SessionService = new EvsSessionService(sessionRepository);
    const rateService: RateService = new EvsRateService(rateRepository);
    const vehicleService: VehicleService = new EvsVehicleService(vehicleRepository);
    const chargeStatsService = new EvsChargeStatsService();

    return {
      sessionService,
      rateService,
      vehicleService,
      chargeStatsService
    };
  }, []);

  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
}

export function useServices() {
  const services = useContext(ServiceContext);

  if (!services) {
    throw new Error('ServiceContext must be used within a ServiceProvider');
  }

  return services;
}
