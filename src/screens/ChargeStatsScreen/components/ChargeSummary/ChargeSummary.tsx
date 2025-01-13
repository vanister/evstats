import './ChargeSummary.scss';

import { ChargeAverage } from '../ChargeAverage/ChargeAverage';
import { ChargeAverage as ChargeAverageType } from '../../../../services/ChargeStatsService';

export type ChargeSummaryProps = {
  averages: ChargeAverageType[];
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
