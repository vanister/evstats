import { format, parse, differenceInDays, startOfDay, subDays, addMonths, subMonths, addYears, subYears } from 'date-fns';

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

/**
 * Gets the current month in YYYY-MM format.
 */
export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

/**
 * Gets the current year as a string.
 */
export function getCurrentYear(): string {
  return format(new Date(), 'yyyy');
}

/**
 * Subtracts one month from a date and returns it in YYYY-MM format.
 */
export function getPreviousMonth(yearMonthString: string): string {
  const [year, month] = yearMonthString.split('-').map(Number);
  const date = new Date(year, month - 1); // month - 1 because Date constructor uses 0-based months
  const previousMonth = subMonths(date, 1);
  return format(previousMonth, 'yyyy-MM');
}

/**
 * Adds one month to a date and returns it in YYYY-MM format.
 */
export function getNextMonth(yearMonthString: string): string {
  const [year, month] = yearMonthString.split('-').map(Number);
  const date = new Date(year, month - 1); // month - 1 because Date constructor uses 0-based months
  const nextMonth = addMonths(date, 1);
  return format(nextMonth, 'yyyy-MM');
}

/**
 * Subtracts one year from a year string.
 */
export function getPreviousYear(yearString: string): string {
  const year = parseInt(yearString, 10);
  const date = new Date(year, 0, 1);
  const previousYear = subYears(date, 1);
  return format(previousYear, 'yyyy');
}

/**
 * Adds one year to a year string.
 */
export function getNextYear(yearString: string): string {
  const year = parseInt(yearString, 10);
  const date = new Date(year, 0, 1);
  const nextYear = addYears(date, 1);
  return format(nextYear, 'yyyy');
}

/**
 * Formats a month string (YYYY-MM) for display.
 */
export function formatMonthForDisplay(yearMonthString: string): string {
  const [year, month] = yearMonthString.split('-').map(Number);
  const date = new Date(year, month - 1);
  return format(date, 'MMMM yyyy');
}
