/** The session model. */
export type Session = {
  id?: number;
  date: string;
  kWh: number;
  /** `db column - rate_type_id` */
  rateTypeId: number;
  /** `db column - rate_override` */
  rateOverride?: number;
  /** `db column - vehicle_id` */
  vehicleId: number;
};

/** The session database object. */
export type SessionDbo = {
  id?: number;
  date: string;
  kwh: number;
  // remember that dbos are lowered_snake_case
  rate_override?: number;
  rate_type_id: number;
  vehicle_id: number;
};

/** The session log entry view model */
export type SessionLog = {
  id: number;
  date: string;
  kWh: number;
  vehicleId: number;
  vehicleName: string;
  rateTypeId: number;
  rateType: string;
};
