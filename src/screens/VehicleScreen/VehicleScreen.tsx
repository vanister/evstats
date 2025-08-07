import { IonIcon, IonButton, useIonAlert, useIonViewWillEnter } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useRef, useState } from 'react';
import EvsPage from '../../components/EvsPage';
import { logToDevServer } from '../../logger';
import { Vehicle } from '../../models/vehicle';
import VehicleList from './components/VehilceList/VehicleList';
import VehicleModal from './components/VehicleModal/VehicleModal';
import { useVehicles } from './useVehicles';

export default function VehicleScreen() {
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle>(null);
  const pageRef = useRef<HTMLElement>(null);
  const [showAlert] = useIonAlert();
  const {
    vehicles,
    vehicleStats,
    loadingStats,
    defaultVehicleId,
    refreshStats,
    addNewVehicle,
    editVehicle,
    removeVehicle,
    setDefaultVehicle
  } = useVehicles();

  useIonViewWillEnter(() => {
    refreshStats();
  });

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

    await showAlert(errorMessage, [{ text: 'OK', role: 'cancel' }]);

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
    const stats = vehicleStats.find((s) => s.vehicleId === vehicle.id);
    const sessionCount = stats?.totalSessions ?? 0;
    const vehicleName = vehicle.nickname ?? vehicle.model;

    let message = `Are you sure you want to delete ${vehicleName}?`;
    if (sessionCount > 0) {
      message += ` This will also delete ${sessionCount} charging session${
        sessionCount === 1 ? '' : 's'
      } associated with this vehicle.`;
    }

    showAlert(message, [
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

  const handleSetDefaultClick = async (vehicle: Vehicle) => {
    try {
      await setDefaultVehicle(vehicle);
    } catch (error) {
      logToDevServer(`Failed to set default vehicle: ${error.message}`, 'error', error.stack);
      await showAlert('Failed to set default vehicle. Please try again.', [
        { text: 'OK', role: 'cancel' }
      ]);
    }
  };

  // Create header add button
  const addButton = (
    <IonButton fill="clear" onClick={handleAddClick}>
      <IonIcon icon={add} />
    </IonButton>
  );

  const headerButtons = [
    {
      key: 'add',
      button: addButton,
      slot: 'end'
    }
  ];

  return (
    <EvsPage
      ref={pageRef}
      className="vehicle-screen"
      title="Vehicles"
      fixedSlotPlacement="before"
      hideBack
      headerButtons={headerButtons}
    >
      <VehicleList
        vehicles={vehicles}
        vehicleStats={vehicleStats}
        loading={loadingStats}
        defaultVehicleId={defaultVehicleId}
        onDeleteClick={handleDeleteClick}
        onEditClick={handleEditClick}
        onSetDefaultClick={handleSetDefaultClick}
      />

      {showModal && (
        <VehicleModal
          isNew={isNew}
          presentingElement={pageRef.current}
          vehicle={editingVehicle}
          onDidDismiss={handleModalDismiss}
          onSave={handleSaveClick}
        />
      )}
    </EvsPage>
  );
}
