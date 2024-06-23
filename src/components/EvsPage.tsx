import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

export type EvsPageProps = {
  title: string;
  children: React.ReactNode;
  hideMenuButton?: boolean;
  fixedSlotPlacement?: 'before' | 'after';
};

export default function EvsPage(props: EvsPageProps) {
  const { children, fixedSlotPlacement, hideMenuButton, title } = props;

  return (
    <IonPage>
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
}
