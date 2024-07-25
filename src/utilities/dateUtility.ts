/**
 * Gets today's date in ISO8601 format (YYYY-MM-DD).
 */
export function today(): string {
  const today = new Date().toISOString().split('T')[0];

  return today;
}
