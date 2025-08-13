import { SessionDbo } from '../../models/session';
import { BaseRepository } from './BaseRepository';
import { SessionSql } from '../sql/SessionSql';
import { DbContext } from '../DbContext';

export interface SessionRepository {
  list(limit?: number, page?: number): Promise<SessionDbo[]>;
  get(id: number): Promise<SessionDbo>;
  getByVehicleId(vehicleId: number): Promise<SessionDbo[]>;
  add(session: SessionDbo): Promise<SessionDbo>;
  update(session: SessionDbo): Promise<number>;
  remove(id: number): Promise<boolean>;
  removeByVehicleId(vehicleId: number): Promise<number>;
}

export class EvsSessionRepository extends BaseRepository<SessionDbo> implements SessionRepository {
  constructor(context: DbContext) {
    super(context);
  }

  async list(limit = 50, page = 1): Promise<SessionDbo[]> {
    // page is 1-based but offset starts at 0
    const offsetPage = (page - 1) * limit;
    const params = [limit, offsetPage];
    const values = await this.context.query<SessionDbo>(SessionSql.List, params);

    return values ?? [];
  }

  async get(id: number): Promise<SessionDbo> {
    const values = await this.context.query<SessionDbo>(SessionSql.Get, [id]);
    const session = values?.[0];

    return session;
  }

  async getByVehicleId(vehicleId: number): Promise<SessionDbo[]> {
    const values = await this.context.query<SessionDbo>(SessionSql.GetByVehicleId, [vehicleId]);

    return values ?? [];
  }

  async add(session: SessionDbo): Promise<SessionDbo> {
    const params = this.getValues(session, ['id']);
    const { lastId } = await this.context.run(SessionSql.Add, params);
    const newSession = { ...session, id: lastId };

    return newSession;
  }

  async update(session: SessionDbo): Promise<number> {
    const params = this.getValues(session, ['id']);
    const { changes } = await this.context.run(SessionSql.Update, [...params, session.id]);

    return changes;
  }

  async remove(id: number): Promise<boolean> {
    const { changes } = await this.context.run(SessionSql.Delete, [id]);

    return changes > 0;
  }

  async removeByVehicleId(vehicleId: number): Promise<number> {
    const { changes } = await this.context.run(SessionSql.DeleteByVehicleId, [vehicleId]);

    return changes;
  }

}
