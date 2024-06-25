import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import classNames from 'classnames';
import React from 'react';

interface EvsPageProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  fixedSlotPlacement?: 'before' | 'after';
  padding?: boolean;
  title: string;
}

const EvsPage = React.forwardRef((props: EvsPageProps, ref) => {
  const { children, className, color, fixedSlotPlacement, padding, title } =
    props;

  return (
    <IonPage ref={ref} className={classNames('evs-page', className)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className={`${padding ? 'ion-padding' : ''}`}
        color={color}
        fullscreen
        fixedSlotPlacement={fixedSlotPlacement}
      >
        <IonHeader collapse="condense">
          <IonToolbar color={color}>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonContent>
    </IonPage>
  );
});

export default EvsPage;
