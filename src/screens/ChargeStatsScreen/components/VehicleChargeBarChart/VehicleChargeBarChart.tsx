import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration } from 'chart.js';
import { ChargeStatData } from '../../../../services/ChargeStatsService';
import ChargeSummary, { ChargeAverage } from './ChargeSummary';

export type VehicleChargeBarChartProps = {
  data: ChargeStatData;
  title?: string;
};

const DEFAULT_RADIUS = 10;
const CHART_TYPE = 'bar';

export default function VehicleChargeBarChart({ data, title }: VehicleChargeBarChartProps) {
  const chart = useRef<Chart>();
  const chartCanvasRef = useRef<HTMLCanvasElement>();
  const [chartConfig, setChartConfig] = useState<ChartConfiguration>(null);

  const averages: ChargeAverage[] = [
    { name: 'Home', color: '#004D80', percent: 75 },
    { name: 'Work', color: '#F27200', percent: 0 },
    { name: 'Other', color: '#929292', percent: 20 },
    { name: 'DC', color: '#B51700', percent: 5 }
  ];

  useEffect(() => {
    if (!data) {
      return;
    }

    const { labels } = data;
    const datasets = data.datasets.map((ds) => ({ borderRadius: DEFAULT_RADIUS, ...ds }));
    const config: ChartConfiguration = {
      type: CHART_TYPE,
      options: {
        animation: false,
        responsive: true,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        },
        plugins: {
          title: { display: true, text: title }
        }
      },
      data: {
        // the x-axis labels
        labels,
        datasets
      }
    };

    setChartConfig(config);
  }, [data]);

  useLayoutEffect(() => {
    if (!chartConfig) {
      return;
    }

    chart.current = new Chart(chartCanvasRef.current, chartConfig);

    return () => {
      chart.current?.destroy();
    };
  }, [chartConfig]);

  return (
    <div className="vehicle-charge-bar-chart">
      <canvas ref={chartCanvasRef} id="vehicle-charge-bar-chart-canvas" height={250}></canvas>
      <ChargeSummary averages={averages} />
    </div>
  );
}
