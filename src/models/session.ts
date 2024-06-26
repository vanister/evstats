export interface Session {
  id?: number;
  date: string;
  kWhAdded: number;
  rateTypeId: number;
  rateOverride?: number;
  vehicleId: number;
}

export class SessionViewModal {
  constructor(
    public id: number,
    public date: string,
    public kWh: number,
    public vehicleName: string,
    public rateType: string
  ) {}
}
