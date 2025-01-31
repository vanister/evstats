import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import {
  ServiceContainerIntializer,
  ServiceLocator,
  ServiceContainer
} from '../services/ServiceContainer';
import { useDatabaseManager } from './DatabaseManagerProvider';
import { logToDevServer } from '../logger';

type ServiceContextType = {
  serviceLocator: ServiceLocator;
  ready: boolean;
};

type ServiceProviderProps = PropsWithChildren<{
  serviceLocator: ServiceLocator;
  containerInitializer: ServiceContainerIntializer;
}>;

const ServiceContext = createContext<ServiceContextType>({ serviceLocator: null, ready: false });

/** Provides the services used throughout the app */
export function ServiceProvider({
  children,
  containerInitializer,
  serviceLocator
}: ServiceProviderProps) {
  const [ready, setReady] = useState(false);
  const databaseManager = useDatabaseManager();

  useEffect(() => {
    logToDevServer('building the service container');
    containerInitializer({ databaseManager });
    setReady(true);
  }, []);

  return (
    <ServiceContext.Provider value={{ serviceLocator, ready }}>{children}</ServiceContext.Provider>
  );
}

export function useServiceState() {
  const context = useContext(ServiceContext);
  const { ready } = context;

  if (!context) {
    throw new Error('ServiceContext must be used within a ServiceProvider');
  }

  return ready;
}

export function useServices<Service extends keyof ServiceContainer>(name: Service) {
  const context = useContext(ServiceContext);
  const { serviceLocator } = context;

  if (!context) {
    throw new Error('ServiceContext must be used within a ServiceProvider');
  }

  return serviceLocator(name);
}
