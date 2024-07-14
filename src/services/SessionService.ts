import { ExplicitAny } from 'evs-types';
import { Session } from '../models/session';

const MOCK_SESSIONS: Session[] = [
  {
    id: 1,
    kWhAdded: 43,
    date: '2024-05-22',
    rateTypeId: 1,
    vehicleId: 1
  },
  {
    id: 2,
    kWhAdded: 22,
    date: '2024-04-16',
    rateTypeId: 1,
    vehicleId: 1
  },
  {
    id: 3,
    kWhAdded: 12,
    date: '2024-04-08',
    rateTypeId: 3,
    vehicleId: 2
  }
];

export interface SessionService {
  list(limit?: number, page?: number): Promise<Session[]>;
  get(id: number): Promise<Session>;
  add(session: Session): Promise<Session>;
  update(session: Session): Promise<void>;
  remove(id: number): Promise<void>;
}

export class EvsSessionService implements SessionService {
  private sessions: Session[] = [...MOCK_SESSIONS];
  private lastId = 3;

  async list(limit = 20, page = 1): Promise<Session[]> {
    return this.sessions.slice(page - 1, limit);
  }

  async get(id: number): Promise<Session> {
    const session = this.sessions.find((s) => s.id === id);

    if (!session) {
      throw new Error('not found');
    }

    return session;
  }

  async add(session: Session): Promise<Session> {
    const newSession: Session = { ...session, id: ++this.lastId };

    this.sessions.push(newSession);

    return newSession;
  }

  async update(session: Session): Promise<void> {
    const existing = await this.get(session.id!);

    Object.keys(existing).forEach((key) => {
      (existing as ExplicitAny)[key] = (session as ExplicitAny)[key];
    });
  }

  async remove(id: number): Promise<void> {
    this.sessions = this.sessions.filter((s) => s.id !== id);
  }
}
