import { Dispatch } from 'react';
import {
  ROOT_RATE_TYPES_LOADED,
  ROOT_RATE_TYPES_LOADING,
  ROOT_RATE_TYPES_LOADING_FAILED,
  ROOT_VEHICLES_LOADED,
  ROOT_VEHICLES_LOADING,
  ROOT_VEHICLES_LOADING_FAILED
} from './actionTypes';
import { RootAction } from './root-state-types';
import { VehicleService } from '../../services/VehicleService';
import { RateService } from '../../services/RateService';

export const loadVehicles = async (
  vehicleService: VehicleService,
  dispatch: Dispatch<RootAction>
) => {
  try {
    dispatch({ type: ROOT_VEHICLES_LOADING });

    const vehicles = await vehicleService.list();

    dispatch({ type: ROOT_VEHICLES_LOADED, payload: { vehicles } });
  } catch (error) {
    dispatch({ type: ROOT_VEHICLES_LOADING_FAILED, payload: { error } });
  }
};

export const loadRateTypes = async (rateService: RateService, dispatch: Dispatch<RootAction>) => {
  try {
    dispatch({ type: ROOT_RATE_TYPES_LOADING });

    const rateTypes = await rateService.list();

    dispatch({ type: ROOT_RATE_TYPES_LOADED, payload: { rateTypes } });
  } catch (error) {
    dispatch({ type: ROOT_RATE_TYPES_LOADING_FAILED, payload: { error } });
  }
};
