import './ImportScreen.scss';

import { IonList, IonItem, IonLabel, IonIcon, useIonRouter } from '@ionic/react';
import { carOutline, flashOutline } from 'ionicons/icons';
import EvsPage from '../../../components/EvsPage';
import EvsNote from '../../../components/EvsNote/EvsNote';
import { useAppSelector } from '../../../redux/hooks';

export default function ImportScreen() {
  const router = useIonRouter();
  const hasVehicles = useAppSelector((s) => s.vehicles.length > 0);

  const handleVehicleImportClick = () => {
    router.push('/settings/import/vehicles');
  };

  const handleSessionImportClick = () => {
    router.push('/settings/import/sessions');
  };


  return (
    <EvsPage className="import-screen" title="Import Data">
      <IonList inset>
        <IonItem button onClick={handleVehicleImportClick}>
          <IonIcon icon={carOutline} slot="start" />
          <IonLabel>Import Vehicles</IonLabel>
        </IonItem>

        <IonItem button disabled={!hasVehicles} onClick={handleSessionImportClick}>
          <IonIcon icon={flashOutline} slot="start" />
          <IonLabel>Import Sessions</IonLabel>
        </IonItem>
      </IonList>
      <EvsNote>
        {hasVehicles
          ? 'Import your vehicles first, then add your charging sessions'
          : 'Import your vehicles before importing sessions'}
      </EvsNote>
    </EvsPage>
  );
}
