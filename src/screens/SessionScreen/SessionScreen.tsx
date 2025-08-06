import { IonIcon, useIonAlert } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useMemo, useRef } from 'react';
import EvsFloatingActionButton from '../../components/EvsFloatingActionButton';
import EvsPage from '../../components/EvsPage';
import { SessionLog } from '../../models/session';
import SessionList from './components/SessionList/SessionList';
import SessionModal from './components/SessionModal/SessionModal';
import { useSessions } from './useSessions';
import { useImmerState } from '../../hooks/useImmerState';
import { SessionState } from './session-types';
import { validateSession, isValidSession } from './validator';

// Form state type - use null instead of optional for required fields
type SessionFormState = {
  id?: number;
  date: string;
  kWh: number | null;
  rateTypeId: number | null;
  rateOverride?: number;
  vehicleId: number | null;
};
import { toSessionLogItem } from './helpers';
import { useAppSelector } from '../../redux/hooks';
import { logToDevServer } from '../../logger';

const INITIAL_STATE: SessionState = {
  showModal: false,
  isNew: false,
  editingSession: null
};

export default function SessionScreen() {
  const presentingElement = useRef<HTMLElement>();
  const [showAlert] = useIonAlert();
  const {
    lastUsedRateTypeId,
    selectedVehicleId,
    sessions,
    addSession,
    updateSession,
    operationLoading
  } = useSessions();
  const vehicles = useAppSelector((s) => s.vehicles);
  const rateTypes = useAppSelector((s) => s.rateType.rateTypes);

  const [localState, setLocalState] = useImmerState<SessionState>(INITIAL_STATE);
  const sessionLogs = useMemo(
    () => sessions.map((s) => toSessionLogItem(s, vehicles, rateTypes)),
    [sessions, vehicles, rateTypes]
  );

  const handleAddSessionFabClick = () => {
    setLocalState((s) => {
      s.showModal = true;
      s.isNew = true;
    });
  };

  const handleSaveSession = async (sessionFormState: SessionFormState) => {
    const validationError = validateSession(sessionFormState);

    if (validationError) {
      await showAlert(validationError);
      return false;
    }

    // Type guard to ensure we have a valid session before proceeding
    if (!isValidSession(sessionFormState)) {
      await showAlert('Invalid session data');
      return false;
    }

    const errorMessage = localState.isNew
      ? await addSession(sessionFormState)
      : await updateSession(sessionFormState);

    if (errorMessage) {
      await showAlert(errorMessage);

      return false;
    }

    return true;
  };

  const handleSessionModalDismiss = () => {
    setLocalState((s) => {
      s.showModal = false;
      s.isNew = false;
      s.editingSession = null;
    });
  };

  const handleSessionSelection = async (sessionLog: SessionLog) => {
    const editingSession = sessions.find((s) => s.id === sessionLog.id);

    setLocalState((s) => {
      s.isNew = false;
      s.showModal = true;
      s.editingSession = editingSession;
    });
  };

  return (
    <EvsPage
      ref={presentingElement}
      className="sessions"
      title="Sessions"
      fixedSlotPlacement="before"
    >
      <EvsFloatingActionButton
        horizontal="end"
        vertical="bottom"
        slot="fixed"
        onClick={handleAddSessionFabClick}
      >
        <IonIcon icon={add} />
      </EvsFloatingActionButton>
      <SessionList sessions={sessionLogs} onSelection={handleSessionSelection} />
      {localState.showModal && (
        <SessionModal
          isNew={localState.isNew}
          loading={operationLoading}
          rates={rateTypes}
          selectedRateTypeId={lastUsedRateTypeId}
          selectedVehicleId={selectedVehicleId}
          session={localState.editingSession}
          vehicles={vehicles}
          presentingElement={presentingElement.current}
          onSave={handleSaveSession}
          onDidDismiss={handleSessionModalDismiss}
        />
      )}
    </EvsPage>
  );
}
