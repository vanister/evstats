import './ChargeAverage.scss';
import type { ChargeAverage } from '../../../../models/chargeStats';

export type ChargeAverageProps = {
  average: ChargeAverage;
};

export function ChargeAverage({ average }: ChargeAverageProps) {
  return (
    <div className="charge-average">
      <span className="symbol" style={{ backgroundColor: average.color }}></span>
      <span className="name">{average.name}</span>
      <span className="percent">{`${average.percent}%`}</span>
    </div>
  );
}
