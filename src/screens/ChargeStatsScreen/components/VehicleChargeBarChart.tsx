import { useLayoutEffect, useRef } from 'react';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  LinearScale
} from 'chart.js';

export type VehicleChargeBarChartProps = {
  // data: any[];
  // labels: any[];
  // title?: string;
};

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

export default function VehicleChargeBarChart(_props: VehicleChargeBarChartProps) {
  const chart = useRef<Chart>();
  const chartCanvasRef = useRef<HTMLCanvasElement>();
  const chartOptions: ChartConfiguration = {
    type: 'bar',
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    },
    data: {
      // the x-axis labels
      labels: ['January', 'February', 'March', 'April'],
      datasets: [
        {
          label: 'Home',
          // must match the labels length?
          data: [15, 23, 56, 10],
          backgroundColor: 'Blue',
          borderRadius: 10
        },
        {
          label: 'Work',
          data: [25, 0, 46, 9],
          backgroundColor: 'Orange',
          borderRadius: 10
        },
        {
          label: 'Other',
          data: [8, 33, 26, 12],
          backgroundColor: 'Gray',
          borderRadius: 10
        },
        {
          label: 'DC',
          data: [40, 14, 32, 8],
          backgroundColor: 'Red',
          borderRadius: 10
        }
      ]
    }
  };

  useLayoutEffect(() => {
    chart.current = new Chart(chartCanvasRef.current, chartOptions);

    return () => {
      chart.current?.destroy();
    };
  }, []);

  return (
    <div className="vehicle-charge-bar-chart">
      <canvas ref={chartCanvasRef} id="vehicle-charge-bar-chart-canvas"></canvas>
    </div>
  );
}
