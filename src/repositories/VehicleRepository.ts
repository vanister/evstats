import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Vehicle } from '../models/vehicle';
import { VehicleSql } from './sql/VehicleSql';

export interface VehicleRepository {
  list(): Promise<Vehicle[]>;
  get(id: number): Promise<Vehicle>;
  add(vehicle: Vehicle): Promise<Vehicle>;
  update(vehicle: Vehicle): Promise<number>;
  remove(id: number): Promise<boolean>;
}

export class EvsVehicleRepository implements VehicleRepository {
  constructor(private readonly context: SQLiteDBConnection) {}

  async list(): Promise<Vehicle[]> {
    const { values } = await this.context.query(VehicleSql.list);

    return values ?? [];
  }

  async get(id: number): Promise<Vehicle> {
    const { values } = await this.context.query(VehicleSql.getById, [id]);
    // todo - convert to camelCase
    const vehicle = values?.[0];

    return vehicle;
  }

  async add(vehicle: Vehicle): Promise<Vehicle> {
    const vehicleValues = [];
    const { changes } = await this.context.run(VehicleSql.add, vehicleValues);
    const id = changes.lastId;
    const newVehicle: Vehicle = { ...vehicle, id };

    return newVehicle;
  }

  async update(_vehicle: Vehicle): Promise<number> {
    const updatedValues = [];
    const { changes } = await this.context.run(VehicleSql.update, updatedValues);

    return changes.changes;
  }

  async remove(id: number): Promise<boolean> {
    const { changes } = await this.context.run(VehicleSql.delete, [id]);

    return changes.changes > 0;
  }
}
