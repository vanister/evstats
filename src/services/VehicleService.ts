import { VehicleRepository } from '../data/repositories/VehicleRepository';
import { SessionRepository } from '../data/repositories/SessionRepository';
import { NotFoundError } from '../errors/NotFoundError';
import { Vehicle, VehicleDbo } from '../models/vehicle';
import { BaseService } from './BaseService';
import { PartialPropertyRecord } from './service-types';
import { PreferenceService } from './PreferenceService';
import { PreferenceKeys } from '../constants';
import { SessionSql } from '../data/sql/SessionSql';
import { VehicleSql } from '../data/sql/VehicleSql';
import { DbContext } from '../data/DbContext';

export interface VehicleService {
  list(): Promise<Vehicle[]>;
  get(id: number): Promise<Vehicle>;
  add(vehicle: Vehicle): Promise<Vehicle>;
  update(vehicle: Vehicle): Promise<void>;
  remove(id: number): Promise<boolean>;
  getDefaultVehicleId(): Promise<number | null>;
  setDefaultVehicleId(vehicleId: number): Promise<void>;
}

export class EvsVehicleService extends BaseService implements VehicleService {
  
  private vehicleToDboPropMap: PartialPropertyRecord<Vehicle, VehicleDbo> = {
    batterySize: 'battery_size'
  };

  private dboToVehiclePropMap: PartialPropertyRecord<VehicleDbo, Vehicle> = {
    battery_size: 'batterySize'
  };

  constructor(
    private vehicleRepository: VehicleRepository,
    private sessionRepository: SessionRepository,
    private preferenceService: PreferenceService,
    private context: DbContext
  ) {
    super();
  }

  async list(): Promise<Vehicle[]> {
    const dbos = await this.vehicleRepository.list();
    const vehicles = dbos.map((dbo) => this.toVehicle(dbo));

    return vehicles;
  }

  async get(id: number): Promise<Vehicle> {
    const dbo = await this.vehicleRepository.get(id);

    if (!dbo) {
      throw new NotFoundError();
    }

    const vehicle = this.toVehicle(dbo);

    return vehicle;
  }

  async add(vehicle: Vehicle): Promise<Vehicle> {
    const dbo = this.toVehicleDbo(vehicle);
    const id = await this.vehicleRepository.add(dbo);
    const newVehicle: Vehicle = { ...vehicle, id };

    return newVehicle;
  }

  async update(vehicle: Vehicle): Promise<void> {
    const existing = await this.get(vehicle.id);
    const dbo = this.toVehicleDbo(vehicle);
    const updates = { ...existing, ...dbo };

    await this.vehicleRepository.update(updates);
  }

  async remove(id: number): Promise<boolean> {
    // Use a transaction to ensure data integrity
    // First delete all sessions for this vehicle, then delete the vehicle
    const statements = [
      { statement: SessionSql.DeleteByVehicleId, values: [id] },
      { statement: VehicleSql.Delete, values: [id] }
    ];

    const { changes } = await this.context.executeSet(statements, true);
    const vehicleWasRemoved = changes > 0;

    if (vehicleWasRemoved) {
      // If we're removing the default vehicle, clear the default preference
      const defaultVehicleId = await this.getDefaultVehicleId();
      if (defaultVehicleId === id) {
        await this.preferenceService.remove(PreferenceKeys.DefaultVehicleId);
      }

      // If we're removing the last used vehicle, clear the last used preference
      const lastUsedVehicleId = await this.preferenceService.get<number>(PreferenceKeys.LastUsedVehicleId, 'number');
      if (lastUsedVehicleId === id) {
        await this.preferenceService.remove(PreferenceKeys.LastUsedVehicleId);
      }
    }

    return vehicleWasRemoved;
  }

  async getDefaultVehicleId(): Promise<number | null> {
    return await this.preferenceService.get<number>(PreferenceKeys.DefaultVehicleId, 'number');
  }

  async setDefaultVehicleId(vehicleId: number): Promise<void> {
    await this.preferenceService.set(PreferenceKeys.DefaultVehicleId, vehicleId.toString());
  }

  private toVehicle(dbo: VehicleDbo): Vehicle {
    const vehicle: Vehicle = this.mapFrom(dbo, this.dboToVehiclePropMap);

    return vehicle;
  }

  private toVehicleDbo(vehicle: Vehicle): VehicleDbo {
    const dbo: VehicleDbo = this.mapFrom(vehicle, this.vehicleToDboPropMap);

    return dbo;
  }
}
