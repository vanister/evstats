/** Vehicle usage statistics */
export type VehicleStats = {
  vehicleId: number;
  totalSessions: number;
  totalKwh: number;
  lastChargeDate?: string;
  averageKwhPerSession: number;
};

/** Database result type for vehicle statistics query */
export type VehicleStatsDbo = {
  vehicle_id: number;
  totalSessions: number;
  totalKwh: number;
  lastChargeDate?: string;
  averageKwhPerSession: number;
};