import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import classNames from 'classnames';
import { carOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import VehicleScreen from '../screens/VehicleScreen/VehicleScreen';

type EvsPageProps = {
  children: React.ReactNode;
  className?: string;
  color?: string;
  fixedSlotPlacement?: 'before' | 'after';
  padding?: boolean;
  title?: string;
};

function EvsPage(
  { children, color, title, ...props }: EvsPageProps,
  ref: React.MutableRefObject<HTMLElement>
) {
  const [showModal, setShowModal] = useState(false);

  const handleVehicleClick = () => {
    setShowModal(true);
  };

  const handleModalDismiss = () => {
    setShowModal(false);
  };

  return (
    <IonPage ref={ref} className={classNames('evs-page', props.className)}>
      <IonHeader className="evs-page-header">
        <IonToolbar>
          <IonButtons slot="primary">
            <IonButton onClick={handleVehicleClick}>
              <IonIcon slot="icon-only" icon={carOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className={classNames('evs-page-content', { 'ion-padding': props.padding })}
        color={color}
        fullscreen
        fixedSlotPlacement={props.fixedSlotPlacement}
      >
        <IonHeader className="evs-page-content-header" collapse="condense">
          <IonToolbar color={color}>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {children}
        {showModal && <VehicleScreen onDismiss={handleModalDismiss} />}
      </IonContent>
    </IonPage>
  );
}

export default React.forwardRef(EvsPage);
