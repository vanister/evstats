import { useContext } from 'react';
import { MenuControlContext } from '../providers/MenuControl';

export function useMenuControl() {
  const context = useContext(MenuControlContext);

  return context;
}