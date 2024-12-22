import { IonContent, IonModal } from '@ionic/react';
import { useEffect, useRef } from 'react';
import { ModalRolesOld } from '../../../../constants';
import { useImmerState } from '../../../../hooks/useImmerState';
import { Session } from '../../../../models/session';
import { validateSession } from '../../validator';
import RequiredFieldSection from './RequiredFieldSection';
import VehicleSection from './VehicleSection';
import RateSection from './RateSection';
import { SessionModalState } from '../../session-types';
import ModalHeader from './ModalHeader';
import { today } from '../../../../utilities/dateUtility';
import { useServices } from '../../../../providers/ServiceProvider';
import EvsProgressLoader from '../../../../components/EvsProgressLoader';

type SessionModalProps = {
  allowCloseGesture?: boolean;
  isNew?: boolean;
  presentingElement?: HTMLElement;
  session?: Session | null;
  triggerId?: string;
  onCancel?: VoidFunction;
  onSave: (session: Session) => Promise<void>;
  onDidDismiss?: VoidFunction;
};

const INITIAL_FORM_STATE: SessionModalState = {
  loading: true,
  rateTypes: [],
  vehicles: [],
  session: {
    date: today(),
    rateTypeId: 1,
    vehicleId: 1
  }
};

export default function SessionModal({ isNew, session, ...props }: SessionModalProps) {
  const rateService = useServices('rateService');
  const vehicleService = useServices('vehicleService');
  const [state, setState] = useImmerState<SessionModalState>(INITIAL_FORM_STATE);
  const modal = useRef<HTMLIonModalElement>(null);
  const loaded = !state.loading && (isNew ? true : !!session);

  useEffect(() => {
    const loadVehiclesAndRates = async () => {
      const rateTypes = await rateService.list();
      const vehicles = await vehicleService.list();

      setState((s) => {
        s.rateTypes = rateTypes;
        s.vehicles = vehicles;
        s.loading = false;
      });
    };

    loadVehiclesAndRates();
  }, []);

  useEffect(() => {
    setState((s) => {
      if (!isNew) {
        s.session = session;
        return;
      }
    });
  }, [session]);

  const modalCanDismiss = async (_: unknown, role: string | undefined) => {
    if (props.allowCloseGesture) {
      return true;
    }

    return role !== ModalRolesOld.gesture;
  };

  const handleDidDismiss = () => {
    props.onDidDismiss?.();
  };

  const handleCancelClick = () => {
    props.onCancel?.();
    modal.current?.dismiss();
  };

  const handleSaveClick = async () => {
    const errorMsg = validateSession(state.session);

    setState((s) => {
      s.errorMsg = errorMsg;
    });

    if (errorMsg) {
      // don't raise save if there are errors
      return;
    }

    await props.onSave(state.session as Session);
    await modal.current?.dismiss();
  };

  return (
    <IonModal
      isOpen
      ref={modal}
      className="session-modal"
      canDismiss={modalCanDismiss}
      presentingElement={props.presentingElement}
      onDidDismiss={handleDidDismiss}
    >
      <ModalHeader
        title={isNew ? 'New Session' : 'Edit Session'}
        errorMessage={state.errorMsg}
        disableAction={!loaded}
        onCancelClick={handleCancelClick}
        onSaveClick={handleSaveClick}
      ></ModalHeader>
      <IonContent color="light">
        <EvsProgressLoader hide={loaded} type="indeterminate" />
        {/* todo - add form and check validity */}
        <RequiredFieldSection state={state} setState={setState}></RequiredFieldSection>
        <VehicleSection state={state} setState={setState}></VehicleSection>
        <RateSection state={state} setState={setState}></RateSection>
      </IonContent>
    </IonModal>
  );
}
