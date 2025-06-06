import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration } from 'chart.js';
import ChargeSummary from '../ChargeSummary/ChargeSummary';
import { ChargeStatData } from '../../../../models/chargeStats';
import { createChartConfig } from '../../chart-config';

type VehicleChargeBarChartProps = {
  data: ChargeStatData;
  title?: string;
};

// todo - take in a date value for 'today' to allow testing
export default function VehicleChargeBarChart({ data, title }: VehicleChargeBarChartProps) {
  const chart = useRef<Chart>();
  const chartCanvasRef = useRef<HTMLCanvasElement>();
  const today = useRef(new Date());
  const [chartConfig, setChartConfig] = useState<ChartConfiguration>(null);

  useEffect(() => {
    if (!data) {
      return;
    }

    const config = createChartConfig({
      data,
      title,
      today: today.current
    });

    setChartConfig(config);
  }, [data, title]);

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
      <ChargeSummary averages={data?.averages ?? []} />
    </div>
  );
}
