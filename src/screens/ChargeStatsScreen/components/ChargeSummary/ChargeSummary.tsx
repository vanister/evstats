import './ChargeSummary.scss';

import type { ChargeAverage as ChargeAvergeType } from '../../../../models/chargeStats';
import { ChargeAverage } from '../ChargeAverage/ChargeAverage';

export type ChargeSummaryProps = {
  averages: ChargeAvergeType[];
  mode: 'kwh' | 'percent';
};

export default function ChargeSummary({ averages, mode }: ChargeSummaryProps) {
  // Calculate total kWh for percentage calculations
  const totalKwh = averages.reduce((sum, avg) => sum + avg.kWh, 0);

  return (
    <div className="charge-summary">
      {averages?.map((a) => (
        <ChargeAverage key={a.name} average={a} mode={mode} totalKwh={totalKwh} />
      ))}
    </div>
  );
}
