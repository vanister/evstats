import { Vehicle } from '../../models/vehicle';
import { useServices } from '../../providers/ServiceProvider';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addVehicle, deleteVehicle, updateVehicle } from '../../redux/vehicleSlice';

type VehicleUpdater = (vehicle: Vehicle) => Promise<string | null>;

export type UseVehicleHook = {
  vehicles: Vehicle[];
  addNewVehicle: VehicleUpdater;
  editVehicle: VehicleUpdater;
  removeVehicle: VehicleUpdater;
};

export function useVehicles() {
  const vehicleService = useServices('vehicleService');
  const dispatch = useAppDispatch();
  const vehicles = useAppSelector((s) => s.vehicle.vehicles);

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

  return { vehicles, addNewVehicle, editVehicle, removeVehicle };
}
