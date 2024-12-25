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
