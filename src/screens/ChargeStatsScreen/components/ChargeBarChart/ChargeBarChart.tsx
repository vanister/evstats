import './ChargeBarChart.scss';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration } from 'chart.js';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import ChargeSummary from '../ChargeSummary/ChargeSummary';
import { ChargeStatData } from '../../../../models/chargeStats';
import { createChartConfig } from '../../charge-chart-config';

type ChargeBarChartProps = {
  data: ChargeStatData | null;
  title?: string;
  today?: Date;
};

export default function ChargeBarChart({ data, title, today: todayProp }: ChargeBarChartProps) {
  const chart = useRef<Chart>();
  const chartCanvasRef = useRef<HTMLCanvasElement>();
  const today = useRef(todayProp || new Date());
  const [chartConfig, setChartConfig] = useState<ChartConfiguration | null>(null);
  const [summaryMode, setSummaryMode] = useState<'kwh' | 'percent'>('kwh');

  useEffect(() => {
    if (!data) {
      setChartConfig(null);
      return;
    }

    const config = createChartConfig({
      data,
      title,
      today: today.current
    });

    setChartConfig(config);
  }, [data, title, todayProp]);

  useLayoutEffect(() => {
    if (!chartConfig) {
      return;
    }

    chart.current = new Chart(chartCanvasRef.current, chartConfig);

    return () => {
      chart.current?.destroy();
    };
  }, [chartConfig]);

  if (!data) {
    return null;
  }

  return (
    <div className="vehicle-charge-bar-chart">
      <canvas ref={chartCanvasRef} id="vehicle-charge-bar-chart-canvas" height={250}></canvas>
      
      <IonSegment 
        value={summaryMode} 
        onIonChange={(e) => setSummaryMode(e.detail.value as 'kwh' | 'percent')}
        className="summary-mode-segment"
      >
        <IonSegmentButton value="kwh">
          <IonLabel>kWh</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="percent">
          <IonLabel>%</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      
      <ChargeSummary averages={data.averages} mode={summaryMode} />
    </div>
  );
}
