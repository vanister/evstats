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
import SessionForm from '../SessionScreen/components/SessionForm';

// Form initial state - use null for unset values
const NEW_SESSION: SessionFormState = {
  date: today(),
  kWh: null,
  rateTypeId: null,
  vehicleId: null
};

type SessionDetailsParams = {
  id?: string;
};

type SessionDetailsScreenProps = {
  new?: boolean;
};

export default function SessionDetailsScreen({ new: isNew }: SessionDetailsScreenProps) {
  const { id } = useParams<SessionDetailsParams>();
  const router = useIonRouter();
  const [showAlert] = useIonAlert();
  const {
    lastUsedRateTypeId,
    selectedVehicleId,
    addSession,
    getSession,
    updateSession,
    operationLoading
  } = useSessions();
  const vehicles = useAppSelector((s) => s.vehicles);
  const rateTypes = useAppSelector((s) => s.rateType.rateTypes);

  const [session, setSession] = useImmerState<SessionFormState>({
    ...NEW_SESSION,
    rateTypeId: lastUsedRateTypeId ?? null,
    vehicleId: selectedVehicleId ?? (vehicles.length > 0 ? vehicles[0].id : null)
  });

  // Single effect to handle both new and existing sessions
  useEffect(() => {
    if (isNew) {
      // For new sessions, form is already initialized with defaults
      return;
    }

    if (id) {
      // For existing sessions, load the session data
      const loadSession = async () => {
        try {
          const existingSession = await getSession(parseInt(id));
          if (existingSession) {
            setSession(() => existingSession);
          }
        } catch (error) {
          // Handle error - could redirect to not found page
          console.error('Failed to load session:', error);
        }
      };
      loadSession();
    }
  }, []);

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

    const errorMessage = isNew ? await addSession(session) : await updateSession(session);

    if (errorMessage) {
      await showAlert(errorMessage);
      return;
    }

    // Navigate back on success - sessions will be fresh when we return
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
            draft[field as string] = value;
          });
        }}
      />
    </EvsPage>
  );
}
