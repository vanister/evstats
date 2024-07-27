import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonAlert } from '@ionic/react';
import { IonSlots } from '../../../../constants';
import { CommonSessionModalSectionProps } from '../../session-types';

export type HeaderProps = CommonSessionModalSectionProps & {
  title: string;
  onCancelClick: VoidFunction;
  onSaveClick: VoidFunction;
};

export default function Header(props: HeaderProps) {
  const { state, setState } = props;

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
            isOpen={!!state.errorMsg}
            header="Error"
            message={state.errorMsg || 'An error occurred'}
            buttons={['OK']}
            onDidDismiss={() => {
              setState((s) => {
                s.errorMsg = null;
              });
            }}
          ></IonAlert>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
