import { useEffect } from 'react';
import { Vehicle } from '../../models/vehicle';
import { VehicleStats } from '../../models/vehicleStats';
import { useServices } from '../../providers/ServiceProvider';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addVehicle, deleteVehicle, updateVehicle } from '../../redux/vehicleSlice';
import { useImmerState } from '../../hooks/useImmerState';
import { logToDevServer } from '../../logger';

type VehicleUpdater = (vehicle: Vehicle) => Promise<string | null>;

type VehicleLocalState = {
  vehicleStats: VehicleStats[];
  loadingStats: boolean;
  refreshTrigger: number;
  defaultVehicleId: number | null;
};

export type UseVehicleHook = {
  vehicles: Vehicle[];
  vehicleStats: VehicleStats[];
  loadingStats: boolean;
  defaultVehicleId: number | null;
  refreshStats: () => void;
  addNewVehicle: VehicleUpdater;
  editVehicle: VehicleUpdater;
  removeVehicle: VehicleUpdater;
  setDefaultVehicle: (vehicle: Vehicle) => Promise<void>;
};

const INITIAL_STATE: VehicleLocalState = {
  vehicleStats: [],
  loadingStats: true,
  refreshTrigger: 0,
  defaultVehicleId: null
};

export function useVehicles() {
  const dispatch = useAppDispatch();
  const vehicleService = useServices('vehicleService');
  const vehicleStatsService = useServices('vehicleStatsService');
  const vehicles = useAppSelector((s) => s.vehicles);
  const [state, setState] = useImmerState<VehicleLocalState>(INITIAL_STATE);

  useEffect(() => {
    const loadDefaultVehicleId = async () => {
      try {
        const defaultId = await vehicleService.getDefaultVehicleId();
        setState((draft) => {
          draft.defaultVehicleId = defaultId;
        });
      } catch (error) {
        logToDevServer('Failed to load default vehicle ID:', 'error', error);
      }
    };

    loadDefaultVehicleId();
  }, [vehicleService]);

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
        logToDevServer('Failed to load vehicle stats:', 'error', error);
      } finally {
        setState((draft) => {
          draft.loadingStats = false;
        });
      }
    };

    loadVehicleStats();
  }, [vehicles, state.refreshTrigger]);

  const refreshStats = () => {
    setState((draft) => {
      draft.refreshTrigger += 1;
    });
  };

  const setDefaultVehicle = async (vehicle: Vehicle): Promise<void> => {
    try {
      await vehicleService.setDefaultVehicleId(vehicle.id);
      setState((draft) => {
        draft.defaultVehicleId = vehicle.id;
      });
    } catch (error) {
      logToDevServer('Failed to set default vehicle:', 'error', error);
      throw error;
    }
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
    vehicleStats: state.vehicleStats,
    loadingStats: state.loadingStats,
    defaultVehicleId: state.defaultVehicleId,
    refreshStats,
    addNewVehicle,
    editVehicle,
    removeVehicle,
    setDefaultVehicle
  };
}
