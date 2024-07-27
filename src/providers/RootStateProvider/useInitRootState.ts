import { Dispatch, useEffect, useReducer } from 'react';
import { useImmerState } from '../../hooks/useImmerState';
import { useServices } from '../ServiceProvider';
import { loadRateTypes, loadVehicles } from './actions';
import {
  ROOT_INITIALIZED,
  ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
  ROOT_SET_LAST_SELECTED_VEHICLE_ID
} from './actionTypes';
import { INITIAL_ROOT_STATE, rootReducer } from './reducer';
import { RootAction, RootState } from './root-state-types';

const LOCAL_STATE = {
  rateTypesLoaded: false,
  vehiclesLoaded: false,
  previousSelectionLoaded: false
};

export function useInitRootState(): [RootState, Dispatch<RootAction>] {
  const [rootState, dispatch] = useReducer(rootReducer, INITIAL_ROOT_STATE);
  const [localState, setLocalState] = useImmerState(LOCAL_STATE);
  const { rateService, vehicleService } = useServices();

  useEffect(() => {
    // todo - move into helper or custom hook
    const loadRootState = async () => {
      try {
        await loadVehicles(vehicleService, dispatch);
        await loadRateTypes(rateService, dispatch);

        setLocalState((d) => {
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
    if (!(localState.rateTypesLoaded && localState.vehiclesLoaded)) {
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

    setLocalState((d) => {
      d.previousSelectionLoaded = true;
    });
  }, [localState.rateTypesLoaded, localState.vehiclesLoaded]);

  useEffect(() => {
    const { rateTypesLoaded, vehiclesLoaded, previousSelectionLoaded } = localState;

    if (rateTypesLoaded && vehiclesLoaded && previousSelectionLoaded) {
      dispatch({ type: ROOT_INITIALIZED });
    }
  }, [localState]);

  return [rootState, dispatch];
}
