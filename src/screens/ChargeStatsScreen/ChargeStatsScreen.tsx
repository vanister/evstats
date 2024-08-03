import { useEffect, useState } from 'react';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';
import VehicleChargeBarChart from './components/VehicleChargeBarChart/VehicleChargeBarChart';
import { ChargeStatData } from '../../services/ChargeStatsService';
import { IonLoading } from '@ionic/react';

export default function ChargeStatsScreen() {
  const { chargeStatsService } = useServices();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChargeStatData>(null);
  const [selectedVehicleId, _setSelectedVehicleId] = useState(1);

  // todo - useReducer
  useEffect(() => {
    const loadLast31Days = async () => {
      const data = await chargeStatsService.getLast31Days(selectedVehicleId);

      setLoading(false);
      setChartData(data);
    };

    loadLast31Days();
  }, []);

  return (
    <EvsPage className="charge-stats" title="Charge Stats" color="light" padding>
      <IonLoading isOpen={loading} />
      {!loading && <VehicleChargeBarChart data={chartData} title="Last 31 Days" />}
    </EvsPage>
  );
}
