import { IonText, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
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
  return (
    <EvsPage title="Settings">
      <div className="settings-content">
        <div className="ion-padding" style={{ textAlign: 'center', paddingBottom: '16px' }}>
          <IonText color="medium">
            <h2>Coming Soon!</h2>
            <p>We're working on these exciting features:</p>
          </IonText>
        </div>

        <IonList>
          <IonText color="primary" style={{ padding: '16px', display: 'block', fontWeight: 'bold' }}>
            Data & Customization
          </IonText>
          
          <IonItem>
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

          <IonText color="primary" style={{ padding: '16px', display: 'block', fontWeight: 'bold', marginTop: '16px' }}>
            User Experience
          </IonText>
          
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

          <IonText color="primary" style={{ padding: '16px', display: 'block', fontWeight: 'bold', marginTop: '16px' }}>
            Smart Features
          </IonText>
          
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
      </div>
    </EvsPage>
  );
}
