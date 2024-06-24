import { IonFab, IonFabButton } from '@ionic/react';

interface EvsFloatingAddButtonProps {
  id?: string;
  children: React.ReactNode;
  horizontal?: 'start' | 'end' | 'center';
  vertical?: 'top' | 'bottom' | 'center';
  slot?: string;
  onClick?: VoidFunction;
}

export default function EvsFloatingActionButton({
  id,
  children,
  horizontal,
  slot,
  vertical,
  onClick
}: EvsFloatingAddButtonProps) {
  return (
    <IonFab horizontal={horizontal} vertical={vertical} slot={slot}>
      <IonFabButton id={id} onClick={onClick}>
        {children}
      </IonFabButton>
    </IonFab>
  );
}
