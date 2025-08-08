import { VehicleStats, VehicleStatsDbo } from '../../models/vehicleStats';
import { BaseRepository } from './BaseRepository';
import { VehicleStatsSql } from '../sql/VehicleStatsSql';
import { DbContext } from '../DbContext';

export interface VehicleStatsRepository {
  getVehicleStats(vehicleId: number): Promise<VehicleStats | null>;
  getAllVehicleStats(): Promise<VehicleStats[]>;
}

export class EvsVehicleStatsRepository
  extends BaseRepository<VehicleStatsDbo>
  implements VehicleStatsRepository
{
  constructor(context: DbContext) {
    super(context);
  }

  async getVehicleStats(vehicleId: number): Promise<VehicleStats | null> {
    const values = await this.context.query<VehicleStatsDbo>(VehicleStatsSql.GetVehicleStats, [
      vehicleId
    ]);
    const result = values?.[0];

    if (!result) {
      return null;
    }

    return {
      vehicleId: result.vehicle_id,
      totalSessions: result.totalSessions,
      totalKwh: result.totalKwh,
      lastChargeDate: result.lastChargeDate,
      totalCost: result.totalCost
    };
  }

  async getAllVehicleStats(): Promise<VehicleStats[]> {
    const values = await this.context.query<VehicleStatsDbo>(
      VehicleStatsSql.GetAllVehicleStats,
      []
    );

    return (
      values?.map((result: VehicleStatsDbo) => ({
        vehicleId: result.vehicle_id,
        totalSessions: result.totalSessions,
        totalKwh: result.totalKwh,
        lastChargeDate: result.lastChargeDate,
        totalCost: result.totalCost
      })) ?? []
    );
  }
}
