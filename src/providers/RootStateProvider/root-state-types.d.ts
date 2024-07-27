import { Dispatch } from 'react';
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
  error?: Error;
};

export type RootPayload = Partial<RootState>;

export type RootAction = { type: string; payload?: RootPayload };

export type RootDispatch = Dispatch<RootAction>;
