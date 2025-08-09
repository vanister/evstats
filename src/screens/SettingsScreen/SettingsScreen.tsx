import './SettingsScreen.scss';

import { IonList, IonItem, IonLabel, IonIcon, IonNote, useIonRouter } from '@ionic/react';
import { 
  downloadOutline, 
  cloudUploadOutline, 
  shieldCheckmarkOutline, 
  speedometerOutline, 
  carOutline, 
  notificationsOutline, 
  flashOutline, 
  timeOutline 
} from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';

export default function SettingsScreen() {
  const router = useIonRouter();

  const handleRatesClick = () => {
    router.push('/settings/rates');
  };

  return (
    <EvsPage className="settings-screen" title="Settings" hideBack={true}>
      <div className="settings-content">
        <IonList inset>
          
          <IonItem button onClick={handleRatesClick}>
            <IonIcon icon={flashOutline} slot="start" />
            <IonLabel>Update default rates</IonLabel>
          </IonItem>
          
          <IonItem>
            <IonIcon icon={downloadOutline} slot="start" />
            <IonLabel>
              <h3>Export data</h3>
              <p>JSON or CSV format</p>
            </IonLabel>
          </IonItem>
          
          <IonItem>
            <IonIcon icon={cloudUploadOutline} slot="start" />
            <IonLabel>
              <h3>Import data</h3>
              <p>From other apps/formats</p>
            </IonLabel>
          </IonItem>
          
          <IonItem>
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

        <IonList inset>
          
          <IonItem>
            <IonIcon icon={speedometerOutline} slot="start" />
            <IonLabel>
              <h3>Units preferences</h3>
              <p>Metric/Imperial</p>
            </IonLabel>
          </IonItem>
          
          <IonItem>
            <IonIcon icon={carOutline} slot="start" />
            <IonLabel>Default vehicle/rate selection</IonLabel>
          </IonItem>

        </IonList>
        <IonNote color="medium" className="ion-margin-horizontal">
          Personalize the app experience to your preferences
        </IonNote>

        <IonList inset>
          
          <IonItem>
            <IonIcon icon={timeOutline} slot="start" />
            <IonLabel>
              <h3>Charging reminders</h3>
              <p>Based on schedule</p>
            </IonLabel>
          </IonItem>
          
          <IonItem>
            <IonIcon icon={notificationsOutline} slot="start" />
            <IonLabel>
              <h3>Rate change notifications</h3>
              <p>When energy prices update</p>
            </IonLabel>
          </IonItem>
          
          <IonItem>
            <IonIcon icon={flashOutline} slot="start" />
            <IonLabel>
              <h3>Quick session templates</h3>
              <p>Common charging scenarios</p>
            </IonLabel>
          </IonItem>
        </IonList>
        <IonNote color="medium" className="ion-margin-horizontal">
          Advanced features for an enhanced charging experience
        </IonNote>
      </div>
    </EvsPage>
  );
}
