import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonAlert } from '@ionic/react';
import { useEffect, useState } from 'react';
import { IonSlots } from '../constants';

type ModalHeaderProps = {
  errorMessage?: string;
  title: string;
  actionOptions?: {
    primaryText?: string;
    secondaryText?: string;
    disablePrimary?: boolean;
    disableSecondary?: boolean;
  };
  onSecondaryClick?: VoidFunction;
  onPrimaryClick?: VoidFunction;
};

export default function ModalHeader({ title, errorMessage, ...props }: ModalHeaderProps) {
  const {
    primaryText = 'Save',
    secondaryText = 'Cancel',
    disablePrimary = false,
    disableSecondary = false
  } = props.actionOptions ?? {};
  const [showError, setShowError] = useState(!!errorMessage);

  useEffect(() => {
    setShowError(!!errorMessage);
  }, [errorMessage]);

  return (
    <IonHeader>
      <IonToolbar>
        {props.onSecondaryClick && (
          <IonButtons slot={IonSlots.Secondary}>
            <IonButton disabled={disableSecondary} onClick={props.onSecondaryClick}>
              {secondaryText}
            </IonButton>
          </IonButtons>
        )}
        <IonTitle>{title}</IonTitle>
        {props.onPrimaryClick && (
          <IonButtons slot={IonSlots.Primary}>
            <IonButton onClick={props.onPrimaryClick} disabled={disablePrimary}>
              {primaryText}
            </IonButton>
          </IonButtons>
        )}
        <IonAlert
          isOpen={showError}
          header="Error"
          message={errorMessage || 'An error occurred'}
          buttons={['OK']}
          onDidDismiss={() => {
            setShowError(false);
          }}
        ></IonAlert>
      </IonToolbar>
    </IonHeader>
  );
}
