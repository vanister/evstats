import './VehicleScreen.scss';

import { IonContent, IonModal, useIonAlert } from '@ionic/react';
import { Vehicle } from '../../models/vehicle';
import VehicleCard from './components/VehicleCard';
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useServices } from '../../providers/ServiceProvider';
import { deleteVehicle } from '../../redux/vehicleSlice';
import ModalHeader from '../SessionScreen/components/SessionModal/ModalHeader';

// type VehicleScreenState = {
//   loading: boolean;
//   openModal: boolean;
//   isNew?: boolean;
//   editingVehicle?: Vehicle;
// };

// const INITIAL_STATE: VehicleScreenState = {
//   loading: true,
//   openModal: false
// };

type VehicleScreenProps = {
  onDismiss: () => void;
};

export default function VehicleScreen(props: VehicleScreenProps) {
  const [showAlert] = useIonAlert();
  // const presentingElement = useRef<HTMLElement>();
  const modal = useRef<HTMLIonModalElement>();
  const vehicleService = useServices('vehicleService');
  const dispatch = useAppDispatch();
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);
  // const selectedVehicleId = useAppSelector((state) => state.vehicles?.selectedVehicle?.id);
  // const [state, setState] = useImmerState<VehicleScreenState>(INITIAL_STATE);

  // const handleAddClick = () => {
  //   setState((s) => {
  //     s.isNew = true;
  //     s.openModal = true;
  //   });
  // };

  // const handleModalDismiss = () => {
  //   setState((s) => {
  //     s.openModal = false;
  //     s.editingVehicle = undefined;
  //     s.isNew = false;
  //   });
  // };

  // const handleSaveClick = async (vehicle: Vehicle) => {
  //   if (!state.isNew) {
  //     await vehicleService.update(vehicle);
  //     dispatch(updateVehicle(vehicle));

  //     return;
  //   }

  //   const newVehicle = await vehicleService.add(vehicle);
  //   dispatch(addVehicle(newVehicle));

  //   return;
  // };

  // const handleVehicleClick = (vehicle: Vehicle) => {
  //   setState((s) => {
  //     s.editingVehicle = vehicle;
  //     s.isNew = false;
  //     s.openModal = true;
  //   });
  // };

  const handleDeleteClick = async (vehicle: Vehicle) => {
    await showAlert({
      header: 'Delete Vehicle',
      message: `Are you sure you want to delete ${vehicle.nickname ?? vehicle.model}?`,
      buttons: [
        'Cancel',
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await vehicleService.remove(vehicle.id);
            dispatch(deleteVehicle(vehicle));
          }
        }
      ]
    });
  };

  const handleCloseClick = async () => {
    modal.current.dismiss();
  };

  return (
    <IonModal ref={modal} className="vehicle-page" isOpen onDidDismiss={props.onDismiss}>
      <ModalHeader
        title="Vehicles"
        actionOptions={{
          primaryText: 'Add',
          secondaryText: 'Close',
          disableSecondary: vehicles.length === 0
        }}
        onSecondaryClick={handleCloseClick}
      />
      <IonContent color="light">
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
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </IonContent>
    </IonModal>
  );

  // return (
  //   <EvsPage
  //     className="vehicle-page"
  //     ref={presentingElement}
  //     title="Vehicles"
  //     fixedSlotPlacement="before"
  //     color="light"
  //   >
  //     {/* <VehicleEmptyState /> */}
  //     {vehicles.length === 0 && (
  //       <div className="no-vehicles-container">
  //         <h5>Click the + button to add a vehicle</h5>
  //       </div>
  //     )}

  //     {/* <VehicleList */}
  //     {vehicles.map((vehicle) => (
  //       <VehicleCard
  //         key={vehicle.id}
  //         selected={selectedVehicleId === vehicle.id}
  //         vehicle={vehicle}
  //         onSelectClick={handleSelectClick}
  //         onEditClick={handleVehicleClick}
  //         onDeleteClick={handleDeleteClick}
  //       />
  //     ))}

  //     {state.openModal && (
  //       <VehicleModal
  //         isNew={state.isNew}
  //         vehicle={state.editingVehicle}
  //         allowCloseGesture={!state.isNew}
  //         presentingElement={presentingElement.current}
  //         onDidDismiss={handleModalDismiss}
  //         onSave={handleSaveClick}
  //       />
  //     )}

  //     <EvsFloatingActionButton
  //       className="add-vehicle-fab"
  //       horizontal="end"
  //       vertical="bottom"
  //       slot="fixed"
  //       onClick={handleAddClick}
  //     >
  //       <IonIcon icon={add} />
  //     </EvsFloatingActionButton>
  //   </EvsPage>
  // );
}
