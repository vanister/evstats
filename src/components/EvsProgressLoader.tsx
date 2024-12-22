import { IonProgressBar } from '@ionic/react';

type EvsProgressLoaderProps = {
  hide?: boolean;
  type: 'indeterminate' | 'determinate';
  value?: number;
};

export default function EvsProgressLoader({ hide, type, value }: EvsProgressLoaderProps) {
  if (hide) {
    return null;
  }

  return <IonProgressBar type={type} value={value} />;
}
