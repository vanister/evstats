import { SessionRepository } from '../data/repositories/SessionRepository';
import { BaseService } from './BaseService';

export type ChargeAverage = {
  name: string;
  percent: number;
  color: string;
};

export type ChargeStatDataset = {
  label: string;
  data: number[];
  backgroundColor: string;
};

export type ChargeStatData = {
  vehicleId: number;
  labels: (string | number)[];
  datasets: ChargeStatDataset[];
  averages: ChargeAverage[];
};

export interface ChargeStatsService {
  getLast31Days(vehicleId: number): Promise<ChargeStatData>;
}

const ChargeColors = {
  Home: '#004D80',
  Work: '#F27200',
  Other: '#929292',
  DC: '#B51700'
};

/** Charge stats chart data service. */
export class EvsChargeStatsService extends BaseService implements ChargeStatsService {
  constructor(private readonly sessionRepository: SessionRepository) {
    super();
  }

  async getLast31Days(vehicleId: number): Promise<ChargeStatData> {
    const randomKwh = (seed = 51) => Math.floor(Math.random() * seed);
    const randomDataset = () => Array.from({ length: 31 }, () => randomKwh()).reverse();

    const datasets: ChargeStatDataset[] = [
      {
        label: 'Home',
        // must match the labels length
        data: randomDataset(),
        backgroundColor: this.getColor('Home')
      },
      {
        label: 'Work',
        data: randomDataset(),
        backgroundColor: this.getColor('Work')
      },
      {
        label: 'Other',
        data: randomDataset(),
        backgroundColor: this.getColor('Other')
      },
      {
        label: 'DC',
        data: randomDataset(),
        backgroundColor: this.getColor('DC')
      }
    ];

    const averages: ChargeAverage[] = this.getAverages(datasets);

    const data: ChargeStatData = {
      vehicleId,
      labels: Array.from({ length: 31 }, (_, i) => i).reverse(),
      datasets,
      averages
    };

    // todo - remove
    const promise = new Promise<ChargeStatData>((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 500);
    });

    return promise;
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
