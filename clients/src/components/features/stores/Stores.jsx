


// import React, { useEffect } from 'react';
// import "../../../styles/style.css";
// import { TbSettings } from 'react-icons/tb';
// import ThemeColorPicker from '../../../pages/themes/ThemeCustomizer';



// const ThemeCustomizer = () => {
//   useEffect(() => {
//     // Apply the saved theme settings from local storage
//     document.querySelector('html').setAttribute('data-theme', localStorage.getItem('theme') || 'light');
//     document.querySelector('html').setAttribute('data-sidebar', localStorage.getItem('sidebarTheme') || 'light');
//     document.querySelector('html').setAttribute('data-color', localStorage.getItem('color') || 'primary');
//     document.querySelector('html').setAttribute('data-topbar', localStorage.getItem('topbar') || 'white');
//     document.querySelector('html').setAttribute('data-layout', localStorage.getItem('layout') || 'default');
//     document.querySelector('html').setAttribute('data-width', localStorage.getItem('width') || 'fluid');
//   }, []);

//   // Handler functions for theme changes
//   const handleThemeChange = (e) => {
//     const value = e.target.value;
//     document.documentElement.setAttribute('data-theme', value);
//     localStorage.setItem('theme', value);
//   };

//   const handleSidebarChange = (e) => {
//     const value = e.target.value;
//     document.documentElement.setAttribute('data-sidebar', value);
//     localStorage.setItem('sidebarTheme', value);
//   };

//   const handleColorChange = (e) => {
//     const value = e.target.value;
//     document.documentElement.setAttribute('data-color', value);
//     localStorage.setItem('color', value);
//   };

//   const handleLayoutChange = (e) => {
//     const value = e.target.value;
//     document.documentElement.setAttribute('data-layout', value);
//     localStorage.setItem('layout', value);
//   };

//   const handleTopbarChange = (e) => {
//     const value = e.target.value;
//     document.documentElement.setAttribute('data-topbar', value);
//     localStorage.setItem('topbar', value);
//   };

//   const handleWidthChange = (e) => {
//     const value = e.target.value;
//     document.documentElement.setAttribute('data-width', value);
//     localStorage.setItem('width', value);
//   };

//   const handleReset = (e) => {
//     e.preventDefault();
//     localStorage.clear();
//     window.location.reload();
//   };

//   return (
//     <div className="sidebar-contact">
//       <div className="toggle-theme" data-bs-toggle="offcanvas" data-bs-target="#theme-setting">
//         <tbSettings />
//       </div>
//       <div className="sidebar-themesettings offcanvas offcanvas-end" id="theme-setting">
//         <div className="offcanvas-header d-flex align-items-center justify-content-between bg-dark">
//           <div>
//             <h3 className="mb-1 text-white">Theme Customizer</h3>
//             <p className="text-light">Choose your themes & layouts etc.</p>
//           </div>
//           <a href="#" className="custom-btn-close d-flex align-items-center justify-content-center text-white" data-bs-dismiss="offcanvas">
//             <i className="ti ti-x"></i>
//           </a>
//         </div>
//         <div className="themecard-body offcanvas-body">
//           <div className="accordion accordion-customicon1 accordions-items-seperate" id="settingtheme">
//             {/* Layout Selection */}
//             <div className="accordion-item border px-3 layout-select">
//               <h2 className="accordion-header">
//                 <button className="accordion-button text-dark bg-transparent fs-16 px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#layoutsetting" aria-expanded="true">
//                   Select Layouts
//                 </button>
//               </h2>
//               <div id="layoutsetting" className="accordion-collapse collapse show">
//                 <div className="accordion-body border-top px-0 py-3">
//                   <div className="row gx-3">
//                     {/* Default Layout */}
//                     <div className="col-4">
//                       <div className="theme-layout mb-3">
//                         <input type="radio" name="LayoutTheme" id="defaultLayout" value="default" defaultChecked onChange={handleLayoutChange} />
//                         <label htmlFor="defaultLayout">
//                           <span className="d-block mb-2 layout-img">
//                             <img src="assets/img/theme/default.svg" alt="img" />
//                           </span>
//                           <span className="layout-type">Default</span>
//                         </label>
//                       </div>
//                     </div>
//                     {/* Mini Layout */}
//                     <div className="col-4">
//                       <div className="theme-layout mb-3">
//                         <input type="radio" name="LayoutTheme" id="miniLayout" value="mini" onChange={handleLayoutChange} />
//                         <label htmlFor="miniLayout">
//                           <span className="d-block mb-2 layout-img">
//                             <img src="assets/img/theme/mini.svg" alt="img" />
//                           </span>
//                           <span className="layout-type">Mini</span>
//                         </label>
//                       </div>
//                     </div>
//                     {/* Two Column Layout */}
//                     <div className="col-4">
//                       <div className="theme-layout mb-3">
//                         <input type="radio" name="LayoutTheme" id="twocolumnLayout" value="twocolumn" onChange={handleLayoutChange} />
//                         <label htmlFor="twocolumnLayout">
//                           <span className="d-block mb-2 layout-img">
//                             <img src="assets/img/theme/two-column.svg" alt="img" />
//                           </span>
//                           <span className="layout-type">Two Column</span>
//                         </label>
//                       </div>
//                     </div>
//                     {/* Horizontal Layout */}
//                     <div className="col-4">
//                       <div className="theme-layout mb-3">
//                         <input type="radio" name="LayoutTheme" id="horizontalLayout" value="horizontal" onChange={handleLayoutChange} />
//                         <label htmlFor="horizontalLayout">
//                           <span className="d-block mb-2 layout-img">
//                             <img src="assets/img/theme/horizontal.svg" alt="img" />
//                           </span>
//                           <span className="layout-type">Horizontal</span>
//                         </label>
//                       </div>
//                     </div>
//                     {/* Detached Layout */}
//                     <div className="col-4">
//                       <div className="theme-layout mb-3">
//                         <input type="radio" name="LayoutTheme" id="detachedLayout" value="detached" onChange={handleLayoutChange} />
//                         <label htmlFor="detachedLayout">
//                           <span className="d-block mb-2 layout-img">
//                             <img src="assets/img/theme/detached.svg" alt="img" />
//                           </span>
//                           <span className="layout-type">Detached</span>
//                         </label>
//                       </div>
//                     </div>
//                     {/* Without Header Layout */}
//                     <div className="col-4">
//                       <div className="theme-layout mb-3">
//                         <input type="radio" name="LayoutTheme" id="without-headerLayout" value="without-header" onChange={handleLayoutChange} />
//                         <label htmlFor="without-headerLayout">
//                           <span className="d-block mb-2 layout-img">
//                             <img src="assets/img/theme/without-header.svg" alt="img" />
//                           </span>
//                           <span className="layout-type">Without Header</span>
//                         </label>
//                       </div>
//                     </div>
//                     {/* RTL Layout (link) */}
//                     <div className="col-4">
//                       <a href="layout-rtl.html" className="theme-layout mb-3">
//                         <span className="d-block mb-2 layout-img">
//                           <img src="assets/img/theme/rtl.svg" alt="img" />
//                         </span>
//                         <span className="layout-type d-block">RTL</span>
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Layout Width */}
//             <div className="accordion-item border px-3 layout-select">
//               <h2 className="accordion-header">
//                 <button className="accordion-button text-dark fs-16 bg-transparent px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarsetting" aria-expanded="true">
//                   Layout Width
//                 </button>
//               </h2>
//               <div id="sidebarsetting" className="accordion-collapse collapse show">
//                 <div className="accordion-body px-0 py-3 border-top">
//                   <div className="d-flex align-items-center">
//                     <div className="theme-width m-1 me-2">
//                       <input type="radio" name="width" id="fluidWidth" value="fluid" defaultChecked onChange={handleWidthChange} />
//                       <label htmlFor="fluidWidth" className="d-block rounded fs-12">
//                         <i className="ti ti-layout-list me-1"></i>
//                         Fluid Layout
//                       </label>
//                     </div>
//                     <div className="theme-width m-1">
//                       <input type="radio" name="width" id="boxWidth" value="box" onChange={handleWidthChange} />
//                       <label htmlFor="boxWidth" className="d-block rounded fs-12">
//                         <i className="ti ti-layout-distribute-horizontal me-1"></i>
//                         Boxed Layout
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Top Bar Color */}
//             <div className="accordion-item border px-3">
//               <h2 className="accordion-header">
//                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#topbarsetting" aria-expanded="true">
//                   Top Bar Color
//                 </button>
//               </h2>
//               <div id="topbarsetting" className="accordion-collapse collapse show">
//                 <div className="accordion-body pb-1 px-0 py-3 border-top">
//                   <div className="d-flex align-items-center flex-wrap">
//                     <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                       <input type="radio" name="topbar" id="whiteTopbar" value="white" defaultChecked onChange={handleTopbarChange} />
//                       <label htmlFor="whiteTopbar" className="bg-white"></label>
//                     </div>
//                     <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                       <input type="radio" name="topbar" id="darkaquaTopbar" value="topbarcolorone" onChange={handleTopbarChange} />
//                       <label htmlFor="darkaquaTopbar" className="bg-sidebar-color-1"></label>
//                     </div>
//                     <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                       <input type="radio" name="topbar" id="whiterockTopbar" value="topbarcolortwo" onChange={handleTopbarChange} />
//                       <label htmlFor="whiterockTopbar" className="bg-sidebar-color-2"></label>
//                     </div>
//                     <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                       <input type="radio" name="topbar" id="rockblueTopbar" value="topbarcolorthree" onChange={handleTopbarChange} />
//                       <label htmlFor="rockblueTopbar" className="bg-sidebar-color-3"></label>
//                     </div>
//                     <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                       <input type="radio" name="topbar" id="bluehazeTopbar" value="topbarcolorfour" onChange={handleTopbarChange} />
//                       <label htmlFor="bluehazeTopbar" className="bg-sidebar-color-4"></label>
//                     </div>
//                     <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                       <input type="radio" name="topbar" id="topbar-color-5" value="topbarcolorfive" onChange={handleTopbarChange} />
//                       <label htmlFor="topbar-color-5" className="bg-sidebar-color-5"></label>
//                     </div>
//                     <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
//                       <input type="radio" name="topbar" id="topbar-color-6" value="topbarcolorsix" onChange={handleTopbarChange} />
//                       <label htmlFor="topbar-color-6" className="bg-sidebar-color-6"></label>
//                     </div>
//                     {/* Color picker for topbar */}
//                     <div className="theme-colorselect theme-colorselect-rounded mb-3 mt-0">
//                       <ThemeColorPicker />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Sidebar Color */}
//             <div className="accordion-item border px-3 layout-select">
//               <h2 className="accordion-header">
//                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarcolor" aria-expanded="true">
//                   Sidebar Color
//                 </button>
//               </h2>
//               <div id="sidebarcolor" className="accordion-collapse collapse show">
//                 <div className="accordion-body px-0 py-3 border-top">
//                   <div className="d-flex align-items-center flex-wrap">
//                     <div className="theme-colorselect m-1 me-3">
//                       <input type="radio" name="sidebar" id="lightSidebar" value="light" defaultChecked onChange={handleSidebarChange} />
//                       <label htmlFor="lightSidebar" className="d-block mb-2"></label>
//                     </div>
//                     <div className="theme-colorselect me-3">
//                       <input type="radio" name="sidebar" id="bgcolorSidebar" value="sidebarcolorone" onChange={handleSidebarChange} />
//                       <label htmlFor="bgcolorSidebar" className="d-block bg-sidebar-color-1 mb-2"></label>
//                     </div>
//                     <div className="theme-colorselect me-3">
//                       <input type="radio" name="sidebar" id="bgcolor2Sidebar" value="sidebarcolortwo" onChange={handleSidebarChange} />
//                       <label htmlFor="bgcolor2Sidebar" className="d-block bg-sidebar-color-2 mb-2"></label>
//                     </div>
//                     <div className="theme-colorselect me-3">
//                       <input type="radio" name="sidebar" id="bgcolor3Sidebar" value="sidebarcolorthree" onChange={handleSidebarChange} />
//                       <label htmlFor="bgcolor3Sidebar" className="d-block bg-sidebar-color-3 mb-2"></label>
//                     </div>
//                     <div className="theme-colorselect me-3">
//                       <input type="radio" name="sidebar" id="bgcolor4Sidebar" value="sidebarcolorfour" onChange={handleSidebarChange} />
//                       <label htmlFor="bgcolor4Sidebar" className="d-block bg-sidebar-color-4 mb-2"></label>
//                     </div>
//                     <div className="theme-colorselect me-3">
//                       <input type="radio" name="sidebar" id="bgcolor5Sidebar" value="sidebarcolorfive" onChange={handleSidebarChange} />
//                       <label htmlFor="bgcolor5Sidebar" className="d-block bg-sidebar-color-5 mb-2"></label>
//                     </div>
//                     <div className="theme-colorselect me-3">
//                       <input type="radio" name="sidebar" id="bgcolor6Sidebar" value="sidebarcolorsix" onChange={handleSidebarChange} />
//                       <label htmlFor="bgcolor6Sidebar" className="d-block bg-sidebar-color-6 mb-2"></label>
//                     </div>
//                     {/* Color picker for sidebar */}
//                     <div className="theme-colorselect mt-0 mb-2">
//                       <ThemeColorPicker />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Theme Mode */}
//             <div className="accordion-item border px-3">
//               <h2 className="accordion-header">
//                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#modesetting" aria-expanded="true">
//                   Theme Mode
//                 </button>
//               </h2>
//               <div id="modesetting" className="accordion-collapse collapse show">
//                 <div className="accordion-body px-0 py3 border-top">
//                   <div className="d-flex align-items-center">
//                     <div className="theme-mode flex-fill text-center w-100 me-3">
//                       <input type="radio" name="theme" id="lightTheme" value="light" defaultChecked onChange={handleThemeChange} />
//                       <label htmlFor="lightTheme" className="rounded fw-medium w-100">
//                         <span className="d-inline-flex rounded me-2"><i className="ti ti-sun-filled"></i></span>Light
//                       </label>
//                     </div>
//                     <div className="theme-mode flex-fill text-center w-100 me-3">
//                       <input type="radio" name="theme" id="darkTheme" value="dark" onChange={handleThemeChange} />
//                       <label htmlFor="darkTheme" className="rounded fw-medium w-100">
//                         <span className="d-inline-flex rounded me-2"><i className="ti ti-moon-filled"></i></span>Dark
//                       </label>
//                     </div>
//                     <div className="theme-mode flex-fill w-100 text-center">
//                       <input type="radio" name="theme" id="systemTheme" value="system" onChange={handleThemeChange} />
//                       <label htmlFor="systemTheme" className="rounded fw-medium w-100">
//                         <span className="d-inline-flex rounded me-2"><i className="ti ti-device-laptop"></i></span>System
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Add more sections as needed, following the same pattern */}
//           </div>
//         </div>
//         <div className="p-3 pt-0">
//           <div className="row gx-3">
//             <div className="col-6">
//               <a href="#" id="resetbutton" className="btn btn-light close-theme w-100" onClick={handleReset}>
//                 <i className="ti ti-restore me-1"></i>Reset
//               </a>
//             </div>
//             <div className="col-6">
//               <a href="#" className="btn btn-primary w-100" data-bs-dismiss="offcanvas">
//                 <i className="ti ti-shopping-cart-plus me-1"></i>Buy Product
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// // const ThemeCustomizer = () => {
// //   useEffect(() => {
// //     // Apply the saved theme settings from local storage
// //     document.querySelector('html').setAttribute('data-theme', localStorage.getItem('theme') || 'light');
// //     document.querySelector('html').setAttribute('data-sidebar', localStorage.getItem('sidebarTheme') || 'light');
// //     document.querySelector('html').setAttribute('data-color', localStorage.getItem('color') || 'primary');
// //     document.querySelector('html').setAttribute('data-topbar', localStorage.getItem('topbar') || 'white');
// //     document.querySelector('html').setAttribute('data-layout', localStorage.getItem('layout') || 'default');
// //     document.querySelector('html').setAttribute('data-width', localStorage.getItem('width') || 'fluid');
// //   }, []);

// //   // Handler functions for theme changes
// //   const handleThemeChange = (e) => {
// //     const value = e.target.value;
// //     document.documentElement.setAttribute('data-theme', value);
// //     localStorage.setItem('theme', value);
// //   };

// //   const handleSidebarChange = (e) => {
// //     const value = e.target.value;
// //     document.documentElement.setAttribute('data-sidebar', value);
// //     localStorage.setItem('sidebarTheme', value);
// //   };

// //   const handleColorChange = (e) => {
// //     const value = e.target.value;
// //     document.documentElement.setAttribute('data-color', value);
// //     localStorage.setItem('color', value);
// //   };

// //   const handleLayoutChange = (e) => {
// //     const value = e.target.value;
// //     document.documentElement.setAttribute('data-layout', value);
// //     localStorage.setItem('layout', value);
// //   };

// //   const handleTopbarChange = (e) => {
// //     const value = e.target.value;
// //     document.documentElement.setAttribute('data-topbar', value);
// //     localStorage.setItem('topbar', value);
// //   };

// //   const handleWidthChange = (e) => {
// //     const value = e.target.value;
// //     document.documentElement.setAttribute('data-width', value);
// //     localStorage.setItem('width', value);
// //   };

// //   const handleReset = (e) => {
// //     e.preventDefault();
// //     localStorage.clear();
// //     window.location.reload();
// //   };

// //   return (
// //     <div className="sidebar-contact">
// //       <div className="toggle-theme" data-bs-toggle="offcanvas" data-bs-target="#theme-setting">
// //         {/* <i className="fa fa-cog fa-w-16 fa-spin"></i> */}
// //         < TbSettings />
// //       </div>
// //       <div className="sidebar-themesettings offcanvas offcanvas-end" id="theme-setting">
// //         <div className="offcanvas-header d-flex align-items-center justify-content-between bg-dark">
// //           <div>
// //             <h3 className="mb-1 text-white">Theme Customizer</h3>
// //             <p className="text-light">Choose your themes & layouts etc.</p>
// //           </div>
// //           <a href="#" className="custom-btn-close d-flex align-items-center justify-content-center text-white" data-bs-dismiss="offcanvas">
// //             <i className="ti ti-x"></i>
// //           </a>
// //         </div>
// //         <div className="themecard-body offcanvas-body">
// //           <div className="accordion accordion-customicon1 accordions-items-seperate" id="settingtheme">
// //             {/* Layout Selection */}
// //             <div className="accordion-item border px-3 layout-select">
// //               <h2 className="accordion-header">
// //                 <button className="accordion-button text-dark bg-transparent fs-16 px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#layoutsetting" aria-expanded="true">
// //                   Select Layouts
// //                 </button>
// //               </h2>
// //               <div id="layoutsetting" className="accordion-collapse collapse show">
// //                 <div className="accordion-body border-top px-0 py-3">
// //                   <div className="row gx-3">
// //                     {/* Default Layout */}
// //                     <div className="col-4">
// //                       <div className="theme-layout mb-3">
// //                         <input type="radio" name="LayoutTheme" id="defaultLayout" value="default" defaultChecked onChange={handleLayoutChange} />
// //                         <label htmlFor="defaultLayout">
// //                           <span className="d-block mb-2 layout-img">
// //                             <img src="assets/img/theme/default.svg" alt="img" />
// //                           </span>
// //                           <span className="layout-type">Default</span>
// //                         </label>
// //                       </div>
// //                     </div>
// //                     {/* Mini Layout */}
// //                     <div className="col-4">
// //                       <div className="theme-layout mb-3">
// //                         <input type="radio" name="LayoutTheme" id="miniLayout" value="mini" onChange={handleLayoutChange} />
// //                         <label htmlFor="miniLayout">
// //                           <span className="d-block mb-2 layout-img">
// //                             <img src="assets/img/theme/mini.svg" alt="img" />
// //                           </span>
// //                           <span className="layout-type">Mini</span>
// //                         </label>
// //                       </div>
// //                     </div>
// //                     {/* Two Column Layout */}
// //                     <div className="col-4">
// //                       <div className="theme-layout mb-3">
// //                         <input type="radio" name="LayoutTheme" id="twocolumnLayout" value="twocolumn" onChange={handleLayoutChange} />
// //                         <label htmlFor="twocolumnLayout">
// //                           <span className="d-block mb-2 layout-img">
// //                             <img src="assets/img/theme/two-column.svg" alt="img" />
// //                           </span>
// //                           <span className="layout-type">Two Column</span>
// //                         </label>
// //                       </div>
// //                     </div>
// //                     {/* Horizontal Layout */}
// //                     <div className="col-4">
// //                       <div className="theme-layout mb-3">
// //                         <input type="radio" name="LayoutTheme" id="horizontalLayout" value="horizontal" onChange={handleLayoutChange} />
// //                         <label htmlFor="horizontalLayout">
// //                           <span className="d-block mb-2 layout-img">
// //                             <img src="assets/img/theme/horizontal.svg" alt="img" />
// //                           </span>
// //                           <span className="layout-type">Horizontal</span>
// //                         </label>
// //                       </div>
// //                     </div>
// //                     {/* Detached Layout */}
// //                     <div className="col-4">
// //                       <div className="theme-layout mb-3">
// //                         <input type="radio" name="LayoutTheme" id="detachedLayout" value="detached" onChange={handleLayoutChange} />
// //                         <label htmlFor="detachedLayout">
// //                           <span className="d-block mb-2 layout-img">
// //                             <img src="assets/img/theme/detached.svg" alt="img" />
// //                           </span>
// //                           <span className="layout-type">Detached</span>
// //                         </label>
// //                       </div>
// //                     </div>
// //                     {/* Without Header Layout */}
// //                     <div className="col-4">
// //                       <div className="theme-layout mb-3">
// //                         <input type="radio" name="LayoutTheme" id="without-headerLayout" value="without-header" onChange={handleLayoutChange} />
// //                         <label htmlFor="without-headerLayout">
// //                           <span className="d-block mb-2 layout-img">
// //                             <img src="assets/img/theme/without-header.svg" alt="img" />
// //                           </span>
// //                           <span className="layout-type">Without Header</span>
// //                         </label>
// //                       </div>
// //                     </div>
// //                     {/* RTL Layout (link) */}
// //                     <div className="col-4">
// //                       <a href="layout-rtl.html" className="theme-layout mb-3">
// //                         <span className="d-block mb-2 layout-img">
// //                           <img src="assets/img/theme/rtl.svg" alt="img" />
// //                         </span>
// //                         <span className="layout-type d-block">RTL</span>
// //                       </a>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //             {/* Layout Width */}
// //             <div className="accordion-item border px-3 layout-select">
// //               <h2 className="accordion-header">
// //                 <button className="accordion-button text-dark fs-16 bg-transparent px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarsetting" aria-expanded="true">
// //                   Layout Width
// //                 </button>
// //               </h2>
// //               <div id="sidebarsetting" className="accordion-collapse collapse show">
// //                 <div className="accordion-body px-0 py-3 border-top">
// //                   <div className="d-flex align-items-center">
// //                     <div className="theme-width m-1 me-2">
// //                       <input type="radio" name="width" id="fluidWidth" value="fluid" defaultChecked onChange={handleWidthChange} />
// //                       <label htmlFor="fluidWidth" className="d-block rounded fs-12">
// //                         <i className="ti ti-layout-list me-1"></i>
// //                         Fluid Layout
// //                       </label>
// //                     </div>
// //                     <div className="theme-width m-1">
// //                       <input type="radio" name="width" id="boxWidth" value="box" onChange={handleWidthChange} />
// //                       <label htmlFor="boxWidth" className="d-block rounded fs-12">
// //                         <i className="ti ti-layout-distribute-horizontal me-1"></i>
// //                         Boxed Layout
// //                       </label>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //             {/* Top Bar Color */}
// //             <div className="accordion-item border px-3">
// //               <h2 className="accordion-header">
// //                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#topbarsetting" aria-expanded="true">
// //                   Top Bar Color
// //                 </button>
// //               </h2>
// //               <div id="topbarsetting" className="accordion-collapse collapse show">
// //                 <div className="accordion-body pb-1 px-0 py-3 border-top">
// //                   {/* ... Topbar color options ... */}
// //                   {/* For brevity, you can add the rest of the color options here, following the same pattern as above */}
// //                   <div className="theme-colorselect theme-colorselect-rounded mb-3 me-3">
// //                     <input type="radio" name="topbar" id="whiteTopbar" value="white" defaultChecked onChange={handleTopbarChange} />
// //                     <label htmlFor="whiteTopbar" className="bg-white"></label>
// //                   </div>
// //                   {/* Add more color options as needed */}
// //                 </div>
// //               </div>
// //             </div>
// //             {/* Sidebar Color */}
// //             <div className="accordion-item border px-3 layout-select">
// //               <h2 className="accordion-header">
// //                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarcolor" aria-expanded="true">
// //                   Sidebar Color
// //                 </button>
// //               </h2>
// //               <div id="sidebarcolor" className="accordion-collapse collapse show">
// //                 <div className="accordion-body px-0 py-3 border-top">
// //                   <div className="theme-colorselect m-1 me-3">
// //                     <input type="radio" name="sidebar" id="lightSidebar" value="light" defaultChecked onChange={handleSidebarChange} />
// //                     <label htmlFor="lightSidebar" className="d-block mb-2"></label>
// //                   </div>
// //                   {/* Add more sidebar color options as needed */}
// //                 </div>
// //               </div>
// //             </div>
// //             {/* Theme Mode */}
// //             <div className="accordion-item border px-3">
// //               <h2 className="accordion-header">
// //                 <button className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#modesetting" aria-expanded="true">
// //                   Theme Mode
// //                 </button>
// //               </h2>
// //               <div id="modesetting" className="accordion-collapse collapse show">
// //                 <div className="accordion-body px-0 py3 border-top">
// //                   <div className="d-flex align-items-center">
// //                     <div className="theme-mode flex-fill text-center w-100 me-3">
// //                       <input type="radio" name="theme" id="lightTheme" value="light" defaultChecked onChange={handleThemeChange} />
// //                       <label htmlFor="lightTheme" className="rounded fw-medium w-100">
// //                         <span className="d-inline-flex rounded me-2"><i className="ti ti-sun-filled"></i></span>Light
// //                       </label>
// //                     </div>
// //                     <div className="theme-mode flex-fill text-center w-100 me-3">
// //                       <input type="radio" name="theme" id="darkTheme" value="dark" onChange={handleThemeChange} />
// //                       <label htmlFor="darkTheme" className="rounded fw-medium w-100">
// //                         <span className="d-inline-flex rounded me-2"><i className="ti ti-moon-filled"></i></span>Dark
// //                       </label>
// //                     </div>
// //                     <div className="theme-mode flex-fill w-100 text-center">
// //                       <input type="radio" name="theme" id="systemTheme" value="system" onChange={handleThemeChange} />
// //                       <label htmlFor="systemTheme" className="rounded fw-medium w-100">
// //                         <span className="d-inline-flex rounded me-2"><i className="ti ti-device-laptop"></i></span>System
// //                       </label>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //             {/* Add more sections as needed, following the same pattern */}
// //           </div>
// //         </div>
// //         <div className="p-3 pt-0">
// //           <div className="row gx-3">
// //             <div className="col-6">
// //               <a href="#" id="resetbutton" className="btn btn-light close-theme w-100" onClick={handleReset}>
// //                 <i className="ti ti-restore me-1"></i>Reset
// //               </a>
// //             </div>
// //             <div className="col-6">
// //               <a href="#" className="btn btn-primary w-100" data-bs-dismiss="offcanvas">
// //                 <i className="ti ti-shopping-cart-plus me-1"></i>Buy Product
// //               </a>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// export default ThemeCustomizer;




import React from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbEye, TbPointFilled, TbTrash } from "react-icons/tb";

const Stores = () => {
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Stores</h4>
              <h6>Manage your Store</h6>
            </div>
          </div>
          {/* <ul className="table-top-head">
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
          </li>
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print"><i data-feather="printer" className="feather-rotate-ccw" /></a>
          </li>
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i className="ti ti-refresh" /></a>
          </li>
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
          </li>
        </ul> */}
          <div className="table-top-head me-2">
            <li>
              <button type="button" className="icon-btn" title="Pdf">
                <FaFilePdf />
              </button>
            </li>
            <li>
              <label className="icon-btn m-0" title="Import Excel">
                <input type="file" accept=".xlsx, .xls" hidden />
                <FaFileExcel style={{ color: "green" }} />
              </label>
            </li>
            <li>
              <button type="button" className="icon-btn" title="Export Excel">
                <FaFileExcel />
              </button>
            </li>
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#add-store"
            >
              <i className="ti ti-circle-plus me-1" />
              Add Store
            </a>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown">
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Status
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Active
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Inactive
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Store</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                      </label>
                    </td>
                    <td className="text-gray-9">Electro Mart</td>
                    <td>johnsmith</td>
                    <td>
                      <a
                        href="../../cdn-cgi/l/email-protection.html"
                        className="__cf_email__"
                        data-cfemail="f1949d949285839e9c908385b19489909c819d94df929e9c"
                      >
                        [email&nbsp;protected]
                      </a>
                    </td>
                    <td>+12498345785</td>
                    <td>
                      <span className="badge badge-success d-inline-flex align-items-center badge-xs">
                        <TbPointFilled className="ti ti-point-filled me-1" />
                        Active
                      </span>
                    </td>
                    {/* <td className="action-table-data">
                    <div className="edit-delete-action">
                      <a className="me-2 p-2" href="#">
                        <i data-feather="eye" className="feather-eye" />
                      </a>
                      <a className="me-2 p-2" href="javascript:void(0);" data-bs-toggle="modal" cc">
                        <i data-feather="edit" className="feather-edit" />
                      </a>
                      <a className="p-2" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete-modal">
                        <i data-feather="trash-2" className="feather-trash-2" />
                      </a>
                    </div>
                  </td> */}
                    <td className="action-table-data">
                      <div className="edit-delete-action">
                        <a className="me-2 p-2">
                          <TbEye />
                        </a>
                        <a
                          className="me-2 p-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit-store"
                        >
                          <TbEdit />
                        </a>

                        <a className="p-2">
                          <TbTrash />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      {/* <!-- Add Store --> */}
      <div className="modal fade" id="add-store">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Store</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form action="https://dreamspos.dreamstechnologies.com/html/template/store-list.html">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Store Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    User Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="input-blocks mb-3">
                  <label className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="pass-group">
                    <input
                      type="password"
                      className="form-control pass-input"
                    />
                    <span className="fas toggle-password fa-eye-slash" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input type="email" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Phone <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="mb-0">
                  <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                    <span className="status-label ">Status</span>
                    <input
                      type="checkbox"
                      id="user2"
                      className="check"
                      defaultChecked
                    />
                    <label htmlFor="user2" className="checktoggle" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn me-2 btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <!-- /Add Store --> */}
    </div>
  );
};

export default Stores;
