import { RateType } from '../../models/rateType';
import { Vehicle } from '../../models/vehicle';

export type RootStateContextType = {
  state: RootState | undefined;
};

export type RootState = {
  initialized: boolean;
  vehicles: Vehicle[];
  rateTypes: RateType[];
  lastSelectedVehicleId?: number;
  lastSelectedRateTypeId?: number;
  error?: unknown;
};

export type RootPayload = Partial<RootState>;

export type RootAction = { type: string; payload?: RootPayload };
