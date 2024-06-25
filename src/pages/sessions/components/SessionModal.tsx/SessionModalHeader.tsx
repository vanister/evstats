import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonAlert
} from '@ionic/react';
import { IonSlots } from '../../../../constants';

interface AddEditSessionModalHeaderProps {
  errorMsg?: string;
  title: string;
  onCancelClick: VoidFunction;
  onErrorMsgDismiss: VoidFunction;
  onSaveClick: VoidFunction;
}

export default function AddEditSessionModalHeader(
  props: AddEditSessionModalHeaderProps
) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot={IonSlots.start}>
          <IonButton onClick={props.onCancelClick}>Cancel</IonButton>
        </IonButtons>
        <IonTitle>{props.title}</IonTitle>
        <IonButtons slot={IonSlots.end}>
          <IonButton onClick={props.onSaveClick}>Save</IonButton>
          <IonAlert
            isOpen={!!props.errorMsg}
            header="Error"
            subHeader="Please fix the following error(s)"
            message={props.errorMsg}
            buttons={['OK']}
            onDidDismiss={props.onErrorMsgDismiss}
          ></IonAlert>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
