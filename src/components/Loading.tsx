import './Loading.scss';
import { IonSpinner } from '@ionic/react';

/** Shows a fullscreen loading spinner */
export function Loading() {
  return (
    <div className="loading fullscreen">
      <IonSpinner className="spinner" name="circles" />
    </div>
  );
}
