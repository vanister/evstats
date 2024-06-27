/** The session database model */
export interface Session {
  id?: number;
  date: string;
  kWhAdded: number;
  rateTypeId: number;
  rateOverride?: number;
  vehicleId: number;
}

export interface SessionListItem {
  id: number;
  date: string;
  kWh: number;
  vehicleName: string;
  rateType: string;
}
