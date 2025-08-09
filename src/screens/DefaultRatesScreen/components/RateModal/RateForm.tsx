import { IonInput, IonItem, IonList, IonNote } from '@ionic/react';
import { forwardRef, MutableRefObject } from 'react';
import { RateType } from '../../../../models/rateType';

type RateFormProps = {
  rate: RateType;
  onFieldValueChange: (field: keyof RateType, value: string | number) => void;
};

function RateForm(
  { rate, onFieldValueChange }: RateFormProps,
  ref: MutableRefObject<HTMLFormElement>
) {
  const handleColorChange = (value: string) => {
    // Ensure value starts with # and is valid hex format
    let colorValue = value;
    if (!colorValue.startsWith('#') && colorValue.length > 0) {
      colorValue = '#' + colorValue;
    }
    onFieldValueChange('color', colorValue);
  };

  return (
    <form ref={ref}>
      <IonList inset>
        <IonItem>
          <IonInput
            type="text"
            label="Rate Name"
            labelPlacement="fixed"
            placeholder="required"
            maxlength={50}
            value={rate.name}
            required
            onIonInput={(e) => onFieldValueChange('name', e.detail.value)}
          />
        </IonItem>
        <IonItem>
          <IonInput
            type="number"
            label="Amount"
            labelPlacement="fixed"
            placeholder="required"
            min="0.001"
            step="0.001"
            value={rate.amount === 0 ? '' : rate.amount?.toString()}
            required
            onIonInput={(e) => onFieldValueChange('amount', e.detail.value ? +e.detail.value : 0)}
          />
        </IonItem>
      </IonList>
      <IonNote color="medium" className="ion-margin-horizontal">
        Amount should be in dollars per kWh (e.g., 0.13 for 13 cents)
      </IonNote>

      <IonList inset>
        <IonItem>
          <IonInput
            type="text"
            label="Color"
            labelPlacement="fixed"
            placeholder="#004D80"
            maxlength={7}
            value={rate.color}
            onIonInput={(e) => handleColorChange(e.detail.value)}
          />
          <div slot="end" style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: rate.color || '#004D80',
            border: '2px solid #ccc',
            marginLeft: '8px'
          }} />
        </IonItem>
      </IonList>
      <IonNote color="medium" className="ion-margin-horizontal">
        Color should be in hex format (e.g., #004D80, #F27200)
      </IonNote>
    </form>
  );
}

export default forwardRef(RateForm);