import { ChargeColors } from '../../constants';

export function getColor(name: string): string {
  switch (name) {
    case 'Work':
      return ChargeColors.Work;

    case 'Other':
      return ChargeColors.Other;

    case 'DC':
      return ChargeColors.DC;

    case 'Home':
    default:
      return ChargeColors.Home;
  }
}

export function getDateFromDaysAgo(baseDate: Date, daysAgo: number) {
  const date = new Date(baseDate);
  date.setDate(baseDate.getDate() - daysAgo);
  return date;
}
