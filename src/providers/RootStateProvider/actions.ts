import { Dispatch } from 'react';
import {
  RATE_TYPES_LOADED,
  RATE_TYPES_LOADING,
  RATE_TYPES_LOADING_FAILED,
  VEHICLES_LOADED,
  VEHICLES_LOADING,
  VEHICLES_LOADING_FAILED
} from './actionTypes';
import { RootAction } from './root-state-types';
import { VehicleService } from '../../services/VehicleService';
import { RateService } from '../../services/RateService';

export const loadVehicles = async (
  vehicleService: VehicleService,
  dispatch: Dispatch<RootAction>
) => {
  try {
    dispatch({ type: VEHICLES_LOADING });

    const vehicles = await vehicleService.list();

    dispatch({ type: VEHICLES_LOADED, payload: { vehicles } });
  } catch (error) {
    dispatch({ type: VEHICLES_LOADING_FAILED, payload: { error } });
  }
};

export const loadRateTypes = async (rateService: RateService, dispatch: Dispatch<RootAction>) => {
  try {
    dispatch({ type: RATE_TYPES_LOADING });

    const rateTypes = await rateService.list();

    dispatch({ type: RATE_TYPES_LOADED, payload: { rateTypes } });
  } catch (error) {
    dispatch({ type: RATE_TYPES_LOADING_FAILED, payload: { error } });
  }
};
