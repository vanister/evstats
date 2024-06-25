export interface Session {
  id?: number;
  date: Date;
  kWhAdded: number;
  rateTypeId: number;
  rateOverride?: number;
  vehicleId: number;
}


export class SessionViewModal {
  constructor(
    public id: number, public date: Date, public kWh: number, public vehicleName: string, public rateType: string) { }
}