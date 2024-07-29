export type ChargeStatDataset = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderRadius?: number;
};

export type ChargeStatData = {
  vehicleId: number;
  labels: (string | number)[];
  datasets: ChargeStatDataset[];
};

export interface ChargeStatsService {
  getLast31Days(vehicleId: number): Promise<ChargeStatData>;
}

/** Chart stats chart data service. */
export class EvsChargeStatsService implements ChargeStatsService {
  async getLast31Days(vehicleId: number): Promise<ChargeStatData> {
    const randomKwh = (seed = 51) => Math.floor(Math.random() * seed);
    const randomDataset = () => Array.from({ length: 31 }, () => randomKwh()).reverse();

    const data: ChargeStatData = {
      vehicleId,
      labels: Array.from({ length: 31 }, (_, i) => i).reverse(),
      datasets: [
        {
          label: 'Home',
          // must match the labels length?
          data: randomDataset(),
          backgroundColor: '#004D80'
        },
        {
          label: 'Work',
          data: randomDataset(),
          backgroundColor: '#F27200'
        },
        {
          label: 'Other',
          data: randomDataset(),
          backgroundColor: '#929292'
        },
        {
          label: 'DC',
          data: randomDataset(),
          backgroundColor: '#B51700'
        }
      ]
    };

    const promise = new Promise<ChargeStatData>((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 500);
    });

    return promise;
  }
}
