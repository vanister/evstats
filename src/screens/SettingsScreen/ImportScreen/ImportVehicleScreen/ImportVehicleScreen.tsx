import './ImportVehicleScreen.scss';

import { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonNote,
  useIonAlert,
  useIonRouter
} from '@ionic/react';
import { downloadOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';

import EvsPage from '../../../../components/EvsPage';
import EmptyState from '../../../../components/EmptyState';
import EvsProgressLoader from '../../../../components/EvsProgressLoader';
import { useServices } from '../../../../providers/ServiceProvider';
import { ImportResult } from '../../../../services/VehicleImportService';
import { logToDevServer } from '../../../../logger';
import { useAppDispatch } from '../../../../redux/hooks';
import { addVehicle } from '../../../../redux/vehicleSlice';

type ImportState = 'select' | 'processing' | 'complete';

export default function ImportVehicleScreen() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const vehicleImportService = useServices('vehicleImportService');
  const [showAlert] = useIonAlert();
  const [currentState, setCurrentState] = useState<ImportState>('select');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleFileSelect = async () => {
    try {
      // Create a file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv,text/csv';
      input.style.display = 'none';

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          await processFile(file);
        }
      };

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    } catch (error) {
      logToDevServer(`Error selecting file: ${error.message}`, 'error', error.stack);
      await showAlert('Failed to select file. Please try again.', [{ text: 'OK' }]);
    }
  };

  const processFile = async (file: File) => {
    setCurrentState('processing');

    try {
      // Read and validate CSV
      const text = await file.text();
      const validation = vehicleImportService.validateCsvContent(text);

      if (!validation.isValid) {
        // Show validation errors
        await showAlert(`Invalid CSV file:\n${validation.errors.join('\n')}`, [
          { text: 'OK', handler: () => setCurrentState('select') }
        ]);
        return;
      }

      // Import vehicles
      const result = await vehicleImportService.importVehicles(validation.vehicles);

      // Add successful imports to Redux store
      result.importedVehicles.forEach((vehicle) => {
        dispatch(addVehicle(vehicle));
      });

      setImportResult(result);
      setCurrentState('complete');
    } catch (error) {
      logToDevServer(`Error processing file: ${error.message}`, 'error', error.stack);
      await showAlert('Failed to process CSV file. Please try again.', [
        { text: 'OK', handler: () => setCurrentState('select') }
      ]);
    }
  };

  const handleStartOver = () => {
    setCurrentState('select');
    setImportResult(null);
  };

  const handleGoToVehicles = () => {
    router.push('/vehicles');
  };

  return (
    <EvsPage className="import-vehicle-screen" title="Import Vehicles">
      {currentState === 'select' && (
        <>
          <div className="ion-padding">
            <IonButton expand="block" onClick={handleFileSelect} size="large">
              <IonIcon icon={downloadOutline} slot="start" />
              Select CSV File
            </IonButton>

            <div className="import-notes ion-margin-top">
              <IonNote color="medium">
                <p>
                  <strong>Required columns:</strong> make, model, year
                </p>
                <p>
                  <strong>Optional columns:</strong> battery_size, range, nickname, trim, vin
                </p>
                <p>
                  <strong>Example:</strong>
                </p>
                <code>
                  make,model,year,battery_size
                  <br />
                  Ford,Mustang Mach-E,2022,91
                </code>
              </IonNote>
            </div>
          </div>
        </>
      )}

      {currentState === 'processing' && (
        <EmptyState>
          <div className="processing-content">
            <IonIcon icon={downloadOutline} color="primary" className="processing-icon" />
            <h3>Processing CSV...</h3>
            <p>Please wait while we validate and import your vehicles.</p>
            <EvsProgressLoader type="indeterminate" />
          </div>
        </EmptyState>
      )}

      {currentState === 'complete' && importResult && (
        <>
          <IonList inset>
            <IonItem>
              <IonIcon
                icon={importResult.success > 0 ? checkmarkCircleOutline : closeCircleOutline}
                color={importResult.success > 0 ? 'success' : 'danger'}
                slot="start"
              />
              <IonLabel>
                <h2>{importResult.success > 0 ? 'Import Complete!' : 'Import Failed'}</h2>
                <p>
                  {importResult.success > 0
                    ? 'Your vehicles have been imported successfully'
                    : 'There were errors importing your vehicles'}
                </p>
              </IonLabel>
            </IonItem>
          </IonList>

          <IonList inset>
            <IonItem>
              <IonLabel>
                <h3>Total vehicles processed</h3>
                <p>{importResult.total}</p>
              </IonLabel>
            </IonItem>

            {importResult.success > 0 && (
              <IonItem>
                <IonLabel>
                  <h3>Successfully imported</h3>
                  <p>{importResult.success}</p>
                </IonLabel>
                <IonNote slot="end" color="success">
                  {importResult.success}
                </IonNote>
              </IonItem>
            )}

            {importResult.failed > 0 && (
              <IonItem>
                <IonLabel>
                  <h3>Failed to import</h3>
                  <p>{importResult.failed}</p>
                </IonLabel>
                <IonNote slot="end" color="danger">
                  {importResult.failed}
                </IonNote>
              </IonItem>
            )}
          </IonList>

          {importResult.errors.length > 0 && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle color="danger">Import Errors</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {importResult.errors.map((error, index) => (
                  <IonText key={index} color="danger">
                    <p>
                      Row {error.row}: {error.message}
                    </p>
                  </IonText>
                ))}
              </IonCardContent>
            </IonCard>
          )}

          <div className="ion-padding">
            <IonButton
              fill="outline"
              expand="block"
              onClick={handleStartOver}
              className="ion-margin-bottom"
            >
              Import More Files
            </IonButton>
            {importResult.success > 0 && (
              <IonButton expand="block" onClick={handleGoToVehicles}>
                View Vehicles
              </IonButton>
            )}
          </div>
        </>
      )}
    </EvsPage>
  );
}
