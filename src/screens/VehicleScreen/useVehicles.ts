import { useEffect, useState } from 'react';
import { Vehicle } from '../../models/vehicle';
import { VehicleStats } from '../../models/vehicleStats';
import { useServices } from '../../providers/ServiceProvider';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addVehicle, deleteVehicle, updateVehicle } from '../../redux/vehicleSlice';

type VehicleUpdater = (vehicle: Vehicle) => Promise<string | null>;

export type UseVehicleHook = {
  vehicles: Vehicle[];
  vehicleStats: VehicleStats[];
  loadingStats: boolean;
  refreshStats: () => void;
  addNewVehicle: VehicleUpdater;
  editVehicle: VehicleUpdater;
  removeVehicle: VehicleUpdater;
};

export function useVehicles() {
  const dispatch = useAppDispatch();
  const vehicleService = useServices('vehicleService');
  const vehicleStatsService = useServices('vehicleStatsService');
  const vehicles = useAppSelector((s) => s.vehicles);
  const [vehicleStats, setVehicleStats] = useState<VehicleStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadVehicleStats = async () => {
      if (vehicles.length === 0) {
        setLoadingStats(false);
        return;
      }

      try {
        setLoadingStats(true);
        const stats = await vehicleStatsService.getStatsForAllVehicles();
        setVehicleStats(stats);
      } catch (error) {
        console.error('Failed to load vehicle stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadVehicleStats();
  }, [vehicles, refreshTrigger]);

  const refreshStats = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const addNewVehicle = async (vehicle: Vehicle): Promise<string | null> => {
    try {
      const newVehicle = await vehicleService.add(vehicle);
      dispatch(addVehicle(newVehicle));

      return null;
    } catch (error) {
      return error.message;
    }
  };

  const editVehicle = async (vehicle: Vehicle): Promise<string | null> => {
    try {
      await vehicleService.update(vehicle);
      dispatch(updateVehicle(vehicle));

      return null;
    } catch (error) {
      return error.message;
    }
  };

  const removeVehicle = async (vehicle: Vehicle): Promise<string | null> => {
    try {
      await vehicleService.remove(vehicle.id);
      dispatch(deleteVehicle(vehicle));

      return null;
    } catch (error) {
      return error.message;
    }
  };

  return {
    vehicles,
    vehicleStats,
    loadingStats,
    refreshStats,
    addNewVehicle,
    editVehicle,
    removeVehicle
  };
}
