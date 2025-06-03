import './ChargeStatsScreen.scss';

import { useEffect, useState } from 'react';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';
import VehicleChargeBarChart from './components/VehicleChargeBarChart/VehicleChargeBarChart';
import EmptyState from '../../components/EmptyState';
import { ChargeStatData } from '../../models/chargeStats';
import { logToConsole } from '../../logger';

export default function ChargeStatsScreen() {
  const chargeStatsService = useServices('chargeStatsService');
  const [chartData, setChartData] = useState<ChargeStatData>(null);
  const [selectedVehicleId] = useState(1);
  const showEmptyState = !chartData;

  const loadLast31Days = async () => {
    try {
      const data = await chargeStatsService.getLast31Days(selectedVehicleId);
      setChartData(data);
    } catch (error) {
      logToConsole('Error loading last 31 days:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadLast31Days();
  }, []);

  const handleRefresh = async () => {
    logToConsole('ChargeStatsScreen handleRefresh called');
    await loadLast31Days();
    logToConsole('ChargeStatsScreen handleRefresh complete');
  };

  return (
    <EvsPage
      className="charge-stats-screen"
      title="Charge Stats"
      padding
      enableRefresher
      onRefresh={handleRefresh} // Pass refresher handler to EvsPage
    >
      {showEmptyState && <EmptyState>Not enough charge data</EmptyState>}
      <VehicleChargeBarChart data={chartData} title="Last 31 Days" />
    </EvsPage>
  );
}
