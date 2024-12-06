import { createContext, PropsWithChildren, useContext } from 'react';
import { DatabaseManager } from '../data/DatabaseManager';

type DatabaseManagerProviderProps = PropsWithChildren<{
  manager: DatabaseManager;
}>;

const DatabaseManagerContext = createContext<DatabaseManager>(null);

export default function DatabaseManagerProvider({
  children,
  manager
}: DatabaseManagerProviderProps) {
  return (
    <DatabaseManagerContext.Provider value={manager}>{children}</DatabaseManagerContext.Provider>
  );
}

export function useDatabaseManager() {
  const manager = useContext(DatabaseManagerContext);

  if (!manager) {
    throw new Error('DatabaseContext can only be used within a DatabaseProvider');
  }

  return manager;
}
