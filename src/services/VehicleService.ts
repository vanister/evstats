import { NotFoundError } from '../errors/NotFoundError';
import { Vehicle, VehicleDbo } from '../models/vehicle';
import { VehicleRepository } from '../repositories/VehicleRepository';

export interface VehicleService {
  list(): Promise<Vehicle[]>;
  get(id: number): Promise<Vehicle>;
  add(vehicle: Vehicle): Promise<Vehicle>;
  update(vehicle: Vehicle): Promise<void>;
  remove(id: number): Promise<boolean>;
}

type PropertyRecord<From, To> = Record<keyof From, keyof To>;
type DboPropertyRecord = PropertyRecord<VehicleDbo, Vehicle>;
type VehiclePropertyRecord = PropertyRecord<Vehicle, VehicleDbo>;

export class EvsVehicleService implements VehicleService {
  private vehicleToDboPropMap: Partial<VehiclePropertyRecord> = {
    batterySize: 'battery_size'
  };

  private dboToVehiclePropMap: Partial<DboPropertyRecord> = {
    battery_size: 'batterySize'
  };

  constructor(private vehicleRepository: VehicleRepository) {}

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
    const vehicle: Vehicle = this.map(dbo, this.dboToVehiclePropMap);

    return vehicle;
  }

  private toVehicleDbo(vehicle: Vehicle): VehicleDbo {
    const dbo: VehicleDbo = this.map(vehicle, this.vehicleToDboPropMap);

    return dbo;
  }

  // todo - move to base service
  /**
   * Maps proeprties that exists in a property map from one object to a new object.
   *
   * `From` the given object.
   *
   * `PropMap` the map of properties to look up for properties that are not a 1:1 match.
   *
   * `To` is the new object that is created from the mapping.
   *
   * @param from The object with the values to map proeprties from.
   * @param propertyMap The property map to use for lookup.
   */
  protected map<From, PropMap, To>(from: From, propertyMap: PropMap): To {
    const to = Object.entries(from).reduce((prev, [key, value]) => {
      const mappedKey: string = propertyMap[key] ?? key;

      return { ...prev, [mappedKey]: value };
    }, {} as To);

    return to;
  }
}
