import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { InitTableSql } from '../data/sql/InitTableSql';
import { SeedSql } from '../data/sql/SeedSql';

export interface DatabaseContextType {
  db?: SQLiteDBConnection;
  ready: boolean;
}

export interface DatabaseProviderProps {
  children: ReactNode;
  name: string;
}

export const DatabaseContext = createContext<DatabaseContextType>({ ready: false });

export function DatabaseProvider({ children, name }: DatabaseProviderProps) {
  const [dbReady, setDbReady] = useState(false);
  const dbConnectionRef = useRef<SQLiteDBConnection>();

  useEffect(() => {
    const createConnection = async () => {
      setDbReady(false);

      try {
        const connection = new SQLiteConnection(CapacitorSQLite);
        const dbExists = await connection.isDatabase(name);
        const connExists = await connection.isConnection(name, false);

        if (dbExists.result && connExists.result) {
          // get the connection
          dbConnectionRef.current = await connection.retrieveConnection(name, false);
        } else {
          // open a new connection
          dbConnectionRef.current = await connection.createConnection(
            name,
            false,
            'no-encryption',
            1,
            false
          );

          await dbConnectionRef.current.open();
        }

        setDbReady(true);
      } catch (error) {
        alert(`Error opening the database: ${error}`);
      }
    };

    createConnection();

    return () => {
      dbConnectionRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!dbReady) {
      return;
    }

    const setupDatabase = async () => {
      try {
        const createTablesBatach = getTableInitBatchStatements();
        const seedTablesBatch = getTableSeedBatchStatements();

        await dbConnectionRef.current?.executeSet(createTablesBatach);
        await dbConnectionRef.current?.executeSet(seedTablesBatch);
      } catch (error) {
        console.error(error);
        alert(`Error creating and seeding tables: ${error}`);
      }
    };

    setupDatabase();
  }, [dbReady]);

  return (
    <DatabaseContext.Provider value={{ db: dbConnectionRef.current, ready: dbReady }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabaseContext() {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error('DatabaseContext must be used within a DatabaseProvider');
  }

  return context;
}

function getTableInitBatchStatements() {
  return [
    { statement: InitTableSql.CREATE_VEHICLES_TABLE, values: [] },
    { statement: InitTableSql.CREATE_RATE_TYPE_TABLE, values: [] },
    { statement: InitTableSql.CREATE_SESSIONS_TABLE, values: [] }
  ];
}

function getTableSeedBatchStatements() {
  return [{ statement: SeedSql.SEED_RATE_TYPES, values: [] }];
}
