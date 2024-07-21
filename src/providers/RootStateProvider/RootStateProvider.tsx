import { createContext, Dispatch, ReactNode } from 'react';
import { RootAction, RootState } from './root-state-types';
import { useInitRootState } from './useInitRootState';

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

export function RootStateProvider({ children }: RootStateProviderProps) {
  const [state, dispatch] = useInitRootState();

  return (
    <RootStateContext.Provider value={{ state, dispatch }}>{children}</RootStateContext.Provider>
  );
}
