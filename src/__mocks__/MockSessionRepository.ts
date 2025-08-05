import { SessionRepository } from '../data/repositories/SessionRepository';
import { SessionDbo } from '../models/session';
import { MOCK_SESSIONS } from './sessionData';

export class MockSessionRepository implements SessionRepository {
  private sessions: SessionDbo[] = [...MOCK_SESSIONS];
  private lastId = 3;

  async list(limit?: number, page?: number): Promise<SessionDbo[]> {
    return this.sessions.slice(page - 1, limit);
  }

  async get(id: number): Promise<SessionDbo> {
    const session = this.sessions.find((s) => s.id === id);

    return session;
  }

  async getByVehicleId(vehicleId: number): Promise<SessionDbo[]> {
    return this.sessions.filter((s) => s.vehicle_id === vehicleId);
  }

  async add(session: SessionDbo): Promise<SessionDbo> {
    const newSession: SessionDbo = { ...session, id: ++this.lastId };

    this.sessions.push(newSession);

    return newSession;
  }

  async update(session: SessionDbo): Promise<number> {
    const existingIdx = this.sessions.findIndex((s) => s.id === session.id);

    if (existingIdx === -1) {
      return 0;
    }

    const existing = this.sessions[existingIdx];
    const udpated: SessionDbo = { ...existing, ...session };

    this.sessions[existingIdx] = udpated;

    return 1;
  }

  async remove(id: number): Promise<boolean> {
    this.sessions = this.sessions.filter((s) => s.id !== id);

    return true;
  }
}
