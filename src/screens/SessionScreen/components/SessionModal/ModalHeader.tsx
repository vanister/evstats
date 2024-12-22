import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonAlert } from '@ionic/react';
import { IonSlotsOld } from '../../../../constants';
import { useEffect, useState } from 'react';

type ModalHeaderProps = {
  /** True, to disable the action button on the right, false otherwise. */
  disableAction?: boolean;
  title: string;
  errorMessage?: string;
  onCancelClick: VoidFunction;
  onSaveClick: VoidFunction;
};

export default function ModalHeader({
  disableAction,
  title,
  errorMessage,
  ...props
}: ModalHeaderProps) {
  const [showError, setShowError] = useState(!!errorMessage);

  useEffect(() => {
    setShowError(!!errorMessage);
  }, [errorMessage]);

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot={IonSlotsOld.start}>
          <IonButton onClick={props.onCancelClick}>Cancel</IonButton>
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot={IonSlotsOld.end}>
          <IonButton onClick={props.onSaveClick} disabled={disableAction}>
            Save
          </IonButton>
          <IonAlert
            isOpen={showError}
            header="Error"
            message={errorMessage || 'An error occurred'}
            buttons={['OK']}
            onDidDismiss={() => {
              setShowError(false);
            }}
          ></IonAlert>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
