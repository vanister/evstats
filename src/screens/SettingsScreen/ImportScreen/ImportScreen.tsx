import './ImportScreen.scss';

import { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonText,
  useIonAlert,
  useIonRouter
} from '@ionic/react';
import { documentText, cloudUpload, checkmarkCircle, closeCircle } from 'ionicons/icons';

import EvsPage from '../../../components/EvsPage';
import { useServices } from '../../../providers/ServiceProvider';
import { ImportResult } from '../../../services/VehicleImportService';
import { logToDevServer } from '../../../logger';
import { useAppDispatch } from '../../../redux/hooks';
import { addVehicle } from '../../../redux/vehicleSlice';

type ImportState = 'select' | 'processing' | 'complete';

export default function ImportScreen() {
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
        await showAlert(
          `Invalid CSV file:\n${validation.errors.join('\n')}`,
          [{ text: 'OK', handler: () => setCurrentState('select') }]
        );
        return;
      }

      // Import vehicles
      const result = await vehicleImportService.importVehicles(validation.vehicles);
      
      // Add successful imports to Redux store
      result.importedVehicles.forEach(vehicle => {
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
    <EvsPage className="import-screen" title="Import Vehicles">
      <div className="import-content">
        {currentState === 'select' && (
          <div className="import-select">
            <div className="import-instructions">
              <IonIcon icon={documentText} className="instruction-icon" />
              <h2>Import Vehicles from CSV</h2>
              <p>
                Select a CSV file with your vehicle data. Required columns: make, model, year.
                Optional: battery_size, range, nickname, trim, vin.
              </p>
              
              <div className="csv-format-note">
                <h3>Example format:</h3>
                <code>make,model,year,battery_size<br/>Tesla,Model 3,2022,75</code>
              </div>
            </div>

            <IonButton 
              expand="block" 
              onClick={handleFileSelect}
              className="select-file-button"
            >
              <IonIcon icon={cloudUpload} slot="start" />
              Select CSV File
            </IonButton>
          </div>
        )}

        {currentState === 'processing' && (
          <div className="import-processing">
            <IonIcon icon={cloudUpload} className="processing-icon" />
            <h2>Processing CSV...</h2>
            <p>Please wait while we validate and import your vehicles.</p>
            <IonProgressBar type="indeterminate" />
          </div>
        )}

        {currentState === 'complete' && importResult && (
          <div className="import-complete">
            <IonIcon 
              icon={importResult.success > 0 ? checkmarkCircle : closeCircle} 
              color={importResult.success > 0 ? 'success' : 'danger'}
              className="result-icon" 
            />
            
            <h2>
              {importResult.success > 0 ? 'Import Complete!' : 'Import Failed'}
            </h2>
            
            <IonList className="result-summary">
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
                    <p color="success">{importResult.success}</p>
                  </IonLabel>
                </IonItem>
              )}
              
              {importResult.failed > 0 && (
                <IonItem>
                  <IonLabel>
                    <h3>Failed to import</h3>
                    <p color="danger">{importResult.failed}</p>
                  </IonLabel>
                </IonItem>
              )}
            </IonList>

            {importResult.errors.length > 0 && (
              <div className="import-errors">
                <h3>Errors:</h3>
                {importResult.errors.map((error, index) => (
                  <IonText key={index} color="danger">
                    <p>Row {error.row}: {error.message}</p>
                  </IonText>
                ))}
              </div>
            )}

            <div className="result-actions">
              <IonButton fill="outline" onClick={handleStartOver}>
                Import More
              </IonButton>
              {importResult.success > 0 && (
                <IonButton onClick={handleGoToVehicles}>
                  View Vehicles
                </IonButton>
              )}
            </div>
          </div>
        )}
      </div>
    </EvsPage>
  );
}
