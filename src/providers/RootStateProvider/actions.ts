import { Preferences } from '@capacitor/preferences';
import { RateService } from '../../services/RateService';
import { VehicleService } from '../../services/VehicleService';
import {
  ROOT_RATE_TYPES_LOADED,
  ROOT_RATE_TYPES_LOADING,
  ROOT_RATE_TYPES_LOADING_FAILED,
  ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
  ROOT_SET_LAST_SELECTED_VEHICLE_ID,
  ROOT_VEHICLES_LOADED,
  ROOT_VEHICLES_LOADING,
  ROOT_VEHICLES_LOADING_FAILED
} from './actionTypes';
import { RootDispatch, RootState } from './root-state-types';

const LAST_SELECTED_RATE_TYPE_ID = 'LAST_SELECTED_RATE_TYPE_ID';
const LAST_SELECTED_VEHICLE_ID = 'LAST_SELECTED_VEHICLE_ID';

export const loadVehicles = async (vehicleService: VehicleService, dispatch: RootDispatch) => {
  try {
    dispatch({ type: ROOT_VEHICLES_LOADING });

    const vehicles = await vehicleService.list();

    dispatch({ type: ROOT_VEHICLES_LOADED, payload: { vehicles } });
  } catch (error) {
    dispatch({ type: ROOT_VEHICLES_LOADING_FAILED, payload: { error } });
  }
};

export const loadRateTypes = async (rateService: RateService, dispatch: RootDispatch) => {
  try {
    dispatch({ type: ROOT_RATE_TYPES_LOADING });

    const rateTypes = await rateService.list();

    dispatch({ type: ROOT_RATE_TYPES_LOADED, payload: { rateTypes } });
  } catch (error) {
    dispatch({ type: ROOT_RATE_TYPES_LOADING_FAILED, payload: { error } });
  }
};

export const getLastUsedRateTypeId = async (state: RootState, dispatch: RootDispatch) => {
  const { value } = await Preferences.get({ key: LAST_SELECTED_RATE_TYPE_ID });
  const lastSelectedRateTypeId = value ? +value : state.rateTypes[0]?.id;

  dispatch({ type: ROOT_SET_LAST_SELECTED_RATE_TYPE_ID, payload: { lastSelectedRateTypeId } });
};

export const getLastUsedVehicleId = async (state: RootState, dispatch: RootDispatch) => {
  const { value } = await Preferences.get({ key: LAST_SELECTED_VEHICLE_ID });
  const lastSelectedVehicleId = value ? +value : state.rateTypes[0]?.id;

  dispatch({ type: ROOT_SET_LAST_SELECTED_VEHICLE_ID, payload: { lastSelectedVehicleId } });
};
