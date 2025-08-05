import { SessionRepository } from '../data/repositories/SessionRepository';
import { VehicleStats } from '../models/vehicleStats';
import { BaseService } from './BaseService';

export interface VehicleStatsService {
  getStatsForVehicle(vehicleId: number): Promise<VehicleStats>;
  getStatsForAllVehicles(): Promise<VehicleStats[]>;
}

export class EvsVehicleStatsService extends BaseService implements VehicleStatsService {
  constructor(private sessionRepository: SessionRepository) {
    super();
  }

  async getStatsForVehicle(vehicleId: number): Promise<VehicleStats> {
    const sessions = await this.sessionRepository.getByVehicleId(vehicleId);
    
    if (sessions.length === 0) {
      return {
        vehicleId,
        totalSessions: 0,
        totalKwh: 0,
        lastChargeDate: undefined,
        averageKwhPerSession: 0
      };
    }

    const totalKwh = sessions.reduce((sum, session) => sum + session.kwh, 0);
    const sortedByDate = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastChargeDate = sortedByDate[0]?.date;
    const averageKwhPerSession = totalKwh / sessions.length;

    return {
      vehicleId,
      totalSessions: sessions.length,
      totalKwh: Math.round(totalKwh * 100) / 100, // Round to 2 decimal places
      lastChargeDate,
      averageKwhPerSession: Math.round(averageKwhPerSession * 100) / 100
    };
  }

  async getStatsForAllVehicles(): Promise<VehicleStats[]> {
    const allSessions = await this.sessionRepository.list(1000, 1); // Get a large number of sessions
    const vehicleIds = [...new Set(allSessions.map(session => session.vehicle_id))];
    
    const stats = await Promise.all(
      vehicleIds.map(vehicleId => this.getStatsForVehicle(vehicleId))
    );
    
    return stats;
  }
}