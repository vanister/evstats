import { ChartConfiguration } from 'chart.js';
import { getDateFromDaysAgo } from './helpers';
import { CHART_RADIUS, CHART_TYPE, BAR_THICKNESS } from './constants';
import { CreateChartConfigOptions } from './charge-stats-types';

export function createChartConfig({
  data,
  title,
  today,
  isLast31Days = true,
  currentPeriod
}: CreateChartConfigOptions): ChartConfiguration {
  const { labels } = data;
  const datasets = data.datasets.map((ds) => ({
    borderRadius: CHART_RADIUS,
    barThickness: BAR_THICKNESS,
    ...ds
  }));

  return {
    type: CHART_TYPE,
    options: {
      animation: false,
      responsive: true,
      scales: {
        x: {
          stacked: true,
          ticks: {
            callback: createDateTickCallback(today, isLast31Days, currentPeriod),
            maxTicksLimit: 6,
            autoSkip: true
          },
          grid: {
            display: false
          }
        },
        y: {
          stacked: true,
          position: 'right',
          title: {
            display: true,
            text: 'kWh'
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        title: { display: true, text: title },
        tooltip: {
          callbacks: {
            title: createTooltipTitleCallback(today, isLast31Days, currentPeriod)
          }
        }
      }
    },
    data: {
      labels,
      datasets
    }
  };
}

function createDateTickCallback(today: Date, isLast31Days: boolean, currentPeriod?: string) {
  return (value: number, _index: number, _ticks: unknown) => {
    if (isLast31Days) {
      // For Last 31 Days view - use the existing logic
      const daysAgo = 30 - value;
      const date = getDateFromDaysAgo(today, daysAgo);

      return date.toLocaleDateString(undefined, {
        month: 'numeric',
        day: 'numeric'
      });
    } else if (currentPeriod) {
      // For monthly view - show actual dates of the month
      if (currentPeriod.includes('-')) {
        // Monthly format: "2025-07"
        const [year, month] = currentPeriod.split('-').map(Number);
        const date = new Date(year, month - 1, value + 1); // value is 0-indexed, dates are 1-indexed
        
        return date.toLocaleDateString(undefined, {
          month: 'numeric',
          day: 'numeric'
        });
      } else {
        // Yearly format: "2025" - show month names
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[value] || '';
      }
    }
    
    // Fallback - just show the label as-is
    return value.toString();
  };
}

function createTooltipTitleCallback(today: Date, isLast31Days: boolean, currentPeriod?: string) {
  return (tooltipItems: { label: string }[]) => {
    const value = +tooltipItems[0].label;
    
    if (isLast31Days) {
      // For Last 31 Days view - use the existing logic
      const daysAgo = 30 - value;
      const date = getDateFromDaysAgo(today, daysAgo);

      return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } else if (currentPeriod) {
      // For monthly view - show actual dates of the month
      if (currentPeriod.includes('-')) {
        // Monthly format: "2025-07"
        const [year, month] = currentPeriod.split('-').map(Number);
        const date = new Date(year, month - 1, value + 1); // value is 0-indexed, dates are 1-indexed
        
        return date.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      } else {
        // Yearly format: "2025" - show month names
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[value] || '';
      }
    }
    
    // Fallback
    return value.toString();
  };
}
