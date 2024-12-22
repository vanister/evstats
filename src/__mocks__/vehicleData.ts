import { VehicleDbo } from '../models/vehicle';

export const MOCK_VEHICLES: VehicleDbo[] = [
  {
    id: 1,
    year: 2022,
    make: 'Ford',
    model: 'Mustang Mach-E',
    trim: 'GT',
    vin: '1FM123AB456CD7890',
    nickname: 'Red Stallion',
    battery_size: 91.0,
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
    battery_size: 78.0,
    range: 334
  },
  {
    id: 3,
    year: 2023,
    make: 'Rivian',
    model: 'R1S',
    trim: 'Quad Motor',
    vin: '1RM123AB456CD7890',
    battery_size: 131,
    range: 328
  }
];
