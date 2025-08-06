import { forwardRef, MutableRefObject, useEffect, useRef } from 'react';
import { IonInput, IonItem, IonList, IonNote, IonSelectOption } from '@ionic/react';
import EvsSelect from '../../../components/EvsSelect';
import { Vehicle } from '../../../models/vehicle';
import { RateType } from '../../../models/rateType';
import { SessionFormState } from '../session-types';

type SessionFormProps = {
  rateTypes: RateType[];
  session: SessionFormState;
  vehicles: Vehicle[];
  onSessionFieldChange: (field: keyof SessionFormState, value: string | number | undefined) => void;
};

function SessionForm(
  { rateTypes, session, vehicles, onSessionFieldChange }: SessionFormProps,
  ref: MutableRefObject<HTMLFormElement>
) {
  const inputRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    // wait long enough for the modal to appear
    const id = setTimeout(() => {
      inputRef.current?.setFocus();
    }, 500);

    return () => clearTimeout(id);
  }, []);

  return (
    <form ref={ref}>
      <IonList inset>
        <IonItem>
          <IonInput
            ref={inputRef}
            label="kWh"
            labelPlacement="fixed"
            placeholder="required"
            min={0}
            max={999}
            maxlength={3}
            required
            type="number"
            value={session.kWh ?? ''}
            onIonInput={(e) => onSessionFieldChange('kWh', e.detail.value ? +e.detail.value : null)}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Date"
            labelPlacement="fixed"
            placeholder="Session date"
            type="date"
            required
            value={session.date}
            onIonChange={(e) => onSessionFieldChange('date', e.detail.value)}
          />
        </IonItem>
      </IonList>
      <IonList inset>
        <IonItem>
          <EvsSelect
            inset
            label="Vehicle"
            labelPlacement="fixed"
            value={session.vehicleId ?? ''}
            placeholder="required"
            onSelect={(value) => onSessionFieldChange('vehicleId', value ? +value : null)}
          >
            {vehicles.map((v) => (
              <IonSelectOption key={v.id} value={v.id}>
                {v.model}
              </IonSelectOption>
            ))}
          </EvsSelect>
        </IonItem>
      </IonList>
      <IonNote color="medium" className="ion-margin-horizontal">
        A vehicle selection is required
      </IonNote>
      <IonList inset>
        <IonItem>
          <EvsSelect
            label="Rate type"
            labelPlacement="fixed"
            value={session.rateTypeId ?? ''}
            placeholder="required"
            onSelect={(value) => onSessionFieldChange('rateTypeId', value ? +value : null)}
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
            type="number"
            min={0}
            step="0.01"
            value={session.rateOverride ?? ''}
            onIonInput={(e) => onSessionFieldChange('rateOverride', e.detail.value ? +e.detail.value : undefined)}
          />
        </IonItem>
      </IonList>
      <IonNote color="medium" className="ion-margin-horizontal">
        Setting a Rate override will replace the preset rate
      </IonNote>
    </form>
  );
}

export default forwardRef(SessionForm);
