import { useContext } from 'react';
import { RootState } from '../providers/RootStateProvider/root-state-types';
import { RootStateContext } from '../providers/RootStateProvider/RootStateProvider';

export function useRootSelector<T>(select: (state: RootState) => T): T {
  const context = useContext(RootStateContext);

  if (!context) {
    throw new Error('RootStateContext must be used within a RootStateProvider');
  }

  const selectedState = select(context.state!);

  return selectedState;
}
