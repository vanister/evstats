import { format, parse, differenceInDays, startOfDay, subDays } from 'date-fns';

/**
 * Gets today's date in ISO8601 format (YYYY-MM-DD).
 */
export function today(trimDashes = false): string {
  const today = format(new Date(), 'yyyy-MM-dd');

  if (trimDashes) {
    return today.replace(/-/g, '');
  }

  return today;
}

/**
 * Gets the start of day for a given date, normalizing the time to 00:00:00.
 */
export function getStartOfDay(date: Date): Date {
  return startOfDay(date);
}

/**
 * Gets the start of today.
 */
export function getStartOfToday(): Date {
  return startOfDay(new Date());
}

/**
 * Calculates the difference in days between two dates.
 */
export function getDaysDifference(dateLeft: Date, dateRight: Date): number {
  return differenceInDays(dateLeft, dateRight);
}

/**
 * Gets a date that is a specified number of days before the given date.
 */
export function getDateFromDaysAgo(baseDate: Date, daysAgo: number): Date {
  return subDays(baseDate, daysAgo);
}

/**
 * Safely parses a date string (YYYY-MM-DD) as a local date to avoid timezone issues.
 * This prevents date strings from being interpreted as UTC and shifting to the previous day.
 */
export function parseLocalDate(dateString: string): Date {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

/**
 * Formats a date string (YYYY-MM-DD) for display using local date parsing.
 * This ensures the correct date is shown regardless of timezone.
 */
export function formatDateForDisplay(dateString: string): string {
  return parseLocalDate(dateString).toLocaleDateString();
}
