import { ChargeStatData } from '../../models/chargeStats';

export type CreateChartConfigOptions = {
  data: ChargeStatData;
  title?: string;
  today: Date;
  isLast31Days?: boolean;
  currentPeriod?: string; // For monthly view: "2025-07", for yearly view: "2025"
};
