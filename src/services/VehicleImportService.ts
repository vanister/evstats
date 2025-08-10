import { Vehicle, VehicleDbo } from '../models/vehicle';
import { VehicleService } from './VehicleService';
import { validateVehicle, sanitizeVehicle } from '../utilities/vehicleValidation';
import { parseCSV, validateVehicleCsvHeaders, normalizeVehicleHeaders } from '../utilities/csvParser';
import { BaseService } from './BaseService';

export type ParsedVehicle = VehicleDbo & {
  rowNumber: number;
  errors: string[];
  isValid: boolean;
};

export type ImportResult = {
  total: number;
  success: number;
  failed: number;
  errors: { row: number; message: string }[];
  importedVehicles: Vehicle[];
};

export type ImportValidationResult = {
  isValid: boolean;
  errors: string[];
  vehicles: ParsedVehicle[];
};

export interface VehicleImportService {
  validateCsvContent(csvContent: string): ImportValidationResult;
  importVehicles(vehicles: ParsedVehicle[]): Promise<ImportResult>;
}

export class EvsVehicleImportService extends BaseService implements VehicleImportService {
  constructor(private vehicleService: VehicleService) {
    super();
  }

  /**
   * Validates CSV content and parses vehicles for preview.
   */
  validateCsvContent(csvContent: string): ImportValidationResult {
    const parseResult = parseCSV(csvContent);
    const errors: string[] = [...parseResult.errors];

    // Validate headers
    const normalizedHeaders = normalizeVehicleHeaders(parseResult.headers);
    const headerErrors = validateVehicleCsvHeaders(normalizedHeaders);
    errors.push(...headerErrors);

    if (headerErrors.length > 0) {
      return {
        isValid: false,
        errors,
        vehicles: []
      };
    }

    // Parse and validate each vehicle
    const vehicles: ParsedVehicle[] = [];
    
    for (let i = 0; i < parseResult.data.length; i++) {
      const rowData = parseResult.data[i];
      const rowNumber = i + 2; // +2 because we start from row 1 and skip header
      
      try {
        const parsedVehicle = this.parseVehicleFromCsvRow(rowData, normalizedHeaders, rowNumber);
        vehicles.push(parsedVehicle);
      } catch (error) {
        vehicles.push({
          id: 0,
          make: '',
          model: '',
          year: 0,
          range: 0,
          rowNumber,
          errors: [error.message],
          isValid: false
        });
      }
    }

    const hasValidVehicles = vehicles.some(v => v.isValid);
    const globalErrors = vehicles.filter(v => !v.isValid).length === vehicles.length 
      ? ['No valid vehicles found in CSV'] 
      : [];

    return {
      isValid: hasValidVehicles && errors.length === 0,
      errors: [...errors, ...globalErrors],
      vehicles
    };
  }

  /**
   * Imports valid vehicles to the database.
   */
  async importVehicles(vehicles: ParsedVehicle[]): Promise<ImportResult> {
    const validVehicles = vehicles.filter(v => v.isValid);
    const result: ImportResult = {
      total: vehicles.length,
      success: 0,
      failed: vehicles.length - validVehicles.length,
      errors: vehicles.filter(v => !v.isValid).map(v => ({
        row: v.rowNumber,
        message: v.errors.join(', ')
      })),
      importedVehicles: []
    };

    // Import valid vehicles one by one
    for (const vehicleDbo of validVehicles) {
      try {
        // Convert DBO to Vehicle (excluding rowNumber, errors, isValid)
        const vehicle: Vehicle = {
          make: vehicleDbo.make,
          model: vehicleDbo.model,
          year: vehicleDbo.year,
          nickname: vehicleDbo.nickname || undefined,
          trim: vehicleDbo.trim || undefined,
          vin: vehicleDbo.vin || undefined,
          batterySize: vehicleDbo.battery_size || undefined,
          range: vehicleDbo.range || undefined
        };

        const savedVehicle = await this.vehicleService.add(vehicle);
        result.importedVehicles.push(savedVehicle);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: vehicleDbo.rowNumber,
          message: error.message || 'Failed to save vehicle'
        });
      }
    }

    return result;
  }

  /**
   * Parses a single CSV row into a ParsedVehicle.
   */
  private parseVehicleFromCsvRow(
    rowData: Record<string, string>, 
    headers: string[], 
    rowNumber: number
  ): ParsedVehicle {
    const errors: string[] = [];

    // Extract and convert data
    const make = rowData['make'] || '';
    const model = rowData['model'] || '';
    const yearStr = rowData['year'] || '';
    const nicknameStr = rowData['nickname'] || '';
    const trimStr = rowData['trim'] || '';
    const vinStr = rowData['vin'] || '';
    const batterySizeStr = rowData['battery_size'] || '';
    const rangeStr = rowData['range'] || '';

    // Convert numeric fields
    let year = 0;
    let batterySize: number | undefined;
    let range: number | undefined;

    // Parse year (required)
    if (yearStr) {
      const parsedYear = parseInt(yearStr, 10);
      if (isNaN(parsedYear)) {
        errors.push('Year must be a valid number');
      } else {
        year = parsedYear;
      }
    }

    // Parse battery size (optional)
    if (batterySizeStr) {
      const parsed = parseFloat(batterySizeStr);
      if (isNaN(parsed)) {
        errors.push('Battery size must be a valid number');
      } else {
        batterySize = parsed;
      }
    }

    // Parse range (optional)
    if (rangeStr) {
      const parsed = parseInt(rangeStr, 10);
      if (isNaN(parsed)) {
        errors.push('Range must be a valid number');
      } else {
        range = parsed;
      }
    }

    // Create vehicle object for validation
    const vehicle: Vehicle = {
      make,
      model,
      year,
      nickname: nicknameStr || undefined,
      trim: trimStr || undefined,
      vin: vinStr || undefined,
      batterySize,
      range
    };

    // Sanitize and validate
    const sanitizedVehicle = sanitizeVehicle(vehicle);
    const validationError = validateVehicle(sanitizedVehicle);
    
    if (validationError) {
      errors.push(validationError);
    }

    const isValid = errors.length === 0;

    return {
      id: 0, // Will be set by database
      make: sanitizedVehicle.make,
      model: sanitizedVehicle.model,
      year: sanitizedVehicle.year,
      nickname: sanitizedVehicle.nickname || undefined,
      trim: sanitizedVehicle.trim || undefined,
      vin: sanitizedVehicle.vin || undefined,
      battery_size: sanitizedVehicle.batterySize,
      range: sanitizedVehicle.range || 0,
      rowNumber,
      errors,
      isValid
    };
  }
}
