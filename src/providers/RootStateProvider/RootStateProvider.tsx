import { createContext, Dispatch, ReactNode } from 'react';
import { RootAction, RootState } from './root-state-types';
import { useRootState } from './useRootState';
// import { IonAlert } from '@ionic/react';

export type RootStateProviderProps = {
  children: ReactNode;
};

export type RootStateContextType = {
  state: RootState | null;
  dispatch: Dispatch<RootAction>;
};

/** DO NOT use outside of Provider */
export const RootStateContext = createContext<RootStateContextType>(null);

export function RootStateProvider({ children }: RootStateProviderProps) {
  const [state, dispatch] = useRootState();

  return (
    <RootStateContext.Provider value={{ state, dispatch }}>{children}</RootStateContext.Provider>
  );
}
