import { Dispatch } from 'react';
import { VEHICLES_LOADED, VEHICLES_LOADING, VEHICLES_LOADING_FAILED } from './actionTypes';
import { RootAction } from './root-state-types';
import { VehicleService } from '../../services/VehicleService';

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
