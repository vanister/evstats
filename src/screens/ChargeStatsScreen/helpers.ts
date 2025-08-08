import { ChargeColors } from '../../constants';
import { getDateFromDaysAgo as getDateFromDaysAgoUtil } from '../../utilities/dateUtility';

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
  return getDateFromDaysAgoUtil(baseDate, daysAgo);
}
