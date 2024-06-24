import React, { useContext, useState } from 'react';

interface MenuControlContextType {
  disabled?: boolean;
  setDisabled: (value: boolean) => void;
}

interface MenuControlProps {
  children: React.ReactNode;
}

const INITIAL_CONTEXT_VALUES: MenuControlContextType = {
  disabled: false,
  setDisabled: () => {
    /* noop */
  }
};

export const MenuControlContext = React.createContext(INITIAL_CONTEXT_VALUES);

export default function MenuControl({ children }: MenuControlProps) {
  const [disabled, setDisabled] = useState(false);

  return (
    <MenuControlContext.Provider value={{ disabled, setDisabled }}>
      {children}
    </MenuControlContext.Provider>
  );
}
