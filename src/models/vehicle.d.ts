/** The vehicle database model */
export interface Vehicle {
  id: number;
  make: string;
  model: string;
  nickname?: string;
  trim?: string;
  vin?: string;
  year: number;
  /** The useable battery size. */
  batterySize: number;
  /** The initial range of vehicle. */
  range: number;
}

export interface VehicleViewModal {}
