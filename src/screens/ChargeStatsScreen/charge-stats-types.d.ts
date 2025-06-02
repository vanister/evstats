import { ChargeStatData } from '../../../models/chargeStats';

export type CreateChartConfigOptions = {
  data: ChargeStatData;
  title?: string;
  today: Date;
};
