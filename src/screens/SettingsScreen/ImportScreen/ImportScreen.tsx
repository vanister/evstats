import './ImportScreen.scss';

import { IonList, IonItem, IonLabel, IonIcon, useIonRouter } from '@ionic/react';
import { carOutline, flashOutline, analyticsOutline, documentsOutline } from 'ionicons/icons';
import EvsPage from '../../../components/EvsPage';

export default function ImportScreen() {
  const router = useIonRouter();

  const handleVehicleImportClick = () => {
    router.push('/settings/import/vehicles');
  };

  const handleSessionImportClick = () => {
    // TODO: Implement session import
    console.log('Session import coming soon');
  };

  const handleRateImportClick = () => {
    // TODO: Implement rate import
    console.log('Rate import coming soon');
  };

  const handleDataImportClick = () => {
    // TODO: Implement general data import
    console.log('Data import coming soon');
  };

  return (
    <EvsPage className="import-screen" title="Import Data">
      <IonList inset>
        <IonItem button onClick={handleVehicleImportClick}>
          <IonIcon icon={carOutline} slot="start" />
          <IonLabel>Import Vehicles</IonLabel>
        </IonItem>

        <IonItem button disabled onClick={handleSessionImportClick}>
          <IonIcon icon={flashOutline} slot="start" />
          <IonLabel>Import Sessions</IonLabel>
        </IonItem>

        <IonItem button disabled onClick={handleRateImportClick}>
          <IonIcon icon={analyticsOutline} slot="start" />
          <IonLabel>Import Rates</IonLabel>
        </IonItem>

        <IonItem button disabled onClick={handleDataImportClick}>
          <IonIcon icon={documentsOutline} slot="start" />
          <IonLabel>Import All Data</IonLabel>
        </IonItem>
      </IonList>
    </EvsPage>
  );
}
