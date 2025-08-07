import { ChargeStatsDbo } from '../../models/chargeStats';
import { DbContext } from '../DbContext';
import { ChargeStatSql } from '../sql/ChargeStatSql';
import { BaseRepository } from './BaseRepository';

export interface ChargeStatsRepository {
  getLast31Days(vehicleId: number): Promise<ChargeStatsDbo[]>;
  getLast31DaysAllVehicles(): Promise<ChargeStatsDbo[]>;
}

export class EvsChargeStatsRepository
  extends BaseRepository<ChargeStatsDbo>
  implements ChargeStatsRepository
{
  constructor(context: DbContext) {
    super(context);
  }

  async getLast31Days(vehicleId: number): Promise<ChargeStatsDbo[]> {
    const results = await this.context.query<ChargeStatsDbo>(ChargeStatSql.Last31DaysByVehicle, [
      vehicleId
    ]);

    return results;
  }

  async getLast31DaysAllVehicles(): Promise<ChargeStatsDbo[]> {
    const results = await this.context.query<ChargeStatsDbo>(ChargeStatSql.Last31DaysAllVehicles);

    return results;
  }
}
