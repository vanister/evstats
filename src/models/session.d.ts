/** The session database model */
export interface Session {
  id?: number;
  date: string;
  kWhAdded: number;
  rateTypeId: number;
  rateOverride?: number;
  vehicleId: number;
}

export interface SessionLog {
  id: number;
  date: string;
  kWh: number;
  vehicleId: number;
  vehicleName: string;
  rateTypeId: number;
  rateType: string;
}
