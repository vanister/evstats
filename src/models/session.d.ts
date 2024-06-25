export interface Session {
  id?: number;
  date: Date;
  kWhAdded: number;
  rateTypeId: number;
  rateOverride?: number;
  vehicleId: number;
}