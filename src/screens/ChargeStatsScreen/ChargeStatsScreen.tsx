import './ChargeStatsScreen.scss';

import { useEffect, useState } from 'react';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';
import VehicleChargeBarChart from './components/VehicleChargeBarChart/VehicleChargeBarChart';
import { ChargeStatData } from '../../services/ChargeStatsService';
import { IonLoading } from '@ionic/react';
import EmptyState from '../../components/EmptyState';

export default function ChargeStatsScreen() {
  const chargeStatsService = useServices('chargeStatsService');
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChargeStatData>(null);
  const [selectedVehicleId, _setSelectedVehicleId] = useState(1);
  const showEmptyState = !(loading || chartData);

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
    <EvsPage className="charge-stats-screen" title="Charge Stats">
      <IonLoading isOpen={loading} />
      <div className="content-container ion-padding">
        {showEmptyState && <EmptyState>Not enough charge data</EmptyState>}
        <VehicleChargeBarChart data={chartData} title="Last 31 Days" />
      </div>
    </EvsPage>
  );
}
