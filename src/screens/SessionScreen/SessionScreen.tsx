import {
  IonIcon,
  IonButton,
  useIonViewWillEnter,
  IonActionSheet,
  IonChip,
  IonLabel,
  useIonAlert
} from '@ionic/react';
import { add, filter, close } from 'ionicons/icons';
import { useMemo, useState, useRef } from 'react';
import EvsPage from '../../components/EvsPage';
import EvsSearchbar from '../../components/EvsSearchbar';
import { SessionLog, Session } from '../../models/session';
import SessionList from './components/SessionList/SessionList';
import SessionModal from './components/SessionModal/SessionModal';
import { useSessions } from './useSessions';
import { toSessionLogItem } from './helpers';
import { useAppSelector } from '../../redux/hooks';
import { SessionFormState } from './session-types';
import { validateSession, isValidSession } from './validator';

export default function SessionScreen() {
  const pageRef = useRef<HTMLElement>(null);
  const [showAlert] = useIonAlert();
  const { sessions, loadSessions, addSession, updateSession, getSession } = useSessions();
  const vehicles = useAppSelector((s) => s.vehicles);
  const rateTypes = useAppSelector((s) => s.rateType.rateTypes);
  const lastUsedRateTypeId = useAppSelector((s) => s.lastUsed.rateTypeId);
  const lastUsedVehicleId = useAppSelector((s) => s.lastUsed.vehicleId);
  const defaultVehicleId = useAppSelector((s) => s.defaultVehicle.vehicleId);
  const selectedVehicleId = lastUsedVehicleId || defaultVehicleId;

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [editingSession, setEditingSession] = useState<Session>(null);

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
    setShowModal(true);
    setIsNew(true);
    setEditingSession(null);
  };

  const handleSessionSelection = async (sessionLog: SessionLog) => {
    const session = await getSession(sessionLog.id);
    if (session) {
      setShowModal(true);
      setIsNew(false);
      setEditingSession(session);
    }
  };

  const handleSaveClick = async (sessionForm: SessionFormState): Promise<boolean> => {
    const validationError = validateSession(sessionForm);

    if (validationError) {
      await showAlert(validationError, [{ text: 'OK', role: 'cancel' }]);
      return false;
    }

    if (!isValidSession(sessionForm)) {
      await showAlert('Invalid session data', [{ text: 'OK', role: 'cancel' }]);
      return false;
    }

    const errorMessage = isNew ? await addSession(sessionForm) : await updateSession(sessionForm);

    if (errorMessage) {
      await showAlert(errorMessage, [{ text: 'OK', role: 'cancel' }]);
      return false;
    }

    return true;
  };

  const handleModalDismiss = () => {
    setShowModal(false);
    setEditingSession(null);
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
    // Only show filter button when there are multiple vehicles and sessions to filter
    ...(vehicles.length > 1 && sessions.length > 0
      ? [
          {
            key: 'filter',
            slot: 'start',
            button: (
              <IonButton fill="clear" onClick={handleFilterClick}>
                <IonIcon icon={filter} />
              </IonButton>
            )
          }
        ]
      : []),
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

  // Create search toolbar content - only show when there are sessions to search
  const searchToolbarContent =
    sessions.length > 0 ? (
      <EvsSearchbar
        value={searchTerm}
        placeholder="Search sessions..."
        onInput={handleSearchInput}
        onClear={clearSearch}
      />
    ) : undefined;

  return (
    <EvsPage
      ref={pageRef}
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

      <SessionList 
        sessions={filteredSessionLogs} 
        totalSessionCount={sessionLogs.length}
        isFiltered={hasActiveFilters}
        onSelection={handleSessionSelection} 
      />

      <IonActionSheet
        isOpen={showFilterSheet}
        onDidDismiss={() => setShowFilterSheet(false)}
        header="Filter by Vehicle"
        buttons={filterButtons}
      />

      {showModal && (
        <SessionModal
          isNew={isNew}
          presentingElement={pageRef.current}
          session={editingSession}
          vehicles={vehicles}
          rates={rateTypes}
          selectedVehicleId={selectedVehicleId}
          selectedRateTypeId={lastUsedRateTypeId}
          onSave={handleSaveClick}
          onDidDismiss={handleModalDismiss}
        />
      )}
    </EvsPage>
  );
}
