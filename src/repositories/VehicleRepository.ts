import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { VehicleDbo } from '../models/vehicle';
import { VehicleSql } from './sql/VehicleSql';

export interface VehicleRepository {
  list(): Promise<VehicleDbo[]>;
  get(id: number): Promise<VehicleDbo>;
  add(vehicle: VehicleDbo): Promise<number>;
  update(vehicle: VehicleDbo): Promise<number>;
  remove(id: number): Promise<boolean>;
}

export class EvsVehicleRepository implements VehicleRepository {
  constructor(private readonly context: SQLiteDBConnection) {}

  async list(): Promise<VehicleDbo[]> {
    const { values } = await this.context.query(VehicleSql.list);

    return (values as VehicleDbo[]) ?? [];
  }

  async get(id: number): Promise<VehicleDbo> {
    const { values } = await this.context.query(VehicleSql.getById, [id]);
    const vehicle = values?.[0] as VehicleDbo;

    return vehicle;
  }

  async add(_vehicle: VehicleDbo): Promise<number> {
    // todo - get the insert values
    const vehicleValues = [];
    const { changes } = await this.context.run(VehicleSql.add, vehicleValues);
    const id = changes.lastId;

    return id;
  }

  async update(_vehicle: VehicleDbo): Promise<number> {
    const updatedValues = [];
    const { changes } = await this.context.run(VehicleSql.update, updatedValues);

    return changes.changes;
  }

  async remove(id: number): Promise<boolean> {
    const { changes } = await this.context.run(VehicleSql.delete, [id]);

    return changes.changes > 0;
  }
}
