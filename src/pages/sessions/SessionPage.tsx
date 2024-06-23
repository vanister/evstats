import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';

export type SessionPageProps = {};

export default function SessionPage(props: SessionPageProps) {
  // a recent list of charge sessions
  return (
    <EvsPage title="Sessions" fixedSlotPlacement="before">
      <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      <IonList>
        <IonItem button>
          <IonLabel>
            <h3>Mustang Mach-E</h3>
            <p>06/22/2024</p>
          </IonLabel>
          <IonLabel slot="end">
            <h3>43 kWh</h3>
          </IonLabel>
        </IonItem>
        <IonItem button>
          <IonLabel>
            <h3>Mustang Mach-E</h3>
            <p>06/18/2024</p>
          </IonLabel>
          <IonLabel slot="end">
            <h3>23 kWh</h3>
          </IonLabel>
        </IonItem>
      </IonList>
    </EvsPage>
  );
}
