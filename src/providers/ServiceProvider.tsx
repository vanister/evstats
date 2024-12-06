import { createContext, ReactNode, useContext, useEffect } from 'react';
import { buildServiceContainer, getService, ServiceContainer } from '../services/ServiceInjector';
import { useDatabaseManager } from './DatabaseManagerProvider';
import { logToConsole } from '../logger';

type GetServiceFunction = typeof getService;

const ServiceContext = createContext<GetServiceFunction>(null);

type ServiceProviderProps = {
  children: ReactNode;
};

/** Provides the services used throughout the app */
export function ServiceProvider({ children }: ServiceProviderProps) {
  const databaseManager = useDatabaseManager();

  useEffect(() => {
    logToConsole('building the service container');
    buildServiceContainer({ databaseManager });
  }, []);

  return <ServiceContext.Provider value={getService}>{children}</ServiceContext.Provider>;
}

export function useServices<Service extends keyof ServiceContainer>(name: Service) {
  const serviceLocator = useContext(ServiceContext);

  if (!serviceLocator) {
    throw new Error('ServiceContext must be used within a ServiceProvider');
  }

  return serviceLocator(name);
}
