import { createContext, ReactNode, useReducer } from 'react';
import { RootAction, RootStateContextType } from './root-state-types';
import { INITIAL_ROOT_STATE, rootReducer } from './reducer';

export type RootStateProviderProps = {
  children: ReactNode;
};

export const RootStateContext = createContext<RootStateContextType>({
  state: undefined,
  dispatch: (_action: RootAction) => {
    throw new Error('RootStateContext must be used inside of the RootStateProvider component.');
  }
});

export function RootStateProvider({ children }: RootStateProviderProps) {
  const [state, dispatch] = useReducer(rootReducer, INITIAL_ROOT_STATE);

  return (
    <RootStateContext.Provider value={{ state, dispatch }}>{children}</RootStateContext.Provider>
  );
}
