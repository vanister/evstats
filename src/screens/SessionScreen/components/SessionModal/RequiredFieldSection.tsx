import { IonList, IonItem, IonInput } from '@ionic/react';
import { SessionModalStateProps } from '../../session-types';

type RequiredFieldSectionProps = SessionModalStateProps;

export default function RequiredFieldSection({ state, setState }: RequiredFieldSectionProps) {
  return (
    <IonList inset>
      <IonItem>
        <IonInput
          label="kWh *"
          labelPlacement="fixed"
          placeholder="Added during charge session"
          min={0}
          max={999}
          maxlength={3}
          type="number"
          value={state.session.kWh}
          onIonInput={(e) =>
            setState((s) => {
              s.session.kWh = +e.detail.value;
            })
          }
        />
      </IonItem>
      <IonItem>
        <IonInput
          label="Date *"
          labelPlacement="fixed"
          placeholder="Session date"
          type="date"
          value={state.session.date}
          onIonChange={(e) =>
            setState((s) => {
              s.session.date = e.detail.value!;
            })
          }
        />
      </IonItem>
    </IonList>
  );
}
