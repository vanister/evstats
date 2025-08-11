import './SettingsScreen.scss';

import { IonList, IonItem, IonLabel, IonIcon, useIonRouter } from '@ionic/react';
import {
  downloadOutline,
  shieldCheckmarkOutline,
  flashOutline,
  shareOutline
} from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';
import EvsNote from '../../components/EvsNote/EvsNote';
import { useAppSelector } from '../../redux/hooks';

export default function SettingsScreen() {
  const router = useIonRouter();
  const hasVehicles = useAppSelector((s) => s.vehicles.length > 0);

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

          <IonItem button onClick={handleImportClick}>
            <IonIcon icon={downloadOutline} slot="start" />
            <IonLabel>Import data</IonLabel>
          </IonItem>
          {/* todo - disable this when no vehicle, but for now always disable since its not implemented yet */}
          <IonItem disabled={!hasVehicles || true}>
            <IonIcon icon={shareOutline} slot="start" />
            <IonLabel>Export data</IonLabel>
          </IonItem>

          {/* todo - disable this when no vehicle, but for now always disable since its not implemented yet */}
          <IonItem disabled={!hasVehicles || true}>
            <IonIcon icon={shieldCheckmarkOutline} slot="start" />
            <IonLabel>Backup & restore</IonLabel>
          </IonItem>
        </IonList>
        <EvsNote>
          {hasVehicles
            ? 'Customize your charging rates and manage your data'
            : 'Get started by updating your rates and importing vehicles'}
        </EvsNote>
        <EvsNote>
          Export data and backup & restore coming soon.
        </EvsNote>
      </div>
    </EvsPage>
  );
}
