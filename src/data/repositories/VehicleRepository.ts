import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { VehicleSql } from '../sql/VehicleSql';
import { VehicleDbo } from '../../models/vehicle';
import { BaseRepository } from './BaseRepository';

export interface VehicleRepository {
  list(): Promise<VehicleDbo[]>;
  get(id: number): Promise<VehicleDbo>;
  add(vehicle: VehicleDbo): Promise<number>;
  update(vehicle: VehicleDbo): Promise<number>;
  remove(id: number): Promise<boolean>;
}

export class EvsVehicleRepository extends BaseRepository<VehicleDbo> implements VehicleRepository {
  constructor(context: SQLiteDBConnection) {
    super(context);
  }

  async list(): Promise<VehicleDbo[]> {
    const { values } = await this.context.query(VehicleSql.List);

    return (values as VehicleDbo[]) ?? [];
  }

  async get(id: number): Promise<VehicleDbo> {
    const { values } = await this.context.query(VehicleSql.GetById, [id]);
    const vehicle = values?.[0] as VehicleDbo;

    return vehicle;
  }

  async add(vehicle: VehicleDbo): Promise<number> {
    const values = this.getValues(vehicle, ['id']);
    const { changes } = await this.context.run(VehicleSql.Add, values);
    const id = changes.lastId;

    return id;
  }

  async update(vehicle: VehicleDbo): Promise<number> {
    const valuesWithoutId = this.getValues(vehicle, ['id']);
    // we want id at the end because that's where the where clause is
    const updatedValues = [...valuesWithoutId, vehicle.id];
    const { changes } = await this.context.run(VehicleSql.Update, updatedValues);

    return changes.changes;
  }

  async remove(id: number): Promise<boolean> {
    const { changes } = await this.context.run(VehicleSql.Delete, [id]);

    return changes.changes > 0;
  }
}
