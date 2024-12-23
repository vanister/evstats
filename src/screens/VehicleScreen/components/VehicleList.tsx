import { IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import EvsFloatingActionButton from '../../../components/EvsFloatingActionButton';
import EvsPage from '../../../components/EvsPage';
import { useAppSelector } from '../../../redux/hooks';
import VehicleCard from './VehicleCard/VehicleCard';

export default function VehicleList() {
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);

  return (
    <EvsPage className="vehicle-page" title="Vehicles" fixedSlotPlacement="before" color="light">
      {/* <VehicleEmptyState /> */}
      {vehicles.length === 0 && (
        <div className="no-vehicles-container">
          <h5>Click the + button to add a vehicle</h5>
        </div>
      )}

      {/* <VehicleList */}
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          // onSelectClick={handleSelectClick}
          // onEditClick={handleVehicleClick}
          // onDeleteClick={handleDeleteClick}
        />
      ))}

      {/* {state.openModal && (
   <VehicleModal
     isNew={state.isNew}
     vehicle={state.editingVehicle}
     allowCloseGesture={!state.isNew}
     presentingElement={presentingElement.current}
     onDidDismiss={handleModalDismiss}
     onSave={handleSaveClick}
   />
 )} */}

      <EvsFloatingActionButton
        className="add-vehicle-fab"
        horizontal="end"
        vertical="bottom"
        slot="fixed"
      >
        <IonIcon icon={add} />
      </EvsFloatingActionButton>
    </EvsPage>
  );
}
