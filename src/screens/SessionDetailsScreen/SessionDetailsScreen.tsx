import { IonButton, IonIcon, useIonAlert } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useIonRouter } from '@ionic/react';
import EvsPage from '../../components/EvsPage';
import { useImmerState } from '../../hooks/useImmerState';
import { today } from '../../utilities/dateUtility';
import { SessionFormState } from '../SessionScreen/session-types';
import { validateSession, isValidSession } from '../SessionScreen/validator';
import { useSessions } from '../SessionScreen/useSessions';
import { useAppSelector } from '../../redux/hooks';
import { logToDevServer } from '../../logger';
import SessionForm from '../SessionScreen/components/SessionForm';

// Form initial state - use null for unset values
const NEW_SESSION: SessionFormState = {
  date: today(),
  kWh: null,
  rateTypeId: null,
  vehicleId: null
};

type SessionDetailsParams = {
  id: string;
};

export default function SessionDetailsScreen() {
  const { id } = useParams<SessionDetailsParams>();
  const router = useIonRouter();
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

  const isNew = id === 'new';
  const existingSession = isNew ? null : sessions.find((s) => s.id === parseInt(id));

  // Debug logging
  logToDevServer(`SessionDetailsScreen - ID: ${id}, isNew: ${isNew}, sessions.length: ${sessions.length}, existingSession: ${existingSession ? 'found' : 'not found'}`);

  const [session, setSession] = useImmerState<SessionFormState>({
    ...NEW_SESSION,
    rateTypeId: lastUsedRateTypeId ?? null,
    vehicleId: selectedVehicleId ?? (vehicles.length > 0 ? vehicles[0].id : null),
    ...(existingSession ?? {})
  });

  // Redirect if session not found and not creating new (but only after sessions have loaded)
  useEffect(() => {
    if (!isNew && sessions.length > 0 && !existingSession) {
      logToDevServer(`SessionDetailsScreen - Session not found, redirecting back to list. ID: ${id}`);
      router.push('/sessions', 'root', 'replace');
    }
  }, [isNew, existingSession, sessions.length, router, id]);

  const handleSave = async () => {
    const validationError = validateSession(session);

    if (validationError) {
      await showAlert(validationError);
      return;
    }

    // Type guard to ensure we have a valid session before proceeding
    if (!isValidSession(session)) {
      await showAlert('Invalid session data');
      return;
    }

    const errorMessage = isNew
      ? await addSession(session)
      : await updateSession(session);

    if (errorMessage) {
      await showAlert(errorMessage);
      return;
    }

    // Navigate back to sessions list on success
    router.goBack();
  };


  // Create header save button
  const saveButton = (
    <IonButton fill="clear" onClick={handleSave} disabled={operationLoading}>
      <IonIcon icon={checkmark} />
    </IonButton>
  );

  const headerButtons = [
    {
      key: 'save',
      button: saveButton,
      slot: 'end'
    }
  ];

  return (
    <EvsPage
      className="session-details"
      title={isNew ? 'New Session' : 'Edit Session'}
      headerButtons={headerButtons}
    >
      <SessionForm
        session={session}
        vehicles={vehicles}
        rateTypes={rateTypes}
        onSessionFieldChange={(field, value) => {
          setSession((draft) => {
            (draft as any)[field] = value;
          });
        }}
      />
    </EvsPage>
  );
}