import './ChargeStatsScreen.scss';

import { useEffect, useState } from 'react';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';
import VehicleChargeBarChart from './components/VehicleChargeBarChart/VehicleChargeBarChart';
import EmptyState from '../../components/EmptyState';
import { ChargeStatData } from '../../models/chargeStats';

export default function ChargeStatsScreen() {
  const chargeStatsService = useServices('chargeStatsService');
  const [chartData, setChartData] = useState<ChargeStatData>(null);
  const [selectedVehicleId, _setSelectedVehicleId] = useState(1);
  const showEmptyState = !chartData;

  // todo - useReducer
  useEffect(() => {
    const loadLast31Days = async () => {
      const data = await chargeStatsService.getLast31Days(selectedVehicleId);

      setChartData(data);
    };

    loadLast31Days();
  }, []);

  return (
    <EvsPage className="charge-stats-screen" title="Charge Stats">
      <div className="content-container ion-padding">
        {showEmptyState && <EmptyState>Not enough charge data</EmptyState>}
        <VehicleChargeBarChart data={chartData} title="Last 31 Days" />
      </div>
    </EvsPage>
  );
}
