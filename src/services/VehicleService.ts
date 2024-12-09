import { NotFoundError } from '../errors/NotFoundError';
import { Vehicle } from '../models/vehicle';
import { VehicleRepository } from '../repositories/VehicleRepository';

export interface VehicleService {
  list(): Promise<Vehicle[]>;
  get(id: number): Promise<Vehicle>;
  add(vehicle: Vehicle): Promise<Vehicle>;
  update(vehicle: Vehicle): Promise<void>;
  remove(id: number): Promise<boolean>;
}

export class EvsVehicleService implements VehicleService {
  constructor(private vehicleRepository: VehicleRepository) {}

  async list(): Promise<Vehicle[]> {
    return this.vehicleRepository.list();
  }

  async get(id: number): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.get(id);

    if (!vehicle) {
      throw new NotFoundError();
    }

    return vehicle;
  }

  async add(vehicle: Vehicle): Promise<Vehicle> {
    const newVehicle = this.vehicleRepository.add(vehicle);

    return newVehicle;
  }

  async update(vehicle: Vehicle): Promise<void> {
    const existing = await this.get(vehicle.id);
    const updates: Vehicle = { ...existing, ...vehicle };

    await this.vehicleRepository.update(updates);
  }

  async remove(id: number): Promise<boolean> {
    const removed = await this.vehicleRepository.remove(id);

    return removed;
  }
}
