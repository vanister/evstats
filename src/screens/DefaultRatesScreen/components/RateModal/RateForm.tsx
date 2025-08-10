import { IonInput, IonItem, IonList, IonNote } from '@ionic/react';
import { RateType } from '../../../../models/rateType';
import { BuiltInRateColors } from '../../../../constants';

type RateFormProps = {
  rate: RateType;
  isNew?: boolean;
  onFieldValueChange: (field: keyof RateType, value: string | number) => void;
};

export default function RateForm({ rate, isNew, onFieldValueChange }: RateFormProps) {
  const handleColorChange = (value: string) => {
    let colorValue = value;
    if (!colorValue.startsWith('#') && colorValue.length > 0) {
      colorValue = '#' + colorValue;
    }
    onFieldValueChange('color', colorValue);
  };

  const getColorPlaceholder = () => {
    if (isNew) {
      // Cycle through built-in colors based on rate name or use Home as default
      const colorKeys = Object.keys(BuiltInRateColors) as Array<keyof typeof BuiltInRateColors>;
      const matchingKey = colorKeys.find((key) => key.toLowerCase() === rate.name.toLowerCase());
      return matchingKey ? BuiltInRateColors[matchingKey] : BuiltInRateColors.Home;
    }
    return rate.color || BuiltInRateColors.Other;
  };

  return (
    <form>
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
            placeholder={getColorPlaceholder()}
            maxlength={7}
            value={rate.color}
            onIonInput={(e) => handleColorChange(e.detail.value)}
          />
          <div
            slot="end"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: rate.color || BuiltInRateColors.Home,
              border: '2px solid #ccc',
              marginLeft: '8px'
            }}
          />
        </IonItem>
      </IonList>
    </form>
  );
}
