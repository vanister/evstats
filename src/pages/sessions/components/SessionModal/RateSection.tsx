import { IonList, IonItem, IonSelectOption, IonInput, IonNote } from '@ionic/react';
import EvsSelect from '../../../../components/EvsSelect';
import { RateType } from '../../../../hooks/useRateTypes';
import { SessionModalState } from './SessionModal';
import { SetImmerState } from '../../../../hooks/useImmerState';

export interface RateSectionProps {
  rateTypes: RateType[];
  state: SessionModalState;
  setState: SetImmerState<SessionModalState>;
}

export default function RateSection({ state, rateTypes, setState }: RateSectionProps) {
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
              s.session.rateTypeId = value;
            })
          }
        >
          {rateTypes.map((r) => (
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
          onIonChange={(e) =>
            setState((s) => {
              s.session.rateOverride = +e.detail.value! || undefined;
            })
          }
        />
      </IonItem>
      <IonNote className="ion-padding">This will override the preset rate type.</IonNote>
    </IonList>
  );
}
