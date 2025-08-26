import './SettingsScreen.scss';

import { IonList, IonItem, IonLabel, IonIcon, useIonRouter } from '@ionic/react';
import { downloadOutline, flashOutline, heartOutline } from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';
import EvsNote from '../../components/EvsNote/EvsNote';
import { useAppSelector } from '../../redux/hooks';
import { useState } from 'react';
import TipJarModal from './TipJarModal/TipJarModal';

export default function SettingsScreen() {
  const router = useIonRouter();
  const hasVehicles = useAppSelector((s) => s.vehicles.length > 0);
  const [showTipJar, setShowTipJar] = useState(false);

  const handleRatesClick = () => {
    router.push('/settings/rates');
  };

  const handleImportClick = () => {
    router.push('/settings/import');
  };


  const handleSupportClick = () => {
    setShowTipJar(true);
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
          {/* Temporarily disabled - database file visibility issue */}
          {/* <IonItem button disabled={!hasVehicles} onClick={handleExportClick}>
            <IonIcon icon={shareOutline} slot="start" />
            <IonLabel>Export data</IonLabel>
          </IonItem> */}
        </IonList>

        <IonList inset>
          <IonItem button onClick={handleSupportClick}>
            <IonIcon icon={heartOutline} slot="start" />
            <IonLabel>Support the App</IonLabel>
          </IonItem>
        </IonList>
        <EvsNote>
          {hasVehicles
            ? 'Customize your charging rates and manage your data'
            : 'Get started by updating your rates and importing vehicles'}
        </EvsNote>
      </div>

      <TipJarModal 
        isOpen={showTipJar} 
        onClose={() => setShowTipJar(false)} 
      />
    </EvsPage>
  );
}
