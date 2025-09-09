// src/Context/LayoutContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [layout, setLayout] = useState("vertical");

  useEffect(() => {
    const savedLayout = localStorage.getItem("layout");
    if (savedLayout) setLayout(savedLayout);
  }, []);

  const changeLayout = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem("layout", newLayout);
  };

  return (
    <LayoutContext.Provider value={{ layout, changeLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);