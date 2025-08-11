import './ImportVehicleScreen.scss';

import { useState } from 'react';
import { IonButton, IonIcon, IonText, IonNote, useIonRouter } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import EvsPage from '../../../../components/EvsPage';
import EvsProgressLoader from '../../../../components/EvsProgressLoader';
import { useServices } from '../../../../providers/ServiceProvider';
import { ImportResult } from '../../../../services/VehicleImportService';
import { logToDevServer } from '../../../../logger';
import { useAppDispatch } from '../../../../redux/hooks';
import { addVehicle } from '../../../../redux/vehicleSlice';

type ImportState = 'select' | 'processing' | 'complete' | 'error';

export default function ImportVehicleScreen() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const vehicleImportService = useServices('vehicleImportService');
  const [currentState, setCurrentState] = useState<ImportState>('select');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileSelect = async () => {
    // Declare input outside try block for proper cleanup
    let input: HTMLInputElement | undefined;

    try {
      // Reset state
      setCurrentState('select');
      setErrorMessage('');
      setValidationErrors([]);
      setImportResult(null);

      // Create a file input for mobile file picker
      input = document.createElement('input');
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
    } catch (error) {
      logToDevServer(`Error selecting file: ${error.message}`, 'error', error.stack);
      setErrorMessage('Failed to select file. Please try again.');
      setCurrentState('error');
    } finally {
      // Always clean up the input element if it was created
      if (input && document.body.contains(input)) {
        document.body.removeChild(input);
      }
    }
  };

  const processFile = async (file: File) => {
    setCurrentState('processing');
    setErrorMessage('');
    setValidationErrors([]);

    try {
      // Read and validate CSV
      const text = await file.text();
      const validation = vehicleImportService.validateCsvContent(text);

      if (!validation.isValid) {
        // Store validation errors for proper rendering
        setValidationErrors(validation.errors);
        setCurrentState('error');
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
      setErrorMessage('Failed to process CSV file. Please try again.');
      setCurrentState('error');
    }
  };

  const handleGoToVehicles = () => {
    router.push('/vehicles');
  };

  return (
    <EvsPage className="import-vehicle-screen" title="Import Vehicles" padding>
      {/* Progress indicator below app bar when processing */}
      {currentState === 'processing' && <EvsProgressLoader type="indeterminate" />}

      <IonButton expand="block" onClick={handleFileSelect} disabled={currentState === 'processing'}>
        <IonIcon icon={downloadOutline} slot="start" />
        Select CSV File
      </IonButton>

      {/* Status messages below button */}
      <div className="ion-margin-top">
        {currentState === 'processing' && (
          <IonText color="medium">
            <p>Processing CSV... Please wait while we validate and import your vehicles.</p>
          </IonText>
        )}

        {currentState === 'error' && (
          <IonText color="danger">
            {validationErrors.length > 0 ? (
              <>
                <p>
                  <strong>Invalid CSV file:</strong>
                </p>
                <ul>
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>{errorMessage}</p>
            )}
          </IonText>
        )}

        {currentState === 'select' && (
          <IonNote className="import-notes" color="medium">
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
        )}

        {currentState === 'complete' && importResult && (
          <>
            {importResult.success > 0 && (
              <IonButton
                expand="block"
                fill="outline"
                onClick={handleGoToVehicles}
                className="ion-margin-top"
              >
                View Vehicles
              </IonButton>
            )}

            {importResult.errors.length > 0 && (
              <IonText color="danger">
                <p>
                  <strong>Errors:</strong>
                </p>
                <ul>
                  {importResult.errors.map((error, index) => (
                    <li key={index}>
                      Row {error.row}: {error.message}
                    </li>
                  ))}
                </ul>
              </IonText>
            )}

            <IonText color={importResult.success > 0 ? 'success' : 'danger'}>
              <p>
                <strong>{importResult.success > 0 ? 'Import Complete!' : 'Import Failed'}</strong>
              </p>
              <ul>
                <li>Total: {importResult.total}</li>
                <li>Success: {importResult.success}</li>
                <li>Failed: {importResult.failed}</li>
              </ul>
            </IonText>
          </>
        )}
      </div>
    </EvsPage>
  );
}
