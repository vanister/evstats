export type RateUnits = 'kWh';

/** The rate type model. */
export type RateType = {
  id: number;
  name: string;
  amount: number;
  unit: RateUnits;
  color: string;
};

/** The rate_type database object. */
export type RateTypeDbo = {
  id: number;
  name: string;
  amount: number;
  unit: RateUnits;
  color: string;
};
