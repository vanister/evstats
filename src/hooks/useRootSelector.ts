import { useContext } from 'react';
import { RootState } from '../providers/RootStateProvider/root-state-types';
import { RootStateContext } from '../providers/RootStateProvider/RootStateProvider';

export type RootStateSelect<T> = (state: RootState) => T;

export function useRootSelector<T>(select: RootStateSelect<T>): T {
  const context = useContext(RootStateContext);

  if (!context?.state) {
    throw new Error('RootStateContext state must be used within a RootStateProvider');
  }

  const selectedState = select(context.state);

  return selectedState;
}
