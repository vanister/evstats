import { ExplicitAny } from '@evs-core';
import { Changes, StatementSet } from './repositories/repositories-types';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

export interface DbContext {
  execute(statement: string, transaction?: boolean): Promise<Changes>;
  executeSet(statements: StatementSet[], transaction?: boolean): Promise<Changes>;
  query<T>(statement: string, values?: ExplicitAny[]): Promise<T[]>;
  run(statement: string, values?: ExplicitAny[]): Promise<Changes>;
}

export function createDbContextInstance(connection: SQLiteDBConnection): DbContext {
  return new SqlDbContext(connection);
}

class SqlDbContext implements DbContext {
  constructor(private readonly connection: SQLiteDBConnection) {}

  async execute(statement: string, transaction?: boolean): Promise<Changes> {
    const { changes } = await this.connection.execute(statement, transaction);

    return changes;
  }

  async executeSet(statements: StatementSet[], transaction?: boolean): Promise<Changes> {
    // ensure that values are undefined
    const statementWithValues = statements.map((s) => ({ values: [], ...s }));
    const { changes } = await this.connection.executeSet(statementWithValues, transaction);

    return changes;
  }

  async query<T>(statement: string, values?: ExplicitAny[]): Promise<T[]> {
    const result = await this.connection.query(statement, values);

    return result.values as T[];
  }

  async run(statement: string, values?: ExplicitAny[]): Promise<Changes> {
    const { changes } = await this.connection.run(statement, values);

    return changes;
  }
}
