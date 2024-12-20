import './VehicleScreen.scss';

import { IonIcon } from '@ionic/react';
import EvsFloatingActionButton from '../../components/EvsFloatingActionButton';
import { add } from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';
import { useEffect } from 'react';
import { useImmerState } from '../../hooks/useImmerState';
import { Vehicle } from '../../models/vehicle';
import VehicleCard from './components/VehicleCard';

type VehiclePageState = {
  vehicles: Vehicle[];
  loading: boolean;
};

export default function VehiclePage() {
  const vehicleService = useServices('vehicleService');
  const [state, setState] = useImmerState<VehiclePageState>({ vehicles: [], loading: true });
  const { vehicles } = state;

  useEffect(() => {
    const loadVehicles = async () => {
      const vehicles = await vehicleService.list();

      setState((s) => {
        s.vehicles = vehicles;
      });
    };

    loadVehicles();
  }, []);

  const handleAddClick = () => {
    /* noop */
  };

  return (
    <EvsPage className="vehicle-page" color="light" title="Vehicles" fixedSlotPlacement="before">
      {vehicles.length === 0 && (
        <div className="no-vehicles-container">
          <h5>Click the add button to add a vehicle</h5>
        </div>
      )}

      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}

      <EvsFloatingActionButton
        className="add-vehicle-fab"
        horizontal="end"
        vertical="bottom"
        slot="fixed"
        onClick={handleAddClick}
      >
        <IonIcon icon={add} />
      </EvsFloatingActionButton>
    </EvsPage>
  );
}
