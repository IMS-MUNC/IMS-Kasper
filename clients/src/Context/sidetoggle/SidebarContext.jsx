import { createContext, useContext, useState } from "react";

// SidebarContext.js
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // NEW

  const toggleMenu = (menuKey, isTopLevel = false) => {
    setOpenMenus((prev) => {
      const isCurrentlyOpen = !!prev[menuKey];
      if (isTopLevel) {
        const newState = Object.fromEntries(
          Object.entries(prev).filter(
            ([key, value]) => key !== menuKey && !value
          )
        );
        return {
          ...newState,
          [menuKey]: !isCurrentlyOpen,
        };
      } else {
        return {
          ...prev,
          [menuKey]: !isCurrentlyOpen,
        };
      }
    });
  };

  const handleMobileToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => !prev); // NEW
  };

  const handleLinkClick = () => {
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        openMenus,
        mobileOpen,
        sidebarCollapsed, // NEW
        toggleMenu,
        handleMobileToggle,
        handleSidebarCollapse, // NEW
        handleLinkClick,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
