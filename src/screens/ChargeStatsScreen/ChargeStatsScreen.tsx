import './ChargeStatsScreen.scss';

import { useEffect, useState } from 'react';
import { IonButton, IonIcon, IonActionSheet } from '@ionic/react';
import { filter } from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';
import VehicleChargeBarChart from './components/VehicleChargeBarChart/VehicleChargeBarChart';
import EmptyState from '../../components/EmptyState';
import { ChargeStatData } from '../../models/chargeStats';
import { Vehicle } from '../../models/vehicle';
import { logToDevServer } from '../../logger';
import { useAppSelector } from '../../redux/hooks';

export default function ChargeStatsScreen() {
  const chargeStatsService = useServices('chargeStatsService');
  const vehicles = useAppSelector((s) => s.vehicles);
  const [chartData, setChartData] = useState<ChargeStatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('all'); // 'all' or vehicleId
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  
  const showEmptyState = !chartData && !loading && !error;

  const loadChartData = async () => {
    if (vehicles.length === 0) {
      setError('No vehicles available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let data: ChargeStatData;
      
      if (selectedVehicleFilter === 'all') {
        data = await chargeStatsService.getAllVehiclesLast31Days();
      } else {
        const vehicleId = parseInt(selectedVehicleFilter);
        data = await chargeStatsService.getLast31Days(vehicleId);
      }
      
      setChartData(data);
    } catch (error) {
      logToDevServer(`Error loading charge stats: ${error.message}`, 'error', error.stack);
      setError(error.message || 'Failed to load charge statistics');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or filter changes
  useEffect(() => {
    loadChartData();
  }, [selectedVehicleFilter, vehicles]);

  const handleRefresh = async () => {
    logToDevServer('ChargeStatsScreen handleRefresh called');
    await loadChartData();
    logToDevServer('ChargeStatsScreen handleRefresh complete');
  };

  const handleVehicleFilterChange = (value: string) => {
    setSelectedVehicleFilter(value);
    setIsActionSheetOpen(false);
  };

  const handleFilterButtonClick = () => {
    setIsActionSheetOpen(true);
  };

  const getVehicleDisplayName = (vehicle: Vehicle) => {
    return vehicle.nickname || `${vehicle.make} ${vehicle.model}`;
  };

  const getChartTitle = () => {
    if (selectedVehicleFilter === 'all') {
      return 'Last 31 Days - All Vehicles';
    }
    
    const vehicle = vehicles.find(v => v.id === parseInt(selectedVehicleFilter));
    return vehicle ? `Last 31 Days - ${getVehicleDisplayName(vehicle)}` : 'Last 31 Days';
  };

  // Create action sheet buttons
  const actionSheetButtons = [
    {
      text: 'All Vehicles',
      handler: () => handleVehicleFilterChange('all')
    },
    ...vehicles.map(vehicle => ({
      text: getVehicleDisplayName(vehicle),
      handler: () => handleVehicleFilterChange(vehicle.id.toString())
    })),
    {
      text: 'Cancel',
      role: 'cancel'
    }
  ];

  // Create header filter button
  const filterButton = (
    <IonButton fill="clear" onClick={handleFilterButtonClick}>
      <IonIcon icon={filter} />
    </IonButton>
  );

  const headerButtons = [
    {
      key: 'filter',
      button: filterButton,
      slot: 'end'
    }
  ];

  return (
    <EvsPage
      className="charge-stats-screen"
      title="Charge Stats"
      padding
      enableRefresher
      onRefresh={handleRefresh}
      headerButtons={headerButtons}
    >
      {loading && <EmptyState>Loading charge statistics...</EmptyState>}
      {error && <EmptyState>Error: {error}</EmptyState>}
      {showEmptyState && <EmptyState>Not enough charge data</EmptyState>}
      {chartData && <VehicleChargeBarChart data={chartData} title={getChartTitle()} />}
      
      <IonActionSheet
        isOpen={isActionSheetOpen}
        onDidDismiss={() => setIsActionSheetOpen(false)}
        header="Filter by Vehicle"
        buttons={actionSheetButtons}
      />
    </EvsPage>
  );
}
