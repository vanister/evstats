import { VehicleRepository } from '../data/repositories/VehicleRepository';
import { NotFoundError } from '../errors/NotFoundError';
import { Vehicle, VehicleDbo } from '../models/vehicle';
import { BaseService } from './BaseService';
import { PartialPropertyRecord } from './service-types';

export interface VehicleService {
  list(): Promise<Vehicle[]>;
  get(id: number): Promise<Vehicle>;
  add(vehicle: Vehicle): Promise<Vehicle>;
  update(vehicle: Vehicle): Promise<void>;
  remove(id: number): Promise<boolean>;
}

export class EvsVehicleService extends BaseService implements VehicleService {
  private vehicleToDboPropMap: PartialPropertyRecord<Vehicle, VehicleDbo> = {
    batterySize: 'battery_size'
  };

  private dboToVehiclePropMap: PartialPropertyRecord<VehicleDbo, Vehicle> = {
    battery_size: 'batterySize'
  };

  constructor(private vehicleRepository: VehicleRepository) {
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
    const removed = await this.vehicleRepository.remove(id);

    return removed;
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
