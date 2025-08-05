/** Vehicle usage statistics */
export type VehicleStats = {
  vehicleId: number;
  totalSessions: number;
  totalKwh: number;
  lastChargeDate?: string;
  averageKwhPerSession: number;
};