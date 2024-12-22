import { NotFoundError } from '../errors/NotFoundError';
import { Session } from '../models/session';
import { SessionRepository } from '../repositories/SessionRepository';
import { BaseService } from './BaseService';

export interface SessionService {
  list(limit?: number, page?: number): Promise<Session[]>;
  get(id: number): Promise<Session>;
  add(session: Session): Promise<Session>;
  update(session: Session): Promise<void>;
  remove(id: number): Promise<void>;
}

export class EvsSessionService extends BaseService implements SessionService {
  constructor(private sessionRepository: SessionRepository) {
    super();
  }

  async list(limit = 20, page = 1): Promise<Session[]> {
    const sessions = await this.sessionRepository.list(limit, page);

    return sessions;
  }

  async get(id: number): Promise<Session> {
    const session = await this.sessionRepository.get(id);

    if (!session) {
      throw new NotFoundError();
    }

    return session;
  }

  async add(session: Session): Promise<Session> {
    const newSession = await this.sessionRepository.add(session);

    return newSession;
  }

  async update(session: Session): Promise<void> {
    await this.sessionRepository.update(session);
  }

  async remove(id: number): Promise<void> {
    await this.sessionRepository.remove(id);
  }
}
