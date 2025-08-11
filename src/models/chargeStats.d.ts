export type ChargeStatsDbo = {
  vehicle_id: number;
  date: string;
  rate_type_id: number;
  kwh: number;
  rate: number;
  rate_name: string;
  rate_override: number | null;
};

export type ChargeAverage = {
  name: string;
  kWh: number;
  color: string;
};

export type ChargeStatDataset = {
  label: string;
  data: (number | null)[];
  backgroundColor: string;
};

export type CostTotal = {
  name: string;
  cost: number;
  color: string;
};

export type ChargeStatData = {
  vehicleId: number; // Kept for backward compatibility
  vehicleIds: number[]; // Array of vehicle IDs included in this data
  labels: (string | number)[];
  datasets: ChargeStatDataset[];
  averages: ChargeAverage[];
  costTotals: CostTotal[];
  totalCost: number;
};
