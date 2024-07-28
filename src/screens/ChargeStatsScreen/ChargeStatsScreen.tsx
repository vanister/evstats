import EvsPage from '../../components/EvsPage';
import VehicleChargeBarChart from './components/VehicleChargeBarChart';

export default function ChargeStatsScreen() {
  // const { datasets, labels } = useVehicleChartData({ vehicleId: 1 });

  return (
    <EvsPage className="charge-stats" title="Charge Stats" color="light" padding>
      <VehicleChargeBarChart />
    </EvsPage>
  );
}
