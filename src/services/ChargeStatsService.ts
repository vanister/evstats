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

  async getLast31Days(vehicleId: number): Promise<ChargeStatData> {
    const rateTypes = await this.rateRepository.list();
    const chargeStats = await this.chargeStatsRepository.getLast31Days(vehicleId);
    const datasets: ChargeStatDataset[] = this.createDataset(chargeStats, rateTypes);
    const averages: ChargeAverage[] = this.getAverages(datasets);

    const data: ChargeStatData = {
      vehicleId,
      labels: Array.from({ length: 31 }, (_, i) => i).reverse(),
      datasets,
      averages
    };

    return data;
  }

  private createDataset(
    chargeStats: ChargeStatsDbo[],
    rateTypes: RateTypeDbo[]
  ): ChargeStatDataset[] {
    // create a map of rate types to empty placeholders
    const defaultRateTypes = rateTypes
      .map((r) => r.name)
      .reduce((prev, curr) => ({ ...prev, [curr]: [] }), {});

    // group all kwh entries by rate name
    const kwhByRateType = chargeStats.reduce<{ [name: string]: number[] }>(
      (runningSum, { rate_name: rateName, kwh }) => {
        if (!runningSum[rateName]) {
          runningSum[rateName] = [];
        }

        runningSum[rateName].push(kwh);

        return runningSum;
      },
      defaultRateTypes
    );

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
