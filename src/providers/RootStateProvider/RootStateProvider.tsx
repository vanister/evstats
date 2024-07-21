import { createContext, Dispatch, ReactNode, useEffect, useReducer } from 'react';
import { RootAction, RootState } from './root-state-types';
import { INITIAL_ROOT_STATE, rootReducer } from './reducer';
import { loadRateTypes, loadVehicles } from './actions';
import {
  ROOT_INITIALIZED,
  ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
  ROOT_SET_LAST_SELECTED_VEHICLE_ID
} from './actionTypes';
import { useServices } from '../ServiceProvider';
import { useImmerState } from '../../hooks/useImmerState';

export type RootStateProviderProps = {
  children: ReactNode;
};

export type RootStateContextType = {
  state: RootState | null;
  dispatch: Dispatch<RootAction> | null;
};

export const RootStateContext = createContext<RootStateContextType>({
  state: null,
  dispatch: null
});

const ROOT_LOCAL_STATE = {
  rateTypesLoaded: false,
  vehiclesLoaded: false,
  previousSelectionLoaded: false
};

export function RootStateProvider({ children }: RootStateProviderProps) {
  const [localState, setLocalState] = useImmerState(ROOT_LOCAL_STATE);
  const [state, dispatch] = useReducer(rootReducer, INITIAL_ROOT_STATE);
  const { rateService, vehicleService } = useServices();

  // todo - move thse hooks into a useRootState hook
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
      payload: { lastSelectedVehicleId: state.rateTypes[0]?.id }
    });

    dispatch({
      type: ROOT_SET_LAST_SELECTED_VEHICLE_ID,
      payload: { lastSelectedVehicleId: state.vehicles[0]?.id }
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

  const _setLastRateTypeUsed = (rateTypeId: number) => {
    // store in local storage
    dispatch({
      type: ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
      payload: { lastSelectedRateTypeId: rateTypeId }
    });
  };

  const _setLastVehicleIdUsed = (vehicleId: number) => {
    // store in local storage
    dispatch({
      type: ROOT_SET_LAST_SELECTED_VEHICLE_ID,
      payload: { lastSelectedRateTypeId: vehicleId }
    });
  };

  return (
    <RootStateContext.Provider value={{ state, dispatch }}>{children}</RootStateContext.Provider>
  );
}
