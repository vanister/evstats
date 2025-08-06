import { Session } from '../../models/session';
import { parseLocalDate } from '../../utilities/dateUtility';

// Type guard to check if a SessionFormState is a valid Session
export function isValidSession(session: Partial<Session>): session is Session {
  return !!(
    session.date &&
    session.kWh &&
    session.kWh > 0 &&
    session.vehicleId &&
    session.rateTypeId
  );
}

export function validateSession(session: Partial<Session>): string | null {
  if (!session.date) {
    return 'Date is required';
  }

  // Validate date format and parseability
  try {
    const parsedDate = parseLocalDate(session.date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date format';
    }
  } catch (error) {
    return 'Invalid date format';
  }

  if (!session.kWh || session.kWh <= 0) {
    return 'kWh must be a value greater than 0';
  }

  if (!session.vehicleId) {
    return 'Vehicle selection is required';
  }

  if (!session.rateTypeId) {
    return 'Rate type selection is required';
  }

  const rateOverride = session.rateOverride ? +session.rateOverride : null;

  if (rateOverride !== null && (isNaN(rateOverride) || rateOverride <= 0)) {
    return 'Rate override must be a value greater than 0';
  }

  // valid
  return null;
}
