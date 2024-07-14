import { createContext, ReactNode, useContext, useMemo } from 'react';
import { EvsSessionService, SessionService } from '../services/SessionService';
import { EvsRateService, RateService } from '../services/RateService';
import { EvsVehicleService, VehicleService } from '../services/VehicleService';

export type Services = {
  sessionService: SessionService;
  rateService: RateService;
  vehicleService: VehicleService;
};

export type ServiceProviderProps = {
  children: ReactNode;
};

const ServiceContext = createContext<Services | null>(null);

/** Provides the services used throughout the app */
export function ServiceProvider({ children }: ServiceProviderProps) {
  const services: Services = useMemo(() => {
    const sessionService: SessionService = new EvsSessionService();
    const rateService: RateService = new EvsRateService();
    const vehicleService: VehicleService = new EvsVehicleService();

    return {
      sessionService,
      rateService,
      vehicleService
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
