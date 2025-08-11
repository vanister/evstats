import { IonNote } from '@ionic/react';
import { ReactNode } from 'react';
import classNames from 'classnames';

export type EvsNoteProps = {
  children: ReactNode;
  className?: string;
};

export default function EvsNote({ children, className }: EvsNoteProps) {
  return (
    <IonNote color="medium" className={classNames('ion-margin-horizontal', className)}>
      {children}
    </IonNote>
  );
}