import './ChargeStatsScreen.scss';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { IonButton, IonIcon, IonActionSheet, useIonViewWillEnter } from '@ionic/react';
import { filter } from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';
import ChargeBarChart from './components/ChargeBarChart/ChargeBarChart';
import CostBarChart from './components/CostBarChart/CostBarChart';
import EmptyState from '../../components/EmptyState';
import { ChargeStatData } from '../../models/chargeStats';
import { Vehicle } from '../../models/vehicle';
import { logToDevServer } from '../../logger';
import { useAppSelector } from '../../redux/hooks';
import { ALL_VEHICLES_ID } from '../../constants';

export default function ChargeStatsScreen() {
  const chargeStatsService = useServices('chargeStatsService');
  const vehicles = useAppSelector((s) => s.vehicles);
  const [chartData, setChartData] = useState<ChargeStatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<number>(ALL_VEHICLES_ID);
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

      if (selectedVehicleFilter === ALL_VEHICLES_ID) {
        data = await chargeStatsService.getAllVehiclesLast31Days();
      } else {
        data = await chargeStatsService.getLast31Days(selectedVehicleFilter);
      }

      setChartData(data);
    } catch (error) {
      logToDevServer(`Error loading charge stats: ${error.message}`, 'error', error.stack);
      setError(error.message || 'Failed to load charge statistics');
    } finally {
      setLoading(false);
    }
  };

  // Load data initially when screen enters
  useIonViewWillEnter(() => {
    loadChartData();
  });

  // Reload data when filter changes
  useEffect(() => {
    loadChartData();
  }, [selectedVehicleFilter]);

  const handleVehicleFilterChange = useCallback((value: number) => {
    setSelectedVehicleFilter(value);
    setIsActionSheetOpen(false);
  }, []);

  const handleFilterButtonClick = useCallback(() => {
    setIsActionSheetOpen(true);
  }, []);

  const getVehicleDisplayName = (vehicle: Vehicle) => {
    return vehicle.nickname || `${vehicle.make} ${vehicle.model}`;
  };

  const getChartTitle = () => {
    if (selectedVehicleFilter === ALL_VEHICLES_ID) {
      return 'Last 31 Days - All Vehicles';
    }

    const vehicle = vehicles.find((v) => v.id === selectedVehicleFilter);
    return vehicle ? `Last 31 Days - ${getVehicleDisplayName(vehicle)}` : 'Last 31 Days';
  };

  const getCostChartTitle = () => {
    const baseTitle = 'Costs';
    if (selectedVehicleFilter === ALL_VEHICLES_ID) {
      return `${baseTitle} - All Vehicles`;
    }

    const vehicle = vehicles.find((v) => v.id === selectedVehicleFilter);
    return vehicle ? `${baseTitle} - ${getVehicleDisplayName(vehicle)}` : baseTitle;
  };

  // Create action sheet buttons
  const actionSheetButtons = useMemo(() => [
    {
      text: 'All Vehicles',
      handler: () => handleVehicleFilterChange(ALL_VEHICLES_ID)
    },
    ...vehicles.map((vehicle) => ({
      text: getVehicleDisplayName(vehicle),
      handler: () => handleVehicleFilterChange(vehicle.id!)
    })),
    {
      text: 'Cancel',
      role: 'cancel'
    }
  ], [vehicles, handleVehicleFilterChange]);

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
      slot: 'start'
    }
  ];

  return (
    <EvsPage
      className="charge-stats-screen"
      title="Charge Stats"
      padding
      hideBack={true}
      headerButtons={headerButtons}
    >
      {loading && <EmptyState>Loading charge statistics...</EmptyState>}
      {error && <EmptyState>Error: {error}</EmptyState>}
      {showEmptyState && <EmptyState>Not enough charge data</EmptyState>}
      {chartData && (
        <>
          <ChargeBarChart data={chartData} title={getChartTitle()} />
          <CostBarChart
            costTotals={chartData.costTotals}
            totalCost={chartData.totalCost}
            title={getCostChartTitle()}
          />
        </>
      )}

      <IonActionSheet
        isOpen={isActionSheetOpen}
        onDidDismiss={() => setIsActionSheetOpen(false)}
        header="Filter by Vehicle"
        buttons={actionSheetButtons}
      />
    </EvsPage>
  );
}
