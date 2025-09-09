import React, { createContext, useContext, useState } from 'react';

// Create the context
const ViewContext = createContext();

// Create the provider component
export const ViewProvider = ({ children }) => {
  const [viewType, setViewType] = useState('card');

  // Toggle between card and table views
  const toggleViewType = () => {
    setViewType((prevType) => (prevType === 'card' ? 'table' : 'card'));
  };

  return (
    <ViewContext.Provider value={{ viewType, toggleViewType }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useViewContext = () => {
  return useContext(ViewContext);
};
