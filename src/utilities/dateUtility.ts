/**
 * Gets today's date in ISO8601 format (YYYY-MM-DD).
 */
export function today(trimDashes = false): string {
  const today = new Date().toISOString().split('T')[0];

  if (trimDashes) {
    return today.replace('-', '');
  }

  return today;
}

/**
 * Safely parses a date string (YYYY-MM-DD) as a local date to avoid timezone issues.
 * This prevents date strings from being interpreted as UTC and shifting to the previous day.
 */
export function parseLocalDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Formats a date string (YYYY-MM-DD) for display using local date parsing.
 * This ensures the correct date is shown regardless of timezone.
 */
export function formatDateForDisplay(dateString: string): string {
  return parseLocalDate(dateString).toLocaleDateString();
}
