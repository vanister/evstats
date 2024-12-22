import './VehicleScreen.scss';

import { IonIcon, useIonAlert } from '@ionic/react';
import EvsFloatingActionButton from '../../components/EvsFloatingActionButton';
import { add } from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';
import { useEffect, useRef } from 'react';
import { useImmerState } from '../../hooks/useImmerState';
import { Vehicle } from '../../models/vehicle';
import VehicleCard from './components/VehicleCard';
import VehicleModal from './components/VehicleModal/VehicleModal';

type VehicleScreenState = {
  vehicles: Vehicle[];
  loading: boolean;
  openModal: boolean;
  isNew?: boolean;
  editingVehicle?: Vehicle;
};

export default function VehicleScreen() {
  const vehicleService = useServices('vehicleService');
  const [showAlert] = useIonAlert();
  const presentingElement = useRef<HTMLElement>();
  const [state, setState] = useImmerState<VehicleScreenState>({
    vehicles: [],
    loading: true,
    openModal: false
  });

  useEffect(() => {
    const loadVehicles = async () => {
      const vehicles = await vehicleService.list();

      setState((s) => {
        s.vehicles = vehicles;
      });
    };

    loadVehicles();
  }, []);

  const deleteVehicle = async (vehicle: Vehicle) => {
    await vehicleService.remove(vehicle.id);

    setState((s) => {
      const idx = s.vehicles.findIndex((v) => v.id === vehicle.id);
      s.vehicles.splice(idx, 1);
    });
  };

  const handleAddClick = () => {
    setState((s) => {
      s.isNew = true;
      s.openModal = true;
    });
  };

  const handleModalDismiss = () => {
    setState((s) => {
      s.openModal = false;
      s.editingVehicle = undefined;
      s.isNew = false;
    });
  };

  const handleSaveClick = async (vehicle: Vehicle) => {
    if (!state.isNew) {
      await vehicleService.update(vehicle);
      // update the vehicle in the list without making a new request
      setState((s) => {
        const existingIdx = s.vehicles.findIndex((v) => v.id === vehicle.id);
        s.vehicles[existingIdx] = vehicle;
      });

      return;
    }

    const newVehicle = await vehicleService.add(vehicle);

    setState((s) => {
      s.vehicles.push(newVehicle);
    });

    return;
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    setState((s) => {
      s.editingVehicle = vehicle;
      s.isNew = false;
      s.openModal = true;
    });
  };

  const handleDeleteClick = async (vehicle: Vehicle) => {
    await showAlert({
      header: 'Delete Vehicle',
      message: `Are you sure you want to delete ${vehicle.nickname ?? vehicle.model}?`,
      buttons: [
        'Cancel',
        {
          text: 'Delete',
          role: 'destructive',
          handler: deleteVehicle
        }
      ]
    });
  };

  return (
    <EvsPage
      className="vehicle-page"
      ref={presentingElement}
      title="Vehicles"
      fixedSlotPlacement="before"
    >
      {/* <VehicleEmptyState /> */}
      {state.vehicles.length === 0 && (
        <div className="no-vehicles-container">
          <h5>Click the + button to add a vehicle</h5>
        </div>
      )}

      {/* <VehicleList */}
      {state.vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          selected
          vehicle={vehicle}
          onEditClick={handleVehicleClick}
          onDeleteClick={handleDeleteClick}
        />
      ))}

      {state.openModal && (
        <VehicleModal
          isNew={state.isNew}
          vehicle={state.editingVehicle}
          allowCloseGesture={!state.isNew}
          presentingElement={presentingElement.current}
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
