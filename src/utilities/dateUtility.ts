import { format, parse } from 'date-fns';

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
