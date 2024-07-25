import { IonList, IonItem, IonSelectOption, IonInput, IonNote } from '@ionic/react';
import EvsSelect from '../../../../components/EvsSelect';
import { CommonSessionModalSectionProps } from '../../session-types';
import { useRootSelector } from '../../../../hooks/useRootSelector';

export type RateSectionProps = CommonSessionModalSectionProps;

export default function RateSection({ state, setState }: RateSectionProps) {
  const rateTypes = useRootSelector((s) => s.rateTypes);

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
