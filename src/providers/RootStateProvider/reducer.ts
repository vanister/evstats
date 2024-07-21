import { produce } from 'immer';
import { RootAction, RootState } from './root-state-types';
import {
  ROOT_INITIALIZED,
  ROOT_INITIALIZING,
  ROOT_RATE_TYPES_LOADED,
  ROOT_RATE_TYPES_LOADING_FAILED,
  ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
  ROOT_SET_LAST_SELECTED_VEHICLE_ID,
  ROOT_VEHICLES_LOADED,
  ROOT_VEHICLES_LOADING_FAILED
} from './actionTypes';

export const INITIAL_ROOT_STATE: RootState = {
  initialized: false,
  rateTypes: [],
  vehicles: []
};

export function rootReducer(state: RootState, action: RootAction): RootState {
  const { type, payload } = action;

  return produce(state, (draft) => {
    switch (type) {
      case ROOT_INITIALIZING:
        draft.initialized = false;
        break;

      case ROOT_INITIALIZED:
        draft.initialized = true;
        draft.error = null;
        break;

      case ROOT_VEHICLES_LOADED:
        draft.vehicles = payload!.vehicles!;
        draft.error = null;
        break;

      case ROOT_VEHICLES_LOADING_FAILED:
        draft.error = payload!.error;
        break;

      case ROOT_RATE_TYPES_LOADED:
        draft.rateTypes = payload!.rateTypes!;
        draft.error = null;
        break;

      case ROOT_RATE_TYPES_LOADING_FAILED:
        draft.error = payload!.error;
        break;

      case ROOT_SET_LAST_SELECTED_RATE_TYPE_ID:
        draft.lastSelectedRateTypeId = payload!.lastSelectedRateTypeId;
        break;

      case ROOT_SET_LAST_SELECTED_VEHICLE_ID:
        draft.lastSelectedVehicleId = payload!.lastSelectedVehicleId;
        break;

      default:
        break;
    }
  });
}
