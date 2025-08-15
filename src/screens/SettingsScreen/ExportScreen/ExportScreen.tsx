import './ExportScreen.scss';

import { useState } from 'react';
import { IonList, IonItem, IonLabel, IonIcon, IonButton, IonAlert } from '@ionic/react';
import { carOutline, flashOutline } from 'ionicons/icons';
import EvsPage from '../../../components/EvsPage';
import EvsNote from '../../../components/EvsNote/EvsNote';
import { useServices } from '../../../providers/ServiceProvider';
import { useAppSelector } from '../../../redux/hooks';

export default function ExportScreen() {
  const exportService = useServices('exportService');
  const vehicles = useAppSelector((s) => s.vehicles);
  const [exportingVehicles, setExportingVehicles] = useState(false);
  const [exportingSessions, setExportingSessions] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleExportVehicles = async () => {
    if (vehicles.length === 0) {
      setAlertMessage('No vehicles to export. Add vehicles first.');
      setShowAlert(true);
      return;
    }

    setExportingVehicles(true);
    try {
      await exportService.exportAndSaveVehicles();
      // No need to show success message since Share dialog handles user interaction
    } catch (error) {
      setAlertMessage(`Failed to export vehicles: ${error.message}`);
      setShowAlert(true);
    } finally {
      setExportingVehicles(false);
    }
  };

  const handleExportSessions = async () => {
    setExportingSessions(true);
    try {
      await exportService.exportAndSaveSessions();
      // No need to show success message since Share dialog handles user interaction
    } catch (error) {
      setAlertMessage(`Failed to export sessions: ${error.message}`);
      setShowAlert(true);
    } finally {
      setExportingSessions(false);
    }
  };

  return (
    <EvsPage className="export-screen" title="Export Data" hideBack={false}>
      <div className="export-content">
        <EvsNote>
          Export your vehicles and charging sessions as CSV files for backup or analysis in other applications.
        </EvsNote>

        <IonList inset>
          <IonItem>
            <IonIcon icon={carOutline} slot="start" />
            <IonLabel>
              <h2>Export Vehicles</h2>
              <p>Export {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} as CSV</p>
            </IonLabel>
            <IonButton 
              fill="outline" 
              slot="end" 
              onClick={handleExportVehicles}
              disabled={exportingVehicles || vehicles.length === 0}
            >
              {exportingVehicles ? 'Exporting...' : 'Export'}
            </IonButton>
          </IonItem>

          <IonItem>
            <IonIcon icon={flashOutline} slot="start" />
            <IonLabel>
              <h2>Export Sessions</h2>
              <p>Export all charging sessions as CSV</p>
            </IonLabel>
            <IonButton 
              fill="outline" 
              slot="end" 
              onClick={handleExportSessions}
              disabled={exportingSessions}
            >
              {exportingSessions ? 'Exporting...' : 'Export'}
            </IonButton>
          </IonItem>
        </IonList>

        <EvsNote>
          CSV files will be saved to your device and can be shared or opened in spreadsheet applications.
        </EvsNote>
      </div>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Export Status"
        message={alertMessage}
        buttons={['OK']}
      />
    </EvsPage>
  );
}