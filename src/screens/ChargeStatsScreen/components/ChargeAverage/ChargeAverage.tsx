import './ChargeAverage.scss';
import type { ChargeAverage } from '../../../../models/chargeStats';

export type ChargeAverageProps = {
  average: ChargeAverage;
  mode: 'kwh' | 'percent';
  totalKwh: number;
};

export function ChargeAverage({ average, mode, totalKwh }: ChargeAverageProps) {
  const displayValue = mode === 'kwh' 
    ? `${Math.round(average.kWh)} kWh`
    : `${Math.round((average.kWh / (totalKwh || 1)) * 100)}%`;

  return (
    <div className="charge-average">
      <span className="symbol" style={{ backgroundColor: average.color }}></span>
      <span className="name">{average.name}</span>
      <span className="value">{displayValue}</span>
    </div>
  );
}
