import { ChartConfiguration } from 'chart.js';
import { ChargeStatData } from '../../models/chargeStats';
import { getDateFromDaysAgo } from './helpers';

const DEFAULT_RADIUS = 10;
const CHART_TYPE = 'bar' as const;

type CreateChartConfigOptions = {
  data: ChargeStatData;
  title?: string;
  today: Date;
};

export function createChartConfig({
  data,
  title,
  today
}: CreateChartConfigOptions): ChartConfiguration {
  const { labels } = data;
  const datasets = data.datasets.map((ds) => ({
    borderRadius: DEFAULT_RADIUS,
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
            callback: createDateTickCallback(today)
          }
        },
        y: {
          stacked: true,
          position: 'right',
          title: {
            display: true,
            text: 'kWh'
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
  return (value: number) => getDateFromDaysAgo(today, value).getDate();
}

function createTooltipTitleCallback(today: Date) {
  return (tooltipItems: { label: string }[]) => {
    const value = +tooltipItems[0].label;
    const date = getDateFromDaysAgo(today, value);

    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
}
