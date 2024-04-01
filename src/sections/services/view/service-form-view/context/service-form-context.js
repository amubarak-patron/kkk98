import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const ServiceFormContext = createContext({});

export const useServiceFormContext = () => {
  const context = useContext(ServiceFormContext);

  if (!context) throw new Error('useServiceFormContext must be use inside ServiceFormProvider');

  return context;
};
