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
import { getColor } from '../screens/ChargeStatsScreen/helpers';

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
    const averages: ChargeAverage[] = this.getAverages(datasets);
    const costTotals: CostTotal[] = this.getCostTotals(chargeStats);
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
    const vehicleIds = Array.from(new Set(chargeStats.map(stat => stat.vehicle_id)));
    
    const datasets: ChargeStatDataset[] = this.createDataset(chargeStats, rateTypes, fromDate);
    const averages: ChargeAverage[] = this.getAverages(datasets);
    const costTotals: CostTotal[] = this.getCostTotals(chargeStats);
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

  private createDataset(
    chargeStats: ChargeStatsDbo[],
    rateTypes: RateTypeDbo[],
    fromDate?: Date
  ): ChargeStatDataset[] {
    // Define consistent ordering for rate types
    const orderedRateTypes = ['Home', 'DC', 'Other', 'Work'];
    
    const kwhByRateType: Record<string, number[]> = rateTypes.reduce(
      (acc, { name }) => ({
        ...acc,
        [name]: new Array(31).fill(0)
      }),
      {}
    );

    const today = fromDate ? new Date(fromDate) : new Date();
    today.setHours(0, 0, 0, 0);

    chargeStats.forEach(({ date, kwh, rate_name: rateName }) => {
      // Parse date parts explicitly to ensure exact date representation
      const [year, month, day] = date.split('-').map(Number);
      const sessionDate = new Date(year, month - 1, day); // month is 0-based in Date constructor
      
      const daysDiff = Math.floor(
        (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff >= 0 && daysDiff < 31) {
        // Use daysDiff directly so recent dates (smaller daysDiff) appear on the right
        kwhByRateType[rateName][daysDiff] = kwh;
      }
    });

    // Create datasets in the desired order
    const datasets = orderedRateTypes
      .filter(rateName => kwhByRateType[rateName] !== undefined)
      .map<ChargeStatDataset>((rateName) => ({
        label: rateName,
        data: kwhByRateType[rateName].slice().reverse(), // Reverse here so recent dates appear on right
        backgroundColor: getColor(rateName)
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
        color: getColor(label)
      };
    });

    return averages;
  }

  private getCostTotals(chargeStats: ChargeStatsDbo[]): CostTotal[] {
    const costByRateType: Record<string, number> = {};

    chargeStats.forEach(({ kwh, rate, rate_override, rate_name: rateName }) => {
      const effectiveRate = rate_override || rate;
      const cost = kwh * effectiveRate;
      
      if (!costByRateType[rateName]) {
        costByRateType[rateName] = 0;
      }
      costByRateType[rateName] += cost;
    });

    // Use consistent ordering: Home, DC, Other, Work
    const orderedRateTypes = ['Home', 'DC', 'Other', 'Work'];
    const costTotals = orderedRateTypes
      .filter(rateName => costByRateType[rateName] !== undefined)
      .map<CostTotal>((rateName) => ({
        name: rateName,
        cost: Math.round((costByRateType[rateName] || 0) * 100) / 100, // Round to 2 decimal places
        color: getColor(rateName)
      }));

    return costTotals;
  }

  private getTotalCost(chargeStats: ChargeStatsDbo[]): number {
    const totalCost = chargeStats.reduce((total, { kwh, rate, rate_override }) => {
      const effectiveRate = rate_override || rate;
      return total + (kwh * effectiveRate);
    }, 0);

    return Math.round(totalCost * 100) / 100; // Round to 2 decimal places
  }
}
