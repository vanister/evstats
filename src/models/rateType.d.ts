/** The rate type model. */
export type RateType = {
  id: number;
  name: string;
  amount: number;
  unit: 'kWh';
};

/** The rate_type database object. */
export type RateTypeDbo = {
  id: number;
  name: string;
  amount: number;
  unit: string;
};
