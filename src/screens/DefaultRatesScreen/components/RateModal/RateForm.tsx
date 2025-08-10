import { IonInput, IonItem, IonList, IonNote } from '@ionic/react';
import { RateType } from '../../../../models/rateType';
import { BuiltInRateColors, IonSlots } from '../../../../constants';
import ColorIndicator from '../../../../components/ColorIndicator';

type RateFormProps = {
  rate: RateType;
  onFieldValueChange: (field: keyof RateType, value: string | number) => void;
};

export default function RateForm({ rate, onFieldValueChange }: RateFormProps) {
  const handleColorChange = (value: string) => {
    const colorValue = value.length > 0 && !value.startsWith('#') ? `#{$value}` : value;

    onFieldValueChange('color', colorValue);
  };

  const getColorPlaceholder = () => {
    return rate.defaultColor || BuiltInRateColors.Other;
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
            min="0.01"
            step="0.01"
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
          <ColorIndicator
            color={rate.color || rate.defaultColor || BuiltInRateColors.Home}
            size="medium"
            className="color-indicator--form-end"
            slot={IonSlots.End}
          />
        </IonItem>
      </IonList>
    </form>
  );
}
