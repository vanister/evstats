import { Dispatch, useEffect, useReducer } from 'react';
import { useImmerState } from '../../hooks/useImmerState';
import { useServices } from '../ServiceProvider';
import {
  loadRateTypes,
  loadVehicles,
  setLastUsedRateTypeId,
  setLastUsedVehicleId
} from './actions';
import { ROOT_INITIALIZE_FAILED, ROOT_INITIALIZED } from './actionTypes';
import { INITIAL_ROOT_STATE, rootReducer } from './reducer';
import { RootAction, RootState } from './root-state-types';

const LOCAL_STATE = {
  rateTypesLoaded: false,
  vehiclesLoaded: false,
  previousSelectionLoaded: false
};

export function useRootState(): [RootState, Dispatch<RootAction>] {
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
        dispatch({ type: ROOT_INITIALIZE_FAILED, payload: { error } });
      }
    };

    loadRootState();
  }, []);

  useEffect(() => {
    if (!(localState.rateTypesLoaded && localState.vehiclesLoaded)) {
      return;
    }

    if (localState.previousSelectionLoaded) {
      return;
    }

    const loadLastUsedRateAndVehicleIds = async () => {
      // look for the previous stored value locally
      await setLastUsedRateTypeId(rootState, dispatch);
      await setLastUsedVehicleId(rootState, dispatch);

      setLocalState((d) => {
        d.previousSelectionLoaded = true;
      });
    };

    loadLastUsedRateAndVehicleIds();
  }, [localState.rateTypesLoaded, localState.vehiclesLoaded, rootState]);

  useEffect(() => {
    const { rateTypesLoaded, vehiclesLoaded, previousSelectionLoaded } = localState;

    if (rateTypesLoaded && vehiclesLoaded && previousSelectionLoaded) {
      dispatch({ type: ROOT_INITIALIZED });
    }
  }, [localState]);

  return [rootState, dispatch];
}
