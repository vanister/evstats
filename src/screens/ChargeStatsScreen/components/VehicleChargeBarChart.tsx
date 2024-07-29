import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration } from 'chart.js';
import { ChargeStatData } from '../../../services/ChargeStatsService';

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

  useEffect(() => {
    // todo - clean up
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
      <canvas ref={chartCanvasRef} id="vehicle-charge-bar-chart-canvas"></canvas>
    </div>
  );
}
