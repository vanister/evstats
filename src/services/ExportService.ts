import { VehicleRepository } from '../data/repositories/VehicleRepository';
import { SessionRepository } from '../data/repositories/SessionRepository';
import { Vehicle } from '../models/vehicle';
import { Session, SessionDbo } from '../models/session';
import { BaseService } from './BaseService';
import { FileExportService } from '../utilities/fileExport';

export interface ExportService {
  exportVehiclesToCsv(): Promise<string>;
  exportSessionsToCsv(): Promise<string>;
  exportAndSaveVehicles(): Promise<void>;
  exportAndSaveSessions(): Promise<void>;
}

export class EvsExportService extends BaseService implements ExportService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly fileExportService: FileExportService
  ) {
    super();
  }

  async exportVehiclesToCsv(): Promise<string> {
    const vehicles = await this.vehicleRepository.list();
    
    if (vehicles.length === 0) {
      return 'make,model,year,battery_size,range,nickname,trim,vin\r\n';
    }

    const headers = 'make,model,year,battery_size,range,nickname,trim,vin';
    const rows = vehicles.map(vehicle => this.vehicleToCsvRow(vehicle));
    
    return [headers, ...rows].join('\r\n');
  }

  async exportSessionsToCsv(): Promise<string> {
    const sessionDbos = await this.sessionRepository.list();
    
    if (sessionDbos.length === 0) {
      return 'date,kwh,vehicle_id,rate_type_id,rate_override\r\n';
    }

    const headers = 'date,kwh,vehicle_id,rate_type_id,rate_override';
    const rows = sessionDbos.map(sessionDbo => this.sessionDboToCsvRow(sessionDbo));
    
    return [headers, ...rows].join('\r\n');
  }

  async exportAndSaveVehicles(): Promise<void> {
    const csv = await this.exportVehiclesToCsv();
    const filename = this.fileExportService.generateExportFilename('vehicles');
    
    await this.fileExportService.exportFile({
      filename,
      content: csv,
      mimeType: 'text/csv'
    });
  }

  async exportAndSaveSessions(): Promise<void> {
    const csv = await this.exportSessionsToCsv();
    const filename = this.fileExportService.generateExportFilename('sessions');
    
    await this.fileExportService.exportFile({
      filename,
      content: csv,
      mimeType: 'text/csv'
    });
  }

  private vehicleToCsvRow(vehicle: Vehicle): string {
    const fields = [
      vehicle.make,
      vehicle.model,
      vehicle.year?.toString() || '',
      vehicle.batterySize?.toString() || '',
      vehicle.range?.toString() || '',
      vehicle.nickname || '',
      vehicle.trim || '',
      vehicle.vin || ''
    ];

    return fields.map(field => this.escapeCsvField(field)).join(',');
  }

  private sessionToCsvRow(session: Session): string {
    const fields = [
      session.date,
      session.kWh.toString(),
      session.vehicleId.toString(),
      session.rateTypeId.toString(),
      session.rateOverride?.toString() || ''
    ];

    return fields.map(field => this.escapeCsvField(field)).join(',');
  }

  private sessionDboToCsvRow(sessionDbo: SessionDbo): string {
    const fields = [
      sessionDbo.date,
      sessionDbo.kwh.toString(),
      sessionDbo.vehicle_id.toString(),
      sessionDbo.rate_type_id.toString(),
      sessionDbo.rate_override?.toString() || ''
    ];

    return fields.map(field => this.escapeCsvField(field)).join(',');
  }

  private escapeCsvField(field: string): string {
    if (!field) return '""';
    
    // If field contains comma, newline, or quote, wrap in quotes and escape internal quotes
    if (field.includes(',') || field.includes('\n') || field.includes('"')) {
      const escaped = field.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    
    return `"${field}"`;
  }
}