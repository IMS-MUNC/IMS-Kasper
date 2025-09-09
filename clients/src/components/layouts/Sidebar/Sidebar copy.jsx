import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/sidebar.css";
import Logo from "../../../assets/img/logo/munclogotm.png";
import IconLogo from "../../../assets/img/logo/MuncSmall.svg";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { getMenuData } from "./MenuData.jsx";
import { useSidebar } from "../../../Context/sidetoggle/SidebarContext";

const Sidebar = () => {
  const { openMenus, toggleMenu, mobileOpen, handleMobileToggle, handleLinkClick } = useSidebar();

  const menuData = getMenuData();
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={handleMobileToggle}></div>}

      <div className={`sidebar ${mobileOpen ? "open" : "collapsed "}`}>
        <div className="sidebar-logo">
          <Link to="/home"><img src={IconLogo} className="compact-logo" alt="Logo" /></Link>
          <Link to="/home"><img src={Logo} className="full-logo" alt="Full Logo" /></Link>
          <button className="mobile-toggle-btn" onClick={handleMobileToggle}>
            {mobileOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
          </button>
        </div>

        <div className="sidebar-inner">
          <div className="sidebar-menu">
            <ul>
              {menuData.map((section, idx) => (
                <li key={idx} className={`submenu-open ${openMenus[section.key] ? "active" : ""}`}>
                  {section.section && <h6 className="submenu-hdr">{section.section}</h6>}
                  <ul>
                    {section.items.map((item, i) => (
                      item.subItems ? (
                        <li key={i} className={`submenu ${openMenus[item.key] ? "open" : ""}`}>
                          <div
                            className={`subdrop ${openMenus[item.key] ? "active" : ""}`}
                            onClick={() => toggleMenu(item.key, true)}
                          >
                            <span className="menu-item">
                              {item.icon }
                              <span>{item.title}</span>
                            </span>
                            <span className={`menu-arrow ${openMenus[item.key] ? "rotated" : ""}`} />
                          </div>
                          {openMenus[item.key] && (
                            <ul>
                              {item.subItems.map((sub, subIdx) => (
                                sub.nested ? (
                                  <li key={subIdx} className={`submenu submenu-two ${openMenus[sub.nestedKey] ? "open" : ""}`}>
                                    <div onClick={() => toggleMenu(sub.nestedKey)}>
                                      <span>{sub.label}</span>
                                      <span className={`menu-arrow inside-submenu ${openMenus[sub.nestedKey] ? "rotated" : ""}`} />
                                    </div>
                                    {openMenus[sub.nestedKey] && (
                                      <ul>
                                        {sub.nested.map((n, nIdx) => (
                                          <li key={nIdx}>
                                            <Link to={n.path} onClick={handleLinkClick}>
                                              {n.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ) : (
                                  <li key={subIdx}>
                                    <Link to={sub.path} onClick={handleLinkClick}>{sub.label}</Link>
                                  </li>
                                )
                              ))}
                            </ul>
                          )}
                        </li>
                      ) : (
                        <li key={i}>
                          <Link
                            to={item.path}
                            onClick={() => {
                              handleLinkClick();
                              toggleMenu(section.key, true);
                            }}
                          >
                            <span className="menu-item">
                              {item.icon}
                              <span>{item.label}</span>
                            </span>
                          </Link>
                        </li>
                      )
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div class="sidebar-bottom">
          <Link to="/"> <img src={IconLogo} class="compact-logo" alt="Compact Footer Logo" /></Link>
          <Link to="/"> <img src={Logo} class="full-logo" alt="Full Footer Logo" /></Link>

        </div>
      </div>
    </>
  );
};

export default Sidebar;

// // //theme final code 
// import React, { useState, useEffect, useRef } from 'react';
// import { setThemeColor, restoreThemeColor } from '../../../utils/setThemeColor';
// import PerfectScrollbar from 'react-perfect-scrollbar';
// import 'react-perfect-scrollbar/dist/css/styles.css';
// import { getMenuData } from "./MenuData.jsx";

// // Main Sidebar Menu Data
// const mainSidebarMenu = [
// 	{
// 		header: 'Main',
// 		items: [
// 			{
// 				type: 'submenu',
// 				icon: 'ti ti-layout-grid fs-16 me-2',
// 				title: 'Dashboard',
// 				links: [
// 					{ title: 'Admin Dashboard', link: 'index.html', active: true },
// 					{ title: 'Admin Dashboard 2', link: 'admin-dashboard.html' },
// 					{ title: 'Sales Dashboard', link: 'sales-dashboard.html' },
// 				],
// 			},
// 			{
// 				type: 'submenu',
// 				icon: 'ti ti-user-edit fs-16 me-2',
// 				title: 'Super Admin',
// 				links: [
// 					{ title: 'Dashboard', link: 'dashboard.html' },
// 					{ title: 'Companies', link: 'companies.html' },
// 					{ title: 'Subscriptions', link: 'subscription.html' },
// 					{ title: 'Packages', link: 'packages.html' },
// 					{ title: 'Domain', link: 'domain.html' },
// 					{ title: 'Purchase Transaction', link: 'purchase-transaction.html' },
// 				],
// 			},
// 			// ...add more submenus/items as needed
// 		],
// 	},
// 	// ...add more headers/sections as needed
// ];

// // Horizontal Sidebar Menu Data
// const horizontalSidebarMenu = [
// 	{
// 		title: 'Main Menu',
// 		icon: 'ti ti-layout-grid fs-16 me-2',
// 		links: [
// 			{ title: 'Admin Dashboard', link: 'index.html', active: true },
// 			{ title: 'Admin Dashboard 2', link: 'admin-dashboard.html' },
// 			{ title: 'Sales Dashboard', link: 'sales-dashboard.html' },
// 		],
// 	},
// 	// ...add more horizontal menu sections
// ];

// // Two Col Sidebar Tabs Data
// const twoColSidebarTabs = [
// 	{ icon: 'ti ti-smart-home', target: '#dashboard', title: 'Dashboard' },
// 	{ icon: 'ti ti-user-star', target: '#super-admin', title: 'Super Admin' },
// 	{ icon: 'ti ti-layout-grid-add', target: '#application', title: 'Apps' },
// 	{ icon: 'ti ti-layout-board-split', target: '#layout', title: 'Layout' },
// 	{ icon: 'ti ti-table-plus', target: '#inventory', title: 'Inventory' },
// 	{ icon: 'ti ti-stack-3', target: '#stock', title: 'Stock' },
// 	{ icon: 'ti ti-device-laptop', target: '#sales', title: 'Sales' },
// 	{ icon: 'ti ti-shopping-cart-dollar', target: '#finance', title: 'Finance' },
// 	{ icon: 'ti ti-cash', target: '#hrm', title: 'Hrm' },
// 	{ icon: 'ti ti-license', target: '#reports', title: 'Reports' },
// 	{ icon: 'ti ti-page-break', target: '#pages', title: 'Pages' },
// 	{ icon: 'ti ti-lock-check', target: '#settings', title: 'Settings' },
// 	{ icon: 'ti ti-ux-circle', target: '#ui-elements', title: 'UI Elements' },
// 	{ icon: 'ti ti-vector-triangle', target: '#extras', title: 'Extras' },
// ];


// const Sidebar = () => {
//   const [openMenus, setOpenMenus] = useState({});
//   const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar
//   const [miniSidebar, setMiniSidebar] = useState(false); // For mini sidebar
//   const [hovered, setHovered] = useState(false); // For mini sidebar hover
//   const [themeColor, setThemeColor] = useState(localStorage.getItem('color') || 'info');
//   const sidebarRef = useRef(null);
//   const menuData = getMenuData();

// 	// Handle submenu open/close
// 	const toggleMenu = (idx, iidx) => {
// 		setOpenMenus((prev) => ({
// 			...prev,
// 			[`${idx}-${iidx}`]: !prev[`${idx}-${iidx}`],
// 		}));
// 	};

// 	// Handle mobile sidebar toggle
// 	const handleMobileSidebar = (e) => {
// 		e.preventDefault();
// 		setSidebarOpen((prev) => !prev);
// 	};

// 	// Handle overlay click
// 	const handleOverlayClick = () => {
// 		setSidebarOpen(false);
// 		setMiniSidebar(false);
// 	};

// 	// Handle mini sidebar toggle
// 	const handleMiniSidebar = (e) => {
// 		e.preventDefault();
// 		setMiniSidebar((prev) => !prev);
// 	};

//   // Add/remove classes to body/html for sidebar state
//   useEffect(() => {
// 	const html = document.documentElement;
// 	if (sidebarOpen) {
// 	  html.classList.add('menu-opened');
// 	} else {
// 	  html.classList.remove('menu-opened');
// 	}
// 	if (miniSidebar) {
// 	  document.body.classList.add('mini-sidebar');
// 	} else {
// 	  document.body.classList.remove('mini-sidebar');
// 	}
// 	// Clean up on unmount
// 	return () => {
// 	  html.classList.remove('menu-opened');
// 	  document.body.classList.remove('mini-sidebar');
// 	};
//   }, [sidebarOpen, miniSidebar]);

//   // Listen for theme color changes and update state/UI
//   useEffect(() => {
// 	const handleStorage = () => {
// 	  const color = localStorage.getItem('color') || 'info';
// 	  setThemeColor(color);
// 	  document.documentElement.setAttribute('data-color', color);
// 	  // If custom color is set, apply it
// 	  restoreThemeColor();
// 	};
// 	window.addEventListener('storage', handleStorage);
// 	// Also update on mount
// 	handleStorage();
// 	return () => window.removeEventListener('storage', handleStorage);
//   }, []);

// 	// Mini sidebar hover logic (matches script.js)
// 	useEffect(() => {
// 		if (!miniSidebar) return;
// 		const handleMouseOver = (e) => {
// 			if (document.body.classList.contains('mini-sidebar') && document.getElementById('toggle_btn').offsetParent !== null) {
// 				const sidebar = sidebarRef.current;
// 				if (sidebar && (sidebar.contains(e.target) || (document.querySelector('.header-left') && document.querySelector('.header-left').contains(e.target)))) {
// 					setHovered(true);
// 					document.body.classList.add('expand-menu');
// 				} else {
// 					setHovered(false);
// 					document.body.classList.remove('expand-menu');
// 				}
// 			}
// 		};
// 		document.addEventListener('mouseover', handleMouseOver);
// 		return () => document.removeEventListener('mouseover', handleMouseOver);
// 	}, [miniSidebar]);

// 	// Optionally, sticky sidebar logic can be added here with useEffect

// 	return (
// 		<>
// 			{/* Sidebar Overlay for mobile */}
// 			{sidebarOpen && (
// 				<div className="sidebar-overlay opened" onClick={handleOverlayClick}></div>
// 			)}
// 			{/* Main Sidebar */}
// 			<div
// 				// className={`sidebar${sidebarOpen ? ' slide-nav' : ''}${miniSidebar ? ' mini-sidebar' : ''}${hovered ? ' expand-menu' : ''}`}
// 				// id="sidebar"
// 				// ref={sidebarRef}
//         className={`sidebar${sidebarOpen ? ' slide-nav' : ''}${miniSidebar ? ' mini-sidebar' : ''}${hovered ? ' expand-menu' : ''} ${themeColor}`}
// 				id="sidebar"
// 				ref={sidebarRef}
// 				data-color={themeColor}
// 			>
// 				{/* Logo and Profile */}
// 				<div className="sidebar-logo active">
// 					<a href="index.html" className="logo logo-normal">
// 						<img src="assets/img/logo.svg" alt="Img" />
// 					</a>
// 					<a href="index.html" className="logo logo-white">
// 						<img src="assets/img/logo-white.svg" alt="Img" />
// 					</a>
// 					<a href="index.html" className="logo-small">
// 						<img src="assets/img/logo-small.png" alt="Img" />
// 					</a>
// 					<a
// 						id="toggle_btn"
// 						href="#"
// 						onClick={handleMiniSidebar}
// 						title="Toggle Mini Sidebar"
// 					>
// 						<i data-feather="chevrons-left" className="feather-16"></i>
// 					</a>
// 					{/* Mobile menu button */}
// 					<a
// 						id="mobile_btn"
// 						href="#"
// 						className="mobile_btn d-md-none d-block"
// 						onClick={handleMobileSidebar}
// 						title="Open Sidebar"
// 						style={{ position: 'absolute', left: 0, top: 0, zIndex: 1001 }}
// 					>
// 						<i className="ti ti-menu-2"></i>
// 					</a>
// 				</div>
// 				<div className="modern-profile p-3 pb-0">
// 					<div className="text-center rounded bg-light p-3 mb-4 user-profile">
// 						<div className="avatar avatar-lg online mb-3">
// 							<img
// 								src="assets/img/customer/customer15.jpg"
// 								alt="Img"
// 								className="img-fluid rounded-circle"
// 							/>
// 						</div>
// 						<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
// 						<p className="fs-12 mb-0">System Admin</p>
// 					</div>
// 					<div className="sidebar-nav mb-3">
// 						<ul
// 							className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified bg-transparent"
// 							role="tablist"
// 						>
// 							<li className="nav-item">
// 								<a className="nav-link active border-0" href="#">
// 									Menu
// 								</a>
// 							</li>
// 							<li className="nav-item">
// 								<a className="nav-link border-0" href="chat.html">
// 									Chats
// 								</a>
// 							</li>
// 							<li className="nav-item">
// 								<a className="nav-link border-0" href="email.html">
// 									Inbox
// 								</a>
// 							</li>
// 						</ul>
// 					</div>
// 				</div>
// 				<div className="sidebar-header p-3 pb-0 pt-2">
// 					<div className="text-center rounded bg-light p-2 mb-4 sidebar-profile d-flex align-items-center">
// 						<div className="avatar avatar-md onlin">
// 							<img
// 								src="assets/img/customer/customer15.jpg"
// 								alt="Img"
// 								className="img-fluid rounded-circle"
// 							/>
// 						</div>
// 						<div className="text-start sidebar-profile-info ms-2">
// 							<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
// 							<p className="fs-12">System Admin</p>
// 						</div>
// 					</div>
// 					<div className="d-flex align-items-center justify-content-between menu-item mb-3">
// 						<div>
// 							<a href="index.html" className="btn btn-sm btn-icon bg-light">
// 								<i className="ti ti-layout-grid-remove"></i>
// 							</a>
// 						</div>
// 						<div>
// 							<a href="chat.html" className="btn btn-sm btn-icon bg-light">
// 								<i className="ti ti-brand-hipchat"></i>
// 							</a>
// 						</div>
// 						<div>
// 							<a
// 								href="email.html"
// 								className="btn btn-sm btn-icon bg-light position-relative"
// 							>
// 								<i className="ti ti-message"></i>
// 							</a>
// 						</div>
// 						<div className="notification-item">
// 							<a
// 								href="activities.html"
// 								className="btn btn-sm btn-icon bg-light position-relative"
// 							>
// 								<i className="ti ti-bell"></i>
// 								<span className="notification-status-dot"></span>
// 							</a>
// 						</div>
// 						<div className="me-0">
// 							<a href="general-settings.html" className="btn btn-sm btn-icon bg-light">
// 								<i className="ti ti-settings"></i>
// 							</a>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="sidebar-inner slimscroll">
// 					<PerfectScrollbar>
// 						<div id="sidebar-menu" className="sidebar-menu">
// 							<ul>
// 								{/* {menuData.map((section, idx) => (
// 									<li key={idx} className="submenu-open">
// 										<h6 className="submenu-hdr">{section.header}</h6>
// 										<ul>
// 											{section.items.map((item, iidx) =>
// 												item.type === 'submenu' ? (
// 													<li className="submenu" key={iidx}>
// 														<a
// 															href="#"
// 															className={`subdrop${openMenus[`${idx}-${iidx}`] ? ' active' : ''
// 																}`}
// 															onClick={(e) => {
// 																e.preventDefault();
// 																toggleMenu(idx, iidx);
// 															}}
// 														>
// 															<i className={item.icon}></i>
// 															<span>{item.title}</span>
// 															<span className="menu-arrow"></span>
// 														</a>
// 														<ul
// 															style={{
// 																display: openMenus[`${idx}-${iidx}`] ? 'block' : 'none',
// 															}}
// 														>
// 															{item.links.map((link, lidx) => (
// 																<li key={lidx}>
// 																	<a
// 																		href={link.link}
// 																		className={link.active ? 'active' : ''}
// 																	>
// 																		{link.title}
// 																	</a>
// 																</li>
// 															))}
// 														</ul>
// 													</li>
// 												) : (
// 													<li key={iidx}>
// 														<a href={item.link}>
// 															<i className={item.icon}></i>
// 															<span>{item.title}</span>
// 														</a>
// 													</li>
// 												)
// 											)}
// 										</ul>
// 									</li>
// 								))} */}
// 							</ul>
// 						</div>
// 					</PerfectScrollbar>
// 				</div>
// 			</div>
// 			{/* /Main Sidebar */}

// 			{/* Horizontal Sidebar */}
// 			<div className="sidebar sidebar-horizontal" id="horizontal-menu">
// 				<div id="sidebar-menu-3" className="sidebar-menu">
// 					<div className="main-menu">
// 						<ul className="nav-menu">
// 							{horizontalSidebarMenu.map((menu, idx) => (
// 								<li className="submenu" key={idx}>
// 									<a href="index.html">
// 										<i className={menu.icon}></i>
// 										<span>{menu.title}</span>
// 										<span className="menu-arrow"></span>
// 									</a>
// 									<ul>
// 										{menu.links.map((link, lidx) => (
// 											<li key={lidx}>
// 												<a
// 													href={link.link}
// 													className={link.active ? 'active' : ''}
// 												>
// 													{link.title}
// 												</a>
// 											</li>
// 										))}
// 									</ul>
// 								</li>
// 							))}
// 						</ul>
// 					</div>
// 				</div>
// 			</div>
// 			{/* /Horizontal Sidebar */}

// 			{/* Two Col Sidebar */}
// 			<div className="two-col-sidebar" id="two-col-sidebar">
// 				<div className="sidebar sidebar-twocol">
// 					<div className="twocol-mini">
// 						<div className="sidebar-left slimscroll">
// 							<div
// 								className="nav flex-column align-items-center nav-pills"
// 								id="sidebar-tabs"
// 								role="tablist"
// 								aria-orientation="vertical"
// 							>
// 								{twoColSidebarTabs.map((tab, idx) => (
// 									<a
// 										href="#"
// 										className="nav-link"
// 										title={tab.title}
// 										data-bs-toggle="tab"
// 										data-bs-target={tab.target}
// 										key={idx}
// 									>
// 										<i className={tab.icon}></i>
// 									</a>
// 								))}
// 							</div>
// 						</div>
// 					</div>
// 					<div className="sidebar-right">
// 						{/* Logo */}
// 						<div className="sidebar-logo">
// 							<a href="index.html" className="logo logo-normal">
// 								<img src="assets/img/logo.svg" alt="Img" />
// 							</a>
// 							<a href="index.html" className="logo logo-white">
// 								<img src="assets/img/logo-white.svg" alt="Img" />
// 							</a>
// 							<a href="index.html" className="logo-small">
// 								<img src="assets/img/logo-small.png" alt="Img" />
// 							</a>
// 						</div>
// 						{/* /Logo */}
// 						<div className="sidebar-scroll"></div>
// 						<div className="text-center rounded bg-light p-3 mb-3 border">
// 							<div className="avatar avatar-lg online mb-3">
// 								<img
// 									src="assets/img/customer/customer15.jpg"
// 									alt="Img"
// 									className="img-fluid rounded-circle"
// 								/>
// 							</div>
// 							<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
// 							<p className="fs-12 mb-0">System Admin</p>
// 						</div>
// 						<div className="tab-content" id="v-pills-tabContent">
// 							{/* Add tab panes here if needed */}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 			{/* /Two Col Sidebar */}
// 		</>
// 	);
// };

// export default Sidebar;

// -----------------
// //tem code
// import React, { useState, useEffect } from 'react';

// // Main Sidebar Menu Data
// const mainSidebarMenu = [
// 	{
// 		header: 'Main',
// 		items: [
// 			{
// 				type: 'submenu',
// 				icon: 'ti ti-layout-grid fs-16 me-2',
// 				title: 'Dashboard',
// 				links: [
// 					{ title: 'Admin Dashboard', link: 'index.html', active: true },
// 					{ title: 'Admin Dashboard 2', link: 'admin-dashboard.html' },
// 					{ title: 'Sales Dashboard', link: 'sales-dashboard.html' },
// 				],
// 			},
// 			{
// 				type: 'submenu',
// 				icon: 'ti ti-user-edit fs-16 me-2',
// 				title: 'Super Admin',
// 				links: [
// 					{ title: 'Dashboard', link: 'dashboard.html' },
// 					{ title: 'Companies', link: 'companies.html' },
// 					{ title: 'Subscriptions', link: 'subscription.html' },
// 					{ title: 'Packages', link: 'packages.html' },
// 					{ title: 'Domain', link: 'domain.html' },
// 					{ title: 'Purchase Transaction', link: 'purchase-transaction.html' },
// 				],
// 			},
// 			// ...add more submenus/items as needed
// 		],
// 	},
// 	// ...add more headers/sections as needed
// ];

// // Horizontal Sidebar Menu Data
// const horizontalSidebarMenu = [
// 	{
// 		title: 'Main Menu',
// 		icon: 'ti ti-layout-grid fs-16 me-2',
// 		links: [
// 			{ title: 'Admin Dashboard', link: 'index.html', active: true },
// 			{ title: 'Admin Dashboard 2', link: 'admin-dashboard.html' },
// 			{ title: 'Sales Dashboard', link: 'sales-dashboard.html' },
// 		],
// 	},
// 	// ...add more horizontal menu sections
// ];

// // Two Col Sidebar Tabs Data
// const twoColSidebarTabs = [
// 	{ icon: 'ti ti-smart-home', target: '#dashboard', title: 'Dashboard' },
// 	{ icon: 'ti ti-user-star', target: '#super-admin', title: 'Super Admin' },
// 	{ icon: 'ti ti-layout-grid-add', target: '#application', title: 'Apps' },
// 	{ icon: 'ti ti-layout-board-split', target: '#layout', title: 'Layout' },
// 	{ icon: 'ti ti-table-plus', target: '#inventory', title: 'Inventory' },
// 	{ icon: 'ti ti-stack-3', target: '#stock', title: 'Stock' },
// 	{ icon: 'ti ti-device-laptop', target: '#sales', title: 'Sales' },
// 	{ icon: 'ti ti-shopping-cart-dollar', target: '#finance', title: 'Finance' },
// 	{ icon: 'ti ti-cash', target: '#hrm', title: 'Hrm' },
// 	{ icon: 'ti ti-license', target: '#reports', title: 'Reports' },
// 	{ icon: 'ti ti-page-break', target: '#pages', title: 'Pages' },
// 	{ icon: 'ti ti-lock-check', target: '#settings', title: 'Settings' },
// 	{ icon: 'ti ti-ux-circle', target: '#ui-elements', title: 'UI Elements' },
// 	{ icon: 'ti ti-vector-triangle', target: '#extras', title: 'Extras' },
// ];


// const Sidebar = () => {
// 	const [openMenus, setOpenMenus] = useState({});
// 	const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar
// 	const [miniSidebar, setMiniSidebar] = useState(false); // For mini sidebar

// 	// Handle submenu open/close
// 	const toggleMenu = (idx, iidx) => {
// 		setOpenMenus((prev) => ({
// 			...prev,
// 			[`${idx}-${iidx}`]: !prev[`${idx}-${iidx}`],
// 		}));
// 	};

// 	// Handle mobile sidebar toggle
// 	const handleMobileSidebar = (e) => {
// 		e.preventDefault();
// 		setSidebarOpen((prev) => !prev);
// 	};

// 	// Handle overlay click
// 	const handleOverlayClick = () => {
// 		setSidebarOpen(false);
// 		setMiniSidebar(false);
// 	};

// 	// Handle mini sidebar toggle
// 	const handleMiniSidebar = (e) => {
// 		e.preventDefault();
// 		setMiniSidebar((prev) => !prev);
// 	};

// 	// Add/remove classes to body/html for sidebar state
// 	useEffect(() => {
// 		const html = document.documentElement;
// 		if (sidebarOpen) {
// 			html.classList.add('menu-opened');
// 		} else {
// 			html.classList.remove('menu-opened');
// 		}
// 		if (miniSidebar) {
// 			document.body.classList.add('mini-sidebar');
// 		} else {
// 			document.body.classList.remove('mini-sidebar');
// 		}
// 		// Clean up on unmount
// 		return () => {
// 			html.classList.remove('menu-opened');
// 			document.body.classList.remove('mini-sidebar');
// 		};
// 	}, [sidebarOpen, miniSidebar]);

// 	// Optionally, sticky sidebar logic can be added here with useEffect

// 	return (
// 		<>
// 			{/* Sidebar Overlay for mobile */}
// 			{sidebarOpen && (
// 				<div className="sidebar-overlay opened" onClick={handleOverlayClick}></div>
// 			)}
// 			{/* Main Sidebar */}
// 			<div
// 				className={`sidebar${sidebarOpen ? ' slide-nav' : ''}${miniSidebar ? ' mini-sidebar' : ''}`}
// 				id="sidebar"
// 			>
// 				{/* Logo and Profile */}
// 				<div className="sidebar-logo active">
// 					<a href="index.html" className="logo logo-normal">
// 						<img src="assets/img/logo.svg" alt="Img" />
// 					</a>
// 					<a href="index.html" className="logo logo-white">
// 						<img src="assets/img/logo-white.svg" alt="Img" />
// 					</a>
// 					<a href="index.html" className="logo-small">
// 						<img src="assets/img/logo-small.png" alt="Img" />
// 					</a>
// 					<a
// 						id="toggle_btn"
// 						href="#"
// 						onClick={handleMiniSidebar}
// 						title="Toggle Mini Sidebar"
// 					>
// 						<i data-feather="chevrons-left" className="feather-16"></i>
// 					</a>
// 					{/* Mobile menu button */}
// 					<a
// 						id="mobile_btn"
// 						href="#"
// 						className="mobile_btn d-md-none d-block"
// 						onClick={handleMobileSidebar}
// 						title="Open Sidebar"
// 						style={{ position: 'absolute', left: 0, top: 0, zIndex: 1001 }}
// 					>
// 						<i className="ti ti-menu-2"></i>
// 					</a>
// 				</div>
// 				<div className="modern-profile p-3 pb-0">
// 					<div className="text-center rounded bg-light p-3 mb-4 user-profile">
// 						<div className="avatar avatar-lg online mb-3">
// 							<img
// 								src="assets/img/customer/customer15.jpg"
// 								alt="Img"
// 								className="img-fluid rounded-circle"
// 							/>
// 						</div>
// 						<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
// 						<p className="fs-12 mb-0">System Admin</p>
// 					</div>
// 					<div className="sidebar-nav mb-3">
// 						<ul
// 							className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified bg-transparent"
// 							role="tablist"
// 						>
// 							<li className="nav-item">
// 								<a className="nav-link active border-0" href="#">
// 									Menu
// 								</a>
// 							</li>
// 							<li className="nav-item">
// 								<a className="nav-link border-0" href="chat.html">
// 									Chats
// 								</a>
// 							</li>
// 							<li className="nav-item">
// 								<a className="nav-link border-0" href="email.html">
// 									Inbox
// 								</a>
// 							</li>
// 						</ul>
// 					</div>
// 				</div>
// 				<div className="sidebar-header p-3 pb-0 pt-2">
// 					<div className="text-center rounded bg-light p-2 mb-4 sidebar-profile d-flex align-items-center">
// 						<div className="avatar avatar-md onlin">
// 							<img
// 								src="assets/img/customer/customer15.jpg"
// 								alt="Img"
// 								className="img-fluid rounded-circle"
// 							/>
// 						</div>
// 						<div className="text-start sidebar-profile-info ms-2">
// 							<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
// 							<p className="fs-12">System Admin</p>
// 						</div>
// 					</div>
// 					<div className="d-flex align-items-center justify-content-between menu-item mb-3">
// 						<div>
// 							<a href="index.html" className="btn btn-sm btn-icon bg-light">
// 								<i className="ti ti-layout-grid-remove"></i>
// 							</a>
// 						</div>
// 						<div>
// 							<a href="chat.html" className="btn btn-sm btn-icon bg-light">
// 								<i className="ti ti-brand-hipchat"></i>
// 							</a>
// 						</div>
// 						<div>
// 							<a
// 								href="email.html"
// 								className="btn btn-sm btn-icon bg-light position-relative"
// 							>
// 								<i className="ti ti-message"></i>
// 							</a>
// 						</div>
// 						<div className="notification-item">
// 							<a
// 								href="activities.html"
// 								className="btn btn-sm btn-icon bg-light position-relative"
// 							>
// 								<i className="ti ti-bell"></i>
// 								<span className="notification-status-dot"></span>
// 							</a>
// 						</div>
// 						<div className="me-0">
// 							<a href="general-settings.html" className="btn btn-sm btn-icon bg-light">
// 								<i className="ti ti-settings"></i>
// 							</a>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="sidebar-inner slimscroll">
// 					{/* Optionally, add a custom scrollbar component here for slimscroll effect */}
// 					<div id="sidebar-menu" className="sidebar-menu">
// 						<ul>
// 							{mainSidebarMenu.map((section, idx) => (
// 								<li key={idx} className="submenu-open">
// 									<h6 className="submenu-hdr">{section.header}</h6>
// 									<ul>
// 										{section.items.map((item, iidx) =>
// 											item.type === 'submenu' ? (
// 												<li className="submenu" key={iidx}>
// 													<a
// 														href="#"
// 														className={`subdrop${openMenus[`${idx}-${iidx}`] ? ' active' : ''
// 															}`}
// 														onClick={(e) => {
// 															e.preventDefault();
// 															toggleMenu(idx, iidx);
// 														}}
// 													>
// 														<i className={item.icon}></i>
// 														<span>{item.title}</span>
// 														<span className="menu-arrow"></span>
// 													</a>
// 													<ul
// 														style={{
// 															display: openMenus[`${idx}-${iidx}`] ? 'block' : 'none',
// 														}}
// 													>
// 														{item.links.map((link, lidx) => (
// 															<li key={lidx}>
// 																<a
// 																	href={link.link}
// 																	className={link.active ? 'active' : ''}
// 																>
// 																	{link.title}
// 																</a>
// 															</li>
// 														))}
// 													</ul>
// 												</li>
// 											) : (
// 												<li key={iidx}>
// 													<a href={item.link}>
// 														<i className={item.icon}></i>
// 														<span>{item.title}</span>
// 													</a>
// 												</li>
// 											)
// 										)}
// 									</ul>
// 								</li>
// 							))}
// 						</ul>
// 					</div>
// 				</div>
// 			</div>
// 			{/* /Main Sidebar */}

// 			{/* Horizontal Sidebar */}
// 			<div className="sidebar sidebar-horizontal" id="horizontal-menu">
// 				<div id="sidebar-menu-3" className="sidebar-menu">
// 					<div className="main-menu">
// 						<ul className="nav-menu">
// 							{horizontalSidebarMenu.map((menu, idx) => (
// 								<li className="submenu" key={idx}>
// 									<a href="index.html">
// 										<i className={menu.icon}></i>
// 										<span>{menu.title}</span>
// 										<span className="menu-arrow"></span>
// 									</a>
// 									<ul>
// 										{menu.links.map((link, lidx) => (
// 											<li key={lidx}>
// 												<a
// 													href={link.link}
// 													className={link.active ? 'active' : ''}
// 												>
// 													{link.title}
// 												</a>
// 											</li>
// 										))}
// 									</ul>
// 								</li>
// 							))}
// 						</ul>
// 					</div>
// 				</div>
// 			</div>
// 			{/* /Horizontal Sidebar */}

// 			{/* Two Col Sidebar */}
// 			<div className="two-col-sidebar" id="two-col-sidebar">
// 				<div className="sidebar sidebar-twocol">
// 					<div className="twocol-mini">
// 						<div className="sidebar-left slimscroll">
// 							<div
// 								className="nav flex-column align-items-center nav-pills"
// 								id="sidebar-tabs"
// 								role="tablist"
// 								aria-orientation="vertical"
// 							>
// 								{twoColSidebarTabs.map((tab, idx) => (
// 									<a
// 										href="#"
// 										className="nav-link"
// 										title={tab.title}
// 										data-bs-toggle="tab"
// 										data-bs-target={tab.target}
// 										key={idx}
// 									>
// 										<i className={tab.icon}></i>
// 									</a>
// 								))}
// 							</div>
// 						</div>
// 					</div>
// 					<div className="sidebar-right">
// 						{/* Logo */}
// 						<div className="sidebar-logo">
// 							<a href="index.html" className="logo logo-normal">
// 								<img src="assets/img/logo.svg" alt="Img" />
// 							</a>
// 							<a href="index.html" className="logo logo-white">
// 								<img src="assets/img/logo-white.svg" alt="Img" />
// 							</a>
// 							<a href="index.html" className="logo-small">
// 								<img src="assets/img/logo-small.png" alt="Img" />
// 							</a>
// 						</div>
// 						{/* /Logo */}
// 						<div className="sidebar-scroll"></div>
// 						<div className="text-center rounded bg-light p-3 mb-3 border">
// 							<div className="avatar avatar-lg online mb-3">
// 								<img
// 									src="assets/img/customer/customer15.jpg"
// 									alt="Img"
// 									className="img-fluid rounded-circle"
// 								/>
// 							</div>
// 							<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
// 							<p className="fs-12 mb-0">System Admin</p>
// 						</div>
// 						<div className="tab-content" id="v-pills-tabContent">
// 							{/* Add tab panes here if needed */}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 			{/* /Two Col Sidebar */}
// 		</>
// 	);
// };

// export default Sidebar;



//import React from 'react';

// // Main Sidebar Menu Data
// const mainSidebarMenu = [
// 	{
// 		header: 'Main',
// 		items: [
// 			{
// 				type: 'submenu',
// 				icon: 'ti ti-layout-grid fs-16 me-2',
// 				title: 'Dashboard',
// 				links: [
// 					{ title: 'Admin Dashboard', link: 'index.html', active: true },
// 					{ title: 'Admin Dashboard 2', link: 'admin-dashboard.html' },
// 					{ title: 'Sales Dashboard', link: 'sales-dashboard.html' },
// 				],
// 			},
// 			{
// 				type: 'submenu',
// 				icon: 'ti ti-user-edit fs-16 me-2',
// 				title: 'Super Admin',
// 				links: [
// 					{ title: 'Dashboard', link: 'dashboard.html' },
// 					{ title: 'Companies', link: 'companies.html' },
// 					{ title: 'Subscriptions', link: 'subscription.html' },
// 					{ title: 'Packages', link: 'packages.html' },
// 					{ title: 'Domain', link: 'domain.html' },
// 					{ title: 'Purchase Transaction', link: 'purchase-transaction.html' },
// 				],
// 			},
// 			// ...add more submenus/items as needed
// 		],
// 	},
// 	// ...add more headers/sections as needed
// ];

// // Horizontal Sidebar Menu Data
// const horizontalSidebarMenu = [
// 	{
// 		title: 'Main Menu',
// 		icon: 'ti ti-layout-grid fs-16 me-2',
// 		links: [
// 			{ title: 'Admin Dashboard', link: 'index.html', active: true },
// 			{ title: 'Admin Dashboard 2', link: 'admin-dashboard.html' },
// 			{ title: 'Sales Dashboard', link: 'sales-dashboard.html' },
// 		],
// 	},
// 	// ...add more horizontal menu sections
// ];

// // Two Col Sidebar Tabs Data
// const twoColSidebarTabs = [
// 	{ icon: 'ti ti-smart-home', target: '#dashboard', title: 'Dashboard' },
// 	{ icon: 'ti ti-user-star', target: '#super-admin', title: 'Super Admin' },
// 	{ icon: 'ti ti-layout-grid-add', target: '#application', title: 'Apps' },
// 	{ icon: 'ti ti-layout-board-split', target: '#layout', title: 'Layout' },
// 	{ icon: 'ti ti-table-plus', target: '#inventory', title: 'Inventory' },
// 	{ icon: 'ti ti-stack-3', target: '#stock', title: 'Stock' },
// 	{ icon: 'ti ti-device-laptop', target: '#sales', title: 'Sales' },
// 	{ icon: 'ti ti-shopping-cart-dollar', target: '#finance', title: 'Finance' },
// 	{ icon: 'ti ti-cash', target: '#hrm', title: 'Hrm' },
// 	{ icon: 'ti ti-license', target: '#reports', title: 'Reports' },
// 	{ icon: 'ti ti-page-break', target: '#pages', title: 'Pages' },
// 	{ icon: 'ti ti-lock-check', target: '#settings', title: 'Settings' },
// 	{ icon: 'ti ti-ux-circle', target: '#ui-elements', title: 'UI Elements' },
// 	{ icon: 'ti ti-vector-triangle', target: '#extras', title: 'Extras' },
// ];

// const Sidebar = () => (
// 	<>{/* Main Sidebar */}
// 		<div className="sidebar" id="sidebar">
// 			{/* Logo and Profile */}
// 			<div className="sidebar-logo active">
// 				<a href="index.html" className="logo logo-normal">
// 					<img src="assets/img/logo.svg" alt="Img" />
// 				</a>
// 				<a href="index.html" className="logo logo-white">
// 					<img src="assets/img/logo-white.svg" alt="Img" />
// 				</a>
// 				<a href="index.html" className="logo-small">
// 					<img src="assets/img/logo-small.png" alt="Img" />
// 				</a>
// 				<a id="toggle_btn" href="javascript:void(0);">
// 					<i data-feather="chevrons-left" className="feather-16"></i>
// 				</a>
// 			</div>
// 			<div className="modern-profile p-3 pb-0">
// 				<div className="text-center rounded bg-light p-3 mb-4 user-profile">
// 					<div className="avatar avatar-lg online mb-3">
// 						<img
// 							src="assets/img/customer/customer15.jpg"
// 							alt="Img"
// 							className="img-fluid rounded-circle"
// 						/>
// 					</div>
// 					<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
// 					<p className="fs-12 mb-0">System Admin</p>
// 				</div>
// 				<div className="sidebar-nav mb-3">
// 					<ul
// 						className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified bg-transparent"
// 						role="tablist"
// 					>
// 						<li className="nav-item">
// 							<a className="nav-link active border-0" href="#">
// 								Menu
// 							</a>
// 						</li>
// 						<li className="nav-item">
// 							<a className="nav-link border-0" href="chat.html">
// 								Chats
// 							</a>
// 						</li>
// 						<li className="nav-item">
// 							<a className="nav-link border-0" href="email.html">
// 								Inbox
// 							</a>
// 						</li>
// 					</ul>
// 				</div>
// 			</div>
// 			<div className="sidebar-header p-3 pb-0 pt-2">
// 				<div className="text-center rounded bg-light p-2 mb-4 sidebar-profile d-flex align-items-center">
// 					<div className="avatar avatar-md onlin">
// 						<img
// 							src="assets/img/customer/customer15.jpg"
// 							alt="Img"
// 							className="img-fluid rounded-circle"
// 						/>
// 					</div>
// 					<div className="text-start sidebar-profile-info ms-2">
// 						<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
// 						<p className="fs-12">System Admin</p>
// 					</div>
// 				</div>
// 				<div className="d-flex align-items-center justify-content-between menu-item mb-3">
// 					<div>
// 						<a href="index.html" className="btn btn-sm btn-icon bg-light">
// 							<i className="ti ti-layout-grid-remove"></i>
// 						</a>
// 					</div>
// 					<div>
// 						<a href="chat.html" className="btn btn-sm btn-icon bg-light">
// 							<i className="ti ti-brand-hipchat"></i>
// 						</a>
// 					</div>
// 					<div>
// 						<a
// 							href="email.html"
// 							className="btn btn-sm btn-icon bg-light position-relative"
// 						>
// 							<i className="ti ti-message"></i>
// 						</a>
// 					</div>
// 					<div className="notification-item">
// 						<a
// 							href="activities.html"
// 							className="btn btn-sm btn-icon bg-light position-relative"
// 						>
// 							<i className="ti ti-bell"></i>
// 							<span className="notification-status-dot"></span>
// 						</a>
// 					</div>
// 					<div className="me-0">
// 						<a href="general-settings.html" className="btn btn-sm btn-icon bg-light">
// 							<i className="ti ti-settings"></i>
// 						</a>
// 					</div>
// 				</div>
// 			</div>
// 			<div className="sidebar-inner slimscroll">
// 				<div id="sidebar-menu" className="sidebar-menu">
// 					<ul>
// 						{mainSidebarMenu.map((section, idx) => (
// 							<li key={idx} className="submenu-open">
// 								<h6 className="submenu-hdr">{section.header}</h6>
// 								<ul>
// 									{section.items.map((item, iidx) =>
// 										item.type === 'submenu' ? (
// 											<li className="submenu" key={iidx}>
// 												<a href="javascript:void(0);" className="subdrop">
// 													<i className={item.icon}></i>
// 													<span>{item.title}</span>
// 													<span className="menu-arrow"></span>
// 												</a>
// 												<ul>
// 													{item.links.map((link, lidx) => (
// 														<li key={lidx}>
// 															<a
// 																href={link.link}
// 																className={link.active ? 'active' : ''}
// 															>
// 																{link.title}
// 															</a>
// 														</li>
// 													))}
// 												</ul>
// 											</li>
// 										) : (
// 											<li key={iidx}>
// 												<a href={item.link}>
// 													<i className={item.icon}></i>
// 													<span>{item.title}</span>
// 												</a>
// 											</li>
// 										)
// 									)}
// 								</ul>
// 							</li>
// 						))}
// 					</ul>
// 				</div>
// 			</div>
// 		</div>
// 		{/* /Main Sidebar */}

// 		{/* Horizontal Sidebar */}
// 		<div className="sidebar sidebar-horizontal" id="horizontal-menu">
// 			<div id="sidebar-menu-3" className="sidebar-menu">
// 				<div className="main-menu">
// 					<ul className="nav-menu">
// 						{horizontalSidebarMenu.map((menu, idx) => (
// 							<li className="submenu" key={idx}>
// 								<a href="index.html">
// 									<i className={menu.icon}></i>
// 									<span>{menu.title}</span>
// 									<span className="menu-arrow"></span>
// 								</a>
// 								<ul>
// 									{menu.links.map((link, lidx) => (
// 										<li key={lidx}>
// 											<a
// 												href={link.link}
// 												className={link.active ? 'active' : ''}
// 											>
// 												{link.title}
// 											</a>
// 										</li>
// 									))}
// 								</ul>
// 							</li>
// 						))}
// 					</ul>
// 				</div>
// 			</div>
// 		</div>
// 		{/* /Horizontal Sidebar */}

// 		{/* Two Col Sidebar */}
// 		<div className="two-col-sidebar" id="two-col-sidebar">
// 			<div className="sidebar sidebar-twocol">
// 				<div className="twocol-mini">
// 					<div className="sidebar-left slimscroll">
// 						<div
// 							className="nav flex-column align-items-center nav-pills"
// 							id="sidebar-tabs"
// 							role="tablist"
// 							aria-orientation="vertical"
// 						>
// 							{twoColSidebarTabs.map((tab, idx) => (
// 								<a
// 									href="#"
// 									className="nav-link"
// 									title={tab.title}
// 									data-bs-toggle="tab"
// 									data-bs-target={tab.target}
// 									key={idx}
// 								>
// 									<i className={tab.icon}></i>
// 								</a>
// 							))}
// 						</div>
// 					</div>
// 				</div>
// 				<div className="sidebar-right">
// 					{/* Logo */}
// 					<div className="sidebar-logo">
// 						<a href="index.html" className="logo logo-normal">
// 							<img src="assets/img/logo.svg" alt="Img" />
// 						</a>
// 						<a href="index.html" className="logo logo-white">
// 							<img src="assets/img/logo-white.svg" alt="Img" />
// 						</a>
// 						<a href="index.html" className="logo-small">
// 							<img src="assets/img/logo-small.png" alt="Img" />
// 						</a>
// 					</div>
// 					{/* /Logo */}
// 					<div className="sidebar-scroll"></div>
// 					<div className="text-center rounded bg-light p-3 mb-3 border">
// 						<div className="avatar avatar-lg online mb-3">
// 							<img
// 								src="assets/img/customer/customer15.jpg"
// 								alt="Img"
// 								className="img-fluid rounded-circle"
// 							/>
// 						</div>
// 						<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
// 						<p className="fs-12 mb-0">System Admin</p>
// 					</div>
// 					<div className="tab-content" id="v-pills-tabContent">
// 						{/* Add tab panes here if needed */}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 		{/* /Two Col Sidebar */}</>


// );

// export default Sidebar;


// // final code
// import React from "react";
// import { Link } from "react-router-dom";
// import "../../../styles/sidebar.css";
// import Logo from "../../../assets/img/logo/munclogotm.png";
// import IconLogo from "../../../assets/img/logo/MuncSmall.svg";
// import {
//   AiOutlineMenuFold,
//   AiOutlineMenuUnfold,
// } from "react-icons/ai";
// import {
//   MdOutlineCategory,
//   MdOutlineDashboard,
//   MdOutlinePointOfSale,
// } from "react-icons/md";
// import {
//   TbAlertCircle,
//   TbArrowsShuffle,
//   TbBrandAppleArcade,
//   TbBrandAsana,
//   TbBuildingWarehouse,
//   TbBusinessplan,
//   TbCalendar,
//   TbCalendarShare,
//   TbChartBar,
//   TbChartDonut,
//   TbChartDots2,
//   TbChartPie2,
//   TbChartPpf,
//   TbCompass,
//   TbDeviceDesktop,
//   TbDeviceMobile,
//   TbFileDescription,
//   TbFileDollar,
//   TbFileInfinity,
//   TbFileInvoice,
//   TbFilePencil,
//   TbFilePercent,
//   TbFileStack,
//   TbFileUnknown,
//   TbFileUpload,
//   TbFileVector,
//   TbGiftCard,
//   TbGitMerge,
//   TbHomeBolt,
//   TbJumpRope,
//   TbListDetails,
//   TbLogout,
//   TbMapPin,
//   TbMoneybag,
//   TbReceiptRefund,
//   TbReport,
//   TbReportAnalytics,
//   TbReportMoney,
//   TbReportSearch,
//   TbSettings,
//   TbSettings2,
//   TbSettingsDollar,
//   TbShoppingBag,
//   TbTablePlus,
//   TbTrashX,
//   TbTriangleInverted,
//   TbUser,
//   TbUserCog,
//   TbUserDollar,
//   TbUserEdit,
//   TbUsersGroup,
//   TbUserShield,
//   TbUserStar,
//   TbUserUp,
//   TbWorld,
//   TbZoomMoney,
// } from "react-icons/tb";
// import {
//   MdStraighten,
//   MdChecklist,
//   MdVerified,
//   MdQrCode,
// } from "react-icons/md";
// import { CiBank, CiBarcode } from "react-icons/ci";
// import { GoPackage } from "react-icons/go";
// import {
//   PiStackDuotone,
//   PiStackSimpleDuotone,
//   PiStairsBold,
//   PiWarningDiamond,
// } from "react-icons/pi";
// import { HiArrowTrendingUp } from "react-icons/hi2";
// import { useSidebar } from "../../../Context/sidetoggle/SidebarContext";

// const Sidebar = () => {

//   const { openMenus, toggleMenu, mobileOpen, handleMobileToggle, handleLinkClick } = useSidebar();
//   // const [openMenus, setOpenMenus] = useState({});
//   // const [mobileOpen, setMobileOpen] = useState(false);

//   // const toggleMenu = (menuKey, isTopLevel = false) => {
//   //   setOpenMenus((prev) => {
//   //     const isCurrentlyOpen = !!prev[menuKey];

//   //     if (isTopLevel) {
//   //       // Close other top-level menus, keep nested menu states
//   //       const newState = Object.fromEntries(
//   //         Object.entries(prev).filter(
//   //           ([key, value]) => key !== menuKey && !value
//   //         ) // preserve only nested open states
//   //       );
//   //       return {
//   //         ...newState,
//   //         [menuKey]: !isCurrentlyOpen,
//   //       };
//   //     } else {
//   //       // Just toggle nested menu
//   //       return {
//   //         ...prev,
//   //         [menuKey]: !isCurrentlyOpen,
//   //       };
//   //     }
//   //   });
//   // };

//   // const handleMobileToggle = () => {
//   //   setMobileOpen(!mobileOpen);
//   // };

//   // const handleLinkClick = () => {
//   //   if (mobileOpen) setMobileOpen(false);
//   // };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {mobileOpen && (
//         <div className="sidebar-overlay" onClick={handleMobileToggle}></div>
//       )}

//       {/* Sidebar */}
//       <div className={`sidebar ${mobileOpen ? "open" : "collapsed "}`}>
//         <div class="sidebar-logo">
//           <Link to="/home"><img src={IconLogo} class="compact-logo" alt="Logo" /></Link>
//           <Link to="/home"> <img src={Logo} class="full-logo" alt="Full Logo" /></Link>

//           <button className="mobile-toggle-btn" onClick={handleMobileToggle}>
//             {mobileOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
//           </button>
//         </div>

//         <div className="sidebar-inner">
//           <div className="sidebar-menu">
//             <ul>
//               {/* Main Section */}
//               <li className="submenu-open">
//                 <h6 className="submenu-hdr">Main</h6>
//                 <ul>
//                   {/* Dashboard */}
//                   <li
//                     className={`submenu ${openMenus.dashboard ? "open" : ""}`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.dashboard ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("dashboard", true)}
//                     >
//                       <span className="menu-item">
//                         <MdOutlineDashboard className="icons" />
//                         <span>Dashboard</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.dashboard ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.dashboard && (
//                       <ul>
//                         <li>
//                           <Link to="/admin" onClick={handleLinkClick}>
//                             Admin Dashboard
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/admin-2" onClick={handleLinkClick}>
//                             Admin Dashboard 2
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/sales" onClick={handleLinkClick}>
//                             Sales Dashboard
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>
//                   {/* Super Admin */}
//                   <li
//                     className={`submenu ${openMenus.superAdmin ? "open" : ""}`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.superAdmin ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("superAdmin", true)}
//                     >
//                       <span className="menu-item">
//                         <TbUserEdit className="icons" />
//                         <span>Super Admin</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.superAdmin ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.superAdmin && (
//                       <ul>
//                         <li>
//                           <Link to="/dashboard" onClick={handleLinkClick}>
//                             Dashboard
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/companies" onClick={handleLinkClick}>
//                             Companies
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/subscriptions" onClick={handleLinkClick}>
//                             Subscriptions
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/packages" onClick={handleLinkClick}>
//                             Packages
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/domain" onClick={handleLinkClick}>
//                             Domain
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/transactions" onClick={handleLinkClick}>
//                             Purchase Transaction
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   {/* Application */}
//                   <li
//                     className={`submenu ${openMenus.application ? "open" : ""}`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.application ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("application", true)}
//                     >
//                       <span className="menu-item">
//                         <TbBrandAppleArcade className="icons" />
//                         <span>Application</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.application ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.application && (
//                       <ul>
//                         <li>
//                           <Link to="/chat" onClick={handleLinkClick}>
//                             Chat
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/mail" onClick={handleLinkClick}>
//                             Mail
//                           </Link>
//                         </li>
//                         <li
//                           className={`submenu submenu-two ${openMenus.call ? "open" : ""
//                             }`}
//                         >
//                           <div onClick={() => toggleMenu("call")}>
//                             <span>Call</span>
//                             <span
//                               className={`menu-arrow inside-submenu ${openMenus.call ? "rotated" : ""
//                                 }`}
//                             />
//                           </div>
//                           {openMenus.call && (
//                             <ul>
//                               <li>
//                                 <Link
//                                   to="/video-call"
//                                   onClick={handleLinkClick}
//                                 >
//                                   Video Call
//                                 </Link>
//                               </li>
//                               <li>
//                                 <Link
//                                   to="/audio-call"
//                                   onClick={handleLinkClick}
//                                 >
//                                   Audio Call
//                                 </Link>
//                               </li>
//                               <li>
//                                 <Link
//                                   to="/call-history"
//                                   onClick={handleLinkClick}
//                                 >
//                                   Call History
//                                 </Link>
//                               </li>
//                             </ul>
//                           )}
//                         </li>
//                         <li>
//                           <Link to="/calendar" onClick={handleLinkClick}>
//                             Calendar
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/contacts" onClick={handleLinkClick}>
//                             Contacts
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/email" onClick={handleLinkClick}>
//                             Email
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/todo" onClick={handleLinkClick}>
//                             To Do
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/notes" onClick={handleLinkClick}>
//                             Notes
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/file-manager" onClick={handleLinkClick}>
//                             File Manager
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/projects" onClick={handleLinkClick}>
//                             Projects
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>
//                 </ul>
//               </li>

//               {/* Inventory Section */}
//               <li
//                 className={`submenu-open ${openMenus.inventory ? "active" : ""
//                   }`}
//               >
//                 <h6 className="submenu-hdr">Inventory</h6>
//                 <ul>
//                   <li>
//                     <Link
//                       to="/product"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <GoPackage className="icons" />
//                         <span>Product</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/add-product"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <TbTablePlus className="icons" />
//                         <span>Create Product</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/expired-products"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <PiWarningDiamond className="icons" />
//                         <span>Expired Products</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/low-stocks"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <HiArrowTrendingUp className="icons" />
//                         <span>Low Stocks</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/category-list"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <TbListDetails className="icons" />
//                         <span>Category</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/sub-categories"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <MdOutlineCategory className="icons" />
//                         <span>Sub Category</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/brand-list"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <TbBrandAsana className="icons" />
//                         <span>Brands</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/units"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <MdStraighten className="icons" />
//                         <span>Units</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/variant-attributes"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <MdChecklist className="icons" />
//                         <span>Variant Attributes</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/warranty"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <MdVerified className="icons" />
//                         <span>Warranties</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/barcode"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <CiBarcode className="icons" />
//                         <span>Print Barcode</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/qrcode"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("inventory", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <MdQrCode className="icons" />
//                         <span>Print QR Code</span>
//                       </span>
//                     </Link>
//                   </li>
//                 </ul>
//               </li>
//               {/* Stock Section */}
//               <li className={`submenu-open ${openMenus.stock ? "active" : ""}`}>
//                 <h6 className="submenu-hdr">Stock</h6>
//                 <ul>
//                   <li>
//                     <Link
//                       to="/manage-stocks"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("stock", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <PiStackDuotone className="icons" />
//                         <span>Manage Stock</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/stock-adjustment"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("stock", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <PiStairsBold className="icons" />
//                         <span>Stock Adjustment</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/stock-transfer"
//                       onClick={() => {
//                         handleLinkClick();
//                         toggleMenu("stock", true);
//                       }}
//                     >
//                       <span className="menu-item">
//                         <PiStackSimpleDuotone className="icons" />
//                         <span>Stock Transfer</span>
//                       </span>
//                     </Link>
//                   </li>
//                 </ul>
//               </li>

//               {/* sales Section */}
//               {/* <li className="submenu-open">
//                 <h6 className="submenu-hdr">Sales</h6>
//                 <ul>
//                   <li
//                     className={`submenu ${openMenus.salesOrders ? "open" : ""}`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.salesOrders ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("salesOrders", true)}
//                     >
//                       <span className="menu-item">
//                         <MdOutlineDashboard className="icons" />
//                         <span>Sales</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.salesOrders ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.salesOrders && (
//                       <ul>
//                         <li>
//                           <Link to="/online-orders" onClick={handleLinkClick}>
//                             Online Orders
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/pos-orders" onClick={handleLinkClick}>
//                             POS Orders
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   Invoices
//                   <li>
//                     <Link to="/invoice" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbFileInvoice className="icons" />
//                         <span>Invoices</span>
//                       </span>
//                     </Link>
//                   </li>

//                   Sales Return
//                   <li>
//                     <Link to="/sales-returns" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbReceiptRefund className="icons" />
//                         <span>Sales Return</span>
//                       </span>
//                     </Link>
//                   </li>

//                   Quotation
//                   <li>
//                     <Link to="/quotation-list" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbFileDescription className="icons" />
//                         <span>Quotation</span>
//                       </span>
//                     </Link>
//                   </li>

//                    POS Submenu 
//                   <li className={`submenu ${openMenus.pos ? "open" : ""}`}>
//                     <div
//                       className={`subdrop ${openMenus.pos ? "active" : ""}`}
//                       onClick={() => toggleMenu("pos", true)}
//                     >
//                       <span className="menu-item">
//                         <MdOutlinePointOfSale className="icons" />
//                         <span>POS</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.pos ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.pos && (
//                       <ul>
//                         <li>
//                           <Link to="/pos-1" onClick={handleLinkClick}>
//                             POS 1
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/pos-2" onClick={handleLinkClick}>
//                             POS 2
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/pos-3" onClick={handleLinkClick}>
//                             POS 3
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/pos-4" onClick={handleLinkClick}>
//                             POS 4
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/pos-5" onClick={handleLinkClick}>
//                             POS 5
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>
//                 </ul>
//               </li> */}

//               {/* Purchases Section */}
//               {/* <li
//                 className={`submenu-open ${openMenus.purchases ? "active" : ""
//                   }`}
//               >
//                 <h6 className="submenu-hdr">Purchases</h6>
//                 <ul>
//                   <li>
//                     <Link to="/purchase-list" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbShoppingBag className="icons" />
//                         <span>Purchases</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/purchase-order-report" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbFileUnknown className="icons" />
//                         <span>Purchase Order</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/purchase-returns" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbFileUpload className="icons" />
//                         <span>Purchase Return</span>
//                       </span>
//                     </Link>
//                   </li>
//                 </ul>
//               </li> */}

//               {/* Finance & Accounts Section */}
//               {/* <li className="submenu-open">
//                 <h6 className="submenu-hdr">Finance & Accounts</h6>
//                 <ul>
//                   Expenses
//                   <li className={`submenu ${openMenus.expenses ? "open" : ""}`}>
//                     <div
//                       className={`subdrop ${openMenus.expenses ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("expenses", true)}
//                     >
//                       <span className="menu-item">
//                         <TbFileStack className="icons" />
//                         <span>Expenses</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.expenses ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.expenses && (
//                       <ul>
//                         <li>
//                           <Link to="/expense-list" onClick={handleLinkClick}>
//                             Expenses
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/expense-category"
//                             onClick={handleLinkClick}
//                           >
//                             Expense Category
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   Income
//                   <li className={`submenu ${openMenus.income ? "open" : ""}`}>
//                     <div
//                       className={`subdrop ${openMenus.income ? "active" : ""}`}
//                       onClick={() => toggleMenu("income", true)}
//                     >
//                       <span className="menu-item">
//                         <TbFilePencil className="icons" />
//                         <span>Income</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.income ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.income && (
//                       <ul>
//                         <li>
//                           <Link to="/income" onClick={handleLinkClick}>
//                             Income
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/income-category" onClick={handleLinkClick}>
//                             Income Category
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   <li>
//                     <Link to="/account-list" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <CiBank className="icons" />
//                         <span>Bank Accounts</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/money-transfer" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbMoneybag className="icons" />
//                         <span>Money Transfer</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/balance-sheet" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbReportMoney className="icons" />
//                         <span>Balance Sheet</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/trial-balance" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbAlertCircle className="icons" />
//                         <span>Trial Balance</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/cash-flow" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbZoomMoney className="icons" />
//                         <span>Cash Flow</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/account-statement" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbFileInfinity className="icons" />
//                         <span>Account Statement</span>
//                       </span>
//                     </Link>
//                   </li>
//                 </ul>
//               </li> */}

//               {/* Peoples Section */}
//               <li className="submenu-open">
//                 <h6 className="submenu-hdr">Peoples</h6>
//                 <ul>
//                   <li>
//                     <Link to="/customers" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbUsersGroup className="icons" />
//                         <span>Customers</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/billers" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbUserUp className="icons" />
//                         <span>Billers</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/suppliers" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbUserDollar className="icons" />
//                         <span>Suppliers</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/store-list" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbHomeBolt className="icons" />
//                         <span>Stores</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/warehouse" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbBuildingWarehouse className="icons" />
//                         <span>Warehouses</span>
//                       </span>
//                     </Link>
//                   </li>
//                 </ul>
//               </li>

//               {/* { chat and mail} */}












//               { /* Promo Section */}

//               <li className={`submenu-open ${openMenus.promo ? "active" : ""}`}>
//                 <h6 className="submenu-hdr">Promo</h6>
//                 <ul>
//                   <li>
//                     <Link to="/coupons" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbFilePercent className="icons" />
//                         <span>Coupons</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/gift-cards" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbGiftCard className="icons" />
//                         <span>Gift Cards</span>
//                       </span>
//                     </Link>
//                   </li>


//                 </ul>
//               </li>

//               {/* HRM Section */}
//               {/* <li className="submenu-open">
//                 <h6 className="submenu-hdr">HRM</h6>
//                 <ul>
//                   <li>
//                     <Link to="/employees-grid" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbUser className="icons"/>
//                         <span>Employees</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/department-grid" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbCompass className="icons" />
//                         <span>Departments</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/designation" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbGitMerge className="icons" />
//                         <span>Designation</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/shift" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbArrowsShuffle className="icons" />
//                         <span>Shifts</span>
//                       </span>
//                     </Link>
//                   </li>

//                   Attendance submenu
//                   <li
//                     className={`submenu ${openMenus.attendance ? "open" : ""}`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.attendance ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("attendance", true)}
//                     >
//                       <span className="menu-item">
//                         <TbUserCog className="icons" />
//                         <span>Attendance</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.attendance ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.attendance && (
//                       <ul>
//                         <li>
//                           <Link
//                             to="/attendance-employee"
//                             onClick={handleLinkClick}
//                           >
//                             Employee
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/attendance-admin"
//                             onClick={handleLinkClick}
//                           >
//                             Admin
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   Leaves submenu
//                   <li className={`submenu ${openMenus.leaves ? "open" : ""}`}>
//                     <div
//                       className={`subdrop ${openMenus.leaves ? "active" : ""}`}
//                       onClick={() => toggleMenu("leaves", true)}
//                     >
//                       <span className="menu-item">
//                         <TbCalendar className="icons" />
//                         <span>Leaves</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.leaves ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.leaves && (
//                       <ul>
//                         <li>
//                           <Link to="/leaves-admin" onClick={handleLinkClick}>
//                             Admin Leaves
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/leaves-employee" onClick={handleLinkClick}>
//                             Employee Leaves
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/leave-types" onClick={handleLinkClick}>
//                             Leave Types
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   <li>
//                     <Link to="/holidays" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbCalendarShare className="icons" />
//                         <span>Holidays</span>
//                       </span>
//                     </Link>
//                   </li>

//                   Payroll submenu
//                   <li className={`submenu ${openMenus.payroll ? "open" : ""}`}>
//                     <div
//                       className={`subdrop ${openMenus.payroll ? "active" : ""}`}
//                       onClick={() => toggleMenu("payroll", true)}
//                     >
//                       <span className="menu-item">
//                         <TbFileDollar className="icons" />
//                         <span>Payroll</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.payroll ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.payroll && (
//                       <ul>
//                         <li>
//                           <Link to="/employee-salary" onClick={handleLinkClick}>
//                             Employee Salary
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/payslip" onClick={handleLinkClick}>
//                             Payslip
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>
//                 </ul>
//               </li> */}

//               {/* Reports Section */}
//               {/* <li className="submenu-open">
//                 <h6 className="submenu-hdr">Reports</h6>
//                 <ul>
//                   Sales Report submenu
//                   <li
//                     className={`submenu ${openMenus.salesReport ? "open" : ""}`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.salesReport ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("salesReport", true)}
//                     >
//                       <span className="menu-item">
//                         <TbChartBar className="icons" />
//                         <span>Sales Report</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.salesReport ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.salesReport && (
//                       <ul>
//                         <li>
//                           <Link to="/sales-report" onClick={handleLinkClick}>
//                             Sales Report
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/best-seller" onClick={handleLinkClick}>
//                             Best Seller
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>
//                   <li>
//                     <Link to="/purchase-report" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbChartPie2 className="icons" />
//                         <span>Purchase Report</span>
//                       </span>
//                     </Link>
//                   </li>

//                   Inventory Report submenu
//                   <li
//                     className={`submenu ${openMenus.inventoryReport ? "open" : ""
//                       }`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.inventoryReport ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("inventoryReport", true)}
//                     >
//                       <span className="menu-item">
//                         <TbTriangleInverted className="icons" />
//                         <span>Inventory Report</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.inventoryReport ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.inventoryReport && (
//                       <ul>
//                         <li>
//                           <Link
//                             to="/inventory-report"
//                             onClick={handleLinkClick}
//                           >
//                             Inventory Report
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/stock-history" onClick={handleLinkClick}>
//                             Stock History
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/sold-stock" onClick={handleLinkClick}>
//                             Sold Stock
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>
			  
//                   <li>
//                     <Link to="/invoice-report" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbBusinessplan className="icons" />
//                         <span>Invoice Report</span>
//                       </span>
//                     </Link>
//                   </li>

//                   Supplier Report submenu
//                   <li
//                     className={`submenu ${openMenus.supplierReport ? "open" : ""
//                       }`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.supplierReport ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("supplierReport", true)}
//                     >
//                       <span className="menu-item">
//                         <TbUserStar className="icons" />
//                         <span>Supplier Report</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.supplierReport ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.supplierReport && (
//                       <ul>
//                         <li>
//                           <Link to="/supplier-report" onClick={handleLinkClick}>
//                             Supplier Report
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/supplier-due-report"
//                             onClick={handleLinkClick}
//                           >
//                             Supplier Due Report
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   Customer Report submenu
//                   <li
//                     className={`submenu ${openMenus.customerReport ? "open" : ""
//                       }`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.customerReport ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("customerReport", true)}
//                     >
//                       <span className="menu-item">
//                         <TbReport className="icons" />
//                         <span>Customer Report</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.customerReport ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.customerReport && (
//                       <ul>
//                         <li>
//                           <Link to="/customer-report" onClick={handleLinkClick}>
//                             Customer Report
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/customer-due-report"
//                             onClick={handleLinkClick}
//                           >
//                             Customer Due Report
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   Product Report submenu
//                   <li
//                     className={`submenu ${openMenus.productReport ? "open" : ""
//                       }`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.productReport ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("productReport", true)}
//                     >
//                       <span className="menu-item">
//                         <TbReportAnalytics className="icons" />
//                         <span>Product Report</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.productReport ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.productReport && (
//                       <ul>
//                         <li>
//                           <Link to="/product-report" onClick={handleLinkClick}>
//                             Product Report
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/product-expiry-report"
//                             onClick={handleLinkClick}
//                           >
//                             Product Expiry Report
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/product-quantity-alert"
//                             onClick={handleLinkClick}
//                           >
//                             Product Quantity Alert
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   <li>
//                     <Link to="/expense-report" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbFileVector className="icons" />
//                         <span>Expense Report</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/income-report" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbChartPpf className="icons" />
//                         <span>Income Report</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/tax-reports" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbChartDots2 className="icons" />
//                         <span>Tax Report</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/profit-and-loss" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbChartDonut className="icons" />
//                         <span>Profit & Loss</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/annual-report" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbReportSearch className="icons" />
//                         <span>Annual Report</span>
//                       </span>
//                     </Link>
//                   </li>
//                 </ul>
//               </li> */}

//               {/* Location (state country city) */}
//               <li className="submenu-open">
//                 <h6 className="submenu-hdr">Location</h6>
//                 <ul>
//                   <li className={`submenu ${openMenus.Location ? "open" : ""}`}>
//                     <div
//                       className={`subdrop ${openMenus.Location ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("Location", true)}
//                     >
//                       <span className="menu-item">
//                         <TbMapPin className="icons" />
//                         <span>Location</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.Location ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.Location && (
//                       <ul>
//                         <li>
//                           <Link to="/locations" onClick={handleLinkClick}>
//                             Locations
//                           </Link>{" "}
//                         </li>
//                         <li>
//                           <Link to="/countries" onClick={handleLinkClick}>
//                             Countries
//                           </Link>{" "}
//                         </li>
//                         <li>
//                           <Link to="/states" onClick={handleLinkClick}>
//                             States
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/cities" onClick={handleLinkClick}>
//                             Cities
//                           </Link>{" "}
//                         </li>
//                       </ul>
//                     )}
//                   </li>
//                 </ul>
//               </li>

//               {/* User Management */}
//               <li
//                 className={`submenu-open ${openMenus.purchases ? "active" : ""
//                   }`}
//               >
//                 <h6 className="submenu-hdr">User Management</h6>
//                 <ul>
//                   <li>
//                     <Link to="/Users" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbUserShield className="icons" />
//                         <span>Users</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/roles-permissions" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbJumpRope className="icons" />
//                         <span>Roles & Permissions</span>
//                       </span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/delete-account" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbTrashX className="icons" />
//                         <span>Delete Account Request</span>
//                       </span>
//                     </Link>
//                   </li>
//                 </ul>
//               </li>

//               {/* Settings Section */}
//               <li className="submenu-open">
//                 <h6 className="submenu-hdr">Settings</h6>
//                 <ul>
//                   {/* General Settings */}
//                   <li
//                     className={`submenu ${openMenus.generalSettings ? "open" : ""
//                       }`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.generalSettings ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("generalSettings", true)}
//                     >
//                       <span className="menu-item">
//                         <TbSettings className="icons" />
//                         <span>General Settings</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.generalSettings ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.generalSettings && (
//                       <ul>
//                         <li>
//                           <Link
//                             to="/Purchase-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Purchase
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/warehouse-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Warehouse
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/general-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Profile
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/theme"
//                             onClick={handleLinkClick}
//                           >
//                             Theme
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/security-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Security
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/notification" onClick={handleLinkClick}>
//                             Notifications
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/connected-apps" onClick={handleLinkClick}>
//                             Connected Apps
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   {/* Website Settings */}
//                   <li
//                     className={`submenu ${openMenus.websiteSettings ? "open" : ""
//                       }`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.websiteSettings ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("websiteSettings", true)}
//                     >
//                       <span className="menu-item">
//                         <TbWorld className="icons" />
//                         <span>Website Settings</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.websiteSettings ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.websiteSettings && (
//                       <ul>
//                         <li>
//                           <Link to="/system-settings" onClick={handleLinkClick}>
//                             System Settings
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/company-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Company Settings
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/localization-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Localization
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/prefixes" onClick={handleLinkClick}>
//                             Prefixes
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/preference" onClick={handleLinkClick}>
//                             Preference
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/appearance" onClick={handleLinkClick}>
//                             Appearance
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/social-authentication"
//                             onClick={handleLinkClick}
//                           >
//                             Social Authentication
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/language-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Language
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   {/* App Settings */}
//                   <li
//                     className={`submenu ${openMenus.appSettings ? "open" : ""}`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.appSettings ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("appSettings", true)}
//                     >
//                       <span className="menu-item">
//                         <TbDeviceMobile className="icons" />
//                         <span>App Settings</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.appSettings ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.appSettings && (
//                       <ul>
//                         <li
//                           className={`submenu ${openMenus.invoiceSettings ? "open" : ""
//                             }`}
//                         >
//                           <div
//                             className={`subdrop ${openMenus.invoiceSettings ? "active" : ""
//                               }`}
//                             onClick={() => toggleMenu("invoiceSettings")}
//                           >
//                             <span>Invoice</span>
//                             <span
//                               className={`menu-arrow ${openMenus.invoiceSettings ? "rotated" : ""
//                                 }`}
//                             />
//                           </div>
//                           {openMenus.invoiceSettings && (
//                             <ul>
//                               <li>
//                                 <Link
//                                   to="/invoice-settings"
//                                   onClick={handleLinkClick}
//                                 >
//                                   Invoice Settings
//                                 </Link>
//                               </li>
//                               <li>
//                                 <Link
//                                   to="/invoice-template"
//                                   onClick={handleLinkClick}
//                                 >
//                                   Invoice Template
//                                 </Link>
//                               </li>
//                             </ul>
//                           )}
//                         </li>

//                         <li>
//                           <Link
//                             to="/printer-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Printer
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/pos-settings" onClick={handleLinkClick}>
//                             POS
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/custom-fields" onClick={handleLinkClick}>
//                             Custom Fields
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   {/* System Settings */}
//                   <li
//                     className={`submenu ${openMenus.systemSettings ? "open" : ""
//                       }`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.systemSettings ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("systemSettings", true)}
//                     >
//                       <span className="menu-item">
//                         <TbDeviceDesktop className="icons" />
//                         <span>System Settings</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.systemSettings ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.systemSettings && (
//                       <ul>
//                         {/* Email */}
//                         <li
//                           className={`submenu ${openMenus.emailSettings ? "open" : ""
//                             }`}
//                         >
//                           <div
//                             // className={`subdrop ${openMenus.emailSettings ? 'active' : ''}`}
//                             onClick={() => toggleMenu("emailSettings")}
//                           >
//                             <span>Email</span>
//                             <span
//                               className={`menu-arrow ${openMenus.emailSettings ? "rotated" : ""
//                                 }`}
//                             />
//                           </div>
//                           {openMenus.emailSettings && (
//                             <ul>
//                               <li>
//                                 <Link
//                                   to="/email-settings"
//                                   onClick={handleLinkClick}
//                                 >
//                                   Email Settings
//                                 </Link>
//                               </li>
//                               <li>
//                                 <Link
//                                   to="/email-template"
//                                   onClick={handleLinkClick}
//                                 >
//                                   Email Template
//                                 </Link>
//                               </li>
//                             </ul>
//                           )}
//                         </li>

//                         {/* SMS */}
//                         <li
//                           className={`submenu ${openMenus.smsSettings ? "open" : ""
//                             }`}
//                         >
//                           <div
//                             // className={`subdrop ${openMenus.smsSettings ? 'active' : ''}`}
//                             onClick={() => toggleMenu("smsSettings")}
//                           >
//                             <span>SMS</span>
//                             <span
//                               className={`menu-arrow ${openMenus.smsSettings ? "rotated" : ""
//                                 }`}
//                             />
//                           </div>
//                           {openMenus.smsSettings && (
//                             <ul>
//                               <li>
//                                 <Link
//                                   to="/sms-settings"
//                                   onClick={handleLinkClick}
//                                 >
//                                   SMS Settings
//                                 </Link>
//                               </li>
//                               <li>
//                                 <Link
//                                   to="/sms-template"
//                                   onClick={handleLinkClick}
//                                 >
//                                   SMS Template
//                                 </Link>
//                               </li>
//                             </ul>
//                           )}
//                         </li>

//                         <li>
//                           <Link to="/otp-settings" onClick={handleLinkClick}>
//                             OTP
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/gdpr-settings" onClick={handleLinkClick}>
//                             GDPR Cookies
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   {/* Financial Settings */}
//                   <li
//                     className={`submenu ${openMenus.financialSettings ? "open" : ""
//                       }`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.financialSettings ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("financialSettings", true)}
//                     >
//                       <span className="menu-item">
//                         <TbSettingsDollar className="icons" />
//                         <span>Financial Settings</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.financialSettings ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.financialSettings && (
//                       <ul>
//                         <li>
//                           <Link
//                             to="/payment-gateway-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Payment Gateway
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/bank-settings-grid"
//                             onClick={handleLinkClick}
//                           >
//                             Bank Accounts
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/tax-rates" onClick={handleLinkClick}>
//                             Tax Rates
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to="/currency-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Currencies
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   {/* Other Settings */}
//                   <li
//                     className={`submenu ${openMenus.otherSettings ? "open" : ""
//                       }`}
//                   >
//                     <div
//                       className={`subdrop ${openMenus.otherSettings ? "active" : ""
//                         }`}
//                       onClick={() => toggleMenu("otherSettings", true)}
//                     >
//                       <span className="menu-item">
//                         <TbSettings2 className="icons" />
//                         <span>Other Settings</span>
//                       </span>
//                       <span
//                         className={`menu-arrow ${openMenus.otherSettings ? "rotated" : ""
//                           }`}
//                       />
//                     </div>
//                     {openMenus.otherSettings && (
//                       <ul>
//                         <li>
//                           <Link
//                             to="/storage-settings"
//                             onClick={handleLinkClick}
//                           >
//                             Storage
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/ban-ip-address" onClick={handleLinkClick}>
//                             Ban IP Address
//                           </Link>
//                         </li>
//                       </ul>
//                     )}
//                   </li>

//                   {/* Logout */}

//                   <li>
//                     <Link to="/logout" onClick={handleLinkClick}>
//                       <span className="menu-item">
//                         <TbLogout className="icons" />
//                         <span>Logout</span>
//                       </span>
//                     </Link>
//                   </li>
//                 </ul>
//               </li>
//             </ul>
//           </div>
//         </div>


//         <div class="sidebar-bottom">
//           <Link to="/"> <img src={IconLogo} class="compact-logo" alt="Compact Footer Logo" /></Link>
//           <Link to="/"> <img src={Logo} class="full-logo" alt="Full Footer Logo" /></Link>


//         </div>

//       </div>
//     </>
//   );
// };

// export default Sidebar;