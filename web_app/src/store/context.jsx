'use client';

import { createContext, useReducer, useContext } from 'react';
import { reducer, initialState } from './reducer';
const AppContext = createContext();

export const AppWrapper = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
