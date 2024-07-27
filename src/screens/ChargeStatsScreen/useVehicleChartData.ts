export type VehicleChartOptions = {
  vehicleId: number;
};

export function useVehicleChartData(_options: VehicleChartOptions) {
  return { datasets: [], labels: [] };
}
