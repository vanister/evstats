import { VehicleStatsRepository } from '../data/repositories/VehicleStatsRepository';
import { VehicleRepository } from '../data/repositories/VehicleRepository';
import { VehicleStats } from '../models/vehicleStats';
import { BaseService } from './BaseService';

export interface VehicleStatsService {
  getStatsForVehicle(vehicleId: number): Promise<VehicleStats>;
  getStatsForAllVehicles(): Promise<VehicleStats[]>;
}

export class EvsVehicleStatsService extends BaseService implements VehicleStatsService {
  constructor(
    private vehicleStatsRepository: VehicleStatsRepository,
    private vehicleRepository: VehicleRepository
  ) {
    super();
  }

  async getStatsForVehicle(vehicleId: number): Promise<VehicleStats> {
    const stats = await this.vehicleStatsRepository.getVehicleStats(vehicleId);

    if (!stats) {
      return {
        vehicleId,
        totalSessions: 0,
        totalKwh: 0,
        lastChargeDate: undefined,
        totalCost: 0
      };
    }

    return stats;
  }

  async getStatsForAllVehicles(): Promise<VehicleStats[]> {
    const allVehicles = await this.vehicleRepository.list();
    const existingStats = await this.vehicleStatsRepository.getAllVehicleStats();

    // Create stats for all vehicles, using existing stats or default empty stats
    return allVehicles.map((vehicleDbo) => {
      const existingStat = existingStats.find((stat) => stat.vehicleId === vehicleDbo.id);
      return (
        existingStat || {
          vehicleId: vehicleDbo.id,
          totalSessions: 0,
          totalKwh: 0,
          lastChargeDate: undefined,
          totalCost: 0
        }
      );
    });
  }
}
