import './VehicleScreen.scss';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { IonSlots } from '../../constants';
import EvsFloatingActionButton from '../../components/EvsFloatingActionButton';
import { add } from 'ionicons/icons';

export default function VehiclePage() {
  const [isOpen, setIsOpen] = useState(true);
  const [hasVehicles, setHasVehicles] = useState(false);
  const history = useHistory();

  const handleModalDismiss = () => {
    history.replace('/sessions');
  };

  const handleAddClick = () => {
    setHasVehicles(true);
  };

  const handleCloseClick = () => {
    setIsOpen(false);
  };

  return (
    <IonPage className="vehicle-page" color="light">
      <IonContent>
        <div className="spinner-container">
          {!isOpen && <IonSpinner className="loading-spinner"></IonSpinner>}
        </div>
        {/* todo - VehicleModal */}
        <IonModal isOpen={isOpen} onDidDismiss={handleModalDismiss}>
          {/* todo - unify Header */}
          <IonHeader>
            <IonToolbar>
              <IonButtons slot={IonSlots.start}>
                <IonButton onClick={handleCloseClick} disabled={!hasVehicles}>
                  Close
                </IonButton>
              </IonButtons>
              <IonTitle>Vehicles</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent color="light">
            <EvsFloatingActionButton
              horizontal="end"
              vertical="bottom"
              slot="fixed"
              onClick={handleAddClick}
            >
              <IonIcon icon={add} />
            </EvsFloatingActionButton>
            <IonHeader collapse="condense">
              <IonToolbar color="light">
                <IonTitle size="large">Vehicles</IonTitle>
              </IonToolbar>
            </IonHeader>
            {Array(10)
              .fill('card')
              .map((c, i) => (
                // todo - VehicleCard
                <IonCard key={`${c}-${i}`}>
                  <IonCardHeader>
                    <IonCardTitle>Card Title</IonCardTitle>
                    <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
                  </IonCardHeader>

                  <IonCardContent>
                    {
                      "Here's a small text description for the card content. Nothing more, nothing less."
                    }
                  </IonCardContent>

                  <IonButton fill="clear">Action 1</IonButton>
                  <IonButton fill="clear">Action 2</IonButton>
                </IonCard>
              ))}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
