import { Session } from '../../models/session';

export function validateSession(session: Partial<Session>): string | null {
  // todo - check parsable?
  if (!session.date) {
    return 'Date is required';
  }

  if (!session.kWhAdded || session.kWhAdded <= 0) {
    return 'kWh must be a value greater than 0.';
  }

  if (session.rateOverride && session.rateOverride <= 0) {
    return 'Rate override must be a value greater than 0';
  }

  // valid
  return null;
}
