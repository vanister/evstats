import { ChargeStatsDbo } from '../../models/chargeStats';
import { DbContext } from '../DbContext';
import { ChargeStatSql } from '../sql/ChargeStatSql';
import { BaseRepository } from './BaseRepository';

export interface ChargeStatsRepository {
  getLast31Days(vehicleId: number): Promise<ChargeStatsDbo[]>;
  getLast31DaysAllVehicles(): Promise<ChargeStatsDbo[]>;
  getMonth(vehicleId: number, yearMonth: string): Promise<ChargeStatsDbo[]>;
  getMonthAllVehicles(yearMonth: string): Promise<ChargeStatsDbo[]>;
  getYear(vehicleId: number, year: string): Promise<ChargeStatsDbo[]>;
  getYearAllVehicles(year: string): Promise<ChargeStatsDbo[]>;
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

  async getMonth(vehicleId: number, yearMonth: string): Promise<ChargeStatsDbo[]> {
    const results = await this.context.query<ChargeStatsDbo>(ChargeStatSql.MonthByVehicle, [
      yearMonth,
      vehicleId
    ]);

    return results;
  }

  async getMonthAllVehicles(yearMonth: string): Promise<ChargeStatsDbo[]> {
    const results = await this.context.query<ChargeStatsDbo>(ChargeStatSql.MonthAllVehicles, [
      yearMonth
    ]);

    return results;
  }

  async getYear(vehicleId: number, year: string): Promise<ChargeStatsDbo[]> {
    const results = await this.context.query<ChargeStatsDbo>(ChargeStatSql.YearByVehicle, [
      year,
      vehicleId
    ]);

    return results;
  }

  async getYearAllVehicles(year: string): Promise<ChargeStatsDbo[]> {
    const results = await this.context.query<ChargeStatsDbo>(ChargeStatSql.YearAllVehicles, [
      year
    ]);

    return results;
  }
}
