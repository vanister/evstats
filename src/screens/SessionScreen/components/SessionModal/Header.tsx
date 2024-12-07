import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonAlert } from '@ionic/react';
import { IonSlotsOld } from '../../../../constants';
import { SessionModalStateProps } from '../../session-types';

type HeaderProps = SessionModalStateProps & {
  title: string;
  onCancelClick: VoidFunction;
  onSaveClick: VoidFunction;
};

export default function Header(props: HeaderProps) {
  const { state, setState } = props;

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot={IonSlotsOld.start}>
          <IonButton onClick={props.onCancelClick}>Cancel</IonButton>
        </IonButtons>
        <IonTitle>{props.title}</IonTitle>
        <IonButtons slot={IonSlotsOld.end}>
          <IonButton onClick={props.onSaveClick} disabled={state.loading}>
            Save
          </IonButton>
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
