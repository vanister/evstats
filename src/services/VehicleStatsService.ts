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
    const stats = await this.sessionRepository.getVehicleStats(vehicleId);
    
    if (!stats) {
      return {
        vehicleId,
        totalSessions: 0,
        totalKwh: 0,
        lastChargeDate: undefined,
        averageKwhPerSession: 0
      };
    }

    return stats;
  }

  async getStatsForAllVehicles(): Promise<VehicleStats[]> {
    return await this.sessionRepository.getAllVehicleStats();
  }
}