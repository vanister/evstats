import { IonIcon, useIonAlert } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useRef, useState } from 'react';
import EvsFloatingActionButton from '../../../components/EvsFloatingActionButton';
import EvsPage from '../../../components/EvsPage';
import { logToConsole } from '../../../logger';
import { Vehicle } from '../../../models/vehicle';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addVehicle, deleteVehicle, updateVehicle } from '../../../redux/vehicleSlice';
import VehicleCard from './VehicleCard/VehicleCard';
import VehicleModal from './VehicleModal/VehicleModal';

export default function VehicleScreen() {
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle>(null);
  const pageRef = useRef<HTMLElement>(null);
  const [showAlert] = useIonAlert();
  const dispatch = useAppDispatch();
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    try {
      dispatch(deleteVehicle(vehicle));
    } catch (error) {
      logToConsole(error);
    }
  };

  const handleAddClick = () => {
    setShowModal(true);
    setIsNew(true);
    setEditingVehicle(null);
  };

  const handleSaveClick = async (vehicle: Vehicle) => {
    try {
      if (isNew) {
        dispatch(addVehicle(vehicle));
        return true;
      }

      dispatch(updateVehicle(vehicle));
      return true;
    } catch (error) {
      logToConsole('error saving vehicle:', error);
      showAlert(error.message);
      return false;
    }
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
    showAlert(`Are you sure you want to delete ${vehicle.nickname ?? vehicle.model}`, [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          handleDeleteVehicle(vehicle);
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
