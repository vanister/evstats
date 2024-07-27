import { NotFoundError } from '../errors/NotFoundError';
import { Vehicle } from '../models/vehicle';
import { VehicleRepository } from '../repositories/VehicleRepository';

export interface VehicleService {
  list(): Promise<Vehicle[]>;
  get(id: number): Promise<Vehicle>;
  add(vehicle: Vehicle): Promise<Vehicle>;
  update(vehicle: Vehicle): Promise<void>;
  remove(id: number): Promise<void>;
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
    await this.vehicleRepository.update(vehicle);
  }

  async remove(id: number): Promise<void> {
    await this.vehicleRepository.remove(id);
  }
}
