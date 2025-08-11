import { IonSearchbar } from '@ionic/react';

type EvsSearchbarProps = {
  value: string;
  placeholder: string;
  onInput: (event: CustomEvent) => void;
  onClear: () => void;
};

export default function EvsSearchbar({ value, placeholder, onInput, onClear }: EvsSearchbarProps) {
  return (
    <IonSearchbar
      value={value}
      placeholder={placeholder}
      debounce={300}
      onIonInput={onInput}
      onIonClear={onClear}
      showClearButton="focus"
    />
  );
}
