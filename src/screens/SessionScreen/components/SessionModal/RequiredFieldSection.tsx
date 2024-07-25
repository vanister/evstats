import { IonList, IonItem, IonInput } from '@ionic/react';
import { CommonSessionModalSectionProps } from '../../session-types';

export type RequiredFieldSectionProps = CommonSessionModalSectionProps;

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
          value={state.session.kWhAdded}
          onIonChange={(e) =>
            setState((s) => {
              s.session.kWhAdded = +e.detail.value! || undefined;
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
