import './SettingsScreen.scss';

import { IonList, IonItem, IonLabel, IonIcon, IonNote, useIonRouter } from '@ionic/react';
import {
  downloadOutline,
  shieldCheckmarkOutline,
  flashOutline,
  shareOutline
} from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';

export default function SettingsScreen() {
  const router = useIonRouter();

  const handleRatesClick = () => {
    router.push('/settings/rates');
  };

  const handleImportClick = () => {
    router.push('/settings/import');
  };

  return (
    <EvsPage className="settings-screen" title="Settings" hideBack={true}>
      <div className="settings-content">
        <IonList inset>
          <IonItem button onClick={handleRatesClick}>
            <IonIcon icon={flashOutline} slot="start" />
            <IonLabel>Update rates</IonLabel>
          </IonItem>

          <IonItem disabled>
            <IonIcon icon={shareOutline} slot="start" />
            <IonLabel>
              <h3>Export data</h3>
              <p>JSON or CSV format</p>
            </IonLabel>
          </IonItem>

          <IonItem button onClick={handleImportClick}>
            <IonIcon icon={downloadOutline} slot="start" />
            <IonLabel>
              <h3>Import data</h3>
              <p>From CSV files</p>
            </IonLabel>
          </IonItem>

          <IonItem disabled>
            <IonIcon icon={shieldCheckmarkOutline} slot="start" />
            <IonLabel>
              <h3>Backup & restore</h3>
              <p>Settings and data</p>
            </IonLabel>
          </IonItem>
        </IonList>
        <IonNote color="medium" className="ion-margin-horizontal">
          Customize your charging rates and manage your data
        </IonNote>
      </div>
    </EvsPage>
  );
}
