import { IonList, IonItem, IonSelectOption, IonInput, IonNote } from '@ionic/react';
import EvsSelect from '../../../../components/EvsSelect';
import { SessionModalStateProps } from '../../session-types';

type RateSectionProps = SessionModalStateProps;

export default function RateSection({ state, setState }: RateSectionProps) {
  return (
    <IonList inset>
      <IonItem>
        <EvsSelect
          label="Rate type"
          labelPlacement="fixed"
          header="Select a Rate Type"
          value={state.session.rateTypeId}
          onSelect={(value) =>
            setState((s) => {
              s.session.rateTypeId = +value;
            })
          }
        >
          {state.rateTypes.map((r) => (
            <IonSelectOption key={r.id} value={r.id}>
              {r.name}
            </IonSelectOption>
          ))}
        </EvsSelect>
      </IonItem>
      <IonItem>
        <IonInput
          label="Rate override"
          labelPlacement="fixed"
          placeholder="0.32"
          type="number"
          min={0}
          max={99}
          maxlength={2}
          value={state.session.rateOverride}
          onIonInput={(e) =>
            setState((s) => {
              s.session.rateOverride = parseFloat(e.detail.value) || null;
            })
          }
        />
      </IonItem>
      <IonNote className="ion-padding">This will override the preset rate type.</IonNote>
    </IonList>
  );
}
