import { createContext, ReactNode, useContext, useMemo } from 'react';
import { EvsSessionService, SessionService } from '../services/SessionService';

export type Services = {
  sessionService: SessionService;
};

export type ServiceProviderProps = {
  children: ReactNode;
};

const ServiceContext = createContext<Services | null>(null);

/** Provides the services used throughout the app */
export function ServiceProvider({ children }: ServiceProviderProps) {
  const services: Services = useMemo(() => {
    const sessionService: SessionService = new EvsSessionService();

    return {
      sessionService
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
