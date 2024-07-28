import { Preferences } from '@capacitor/preferences';
import { RateService } from '../../services/RateService';
import { VehicleService } from '../../services/VehicleService';
import {
  ROOT_RATE_TYPES_LOADED,
  ROOT_RATE_TYPES_LOADING,
  ROOT_RATE_TYPES_LOADING_FAILED,
  ROOT_GET_LAST_SELECTED_RATE_TYPE_ID,
  ROOT_GET_LAST_SELECTED_VEHICLE_ID,
  ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
  ROOT_SET_LAST_SELECTED_VEHICLE_ID,
  ROOT_VEHICLES_LOADED,
  ROOT_VEHICLES_LOADING,
  ROOT_VEHICLES_LOADING_FAILED
} from './actionTypes';
import { RootDispatch } from './root-state-types';
import { PreferenceKeys } from '../../constants';

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

export const getLastUsedRateTypeIdFromStorage = async (dispatch: RootDispatch) => {
  const { value } = await Preferences.get({ key: PreferenceKeys.LastSelectedRateTypeId });
  const lastSelectedRateTypeId = +value || null;

  dispatch({ type: ROOT_GET_LAST_SELECTED_RATE_TYPE_ID, payload: { lastSelectedRateTypeId } });
};

export const getLastUsedVehicleIdFromStorage = async (dispatch: RootDispatch) => {
  const { value } = await Preferences.get({ key: PreferenceKeys.LastSelectedVehicleId });
  const lastSelectedVehicleId = +value || null;

  dispatch({ type: ROOT_GET_LAST_SELECTED_VEHICLE_ID, payload: { lastSelectedVehicleId } });
};

export const setLastUsedRateTypeId = async (id: number, dispatch: RootDispatch) => {
  await Preferences.set({ key: PreferenceKeys.LastSelectedRateTypeId, value: `${id}` });

  dispatch({
    type: ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
    payload: { lastSelectedRateTypeId: id }
  });
};

export const setLastUsedVehicleId = async (id: number, dispatch: RootDispatch) => {
  await Preferences.set({ key: PreferenceKeys.LastSelectedVehicleId, value: `${id}` });

  dispatch({
    type: ROOT_SET_LAST_SELECTED_VEHICLE_ID,
    payload: { lastSelectedVehicleId: id }
  });
};
