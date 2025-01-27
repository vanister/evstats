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
  routerLink?: string;
}>;

export default function EvsFloatingActionButton({
  id,
  children,
  onClick,
  ...props
}: EvsFloatingAddButtonProps) {
  return (
    <IonFab {...props} className={classNames('evs-fab', props.className)}>
      <IonFabButton id={id} onClick={onClick} routerLink={props.routerLink}>
        {children}
      </IonFabButton>
    </IonFab>
  );
}
