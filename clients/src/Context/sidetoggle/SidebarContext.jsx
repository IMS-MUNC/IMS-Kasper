// import { createContext, useContext, useState } from "react";

// // SidebarContext.js
// const SidebarContext = createContext();

// export const SidebarProvider = ({ children }) => {
//   const [openMenus, setOpenMenus] = useState({});
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // NEW

//   const toggleMenu = (menuKey, isTopLevel = false) => {
//     setOpenMenus((prev) => {
//       const isCurrentlyOpen = !!prev[menuKey];
//       if (isTopLevel) {
//         const newState = Object.fromEntries(
//           Object.entries(prev).filter(
//             ([key, value]) => key !== menuKey && !value
//           )
//         );
//         return {
//           ...newState,
//           [menuKey]: !isCurrentlyOpen,
//         };
//       } else {
//         return {
//           ...prev,
//           [menuKey]: !isCurrentlyOpen,
//         };
//       }
//     });
//   };

//   const handleMobileToggle = () => {
//     setMobileOpen((prev) => !prev);
//   };

//   const handleSidebarCollapse = () => {
//     setSidebarCollapsed((prev) => !prev); // NEW
//   };

//   const handleLinkClick = () => {
//     if (mobileOpen) setMobileOpen(false);
//   };

//   return (
//     <SidebarContext.Provider
//       value={{
//         openMenus,
//         mobileOpen,
//         sidebarCollapsed, // NEW
//         toggleMenu,
//         handleMobileToggle,
//         handleSidebarCollapse, // NEW
//         handleLinkClick,
//       }}
//     >
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// export const useSidebar = () => useContext(SidebarContext);



import { createContext, useContext, useState } from "react";

// SidebarContext.js
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // NEW

  const [sidebarOpen, setSidebarOpen] = useState(false);   // for mobile sidebar
  const [miniSidebar, setMiniSidebar] = useState(false);   // for mini sidebar
  const [hovered, setHovered] = useState(false);

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
    setOpenMenus({}); // Close all menus when a link is clicked
  };

  return (
    <SidebarContext.Provider
      value={{
        openMenus,
        mobileOpen,
        sidebarCollapsed,
        sidebarOpen, setSidebarOpen,
        miniSidebar, setMiniSidebar,
        hovered, setHovered,
        toggleMenu,
        handleMobileToggle,
        handleSidebarCollapse,
        handleLinkClick,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
