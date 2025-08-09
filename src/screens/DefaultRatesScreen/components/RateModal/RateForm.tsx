import { IonInput, IonItem, IonList, IonListHeader, IonNote, IonButton, IonIcon } from '@ionic/react';
import { colorPalette } from 'ionicons/icons';
import { forwardRef, MutableRefObject, useState } from 'react';
import { RateType } from '../../../../models/rateType';
import { ChargeColors } from '../../../../constants';

type RateFormProps = {
  rate: RateType;
  onFieldValueChange: (field: keyof RateType, value: string | number) => void;
};

const AVAILABLE_COLORS = Object.values(ChargeColors);

function RateForm(
  { rate, onFieldValueChange }: RateFormProps,
  ref: MutableRefObject<HTMLFormElement>
) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorSelect = (color: string) => {
    onFieldValueChange('color', color);
    setShowColorPicker(false);
  };

  return (
    <form ref={ref}>
      <IonList inset>
        <IonListHeader>Rate Details</IonListHeader>
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
        <IonItem button onClick={() => setShowColorPicker(!showColorPicker)}>
          <div slot="start" style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: rate.color || ChargeColors.Home,
            border: '2px solid #ccc'
          }} />
          <IonNote>Color</IonNote>
          <IonIcon icon={colorPalette} slot="end" />
        </IonItem>
      </IonList>

      {showColorPicker && (
        <IonList inset>
          <IonListHeader>Choose Color</IonListHeader>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '12px', 
            padding: '16px' 
          }}>
            {AVAILABLE_COLORS.map((color) => (
              <IonButton
                key={color}
                fill="clear"
                style={{
                  '--border-radius': '50%',
                  width: '40px',
                  height: '40px',
                  '--background': color,
                  border: rate.color === color ? '3px solid #000' : '1px solid #ccc'
                }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </IonList>
      )}

      <IonNote color="medium" className="ion-margin-horizontal">
        Amount should be in dollars per kWh (e.g., 0.13 for 13 cents)
      </IonNote>
    </form>
  );
}

export default forwardRef(RateForm);