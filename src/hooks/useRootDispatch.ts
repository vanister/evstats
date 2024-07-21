import { Dispatch, useContext } from 'react';
import { RootAction } from '../providers/RootStateProvider/root-state-types';
import { RootStateContext } from '../providers/RootStateProvider/RootStateProvider';

export function useRootDispatch(): Dispatch<RootAction> {
  const context = useContext(RootStateContext);

  if (!context?.dispatch) {
    throw new Error('RooStateContext dispatch must be used within a RootStateProvider');
  }

  return context.dispatch;
}
