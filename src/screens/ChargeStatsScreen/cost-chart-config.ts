import { ChartConfiguration } from 'chart.js';
import { CostTotal } from '../../models/chargeStats';
import { 
  CHART_RADIUS, 
  COST_BAR_THICKNESS, 
  COST_LABEL_FONT, 
  COST_LABEL_COLOR, 
  COST_LABEL_PADDING 
} from './constants';
import { getColor } from './helpers';

export type CreateCostChartConfigOptions = {
  costTotals: CostTotal[];
  totalCost: number;
  title?: string;
};

export function createCostChartConfig({
  costTotals,
  totalCost,
  title
}: CreateCostChartConfigOptions): ChartConfiguration {
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

  return {
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
      animation: false
    },
    plugins: [{
      id: 'costLabels',
      afterDatasetsDraw: function(chart) {
        const ctx = chart.ctx;
        
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          
          meta.data.forEach((bar, index) => {
            const value = dataset.data[index] as number;
            ctx.fillStyle = COST_LABEL_COLOR;
            ctx.font = COST_LABEL_FONT;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            
            const text = `$${Math.round(value)}`;
            const x = bar.x + COST_LABEL_PADDING;
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
        barThickness: COST_BAR_THICKNESS
      }]
    }
  };
}