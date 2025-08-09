import { getDateFromDaysAgo as getDateFromDaysAgoUtil } from '../../utilities/dateUtility';

export function getDateFromDaysAgo(baseDate: Date, daysAgo: number) {
  return getDateFromDaysAgoUtil(baseDate, daysAgo);
}
