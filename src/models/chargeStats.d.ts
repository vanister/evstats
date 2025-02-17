export type ChargeStatsDbo = {
  vehicle_id: number;
  date: string;
  rate_type_id: number;
  kwh: number;
  rate: number;
  rate_name: string;
  rate_override: number;
};

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
