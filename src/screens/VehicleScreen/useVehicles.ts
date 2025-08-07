import { useEffect, useCallback } from 'react';
import { Vehicle } from '../../models/vehicle';
import { useServices } from '../../providers/ServiceProvider';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addVehicle, deleteVehicle, updateVehicle } from '../../redux/vehicleSlice';
import { clearVehicleId } from '../../redux/lastUsedSlice';
import { setDefaultVehicleId, clearDefaultVehicleId } from '../../redux/defaultVehicleSlice';
import { useImmerState } from '../../hooks/useImmerState';
import { logToDevServer } from '../../logger';
import { VehicleLocalState } from './vehicle-types';

const INITIAL_STATE: VehicleLocalState = {
  vehicleStats: [],
  loadingStats: true,
  refreshTrigger: 0
};

export function useVehicles() {
  const dispatch = useAppDispatch();
  const vehicleService = useServices('vehicleService');
  const vehicleStatsService = useServices('vehicleStatsService');
  const vehicles = useAppSelector((s) => s.vehicles);
  const lastUsedVehicleId = useAppSelector((s) => s.lastUsed.vehicleId);
  const defaultVehicleId = useAppSelector((s) => s.defaultVehicle.vehicleId);
  const [state, setState] = useImmerState<VehicleLocalState>(INITIAL_STATE);

  useEffect(() => {
    const loadVehicleStats = async () => {
      if (vehicles.length === 0) {
        setState((draft) => {
          draft.loadingStats = false;
        });
        return;
      }

      try {
        setState((draft) => {
          draft.loadingStats = true;
        });
        const stats = await vehicleStatsService.getStatsForAllVehicles();
        setState((draft) => {
          draft.vehicleStats = stats;
        });
      } catch (error) {
        logToDevServer(`Failed to load vehicle stats: ${error.message}`, 'error', error.stack);
      } finally {
        setState((draft) => {
          draft.loadingStats = false;
        });
      }
    };

    loadVehicleStats();
  }, [vehicles, state.refreshTrigger]);

  const refreshStats = useCallback((): void => {
    setState((draft) => {
      draft.refreshTrigger += 1;
    });
  }, [setState]);

  const setDefaultVehicle = useCallback(async (vehicle: Vehicle): Promise<void> => {
    try {
      await vehicleService.setDefaultVehicleId(vehicle.id);
      dispatch(setDefaultVehicleId(vehicle.id));
    } catch (error) {
      logToDevServer(`Failed to set default vehicle: ${error.message}`, 'error', error.stack);
      throw error;
    }
  }, [vehicleService, dispatch]);

  const addNewVehicle = useCallback(async (vehicle: Vehicle): Promise<string | null> => {
    try {
      const newVehicle = await vehicleService.add(vehicle);
      dispatch(addVehicle(newVehicle));

      return null;
    } catch (error) {
      logToDevServer(`Failed to add new vehicle: ${error.message}`, 'error', error.stack);
      return error.message || 'Failed to add vehicle. Please check your information and try again.';
    }
  }, [vehicleService, dispatch]);

  const editVehicle = useCallback(async (vehicle: Vehicle): Promise<string | null> => {
    try {
      await vehicleService.update(vehicle);
      dispatch(updateVehicle(vehicle));

      return null;
    } catch (error) {
      logToDevServer(`Failed to edit vehicle: ${error.message}`, 'error', error.stack);
      return (
        error.message || 'Failed to update vehicle. Please check your information and try again.'
      );
    }
  }, [vehicleService, dispatch]);

  const removeVehicle = useCallback(async (vehicle: Vehicle): Promise<string | null> => {
    try {
      await vehicleService.remove(vehicle.id);
      dispatch(deleteVehicle(vehicle));

      // Clear last used vehicle ID from Redux if it matches the deleted vehicle
      if (lastUsedVehicleId === vehicle.id) {
        dispatch(clearVehicleId());
      }

      // Clear default vehicle ID from Redux if it matches the deleted vehicle
      if (defaultVehicleId === vehicle.id) {
        dispatch(clearDefaultVehicleId());
      }

      return null;
    } catch (error) {
      logToDevServer(`Failed to remove vehicle: ${error.message}`, 'error', error.stack);
      return error.message || 'Failed to delete vehicle. Please try again.';
    }
  }, [vehicleService, dispatch, lastUsedVehicleId, defaultVehicleId]);

  return {
    vehicles,
    vehicleStats: state.vehicleStats,
    loadingStats: state.loadingStats,
    defaultVehicleId,
    refreshStats,
    addNewVehicle,
    editVehicle,
    removeVehicle,
    setDefaultVehicle
  };
}
