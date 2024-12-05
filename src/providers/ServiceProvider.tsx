import { createContext, ReactNode, useContext } from 'react';
import { getService } from '../services/ServiceInjector';

type GetServiceFunction = typeof getService;

export type ServiceContextType = {
  getService: GetServiceFunction
};

const ServiceContext = createContext<ServiceContextType>({ getService });

type ServiceProviderProps = {
  children: ReactNode;
};

/** Provides the services used throughout the app */
export function ServiceProvider({ children }: ServiceProviderProps) {
  return (
    <ServiceContext.Provider value={{ getService }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices(): GetServiceFunction {
  const services = useContext(ServiceContext);

  if (!services) {
    throw new Error('ServiceContext must be used within a ServiceProvider');
  }

  return services.getService;
}
