import './ChargeSummary.scss';

export type ChargeAverage = {
  name: string;
  color: string;
  percent: number;
};

export type ChargeSummaryProps = {
  averages: ChargeAverage[];
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
  average: ChargeAverage;
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
