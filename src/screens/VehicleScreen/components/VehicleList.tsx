import { IonIcon, useIonRouter } from '@ionic/react';
import { add } from 'ionicons/icons';
import EvsFloatingActionButton from '../../../components/EvsFloatingActionButton';
import EvsPage from '../../../components/EvsPage';
import { useAppSelector } from '../../../redux/hooks';
import VehicleCard from './VehicleCard/VehicleCard';

export default function VehicleList() {
  const router = useIonRouter();
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);

  const handleAddClick = () => {
    router.push('/vehicles/details');
  };

  return (
    <EvsPage className="vehicle-page" title="Vehicles" fixedSlotPlacement="before" hideBack>
      {vehicles.length === 0 && (
        <div className="no-vehicles-container">
          <h5>Click the + button to add a vehicle</h5>
        </div>
      )}

      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          // onSelectClick={handleSelectClick}
          // onEditClick={handleVehicleClick}
          // onDeleteClick={handleDeleteClick}
        />
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
