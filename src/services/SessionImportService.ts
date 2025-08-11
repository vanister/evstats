import { Session, SessionDbo } from '../models/session';
import { SessionRepository } from '../data/repositories/SessionRepository';
import { parseCSV } from '../utilities/csvParser';
import { BaseService } from './BaseService';
import { parseLocalDate } from '../utilities/dateUtility';

export type ParsedSession = SessionDbo & {
  rowNumber: number;
  errors: string[];
  isValid: boolean;
};

export type SessionImportResult = {
  total: number;
  success: number;
  failed: number;
  errors: { row: number; message: string }[];
  importedSessions: Session[];
};

export type SessionImportValidationResult = {
  isValid: boolean;
  errors: string[];
  sessions: ParsedSession[];
};

export interface SessionImportService {
  validateCsvContent(csvContent: string): SessionImportValidationResult;
  importSessions(sessions: ParsedSession[]): Promise<SessionImportResult>;
}

export class EvsSessionImportService extends BaseService implements SessionImportService {
  constructor(private sessionRepository: SessionRepository) {
    super();
  }

  /**
   * Validates CSV content and parses sessions for preview.
   */
  validateCsvContent(csvContent: string): SessionImportValidationResult {
    const parseResult = parseCSV(csvContent);
    const errors: string[] = [...parseResult.errors];

    // Validate headers
    const normalizedHeaders = normalizeSessionHeaders(parseResult.headers);
    const headerErrors = validateSessionCsvHeaders(normalizedHeaders);
    errors.push(...headerErrors);

    if (headerErrors.length > 0) {
      return {
        isValid: false,
        errors,
        sessions: []
      };
    }

    // Parse and validate each session
    const sessions: ParsedSession[] = [];

    for (let i = 0; i < parseResult.data.length; i++) {
      const rowData = parseResult.data[i];
      const rowNumber = i + 2; // +2 because we start from row 1 and skip header

      try {
        const parsedSession = this.parseSessionFromCsvRow(rowData, normalizedHeaders, rowNumber);
        sessions.push(parsedSession);
      } catch (error) {
        sessions.push({
          id: 0,
          date: '',
          kwh: 0,
          rate_type_id: 0,
          vehicle_id: 0,
          rate_override: null,
          rowNumber,
          errors: [error.message],
          isValid: false
        });
      }
    }

    const hasValidSessions = sessions.some((s) => s.isValid);
    const globalErrors =
      sessions.filter((s) => !s.isValid).length === sessions.length
        ? ['No valid sessions found in CSV']
        : [];

    return {
      isValid: hasValidSessions && errors.length === 0,
      errors: [...errors, ...globalErrors],
      sessions
    };
  }

  /**
   * Imports valid sessions to the database.
   */
  async importSessions(sessions: ParsedSession[]): Promise<SessionImportResult> {
    const validSessions = sessions.filter((s) => s.isValid);
    const result: SessionImportResult = {
      total: sessions.length,
      success: 0,
      failed: sessions.length - validSessions.length,
      errors: sessions
        .filter((s) => !s.isValid)
        .map((s) => ({
          row: s.rowNumber,
          message: s.errors.join(', ')
        })),
      importedSessions: []
    };

    // Import valid sessions one by one
    for (const parsedSession of validSessions) {
      try {
        // Convert to SessionDbo (excluding rowNumber, errors, isValid)
        const sessionDbo: SessionDbo = {
          id: 0, // Will be set by database
          date: parsedSession.date,
          kwh: parsedSession.kwh,
          rate_type_id: parsedSession.rate_type_id,
          vehicle_id: parsedSession.vehicle_id,
          rate_override: parsedSession.rate_override
        };

        const savedSessionDbo = await this.sessionRepository.add(sessionDbo);

        // Convert back to Session format for result
        const savedSession: Session = {
          id: savedSessionDbo.id,
          date: savedSessionDbo.date,
          kWh: savedSessionDbo.kwh,
          rateTypeId: savedSessionDbo.rate_type_id,
          vehicleId: savedSessionDbo.vehicle_id,
          rateOverride: savedSessionDbo.rate_override || undefined
        };

        result.importedSessions.push(savedSession);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: parsedSession.rowNumber,
          message: error.message || 'Failed to save session'
        });
      }
    }

    return result;
  }

  /**
   * Parses a single CSV row into a ParsedSession.
   */
  private parseSessionFromCsvRow(
    rowData: Record<string, string>,
    headers: string[],
    rowNumber: number
  ): ParsedSession {
    const errors: string[] = [];

    // Extract and convert data
    const dateStr = rowData['date'] || '';
    const kwhStr = rowData['kwh'] || '';
    const vehicleIdStr = rowData['vehicle_id'] || '';
    const rateTypeIdStr = rowData['rate_type_id'] || '';
    const rateOverrideStr = rowData['rate_override'] || '';

    // Parse and validate date
    let date = '';
    if (dateStr) {
      try {
        // Validate date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          errors.push('Date must be in YYYY-MM-DD format');
        } else {
          const parsedDate = parseLocalDate(dateStr);
          if (isNaN(parsedDate.getTime())) {
            errors.push('Invalid date');
          } else {
            date = dateStr;
          }
        }
      } catch {
        errors.push('Invalid date format');
      }
    } else {
      errors.push('Date is required');
    }

    // Parse kWh (required)
    let kwh = 0;
    if (kwhStr) {
      const parsed = parseFloat(kwhStr);
      if (isNaN(parsed) || parsed <= 0) {
        errors.push('kWh must be a positive number');
      } else {
        kwh = parsed;
      }
    } else {
      errors.push('kWh is required');
    }

    // Parse vehicle_id (required)
    let vehicleId = 0;
    if (vehicleIdStr) {
      const parsed = parseInt(vehicleIdStr, 10);
      if (isNaN(parsed) || parsed <= 0) {
        errors.push('Vehicle ID must be a positive integer');
      } else {
        vehicleId = parsed;
      }
    } else {
      errors.push('Vehicle ID is required');
    }

    // Parse rate_type_id (required)
    let rateTypeId = 0;
    if (rateTypeIdStr) {
      const parsed = parseInt(rateTypeIdStr, 10);
      if (isNaN(parsed) || parsed <= 0) {
        errors.push('Rate Type ID must be a positive integer');
      } else {
        rateTypeId = parsed;
      }
    } else {
      errors.push('Rate Type ID is required');
    }

    // Parse rate_override (optional)
    let rateOverride: number | null = null;
    if (rateOverrideStr) {
      const parsed = parseFloat(rateOverrideStr);
      if (isNaN(parsed) || parsed < 0) {
        errors.push('Rate Override must be a non-negative number');
      } else {
        rateOverride = parsed;
      }
    }

    const isValid = errors.length === 0;

    return {
      id: 0, // Will be set by database
      date,
      kwh,
      rate_type_id: rateTypeId,
      vehicle_id: vehicleId,
      rate_override: rateOverride,
      rowNumber,
      errors,
      isValid
    };
  }
}

/**
 * Validates that the CSV has the required session columns.
 */
function validateSessionCsvHeaders(headers: string[]): string[] {
  const errors: string[] = [];
  const requiredHeaders = ['date', 'kwh', 'vehicle_id', 'rate_type_id'];
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());

  for (const required of requiredHeaders) {
    if (!normalizedHeaders.includes(required)) {
      errors.push(`Missing required column: ${required}`);
    }
  }

  return errors;
}

/**
 * Normalizes headers to match SessionDbo property names.
 */
function normalizeSessionHeaders(headers: string[]): string[] {
  const headerMap: Record<string, string> = {
    'vehicle id': 'vehicle_id',
    vehicleid: 'vehicle_id',
    vehicle: 'vehicle_id',
    'rate type id': 'rate_type_id',
    'rate type': 'rate_type_id',
    ratetypeid: 'rate_type_id',
    ratetype: 'rate_type_id',
    'rate id': 'rate_type_id',
    rateid: 'rate_type_id',
    'rate override': 'rate_override',
    rateoverride: 'rate_override',
    override: 'rate_override',
    'custom rate': 'rate_override',
    customrate: 'rate_override',
    'kw h': 'kwh',
    'kw-h': 'kwh',
    kilowatthours: 'kwh',
    'kilowatt hours': 'kwh',
    energy: 'kwh'
  };

  return headers.map((header) => {
    const normalized = header.toLowerCase().trim();
    return headerMap[normalized] || normalized;
  });
}