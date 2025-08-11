import './ImportSessionScreen.scss';

import { useState } from 'react';
import { IonButton, IonIcon, IonText, IonNote, useIonRouter } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import EvsPage from '../../../../components/EvsPage';
import EvsProgressLoader from '../../../../components/EvsProgressLoader';
import { useServices } from '../../../../providers/ServiceProvider';
import { SessionImportResult } from '../../../../services/SessionImportService';
import { logToDevServer } from '../../../../logger';

type ImportState = 'select' | 'processing' | 'complete' | 'error';

export default function ImportSessionScreen() {
  const router = useIonRouter();
  const sessionImportService = useServices('sessionImportService');
  const [currentState, setCurrentState] = useState<ImportState>('select');
  const [importResult, setImportResult] = useState<SessionImportResult | null>(null);
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
      const validation = sessionImportService.validateCsvContent(text);

      if (!validation.isValid) {
        // Store validation errors for proper rendering
        setValidationErrors(validation.errors);
        setCurrentState('error');
        return;
      }

      // Import sessions
      const result = await sessionImportService.importSessions(validation.sessions);

      setImportResult(result);
      setCurrentState('complete');
    } catch (error) {
      logToDevServer(`Error processing file: ${error.message}`, 'error', error.stack);
      setErrorMessage('Failed to process CSV file. Please try again.');
      setCurrentState('error');
    }
  };

  const handleGoToSessions = () => {
    router.push('/sessions');
  };

  return (
    <EvsPage className="import-session-screen" title="Import Sessions" padding>
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
            <p>Processing CSV... Please wait while we validate and import your sessions.</p>
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
              <strong>Required columns:</strong> vehicle_id, date, kwh, rate_type_id
            </p>
            <p>
              <strong>Optional columns:</strong> rate_override
            </p>
            <p>
              <strong>Date format:</strong> YYYY-MM-DD (e.g., 2024-01-15)
            </p>
            <p>
              <strong>Example:</strong>
            </p>
            <code>
              vehicle_id,date,kwh,rate_type_id
              <br />
              1,2024-01-15,45.2,1
            </code>
            <p>
              <strong>Note:</strong> You can find the Vehicle ID at the bottom of each vehicle card on the
              Vehicles screen.
            </p>
          </IonNote>
        )}

        {currentState === 'complete' && importResult && (
          <>
            {importResult.success > 0 && (
              <IonButton
                expand="block"
                fill="outline"
                onClick={handleGoToSessions}
                className="ion-margin-top"
              >
                View Sessions
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