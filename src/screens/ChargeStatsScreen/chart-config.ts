import { ChartConfiguration } from 'chart.js';
import { getDateFromDaysAgo } from './helpers';
import { CHART_RADIUS, CHART_TYPE } from './constants';
import { CreateChartConfigOptions } from './charge-stats-types';

export function createChartConfig({
  data,
  title,
  today
}: CreateChartConfigOptions): ChartConfiguration {
  const { labels } = data;
  const datasets = data.datasets.map((ds) => ({
    borderRadius: CHART_RADIUS,
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
            callback: createDateTickCallback(today),
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
            title: createTooltipTitleCallback(today)
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

function createDateTickCallback(today: Date) {
  return (value: number, _index: number, _ticks: unknown) => {
    // Since data is reversed but labels are [0,1,2,...,30], 
    // we need to reverse the label value to get the correct date
    const daysAgo = 30 - value;
    const date = getDateFromDaysAgo(today, daysAgo);
    
    // Show month/day format for better readability
    return date.toLocaleDateString(undefined, { 
      month: 'numeric', 
      day: 'numeric' 
    });
  };
}

function createTooltipTitleCallback(today: Date) {
  return (tooltipItems: { label: string }[]) => {
    const value = +tooltipItems[0].label;
    // Since data is reversed but labels are [0,1,2,...,30], 
    // we need to reverse the label value to get the correct date
    const daysAgo = 30 - value;
    const date = getDateFromDaysAgo(today, daysAgo);

    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
}
