import { Draft, produce } from 'immer';
import { useCallback, useState } from 'react';

/**
 * A state updater function that is given a draft state that can be modified
 * or a new state can be returned.
 */
export type StateUpdater<T> = (state: Draft<T>) => void | Draft<T>;

/**
 * A function at accepts a StateUpdater function to update state.
 */
export type SetImmerState<T> = (updater: StateUpdater<T>) => void;

/**
 * A hook for using immer's `produce` function without React's `useState` hook.
 *
 * @example
 * const [state, setState] = useImmerState({ name: 'Jyn', weapon: 'Blaster' });
 *
 * // this will produce a new immutable state object with name set to 'Jyn Erso'
 * setState(draft => {
 *   drat.name = 'Jyn Erso';
 * });
 *
 * @param initialValue The initial state value.
 */
export function useImmerState<T>(initialValue: T): [T, SetImmerState<T>] {
  const [state, setState] = useState<T>(initialValue);

  const setImmerState = useCallback((updater: StateUpdater<T>) => {
    setState(produce(updater));
  }, []);

  return [state, setImmerState];
}