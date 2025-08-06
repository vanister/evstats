import './ChargeStatsScreen.scss';

import { useEffect, useState } from 'react';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';
import VehicleChargeBarChart from './components/VehicleChargeBarChart/VehicleChargeBarChart';
import EmptyState from '../../components/EmptyState';
import { ChargeStatData } from '../../models/chargeStats';
import { logToDevServer } from '../../logger';
import { useAppSelector } from '../../redux/hooks';

export default function ChargeStatsScreen() {
  const chargeStatsService = useServices('chargeStatsService');
  const [chartData, setChartData] = useState<ChargeStatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get vehicle ID from Redux state - prefer last used, then default
  const lastUsedVehicleId = useAppSelector((s) => s.lastUsed.vehicleId);
  const defaultVehicleId = useAppSelector((s) => s.defaultVehicle.vehicleId);
  const selectedVehicleId = lastUsedVehicleId || defaultVehicleId;
  
  const showEmptyState = !chartData && !loading && !error;

  const loadLast31Days = async () => {
    if (!selectedVehicleId) {
      setError('No vehicle selected');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await chargeStatsService.getLast31Days(selectedVehicleId);
      setChartData(data);
    } catch (error) {
      logToDevServer(`Error loading last 31 days: ${error.message}`, 'error', error.stack);
      setError(error.message || 'Failed to load charge statistics');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or vehicle changes
  useEffect(() => {
    loadLast31Days();
  }, [selectedVehicleId]);

  const handleRefresh = async () => {
    logToDevServer('ChargeStatsScreen handleRefresh called');
    await loadLast31Days();
    logToDevServer('ChargeStatsScreen handleRefresh complete');
  };

  return (
    <EvsPage
      className="charge-stats-screen"
      title="Charge Stats"
      padding
      enableRefresher
      onRefresh={handleRefresh} // Pass refresher handler to EvsPage
    >
      {loading && <EmptyState>Loading charge statistics...</EmptyState>}
      {error && <EmptyState>Error: {error}</EmptyState>}
      {showEmptyState && <EmptyState>Not enough charge data</EmptyState>}
      {chartData && <VehicleChargeBarChart data={chartData} title="Last 31 Days" />}
    </EvsPage>
  );
}
