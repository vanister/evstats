import { SessionDbo } from '../../models/session';
import { BaseRepository } from './BaseRepository';

export interface SessionRepository {
  list(limit?: number, page?: number): Promise<SessionDbo[]>;
  get(id: number): Promise<SessionDbo>;
  add(session: SessionDbo): Promise<SessionDbo>;
  update(session: SessionDbo): Promise<void>;
  remove(id: number): Promise<void>;
}

export class EvsSessionRepository extends BaseRepository<SessionDbo> implements SessionRepository {
  async list(_limit?: number, _page?: number): Promise<SessionDbo[]> {
    throw new Error('not implemented');
  }

  async get(_id: number): Promise<SessionDbo> {
    throw new Error('not implemented');
  }

  async add(_session: SessionDbo): Promise<SessionDbo> {
    throw new Error('not implemented');
  }

  async update(_session: SessionDbo): Promise<void> {
    throw new Error('not implemented');
  }

  async remove(_id: number): Promise<void> {
    throw new Error('not implemented');
  }
}
