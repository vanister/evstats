import { produce } from 'immer';
import { RootAction, RootState } from './root-state-types';
import {
  INITIALIZED,
  INITIALIZING,
  RATE_TYPES_LOADED,
  RATE_TYPES_LOADING_FAILED,
  VEHICLES_LOADED,
  VEHICLES_LOADING_FAILED
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
      case INITIALIZING:
        draft.initialized = false;
        break;

      case INITIALIZED:
        draft.initialized = true;
        draft.error = null;
        break;

      case VEHICLES_LOADED:
        draft.vehicles = payload!.vehicles!;
        draft.error = null;
        break;

      case VEHICLES_LOADING_FAILED:
        draft.error = payload!.error;
        break;

      case RATE_TYPES_LOADED:
        draft.rateTypes = payload!.rateTypes!;
        draft.error = null;
        break;

      case RATE_TYPES_LOADING_FAILED:
        draft.error = payload!.error;
        break;

      default:
        break;
    }
  });
}
