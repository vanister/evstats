import { SessionRepository } from '../data/repositories/SessionRepository';
import { SessionDbo } from '../models/session';
import { VehicleStats } from '../models/vehicleStats';
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

  async getVehicleStats(vehicleId: number): Promise<VehicleStats | null> {
    const vehicleSessions = this.sessions.filter(s => s.vehicle_id === vehicleId);
    
    if (vehicleSessions.length === 0) {
      return null;
    }

    const totalKwh = vehicleSessions.reduce((sum, session) => sum + session.kwh, 0);
    const sortedByDate = vehicleSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastChargeDate = sortedByDate[0]?.date;
    // Mock total cost calculation using a default rate of $0.12 per kWh
    const totalCost = totalKwh * 0.12;

    return {
      vehicleId,
      totalSessions: vehicleSessions.length,
      totalKwh: Math.round(totalKwh * 100) / 100,
      lastChargeDate,
      totalCost: Math.round(totalCost * 100) / 100
    };
  }

  async getAllVehicleStats(): Promise<VehicleStats[]> {
    const vehicleIds = [...new Set(this.sessions.map(session => session.vehicle_id))];
    const stats = await Promise.all(
      vehicleIds.map(vehicleId => this.getVehicleStats(vehicleId))
    );
    
    return stats.filter(stat => stat !== null) as VehicleStats[];
  }
}
