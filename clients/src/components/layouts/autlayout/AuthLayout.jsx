import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import './authlayout.css'; // Import the CSS file
import { useSidebar } from '../../../Context/sidetoggle/SidebarContext';
import Footer from '../Footer/Footer';
import ThemeCustomizer from '../../../pages/themes/ThemeCustomizer';
import useAuthStatus from '../../../hooks/useAuthStatus';

const AuthLayout = () => {
  const { mobileOpen } = useSidebar();

  // call it here - runs on every protected page
  useAuthStatus();

  return (
    <div className={`auth-layout ${mobileOpen ? 'slide-nav' : ''}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Right section: Header + Main */}
      {/* <div className="right-section"> */}
      <div className="main-wrapper">
        {/* Navbar (fixed height) */}
        <Navbar />

        {/* Main content area */}
        <main className="main-content">
          <Outlet />
          {/* <ThemeCustomizer /> */}
        </main>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default AuthLayout;
