import { IonIcon, IonButton, useIonRouter, useIonViewWillEnter, IonActionSheet, IonChip, IonLabel } from '@ionic/react';
import { add, filter, close } from 'ionicons/icons';
import { useMemo, useState } from 'react';
import EvsPage from '../../components/EvsPage';
import { SessionLog } from '../../models/session';
import SessionList from './components/SessionList/SessionList';
import { useSessions } from './useSessions';
import { toSessionLogItem } from './helpers';
import { useAppSelector } from '../../redux/hooks';

export default function SessionScreen() {
  const router = useIonRouter();
  const { sessions, loadSessions } = useSessions();
  const vehicles = useAppSelector((s) => s.vehicles);
  const rateTypes = useAppSelector((s) => s.rateType.rateTypes);
  
  // Filter state
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<number | null>(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  
  // Load sessions whenever we enter this screen
  useIonViewWillEnter(() => {
    loadSessions();
  });

  const sessionLogs = useMemo(
    () => sessions.map((s) => toSessionLogItem(s, vehicles, rateTypes)),
    [sessions, vehicles, rateTypes]
  );

  // Filter sessions based on selected filters
  const filteredSessionLogs = useMemo(() => {
    let filtered = sessionLogs;
    
    if (selectedVehicleFilter !== null) {
      filtered = filtered.filter(session => session.vehicleId === selectedVehicleFilter);
    }
    
    return filtered;
  }, [sessionLogs, selectedVehicleFilter]);

  const handleAddSessionClick = () => {
    // Explicitly pass state to indicate this is a new session
    router.push('/sessions/-1', 'forward', 'push');
    // Alternative approach using history directly if state is needed
    // history.push('/sessions/-1', { isNew: true });
  };

  const handleSessionSelection = (sessionLog: SessionLog) => {
    router.push(`/sessions/${sessionLog.id}`);
  };

  const handleFilterClick = () => {
    setShowFilterSheet(true);
  };

  const handleVehicleFilterChange = (vehicleId: number | null) => {
    setSelectedVehicleFilter(vehicleId);
    setShowFilterSheet(false);
  };

  const clearVehicleFilter = () => {
    setSelectedVehicleFilter(null);
  };

  // Get current filter display name
  const currentFilterName = useMemo(() => {
    if (selectedVehicleFilter === null) return null;
    const vehicle = vehicles.find(v => v.id === selectedVehicleFilter);
    return vehicle?.model || 'Unknown Vehicle';
  }, [selectedVehicleFilter, vehicles]);

  // Create header buttons
  const filterButton = (
    <IonButton fill="clear" onClick={handleFilterClick}>
      <IonIcon icon={filter} />
    </IonButton>
  );

  const addButton = (
    <IonButton fill="clear" onClick={handleAddSessionClick}>
      <IonIcon icon={add} />
    </IonButton>
  );

  const headerButtons = [
    {
      key: 'filter',
      button: filterButton,
      slot: 'end'
    },
    {
      key: 'add',
      button: addButton,
      slot: 'end'
    }
  ];

  // Create filter action sheet buttons
  const filterButtons = [
    {
      text: 'All Vehicles',
      handler: () => handleVehicleFilterChange(null)
    },
    ...vehicles.map(vehicle => ({
      text: vehicle.model,
      handler: () => handleVehicleFilterChange(vehicle.id)
    })),
    {
      text: 'Cancel',
      role: 'cancel' as const
    }
  ];

  return (
    <EvsPage
      className="sessions"
      title="Sessions"
      fixedSlotPlacement="before"
      headerButtons={headerButtons}
    >
      {currentFilterName && (
        <div style={{ padding: '8px 16px' }}>
          <IonChip color="primary" onClick={clearVehicleFilter}>
            <IonLabel>Filtered by: {currentFilterName}</IonLabel>
            <IonIcon icon={close} />
          </IonChip>
        </div>
      )}
      
      <SessionList sessions={filteredSessionLogs} onSelection={handleSessionSelection} />
      
      <IonActionSheet
        isOpen={showFilterSheet}
        onDidDismiss={() => setShowFilterSheet(false)}
        header="Filter by Vehicle"
        buttons={filterButtons}
      />
    </EvsPage>
  );
}
