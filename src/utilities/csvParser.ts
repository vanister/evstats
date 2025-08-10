/**
 * Lightweight CSV parser utility for vehicle import functionality.
 * No external dependencies - implements basic CSV parsing with quote support.
 */

export type CsvParseResult<T = Record<string, string>> = {
  data: T[];
  headers: string[];
  errors: string[];
};

/**
 * Parses CSV content into an array of objects with headers as keys.
 * Supports quoted fields and basic CSV escaping.
 */
export function parseCSV<T = Record<string, string>>(csvContent: string): CsvParseResult<T> {
  const errors: string[] = [];
  const lines = csvContent?.trim().split('\n') ?? [];

  if (lines.length === 0) {
    return { data: [], headers: [], errors: ['CSV file is empty'] };
  }

  // Parse headers
  const headerLine = lines[0];
  const headers = parseCsvLine(headerLine);

  if (headers.length === 0) {
    return { data: [], headers: [], errors: ['No headers found in CSV'] };
  }

  // Parse data rows
  const data: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      continue;
    }

    try {
      const values = parseCsvLine(line);

      // Create object from headers and values
      const rowData: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowData[header.trim()] = values[index]?.trim() || '';
      });

      data.push(rowData as T);
    } catch (error) {
      errors.push(`Row ${i + 1}: ${error.message}`);
    }
  }

  return { data, headers, errors };
}

/**
 * Parses a single CSV line, handling quoted fields and basic escaping.
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(currentField);
      currentField = '';
      i++;
    } else {
      // Regular character
      currentField += char;
      i++;
    }
  }

  // Add the last field
  result.push(currentField);

  return result;
}

/**
 * Validates that the CSV has the required vehicle columns.
 */
export function validateVehicleCsvHeaders(headers: string[]): string[] {
  const errors: string[] = [];
  const requiredHeaders = ['make', 'model', 'year'];
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());

  for (const required of requiredHeaders) {
    if (!normalizedHeaders.includes(required)) {
      errors.push(`Missing required column: ${required}`);
    }
  }

  return errors;
}

/**
 * Normalizes headers to match VehicleDbo property names.
 */
export function normalizeVehicleHeaders(headers: string[]): string[] {
  const headerMap: Record<string, string> = {
    'battery size': 'battery_size',
    batterysize: 'battery_size',
    battery: 'battery_size',
    kWh: 'battery_size',
    kwh: 'battery_size'
  };

  return headers.map((header) => {
    const normalized = header.toLowerCase().trim();
    return headerMap[normalized] || normalized;
  });
}
