import { useEffect, useState } from 'react';
import { Vehicle } from '../models/vehicle';
import { useServices } from '../providers/ServiceProvider';

export function useVehicles() {
  const { vehicleService } = useServices();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const loadVehicles = async () => {
      const vehicles = await vehicleService.list();

      setVehicles(vehicles);
    };

    loadVehicles();
  }, []);

  return { vehicles };
}
