import { IonFab, IonFabButton } from '@ionic/react';
import classNames from 'classnames';
import { PropsWithChildren } from 'react';

type EvsFloatingAddButtonProps = PropsWithChildren<{
  className?: string;
  id?: string;
  horizontal?: 'start' | 'end' | 'center';
  vertical?: 'top' | 'bottom' | 'center';
  slot?: 'fixed' | undefined;
  onClick?: VoidFunction;
}>;

export default function EvsFloatingActionButton({
  id,
  children,
  onClick,
  ...rest
}: EvsFloatingAddButtonProps) {
  return (
    <IonFab {...rest} className={classNames('evs-fab', rest.className)}>
      <IonFabButton id={id} onClick={onClick}>
        {children}
      </IonFabButton>
    </IonFab>
  );
}
