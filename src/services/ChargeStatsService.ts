import { ChargeStatsRepository } from '../data/repositories/ChargeStatsRepository';
import { RateRepository } from '../data/repositories/RateRepository';
import { VehicleRepository } from '../data/repositories/VehicleRepository';
import {
  ChargeStatData,
  ChargeStatDataset,
  ChargeAverage,
  ChargeStatsDbo,
  CostTotal
} from '../models/chargeStats';
import { RateTypeDbo } from '../models/rateType';
import { BaseService } from './BaseService';
import {
  parseLocalDate,
  getStartOfDay,
  getStartOfToday,
  getDaysDifference
} from '../utilities/dateUtility';

export interface ChargeStatsService {
  getLast31Days(vehicleId: number, fromDate?: Date): Promise<ChargeStatData>;
  getAllVehiclesLast31Days(fromDate?: Date): Promise<ChargeStatData>;
}

/** Charge stats chart data service. */
export class EvsChargeStatsService extends BaseService implements ChargeStatsService {
  constructor(
    private readonly chargeStatsRepository: ChargeStatsRepository,
    private readonly rateRepository: RateRepository,
    private readonly vehicleRepository: VehicleRepository
  ) {
    super();
  }

  async getLast31Days(vehicleId: number, fromDate?: Date): Promise<ChargeStatData> {
    const rateTypes = await this.rateRepository.list();
    const chargeStats = await this.chargeStatsRepository.getLast31Days(vehicleId);
    const datasets: ChargeStatDataset[] = this.createDataset(chargeStats, rateTypes, fromDate);
    const averages: ChargeAverage[] = this.getAverages(datasets, rateTypes);
    const costTotals: CostTotal[] = this.getCostTotals(chargeStats, rateTypes);
    const totalCost: number = this.getTotalCost(chargeStats);

    const data: ChargeStatData = {
      vehicleId,
      vehicleIds: [vehicleId], // Single vehicle array
      labels: Array.from({ length: 31 }, (_, i) => i), // 0, 1, 2, ..., 30
      datasets, // Data is already reversed in createDataset
      averages,
      costTotals,
      totalCost
    };

    return data;
  }

  async getAllVehiclesLast31Days(fromDate?: Date): Promise<ChargeStatData> {
    const rateTypes = await this.rateRepository.list();
    const chargeStats = await this.chargeStatsRepository.getLast31DaysAllVehicles();

    // Get unique vehicle IDs from the charge stats data
    const vehicleIds = Array.from(new Set(chargeStats.map((stat) => stat.vehicle_id)));

    const datasets: ChargeStatDataset[] = this.createDataset(chargeStats, rateTypes, fromDate);
    const averages: ChargeAverage[] = this.getAverages(datasets, rateTypes);
    const costTotals: CostTotal[] = this.getCostTotals(chargeStats, rateTypes);
    const totalCost: number = this.getTotalCost(chargeStats);

    const data: ChargeStatData = {
      vehicleId: 0, // Use 0 to indicate "all vehicles" for backward compatibility
      vehicleIds, // Array of all vehicle IDs included in this data
      labels: Array.from({ length: 31 }, (_, i) => i), // 0, 1, 2, ..., 30
      datasets, // Data is already reversed in createDataset
      averages,
      costTotals,
      totalCost
    };

    return data;
  }

  private getRateTypeColor(rateName: string, rateTypes: RateTypeDbo[]): string {
    const rateType = rateTypes.find((rt) => rt.name === rateName);

    if (rateType?.color) {
      return rateType.color;
    }

    return '#929292';
  }

  private createDataset(
    chargeStats: ChargeStatsDbo[],
    rateTypes: RateTypeDbo[],
    fromDate?: Date
  ): ChargeStatDataset[] {
    const rateTypeNames = rateTypes.map((rt) => rt.name);

    const kwhByRateType: Record<string, (number | null)[]> = rateTypes.reduce(
      (acc, { name }) => ({
        ...acc,
        [name]: new Array(31).fill(null)
      }),
      {}
    );

    const today = fromDate ? getStartOfDay(fromDate) : getStartOfToday();

    chargeStats.forEach(({ date, kwh, rate_name: rateName }) => {
      // Use parseLocalDate to safely parse the database date string
      const sessionDate = parseLocalDate(date);

      const daysDiff = getDaysDifference(today, sessionDate);

      if (daysDiff >= 0 && daysDiff < 31) {
        // Sum the kWh values, initializing to 0 if null
        const currentValue = kwhByRateType[rateName][daysDiff] || 0;
        kwhByRateType[rateName][daysDiff] = currentValue + kwh;
      }
    });

    const datasets = rateTypeNames
      .filter((rateName) => {
        // Only include rate types that have at least one non-null value
        return kwhByRateType[rateName].some(value => value !== null && value > 0);
      })
      .map<ChargeStatDataset>((rateName) => ({
        label: rateName,
        data: kwhByRateType[rateName].slice().reverse(),
        backgroundColor: this.getRateTypeColor(rateName, rateTypes)
      }));

    return datasets;
  }

  private getAverages(datasets: ChargeStatDataset[], rateTypes: RateTypeDbo[]): ChargeAverage[] {
    const sum = (prev: number, curr: number) => prev + curr;

    // Create averages for all rate types, not just ones with data
    const averages = rateTypes.map<ChargeAverage>((rateType) => {
      const dataset = datasets.find(ds => ds.label === rateType.name);
      const kWh = dataset ? dataset.data.reduce(sum, 0) : 0;

      return {
        name: rateType.name,
        kWh: kWh, // Keep precise values, round only in display
        color: this.getRateTypeColor(rateType.name, rateTypes)
      };
    });

    return averages;
  }

  private getCostTotals(chargeStats: ChargeStatsDbo[], rateTypes: RateTypeDbo[]): CostTotal[] {
    const costByRateType: Record<string, number> = {};

    chargeStats.forEach(({ kwh, rate, rate_override, rate_name: rateName }) => {
      const effectiveRate = rate_override || rate;
      const cost = kwh * effectiveRate;

      if (!costByRateType[rateName]) {
        costByRateType[rateName] = 0;
      }
      costByRateType[rateName] += cost;
    });

    const rateTypeNames = rateTypes.map((rt) => rt.name);
    const costTotals = rateTypeNames.map<CostTotal>((rateName) => ({
      name: rateName,
      cost: Math.round((costByRateType[rateName] || 0) * 100) / 100,
      color: this.getRateTypeColor(rateName, rateTypes)
    }));

    return costTotals;
  }

  private getTotalCost(chargeStats: ChargeStatsDbo[]): number {
    const totalCost = chargeStats.reduce((total, { kwh, rate, rate_override }) => {
      const effectiveRate = rate_override || rate;
      return total + kwh * effectiveRate;
    }, 0);

    return Math.round(totalCost * 100) / 100;
  }
}
