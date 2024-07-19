import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { RootState } from './root-state-types';
import { INITIAL_ROOT_STATE, rootReducer } from './reducer';
import { loadRateTypes, loadVehicles } from './actions';
import { ROOT_INITIALIZED } from './actionTypes';
import { useServices } from '../ServiceProvider';
import { useImmerState } from '../../hooks/useImmerState';

export type RootStateProviderProps = {
  children: ReactNode;
};
export const RootStateContext = createContext<RootState | null>(null);

const ROOT_LOCAL_STATE = {
  rateTypesLoaded: false,
  vehiclesLoaded: false,
  previousSelectionLoaded: false
};

export function RootStateProvider({ children }: RootStateProviderProps) {
  const [localState, setLocalState] = useImmerState(ROOT_LOCAL_STATE);
  const [state, dispatch] = useReducer(rootReducer, INITIAL_ROOT_STATE);
  const { rateService, vehicleService } = useServices();

  useEffect(() => {
    // todo - move into helper or custom hook
    const loadRootState = async () => {
      console.log('loading root state');

      try {
        await loadVehicles(vehicleService, dispatch);
        await loadRateTypes(rateService, dispatch);

        setLocalState((d) => {
          d.rateTypesLoaded = true;
          d.vehiclesLoaded = true;
        });

        console.log('root state loaded');
      } catch (error) {
        // todo - replace with ion-alert
        // unhandled
        alert(`Unexpected error: ${error}`);
      }
    };

    loadRootState();
  }, []);

  useEffect(() => {
    const { rateTypesLoaded, vehiclesLoaded } = localState;

    if (rateTypesLoaded && vehiclesLoaded) {
      dispatch({ type: ROOT_INITIALIZED });
    }
  }, [localState]);

  return <RootStateContext.Provider value={state}>{children}</RootStateContext.Provider>;
}
