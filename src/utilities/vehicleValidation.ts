import { Vehicle } from '../models/vehicle';

/**
 * Validates a vehicle object and returns the first validation error message found,
 * or null if the vehicle is valid.
 */
export function validateVehicle(vehicle: Vehicle): string | null {
  // Required field validation (highest priority)
  if (!vehicle.make || vehicle.make.trim().length === 0) {
    return 'Make is required';
  }

  if (!vehicle.model || vehicle.model.trim().length === 0) {
    return 'Model is required';
  }

  if (!vehicle.year) {
    return 'Year is required';
  }

  // Format validation (medium priority)
  if (vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 2) {
    return `Year must be between 1900 and ${new Date().getFullYear() + 2}`;
  }

  // String length validation
  if (vehicle.make && vehicle.make.trim().length > 50) {
    return 'Make must be 50 characters or less';
  }

  if (vehicle.model && vehicle.model.trim().length > 50) {
    return 'Model must be 50 characters or less';
  }

  if (vehicle.trim && vehicle.trim.trim().length > 50) {
    return 'Trim must be 50 characters or less';
  }

  if (vehicle.nickname && vehicle.nickname.trim().length > 50) {
    return 'Nickname must be 50 characters or less';
  }

  // Optional field validation (lower priority)
  if (vehicle.vin && vehicle.vin.trim().length > 0) {
    const vinTrimmed = vehicle.vin.trim();
    if (vinTrimmed.length !== 17) {
      return 'VIN must be exactly 17 characters';
    }
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vinTrimmed)) {
      return 'VIN contains invalid characters';
    }
  }

  if (vehicle.range && vehicle.range < 1) {
    return 'Range must be greater than 0';
  }

  if (vehicle.batterySize && vehicle.batterySize < 1) {
    return 'Battery size must be greater than 0';
  }

  // All validation passed
  return null;
}

/**
 * Sanitizes vehicle data by trimming strings and handling edge cases
 */
export function sanitizeVehicle(vehicle: Vehicle): Vehicle {
  return {
    ...vehicle,
    make: vehicle.make?.trim() || '',
    model: vehicle.model?.trim() || '',
    trim: vehicle.trim?.trim() || '',
    nickname: vehicle.nickname?.trim() || '',
    vin: vehicle.vin?.trim().toUpperCase() || ''
  };
}