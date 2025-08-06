import { Session } from '../../models/session';
import { parseLocalDate } from '../../utilities/dateUtility';

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

  const rateOverride = +session.rateOverride;

  if (session.rateOverride && (isNaN(rateOverride) || rateOverride <= 0)) {
    return 'Rate override must be a value greater than 0';
  }

  // valid
  return null;
}
