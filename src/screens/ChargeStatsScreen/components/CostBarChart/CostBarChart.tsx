import './CostBarChart.scss';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration } from 'chart.js';
import { CostTotal } from '../../../../models/chargeStats';
import { createCostChartConfig } from '../../cost-chart-config';
import { COST_CHART_HEIGHT } from '../../constants';

type CostBarChartProps = {
  costTotals: CostTotal[];
  totalCost: number;
  title?: string;
};

export default function CostBarChart({ costTotals, totalCost, title }: CostBarChartProps) {
  const chart = useRef<Chart>();
  const chartCanvasRef = useRef<HTMLCanvasElement>();
  const [chartConfig, setChartConfig] = useState<ChartConfiguration | null>(null);

  useEffect(() => {
    const config = createCostChartConfig({
      costTotals,
      totalCost,
      title
    });

    setChartConfig(config);
  }, [costTotals, totalCost, title]);

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
    <div className="cost-bar-chart">
      <canvas ref={chartCanvasRef} height={COST_CHART_HEIGHT} />
    </div>
  );
}