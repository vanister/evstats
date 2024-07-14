import React, { createContext, useContext, useEffect, useState } from 'react';
import { Connection } from '../data/Connection';
import { BatchStatement, DbContext, SqliteDbContext } from '../data/DbContext';
import { InitTableSql } from '../data/sql/InitTableSql';
import { SeedSql } from '../data/sql/SeedSql';

export interface DatabaseContextProviderProps {
  connection: Connection;
  children: React.ReactNode;
}

const DatabaseContext = createContext<DbContext | undefined>(undefined);

export function DatabaseContextProvider({ connection, children }: DatabaseContextProviderProps) {
  const [dbContext, setDbContext] = useState<DbContext>();

  useEffect(() => {
    const createDbContext = async () => {
      const context = new SqliteDbContext(connection);
      const tableCreatBatch = getTableInitBatchStatements();
      const seedBatch = getTableSeedBatchStatements();

      console.log('create db context');

      // open the connection to the database
      await context.init(tableCreatBatch, seedBatch);

      console.log('created db context');

      // create the tables if they're not there
      setDbContext(context);
    };

    console.log('DatabaseContextProvider useEffect running');

    createDbContext();

    // make sure to close the database when the app is terminated
    return () => {
      console.log('DatabaseContextProvider useEffect cleanup');

      connection.closeDatabase();
    };
  }, []);

  return <DatabaseContext.Provider value={dbContext}>{children}</DatabaseContext.Provider>;
}

export function useDatabaseContext() {
  console.log('useDatabaseContext');

  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error('DatabaseContext must be used within a DatabaseContextProvider');
  }

  return context;
}

function getTableInitBatchStatements(): BatchStatement[] {
  return [
    { statement: InitTableSql.CREATE_VEHICLES_TABLE },
    { statement: InitTableSql.CREATE_RATE_TYPE_TABLE },
    { statement: InitTableSql.CREATE_SESSIONS_TABLE }
  ];
}

function getTableSeedBatchStatements(): BatchStatement[] {
  return [{ statement: SeedSql.SEED_RATE_TYPES }];
}
