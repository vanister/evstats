import './VehicleCard.scss';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText,
  IonBadge
} from '@ionic/react';
import { Vehicle } from '../../../../models/vehicle';
import { VehicleStats } from '../../../../models/vehicleStats';
import { formatDateForDisplay } from '../../../../utilities/dateUtility';

type VehicleCardProps = {
  vehicle: Vehicle;
  stats?: VehicleStats;
  loading?: boolean;
  isDefault?: boolean;
  onEditClick?: (vehicle: Vehicle) => void;
  onDeleteClick?: (vehicle: Vehicle) => void;
  onSetDefaultClick?: (vehicle: Vehicle) => void;
};

export default function VehicleCard({
  vehicle,
  stats,
  loading,
  isDefault,
  ...props
}: VehicleCardProps) {
  const { make, model, year, range, batterySize, trim, nickname } = vehicle;

  return (
    <IonCard className="vehicle-card">
      <IonCardHeader>
        <IonCardTitle className="vehicle-model">
          <span>
            {model} {trim}
          </span>
          {isDefault && <IonBadge color="primary">Default</IonBadge>}
        </IonCardTitle>
        <IonCardSubtitle>{`${year} ${make}`}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="vehicle-details">
          {range && <p>{`Range: ${range} miles`}</p>}
          {batterySize && <p>{`Battery Size: ${vehicle.batterySize} kWh`}</p>}
          {nickname && <p>{`Nickname: ${nickname}`}</p>}
        </div>

        <div className="vehicle-stats">
          <h4>Usage Statistics</h4>
          {loading ? (
            <div className="stats-loading">
              <IonSkeletonText animated style={{ width: '80%' }} />
              <IonSkeletonText animated style={{ width: '60%' }} />
              <IonSkeletonText animated style={{ width: '70%' }} />
            </div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total Sessions:</span>
                <span className="stat-value">{stats.totalSessions}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total kWh:</span>
                <span className="stat-value">{stats.totalKwh}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg per Session:</span>
                <span className="stat-value">{stats.averageKwhPerSession} kWh</span>
              </div>
              {stats.lastChargeDate && (
                <div className="stat-item">
                  <span className="stat-label">Last Charge:</span>
                  <span className="stat-value">{formatDateForDisplay(stats.lastChargeDate)}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="no-stats">No charging data yet</p>
          )}
        </div>
      </IonCardContent>
      <IonButton
        fill="clear"
        onClick={() => props.onEditClick?.(vehicle)}
      >
        Edit
      </IonButton>
      <IonButton
        fill="clear"
        color="danger"
        onClick={() => props.onDeleteClick?.(vehicle)}
      >
        Delete
      </IonButton>
      {!isDefault && (
        <IonButton
          fill="clear"
          onClick={() => props.onSetDefaultClick?.(vehicle)}
        >
          Default
        </IonButton>
      )}
    </IonCard>
  );
}
