import {
  IonIcon,
  IonButton,
  useIonRouter,
  useIonViewWillEnter,
  IonActionSheet,
  IonChip,
  IonLabel,
  IonSearchbar
} from '@ionic/react';
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
  const [searchTerm, setSearchTerm] = useState('');

  // Load sessions whenever we enter this screen
  useIonViewWillEnter(() => {
    loadSessions();
  });

  const sessionLogs = useMemo(
    () => sessions.map((s) => toSessionLogItem(s, vehicles, rateTypes)),
    [sessions, vehicles, rateTypes]
  );

  // Filter sessions based on selected filters and search term
  const filteredSessionLogs = useMemo(() => {
    let filtered = sessionLogs;

    // Apply vehicle filter
    if (selectedVehicleFilter !== null) {
      filtered = filtered.filter((session) => session.vehicleId === selectedVehicleFilter);
    }

    // Apply search filter
    if (!searchTerm.trim()) {
      return filtered;
    }

    const search = searchTerm.toLowerCase();

    return filtered.filter((session) => {
      const searchableText =
        `${session.vehicleName} ${session.rateType} ${session.date} ${session.kWh}kWh`.toLowerCase();

      return searchableText.includes(search);
    });
  }, [sessionLogs, selectedVehicleFilter, searchTerm]);

  const handleAddSessionClick = () => {
    // Explicitly pass state to indicate this is a new session
    router.push('/sessions/new', 'forward', 'push');
    // Alternative approach using history directly if state is needed
    // history.push('/sessions/new', { isNew: true });
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

  const handleSearchInput = (event: CustomEvent) => {
    setSearchTerm(event.detail.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Get current filter display name
  const currentFilterName = useMemo(() => {
    if (selectedVehicleFilter === null) return null;
    const vehicle = vehicles.find((v) => v.id === selectedVehicleFilter);
    return vehicle?.model || 'Unknown Vehicle';
  }, [selectedVehicleFilter, vehicles]);

  // Check if any filters are active
  const hasActiveFilters = selectedVehicleFilter !== null || searchTerm.trim() !== '';

  const headerButtons = [
    {
      key: 'filter',
      slot: 'start',
      button: (
        <IonButton fill="clear" onClick={handleFilterClick}>
          <IonIcon icon={filter} />
        </IonButton>
      )
    },
    {
      key: 'add',
      slot: 'end',
      button: (
        <IonButton fill="clear" onClick={handleAddSessionClick}>
          <IonIcon icon={add} />
        </IonButton>
      )
    }
  ];

  // Create filter action sheet buttons
  const filterButtons = useMemo(
    () => [
      {
        text: 'All Vehicles',
        handler: () => handleVehicleFilterChange(null)
      },
      ...vehicles.map((vehicle) => ({
        text: vehicle.model,
        handler: () => handleVehicleFilterChange(vehicle.id)
      })),
      {
        text: 'Cancel',
        role: 'cancel'
      }
    ],
    [vehicles]
  );

  // Create search toolbar content
  const searchToolbarContent = (
    <IonSearchbar
      value={searchTerm}
      placeholder="Search sessions..."
      debounce={300}
      onIonInput={handleSearchInput}
      onIonClear={clearSearch}
      showClearButton="focus"
    />
  );

  return (
    <EvsPage
      className="sessions"
      title="Sessions"
      fixedSlotPlacement="before"
      hideBack={true}
      headerButtons={headerButtons}
      searchContent={searchToolbarContent}
    >
      {hasActiveFilters && (
        <div style={{ padding: '8px 16px' }}>
          {currentFilterName && (
            <IonChip color="primary" onClick={clearVehicleFilter}>
              <IonLabel>Vehicle: {currentFilterName}</IonLabel>
              <IonIcon icon={close} />
            </IonChip>
          )}
          {searchTerm.trim() && (
            <IonChip
              color="secondary"
              onClick={clearSearch}
              style={{ marginLeft: currentFilterName ? '8px' : '0' }}
            >
              <IonLabel>Search: &ldquo;{searchTerm}&rdquo;</IonLabel>
              <IonIcon icon={close} />
            </IonChip>
          )}
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
