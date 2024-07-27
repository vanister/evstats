import { Vehicle } from '../models/vehicle';

const VEHICLES: Vehicle[] = [
  {
    id: 1,
    year: 2022,
    make: 'Ford',
    model: 'Mustang Mach-E',
    trim: 'GT',
    vin: '1FM123AB456CD7890',
    nickname: 'Red Stallion',
    batterySize: 91.0,
    range: 290
  },
  {
    id: 2,
    year: 2021,
    make: 'Tesla',
    model: 'Model 3',
    trim: 'Long Range',
    vin: '5TM123AB456CD7890',
    nickname: 'M3',
    batterySize: 78.0,
    range: 334
  },
  {
    id: 3,
    year: 2023,
    make: 'Rivian',
    model: 'R1S',
    trim: 'Quad Motor',
    vin: '1RM123AB456CD7890',
    batterySize: 131,
    range: 328
  }
];

export interface VehicleRepository {
  list(): Promise<Vehicle[]>;
  get(id: number): Promise<Vehicle>;
  add(vehicle: Vehicle): Promise<Vehicle>;
  update(vehicle: Vehicle): Promise<void>;
  remove(id: number): Promise<void>;
}

export class EvsVehicleRepository implements VehicleRepository {
  private vehicles: Vehicle[] = [...VEHICLES];
  private lastId = 3;

  async list(): Promise<Vehicle[]> {
    return this.vehicles.slice();
  }

  async get(id: number): Promise<Vehicle> {
    const vehicle = this.vehicles.find((v) => v.id === id);

    return vehicle;
  }

  async add(vehicle: Vehicle): Promise<Vehicle> {
    const newVehicle: Vehicle = { ...vehicle, id: ++this.lastId };

    this.vehicles.push(newVehicle);

    return newVehicle;
  }

  async update(vehicle: Vehicle): Promise<void> {
    const existingId = this.vehicles.findIndex((v) => v.id === vehicle.id);

    if (existingId === -1) {
      return null;
    }

    const existing = this.vehicles[existingId];
    const updated = { ...existing, ...vehicle };

    this.vehicles[existingId] = updated;
  }

  async remove(id: number): Promise<void> {
    this.vehicles = this.vehicles.filter((v) => v.id !== id);
  }
}
