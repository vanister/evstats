import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

export type EvsPageProps = {
  title: string;
  children: React.ReactNode;
  hideMenuButton?: boolean;
  fixedSlotPlacement?: 'before' | 'after';
};

const EvsPage = React.forwardRef((props: EvsPageProps, ref) => {
  const { children, fixedSlotPlacement, hideMenuButton, title } = props;

  return (
    <IonPage ref={ref}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton disabled={hideMenuButton} hidden={hideMenuButton} />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="ion-padding"
        fullscreen
        fixedSlotPlacement={fixedSlotPlacement}
      >
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonContent>
    </IonPage>
  );
});

export default EvsPage;
