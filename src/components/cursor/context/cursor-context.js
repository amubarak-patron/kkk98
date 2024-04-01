import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const CursorContext = createContext({});

export const useCursorContext = () => {
  const context = useContext(CursorContext);

  if (!context) throw new Error('useCursorContext must be use inside CursorProvider');

  return context;
};
