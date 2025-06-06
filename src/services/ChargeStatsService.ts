import { ChargeColors } from '../constants';
import { ChargeStatsRepository } from '../data/repositories/ChargeStatsRepository';
import { RateRepository } from '../data/repositories/RateRepository';
import {
  ChargeStatData,
  ChargeStatDataset,
  ChargeAverage,
  ChargeStatsDbo
} from '../models/chargeStats';
import { RateTypeDbo } from '../models/rateType';
import { BaseService } from './BaseService';

export interface ChargeStatsService {
  getLast31Days(vehicleId: number): Promise<ChargeStatData>;
}

/** Charge stats chart data service. */
export class EvsChargeStatsService extends BaseService implements ChargeStatsService {
  constructor(
    private readonly chargeStatsRepository: ChargeStatsRepository,
    private readonly rateRepository: RateRepository
  ) {
    super();
  } 

  // todo - take in a 'from' arg to allow testing
  async getLast31Days(vehicleId: number): Promise<ChargeStatData> {
    const rateTypes = await this.rateRepository.list();
    const chargeStats = await this.chargeStatsRepository.getLast31Days(vehicleId);
    const datasets: ChargeStatDataset[] = this.createDataset(chargeStats, rateTypes);
    const averages: ChargeAverage[] = this.getAverages(datasets);

    const data: ChargeStatData = {
      vehicleId,
      labels: Array.from({ length: 31 }, (_, i) => i),
      datasets,
      averages
    };

    return data;
  }

  // todo - clean up
  private createDataset(
    chargeStats: ChargeStatsDbo[],
    rateTypes: RateTypeDbo[]
  ): ChargeStatDataset[] {
    const kwhByRateType: Record<string, number[]> = rateTypes.reduce(
      (acc, { name }) => ({
        ...acc,
        [name]: new Array(31).fill(0)
      }),
      {}
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    chargeStats.forEach(({ date, kwh, rate_name: rateName }) => {
      // Parse date parts explicitly to ensure exact date representation
      const [year, month, day] = date.split('-').map(Number);
      const sessionDate = new Date(year, month - 1, day); // month is 0-based in Date constructor
      
      const daysDiff = Math.floor(
        (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff >= 0 && daysDiff < 31) {
        kwhByRateType[rateName][daysDiff] = kwh;
      }
    });

    const datasets = Object.entries(kwhByRateType).map<ChargeStatDataset>(([rateName, kwh]) => ({
      label: rateName,
      data: kwh,
      backgroundColor: this.getColor(rateName)
    }));

    return datasets;
  }

  private getAverages(datasets: ChargeStatDataset[]): ChargeAverage[] {
    const sum = (prev: number, curr: number) => prev + curr;
    const total = datasets.flatMap((ds) => ds.data).reduce(sum, 0);

    const averages = datasets.map<ChargeAverage>(({ data, label }) => {
      const percent = (data.reduce(sum, 0) / (total || 1)) * 100;

      return {
        name: label,
        percent: Math.round(percent),
        color: this.getColor(label)
      };
    });

    return averages;
  }
  
  // todo - move to component/ui layer
  private getColor(name: string): string {
    switch (name) {
      case 'Work':
        return ChargeColors.Work;
      case 'Other':
        return ChargeColors.Other;
      case 'DC':
        return ChargeColors.DC;
      case 'Home':
      default:
        return ChargeColors.Home;
    }
  }
}
