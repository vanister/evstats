import { IonIcon, useIonAlert } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useRef, useState } from 'react';
import EvsFloatingActionButton from '../../../components/EvsFloatingActionButton';
import EvsPage from '../../../components/EvsPage';
import { Vehicle } from '../../../models/vehicle';
import VehicleCard from './VehicleCard/VehicleCard';
import VehicleModal from './VehicleModal/VehicleModal';
import { useVehicles } from '../useVehicles';

export default function VehicleScreen() {
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle>(null);
  const pageRef = useRef<HTMLElement>(null);
  const [showAlert] = useIonAlert();
  const { vehicles, addNewVehicle, editVehicle, removeVehicle } = useVehicles();

  const handleAddClick = () => {
    setShowModal(true);
    setIsNew(true);
    setEditingVehicle(null);
  };

  const handleSaveClick = async (vehicle: Vehicle) => {
    const errorMessage = isNew ? await addNewVehicle(vehicle) : await editVehicle(vehicle);

    if (!errorMessage) {
      return true;
    }

    return false;
  };

  const handleModalDismiss = () => {
    setShowModal(false);
    setEditingVehicle(null);
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setShowModal(true);
    setEditingVehicle(vehicle);
    setIsNew(false);
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    // todo - warn about deleting session entries
    showAlert(`Are you sure you want to delete ${vehicle.nickname ?? vehicle.model}`, [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Delete',
        role: 'destructive',
        handler: async () => {
          await removeVehicle(vehicle);
        }
      }
    ]);
  };

  return (
    <EvsPage
      ref={pageRef}
      className="vehicle-screen"
      title="Vehicles"
      fixedSlotPlacement="before"
      hideBack
    >
      {vehicles.length === 0 && (
        <div className="no-vehicles-container">
          <h5>Click the + button to add a vehicle</h5>
        </div>
      )}

      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ))}

      {showModal && (
        <VehicleModal
          isNew={isNew}
          presentingElement={pageRef.current}
          vehicle={editingVehicle}
          onDidDismiss={handleModalDismiss}
          onSave={handleSaveClick}
        />
      )}

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