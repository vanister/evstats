/** The session database model */
export interface Session {
  id?: number;
  date: string;
  kWhAdded: number;
  rateTypeId: number;
  rateOverride?: number;
  vehicleId: number;
}

export interface SessionViewModal {
  id: number;
  date: string;
  kWh: number;
  vehicleName: string;
  rateType: string;
}
