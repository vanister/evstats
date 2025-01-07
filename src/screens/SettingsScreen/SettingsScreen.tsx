import { IonButton, useIonAlert } from '@ionic/react';
import EvsPage from '../../components/EvsPage';
import { useServices } from '../../providers/ServiceProvider';

export default function SettingsScreen() {
  const [showAlert] = useIonAlert();
  const dbBackupService = useServices('databaseBackupService');

  const handleBackupClick = async () => {
    const errorMsg = await dbBackupService.share();

    if (errorMsg) {
      showAlert(errorMsg);
    }
  };

  return (
    <EvsPage title="Settings">
      <div className="backup-section ion-padding">
        <IonButton expand="block" onClick={handleBackupClick}>
          Export data
        </IonButton>
      </div>
    </EvsPage>
  );
}
