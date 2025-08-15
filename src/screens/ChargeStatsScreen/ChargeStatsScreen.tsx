import './ChargeStatsScreen.scss';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  IonButton,
  IonIcon,
  IonActionSheet,
  useIonViewWillEnter,
  useIonRouter
} from '@ionic/react';
import { filter, add } from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';
import SwipeableChart, { ViewMode } from './components/SwipeableChart/SwipeableChart';
import { ChargeStatData } from '../../models/chargeStats';
import { logToDevServer } from '../../logger';
import { useAppSelector } from '../../redux/hooks';
import { ALL_VEHICLES_ID } from '../../constants';

export default function ChargeStatsScreen() {
  const router = useIonRouter();
  const chargeStatsService = useServices('chargeStatsService');
  const vehicles = useAppSelector((s) => s.vehicles);
  const [chartData, setChartData] = useState<ChargeStatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<number>(ALL_VEHICLES_ID);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const showEmptyState = !chartData && !loading && !error;

  const checkDataExists = async (viewMode: ViewMode, period: string): Promise<boolean> => {
    try {
      let data: ChargeStatData;

      if (viewMode === 'monthly') {
        if (selectedVehicleFilter === ALL_VEHICLES_ID) {
          data = await chargeStatsService.getAllVehiclesMonth(period);
        } else {
          data = await chargeStatsService.getMonth(selectedVehicleFilter, period);
        }
      } else if (viewMode === 'yearly') {
        if (selectedVehicleFilter === ALL_VEHICLES_ID) {
          data = await chargeStatsService.getAllVehiclesYear(period);
        } else {
          data = await chargeStatsService.getYear(selectedVehicleFilter, period);
        }
      } else {
        return false;
      }

      // Check if data has any actual values
      return data && data.datasets.some(dataset => 
        dataset.data.some(value => value !== null && value > 0)
      );
    } catch {
      return false;
    }
  };

  const loadChartData = async (viewMode: ViewMode = 'monthly', period?: string, isLast31Days?: boolean): Promise<boolean> => {
    if (vehicles.length === 0) {
      setError('No vehicles available');
      setLoading(false);
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      let data: ChargeStatData;

      if (viewMode === 'monthly') {
        if (isLast31Days || period === '') {
          // Use last 31 days data
          if (selectedVehicleFilter === ALL_VEHICLES_ID) {
            data = await chargeStatsService.getAllVehiclesLast31Days();
          } else {
            data = await chargeStatsService.getLast31Days(selectedVehicleFilter);
          }
        } else {
          if (!period) {
            setError('Period is required for historical monthly view');
            return false;
          }
          // Use monthly data for specific months
          if (selectedVehicleFilter === ALL_VEHICLES_ID) {
            data = await chargeStatsService.getAllVehiclesMonth(period);
          } else {
            data = await chargeStatsService.getMonth(selectedVehicleFilter, period);
          }
        }
      } else if (viewMode === 'yearly') {
        if (!period) {
          setError('Period is required for yearly view');
          return false;
        }
        if (selectedVehicleFilter === ALL_VEHICLES_ID) {
          data = await chargeStatsService.getAllVehiclesYear(period);
        } else {
          data = await chargeStatsService.getYear(selectedVehicleFilter, period);
        }
      } else {
        setError('Invalid view mode');
        return false;
      }

      setChartData(data);
      return true;
    } catch (error) {
      logToDevServer(`Error loading charge stats: ${error.message}`, 'error', error.stack);
      setError(error.message || 'Failed to load charge statistics');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load data initially when screen enters
  useIonViewWillEnter(() => {
    loadChartData('monthly', '', true); // Start with Last 31 Days
  });

  // Reload data when filter changes
  useEffect(() => {
    loadChartData('monthly', '', true); // Reset to Last 31 Days when filter changes
  }, [selectedVehicleFilter]);

  const handleVehicleFilterChange = useCallback((value: number) => {
    setSelectedVehicleFilter(value);
    setIsActionSheetOpen(false);
  }, []);

  const handleFilterButtonClick = useCallback(() => {
    setIsActionSheetOpen(true);
  }, []);

  const handleAddSessionClick = useCallback(() => {
    router.push('/sessions');
  }, [router]);

  // Create action sheet buttons
  const getVehicleDisplayName = (vehicle: { nickname?: string; make: string; model: string }) => {
    return vehicle.nickname || `${vehicle.make} ${vehicle.model}`;
  };

  const actionSheetButtons = useMemo(
    () => [
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
    ],
    [vehicles, handleVehicleFilterChange]
  );

  // Create header filter button
  const filterButton = (
    <IonButton fill="clear" onClick={handleFilterButtonClick}>
      <IonIcon icon={filter} />
    </IonButton>
  );

  const headerButtons = [
    // Only show filter button when there are multiple vehicles
    ...(vehicles.length > 1 ? [{
      key: 'filter',
      button: filterButton,
      slot: 'start'
    }] : [])
  ];

  return (
    <EvsPage
      className="charge-stats-screen"
      title="Charge Stats"
      padding
      hideBack={true}
      headerButtons={headerButtons}
    >
      {showEmptyState && (
        <div className="empty-state">
          <h3>No charging sessions found</h3>
          <p>
            Check your filters or add charging sessions to see detailed statistics and cost analysis.
          </p>
          <IonButton fill="outline" onClick={handleAddSessionClick} className="ion-margin-top">
            <IonIcon icon={add} slot="start" />
            Add Session
          </IonButton>
        </div>
      )}
      {!showEmptyState && (
        <SwipeableChart
          data={chartData}
          loading={loading}
          error={error}
          selectedVehicleFilter={selectedVehicleFilter}
          vehicles={vehicles}
          onDataRequest={loadChartData}
          onCheckDataExists={checkDataExists}
        />
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
