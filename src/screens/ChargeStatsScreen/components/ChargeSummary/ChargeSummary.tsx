import './ChargeSummary.scss';

import type { ChargeAverage as ChargeAvergeType } from '../../../../models/chargeStats';
import { ChargeAverage } from '../ChargeAverage/ChargeAverage';

export type ChargeSummaryProps = {
  averages: ChargeAvergeType[];
};

export default function ChargeSummary({ averages }: ChargeSummaryProps) {
  return (
    <div className="charge-summary">
      {averages?.map((a) => (
        <ChargeAverage key={a.name} average={a} />
      ))}
    </div>
  );
}
