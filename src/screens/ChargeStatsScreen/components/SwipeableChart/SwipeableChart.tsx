import './SwipeableChart.scss';

import { useState, useCallback, useRef, useEffect } from 'react';
import { IonSegment, IonSegmentButton, IonLabel, createGesture } from '@ionic/react';
import ChargeBarChart from '../ChargeBarChart/ChargeBarChart';
import CostBarChart from '../CostBarChart/CostBarChart';
import { ChargeStatData } from '../../../../models/chargeStats';
import { Vehicle } from '../../../../models/vehicle';
import { ALL_VEHICLES_ID } from '../../../../constants';
import { 
  getCurrentMonth, 
  getCurrentYear, 
  getPreviousMonth, 
  getNextMonth, 
  getPreviousYear, 
  getNextYear,
  formatMonthForDisplay 
} from '../../../../utilities/dateUtility';

export type ViewMode = 'monthly' | 'yearly';

type SwipeableChartProps = {
  data: ChargeStatData | null;
  loading: boolean;
  error: string | null;
  selectedVehicleFilter: number;
  vehicles: Vehicle[];
  onDataRequest: (viewMode: ViewMode, period?: string, isLast31Days?: boolean) => Promise<boolean>;
  onCheckDataExists: (viewMode: ViewMode, period: string) => Promise<boolean>;
};

export default function SwipeableChart({
  data,
  loading: _loading,
  error,
  selectedVehicleFilter,
  vehicles,
  onDataRequest,
  onCheckDataExists
}: SwipeableChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [currentPeriod, setCurrentPeriod] = useState<string>('');
  const [isLast31Days, setIsLast31Days] = useState<boolean>(true); // Start with Last 31 Days
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<ReturnType<typeof createGesture> | null>(null);

  // Initialize current period when component mounts
  useEffect(() => {
    if (viewMode === 'monthly') {
      if (isLast31Days) {
        setCurrentPeriod(''); // Empty period for Last 31 Days
      } else {
        setCurrentPeriod(getCurrentMonth());
      }
    } else if (viewMode === 'yearly') {
      setCurrentPeriod(getCurrentYear());
      setIsLast31Days(false);
    }
  }, [viewMode, isLast31Days]);

  // Set up swipe gestures
  useEffect(() => {
    if (!chartContainerRef.current) return;

    gestureRef.current = createGesture({
      el: chartContainerRef.current,
      gestureName: 'chart-swipe',
      threshold: 15,
      onMove: (_ev) => {
        // Optional: Add visual feedback during swipe
      },
      onEnd: (ev) => {
        const deltaX = ev.deltaX;
        const threshold = 50;

        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            // Swipe right - go back in time
            handleSwipeRight();
          } else {
            // Swipe left - go forward in time (only if not on latest period)
            handleSwipeLeft();
          }
        }
      }
    });

    gestureRef.current.enable();

    return () => {
      gestureRef.current?.destroy();
    };
  }, [viewMode, currentPeriod]);

  const handleSwipeRight = useCallback(async () => {
    if (viewMode === 'monthly') {
      if (isLast31Days) {
        // Switch from Last 31 Days to current month
        const currentMonth = getCurrentMonth();
        setIsLast31Days(false);
        setCurrentPeriod(currentMonth);
        await onDataRequest('monthly', currentMonth, false);
      } else {
        // Go back one month
        const newPeriod = getPreviousMonth(currentPeriod);
        
        // Check if there's data for this period without loading it
        const hasData = await onCheckDataExists('monthly', newPeriod);
        if (hasData) {
          setCurrentPeriod(newPeriod);
          await onDataRequest('monthly', newPeriod, false);
        }
      }
    } else if (viewMode === 'yearly') {
      // Go back one year
      const newPeriod = getPreviousYear(currentPeriod);
      
      // Check if there's data for this period without loading it
      const hasData = await onCheckDataExists('yearly', newPeriod);
      if (hasData) {
        setCurrentPeriod(newPeriod);
        await onDataRequest('yearly', newPeriod, false);
      }
    }
  }, [viewMode, currentPeriod, isLast31Days]);

  const handleSwipeLeft = useCallback(async () => {
    if (viewMode === 'monthly' && !isLast31Days) {
      // Only allow swipe left if we're in actual month view (not Last 31 Days)
      const nextMonthStr = getNextMonth(currentPeriod);
      const currentMonth = getCurrentMonth();
      
      // Check if next month would be the current month
      if (nextMonthStr === currentMonth) {
        // Switch back to Last 31 Days
        setIsLast31Days(true);
        setCurrentPeriod('');
        await onDataRequest('monthly', '', true);
      } else {
        // Go to next historical month (don't go beyond current month)
        const nextYear = parseInt(nextMonthStr.split('-')[0]);
        const nextMonth = parseInt(nextMonthStr.split('-')[1]);
        const currentYear = parseInt(currentMonth.split('-')[0]);
        const currentMonthNum = parseInt(currentMonth.split('-')[1]);
        
        if (nextYear < currentYear || (nextYear === currentYear && nextMonth <= currentMonthNum)) {
          setCurrentPeriod(nextMonthStr);
          await onDataRequest('monthly', nextMonthStr, false);
        }
      }
    } else if (viewMode === 'yearly') {
      const newPeriod = getNextYear(currentPeriod);
      const currentYear = getCurrentYear();
      
      // Don't go beyond current year
      if (parseInt(newPeriod) <= parseInt(currentYear)) {
        setCurrentPeriod(newPeriod);
        await onDataRequest('yearly', newPeriod, false);
      }
    }
  }, [viewMode, currentPeriod, isLast31Days]);



  const handleViewModeChange = async (newViewMode: ViewMode) => {
    if (newViewMode === viewMode) return;

    setViewMode(newViewMode);
    
    if (newViewMode === 'monthly') {
      // Start with Last 31 Days
      setIsLast31Days(true);
      setCurrentPeriod('');
      await onDataRequest('monthly', '', true);
    } else { // yearly
      const period = getCurrentYear();
      setIsLast31Days(false);
      setCurrentPeriod(period);
      await onDataRequest('yearly', period, false);
    }
  };

  const getVehicleDisplayName = (vehicle: Vehicle) => {
    return vehicle.nickname || `${vehicle.make} ${vehicle.model}`;
  };

  const getChartTitle = () => {
    let baseTitle: string;
    
    if (viewMode === 'monthly') {
      if (isLast31Days) {
        baseTitle = 'Last 31 Days';
      } else {
        baseTitle = formatMonthForDisplay(currentPeriod);
      }
    } else { // yearly
      baseTitle = currentPeriod;
    }

    if (selectedVehicleFilter === ALL_VEHICLES_ID) {
      return `${baseTitle} - All Vehicles`;
    }

    const vehicle = vehicles.find((v) => v.id === selectedVehicleFilter);
    return vehicle ? `${baseTitle} - ${getVehicleDisplayName(vehicle)}` : baseTitle;
  };

  const getCostChartTitle = () => {
    const baseTitle = 'Costs';
    if (selectedVehicleFilter === ALL_VEHICLES_ID) {
      return `${baseTitle} - All Vehicles`;
    }

    const vehicle = vehicles.find((v) => v.id === selectedVehicleFilter);
    return vehicle ? `${baseTitle} - ${getVehicleDisplayName(vehicle)}` : baseTitle;
  };

  if (error) {
    return <div className="swipeable-chart-error">Error: {error}</div>;
  }

  return (
    <div className="swipeable-chart">
      <IonSegment 
        value={viewMode} 
        onIonChange={(e) => handleViewModeChange(e.detail.value as ViewMode)}
        className="view-mode-segment"
      >
        <IonSegmentButton value="monthly">
          <IonLabel>Monthly</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="yearly">
          <IonLabel>Yearly</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      <div ref={chartContainerRef} className="chart-container">
        {data && (
          <>
            <ChargeBarChart 
              data={data} 
              title={getChartTitle()} 
              isLast31Days={isLast31Days}
              currentPeriod={currentPeriod}
            />
            <CostBarChart
              costTotals={data.costTotals}
              totalCost={data.totalCost}
              title={getCostChartTitle()}
            />
          </>
        )}
      </div>
    </div>
  );
}