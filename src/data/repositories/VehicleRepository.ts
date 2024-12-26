import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { VehicleSql } from '../sql/VehicleSql';
import { DboKeys } from './repositories-types';
import { VehicleDbo } from '../../models/vehicle';

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

  async update(_vehicle: VehicleDbo): Promise<number> {
    const updatedValues = [];
    const { changes } = await this.context.run(VehicleSql.Update, updatedValues);

    return changes.changes;
  }

  async remove(id: number): Promise<boolean> {
    const { changes } = await this.context.run(VehicleSql.Delete, [id]);

    return changes.changes > 0;
  }

  // todo - base reposi
  protected getValues(dbo: VehicleDbo, except: DboKeys<VehicleDbo>[] = []): unknown[] {
    const values = Object.keys(dbo)
      .filter((key) => !except.includes(key as DboKeys<VehicleDbo>))
      .sort()
      .map((key) => dbo[key]);

    return values;
  }
}
