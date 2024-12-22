import { VehicleDbo } from '../models/vehicle';
import { VehicleRepository } from '../repositories/VehicleRepository';
import { MOCK_VEHICLES } from './vehicleData';

export class MockVehicleRepository implements VehicleRepository {
  private vehicles: VehicleDbo[] = [...MOCK_VEHICLES];

  async list(): Promise<VehicleDbo[]> {
    return this.vehicles;
  }

  async get(id: number): Promise<VehicleDbo | undefined> {
    return this.vehicles.find((v) => v.id === id);
  }

  async add(vehicle: VehicleDbo): Promise<number> {
    const id = this.vehicles.length + 1;
    this.vehicles.push({ ...vehicle, id });

    return id;
  }

  async update(vehicle: VehicleDbo): Promise<number> {
    const index = this.vehicles.findIndex((v) => v.id === vehicle.id);
    const existing = this.vehicles[index];

    this.vehicles[index] = { ...existing, ...vehicle };

    return 1;
  }

  async remove(id: number): Promise<boolean> {
    const index = this.vehicles.findIndex((v) => v.id === id);
    this.vehicles.splice(index, 1);

    return true;
  }
}
