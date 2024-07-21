import { Dispatch, useEffect, useReducer } from 'react';
import { loadRateTypes, loadVehicles } from './actions';
import { useImmerState } from '../../hooks/useImmerState';
import { useServices } from '../ServiceProvider';
import {
  ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
  ROOT_SET_LAST_SELECTED_VEHICLE_ID,
  ROOT_INITIALIZED
} from './actionTypes';
import { rootReducer, INITIAL_ROOT_STATE } from './reducer';
import { RootAction, RootState } from './root-state-types';

const ROOT_LOCAL_STATE = {
  rateTypesLoaded: false,
  vehiclesLoaded: false,
  previousSelectionLoaded: false
};

export function useInitRootState(): [RootState, Dispatch<RootAction>] {
  const [rootState, dispatch] = useReducer(rootReducer, INITIAL_ROOT_STATE);
  const [state, setState] = useImmerState(ROOT_LOCAL_STATE);
  const { rateService, vehicleService } = useServices();

  // todo - move thse hooks into a useRootState hook
  useEffect(() => {
    // todo - move into helper or custom hook
    const loadRootState = async () => {
      try {
        await loadVehicles(vehicleService, dispatch);
        await loadRateTypes(rateService, dispatch);

        setState((d) => {
          d.rateTypesLoaded = true;
          d.vehiclesLoaded = true;
        });
      } catch (error) {
        // todo - replace with ion-alert
        // unhandled
        alert(`Unexpected error: ${error}`);
      }
    };

    loadRootState();
  }, []);

  useEffect(() => {
    if (!(state.rateTypesLoaded && state.vehiclesLoaded)) {
      return;
    }

    // look for the previous stored value locally
    dispatch({
      type: ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
      payload: { lastSelectedVehicleId: rootState.rateTypes[0]?.id }
    });

    dispatch({
      type: ROOT_SET_LAST_SELECTED_VEHICLE_ID,
      payload: { lastSelectedVehicleId: rootState.vehicles[0]?.id }
    });

    setState((d) => {
      d.previousSelectionLoaded = true;
    });
  }, [state.rateTypesLoaded, state.vehiclesLoaded]);

  useEffect(() => {
    const { rateTypesLoaded, vehiclesLoaded, previousSelectionLoaded } = state;

    if (rateTypesLoaded && vehiclesLoaded && previousSelectionLoaded) {
      dispatch({ type: ROOT_INITIALIZED });
    }
  }, [state]);

  return [rootState, dispatch];
}
