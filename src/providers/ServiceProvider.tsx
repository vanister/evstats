import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import {
  ServiceContainerIntializer,
  ServiceLocator,
  ServiceContainer
} from '../services/ServiceContainer';
import { useDatabaseManager } from './DatabaseManagerProvider';
import { logToConsole } from '../logger';

const ServiceContext = createContext<ServiceLocator>(null);

type ServiceProviderProps = PropsWithChildren<{
  serviceLocator: ServiceLocator;
  containerInitializer: ServiceContainerIntializer;
}>;

/** Provides the services used throughout the app */
export function ServiceProvider({
  children,
  containerInitializer,
  serviceLocator
}: ServiceProviderProps) {
  const [loading, setLoading] = useState(true);
  const databaseManager = useDatabaseManager();

  useEffect(() => {
    logToConsole('building the service container');
    containerInitializer({ databaseManager });
    setLoading(false);
  }, []);

  return (
    <ServiceContext.Provider value={serviceLocator}>{!loading && children}</ServiceContext.Provider>
  );
}

export function useServices<Service extends keyof ServiceContainer>(name: Service) {
  const serviceLocator = useContext(ServiceContext);

  if (!serviceLocator) {
    throw new Error('ServiceContext must be used within a ServiceProvider');
  }

  return serviceLocator(name);
}
