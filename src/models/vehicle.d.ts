/** The vehicle model */
export type Vehicle = {
  id: number;
  make: string;
  model: string;
  nickname?: string;
  trim?: string;
  vin?: string;
  year: number;
  /**
   * The useable battery size.
   *
   * `db column - battery_size`
   */
  batterySize: number;
  /** The initial range of vehicle. */
  range: number;
};

/** The vehicle database object. */
export type VehicleDbo = {
  id: number;
  make: string;
  model: string;
  nickname?: string;
  trim?: string;
  vin?: string;
  year: number;
  battery_size: number;
  range: number;
};
