import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration } from 'chart.js';
import { CostTotal } from '../../../../models/chargeStats';
import { getColor } from '../../helpers';
import { CHART_RADIUS } from '../../constants';

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
    // Always show all rate categories, even if no data
    const allRateTypes = ['Home', 'DC', 'Other', 'Work'];
    
    // Create a complete cost array with all rate types
    const completeCostTotals = allRateTypes.map(rateName => {
      const existingCost = costTotals?.find(ct => ct.name === rateName);
      return existingCost || {
        name: rateName,
        cost: 0,
        color: getColor(rateName)
      };
    });

    const config: ChartConfiguration = {
      type: 'bar',
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            display: false,
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: false
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          title: { 
            display: !!title, 
            text: title + (totalCost > 0 ? ` - Total: $${totalCost.toFixed(2)}` : '')
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const cost = Number(context.parsed.x);
                const percentage = totalCost > 0 ? Math.round((cost / totalCost) * 100) : 0;
                return `${context.dataset.label}: $${cost.toFixed(2)} (${percentage}%)`;
              }
            }
          },
          legend: {
            display: false
          }
        },
        interaction: {
          intersect: false
        },
        animation: false,
        onHover: function() {
          // Disable hover animations to prevent redraw
        }
      },
      plugins: [{
        id: 'costLabels',
        afterDatasetsDraw: function(chart) {
          const ctx = chart.ctx;
          
          chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            
            meta.data.forEach((bar, index) => {
              const value = dataset.data[index] as number;
              ctx.fillStyle = '#666';
              ctx.font = 'bold 12px Arial';
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              
              const text = `$${Math.round(value)}`;
              const x = bar.x + 5; // 5px padding from end of bar
              const y = bar.y;
              
              ctx.fillText(text, x, y);
            });
          });
        }
      }],
      data: {
        labels: completeCostTotals.map(ct => ct.name),
        datasets: [{
          label: 'Cost',
          data: completeCostTotals.map(ct => ct.cost),
          backgroundColor: completeCostTotals.map(ct => ct.color),
          borderRadius: CHART_RADIUS,
          borderSkipped: false,
          barThickness: 10
        }]
      }
    };

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

  const allRateTypes = ['Home', 'DC', 'Other', 'Work'];

  return (
    <div style={{ 
      marginTop: '24px',
      height: Math.max(180, allRateTypes.length * 35 + 80) + 'px'
    }}>
      <canvas ref={chartCanvasRef} />
    </div>
  );
}