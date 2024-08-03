import './ChargeSummary.scss';
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

export type ChargeAverageProps = {
  average: ChargeAverageType;
};

export function ChargeAverage({ average }: ChargeAverageProps) {
  return (
    <div className="charge-average">
      <span className="symbol" style={{ backgroundColor: average.color }}></span>
      <span className="percent">{`${average.percent}%`}</span>
      <span className="name">{average.name}</span>
    </div>
  );
}
