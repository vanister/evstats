import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SessionDbo } from '../../models/session';
import { BaseRepository } from './BaseRepository';
import { SessionSql } from '../sql/SessionSql';

export interface SessionRepository {
  list(limit?: number, page?: number): Promise<SessionDbo[]>;
  get(id: number): Promise<SessionDbo>;
  add(session: SessionDbo): Promise<SessionDbo>;
  update(session: SessionDbo): Promise<number>;
  remove(id: number): Promise<boolean>;
}

export class EvsSessionRepository extends BaseRepository<SessionDbo> implements SessionRepository {
  constructor(context: SQLiteDBConnection) {
    super(context);
  }

  async list(limit = 50, page = 1): Promise<SessionDbo[]> {
    // page is 1-based but offset starts at 0
    const offsetPage = (page - 1) * limit;
    const params = [limit, offsetPage];
    const { values } = await this.context.query(SessionSql.List, params);

    return (values as SessionDbo[]) ?? [];
  }

  async get(id: number): Promise<SessionDbo> {
    const { values } = await this.context.query(SessionSql.Get, [id]);
    const session = values?.[0] as SessionDbo;

    return session;
  }

  async add(session: SessionDbo): Promise<SessionDbo> {
    const params = this.getValues(session, ['id']);
    const { changes } = await this.context.run(SessionSql.Add, params);
    const newSession = { ...session, id: changes.lastId };

    return newSession;
  }

  async update(session: SessionDbo): Promise<number> {
    const params = this.getValues(session, ['id']);
    const { changes } = await this.context.run(SessionSql.Update, [...params, session.id]);

    return changes.changes;
  }

  async remove(id: number): Promise<boolean> {
    const { changes } = await this.context.run(SessionSql.Delete, [id]);

    return changes.changes > 0;
  }
}
