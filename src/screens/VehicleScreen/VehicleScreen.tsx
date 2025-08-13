import { IonIcon, IonButton, useIonAlert, useIonViewWillEnter, IonAlert } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useRef, useState, useMemo } from 'react';
import EvsPage from '../../components/EvsPage';
import EvsSearchbar from '../../components/EvsSearchbar';
import { logToDevServer } from '../../logger';
import { Vehicle } from '../../models/vehicle';
import VehicleList from './components/VehilceList/VehicleList';
import VehicleModal from './components/VehicleModal/VehicleModal';
import { useVehicles } from './useVehicles';
import { getDeleteConfirmationMessage } from './helpers';

export default function VehicleScreen() {
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const pageRef = useRef<HTMLElement>(null);
  const [showAlert] = useIonAlert();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle>(null);

  const {
    vehicles,
    vehicleStats,
    loadingStats,
    defaultVehicleId,
    loadVehicleStats,
    addNewVehicle,
    editVehicle,
    removeVehicle,
    setDefaultVehicle
  } = useVehicles();

  useIonViewWillEnter(() => {
    loadVehicleStats();
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
    const message = getDeleteConfirmationMessage(vehicle, vehicleStats);

    setDeleteMessage(message);
    setShowDeleteAlert(true);
    setVehicleToDelete(vehicle);
  };

  const handleDeleteConfirmed = async (vehicle: Vehicle) => {
    setShowDeleteAlert(false);

    const error = await removeVehicle(vehicle);

    setVehicleToDelete(null);
    setDeleteMessage('');

    if (error) {
      logToDevServer(`Failed to delete vehicle: ${error}`, 'error');

      await showAlert({
        header: 'Error',
        message: `Failed to delete vehicle: ${error}`,
        buttons: [{ text: 'OK', role: 'cancel' }]
      });
    }
  };

  const handleSetDefaultClick = async (vehicle: Vehicle) => {
    try {
      await setDefaultVehicle(vehicle);
    } catch (error) {
      logToDevServer(`Failed to set default vehicle: ${error.message}`, 'error', error.stack);
      await showAlert('Failed to set default vehicle. Please try again.', [{ text: 'OK', role: 'cancel' }]);
    }
  };

  const handleSearchInput = (event: CustomEvent) => {
    setSearchTerm(event.detail.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Filter and sort vehicles
  const sortedAndFilteredVehicles = useMemo(() => {
    let filtered = vehicles;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = vehicles.filter((vehicle) => {
        const searchableText = `${vehicle.make} ${vehicle.model} ${vehicle.nickname || ''} ${vehicle.year || ''} ${
          vehicle.batterySize || ''
        }kWh`.toLowerCase();

        return searchableText.includes(search);
      });
    }

    return filtered;
  }, [vehicles, searchTerm, defaultVehicleId]);

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

  // Create search toolbar content - only show when there are vehicles to search
  const searchToolbarContent =
    vehicles.length > 0 ? (
      <EvsSearchbar
        value={searchTerm}
        placeholder="Search vehicles..."
        onInput={handleSearchInput}
        onClear={clearSearch}
      />
    ) : null;

  return (
    <EvsPage
      ref={pageRef}
      className="vehicle-screen"
      title="Vehicles"
      fixedSlotPlacement="before"
      hideBack
      headerButtons={headerButtons}
      searchContent={searchToolbarContent}
    >
      <VehicleList
        vehicles={sortedAndFilteredVehicles}
        vehicleStats={vehicleStats}
        loading={loadingStats}
        defaultVehicleId={defaultVehicleId}
        onDeleteClick={handleDeleteClick}
        onEditClick={handleEditClick}
        onSetDefaultClick={handleSetDefaultClick}
      />

      <IonAlert
        isOpen={showDeleteAlert}
        header="Confirm Delete"
        message={deleteMessage}
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Delete', role: 'destructive', handler: () => handleDeleteConfirmed(vehicleToDelete) }
        ]}
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
