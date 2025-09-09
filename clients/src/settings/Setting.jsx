// import React from 'react'
// import '../styles/setting/setting.css'
// import { useSidebar } from '../Context/sidetoggle/SidebarContext';
// import { TbDeviceDesktop, TbDeviceMobile, TbLogout, TbSettings, TbSettings2, TbSettingsDollar, TbWorld } from 'react-icons/tb';
// import { Link } from 'react-router-dom';


// const Setting = () => {
//   const { openMenus, toggleMenu, mobileOpen, handleMobileToggle, handleLinkClick } = useSidebar();

//   return (
//     <div className="page-wrapper">
//       <div className="content settings-content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">Settings</h4>
//               <h6>Manage your settings on portal</h6>
//             </div>
//           </div>
//           <ul className="table-top-head">
//             <li>
//               <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh">
//                 <i className="ti ti-refresh" />
//               </a>
//             </li>
//             <li>
//               <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header">
//                 <i className="ti ti-chevron-up" />
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div className="row">
//           <div className="col-xl-12">
//             <div className="settings-wrapper d-flex">
//               <div className="settings-sidebar" id="sidebar2">
//                 <div className="sidebar-inner" style={{ overflow: "hidden", width: "100%", height: "635px" }}>
//                   <div id="sidebar-menu5" className="sidebar-menu">
//                     <h4 className="fw-bold fs-18 mb-2 pb-2">Settings</h4>
//                     <ul>
//                       {/* Settings Section */}
//                       <li className="submenu-open">
//                         <h6 className="submenu-hdr">Settings</h6>
//                         <ul>
//                           {/* General Settings */}
//                           <li
//                             className={`submenu ${openMenus.generalSettings ? "open" : ""
//                               }`}
//                           >
//                             <div
//                               className={`subdrop ${openMenus.generalSettings ? "active" : ""
//                                 }`}
//                               onClick={() => toggleMenu("generalSettings", true)}
//                             >
//                               <span className="menu-item">
//                                 <TbSettings className="icons" />
//                                 <span>General Settings</span>
//                               </span>
//                               <span
//                                 className={`menu-arrow ${openMenus.generalSettings ? "rotated" : ""
//                                   }`}
//                               />
//                             </div>
//                             {openMenus.generalSettings && (
//                               <ul>
//                                 <li>
//                                   <Link
//                                     to="/Purchase-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Purchase
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link
//                                     to="/warehouse-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Warehouse
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link
//                                     to="/general-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Profile
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link
//                                     to="/security-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Security
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link to="/notification" onClick={handleLinkClick}>
//                                     Notifications
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link to="/connected-apps" onClick={handleLinkClick}>
//                                     Connected Apps
//                                   </Link>
//                                 </li>
//                               </ul>
//                             )}
//                           </li>

//                           {/* Website Settings */}
//                           <li
//                             className={`submenu ${openMenus.websiteSettings ? "open" : ""
//                               }`}
//                           >
//                             <div
//                               className={`subdrop ${openMenus.websiteSettings ? "active" : ""
//                                 }`}
//                               onClick={() => toggleMenu("websiteSettings", true)}
//                             >
//                               <span className="menu-item">
//                                 <TbWorld className="icons" />
//                                 <span>Website Settings</span>
//                               </span>
//                               <span
//                                 className={`menu-arrow ${openMenus.websiteSettings ? "rotated" : ""
//                                   }`}
//                               />
//                             </div>
//                             {openMenus.websiteSettings && (
//                               <ul>
//                                 <li>
//                                   <Link to="/system-settings" onClick={handleLinkClick}>
//                                     System Settings
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link
//                                     to="/company-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Company Settings
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link
//                                     to="/localization-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Localization
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link to="/prefixes" onClick={handleLinkClick}>
//                                     Prefixes
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link to="/preference" onClick={handleLinkClick}>
//                                     Preference
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link to="/appearance" onClick={handleLinkClick}>
//                                     Appearance
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link
//                                     to="/social-authentication"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Social Authentication
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link
//                                     to="/language-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Language
//                                   </Link>
//                                 </li>
//                               </ul>
//                             )}
//                           </li>

//                           {/* App Settings */}
//                           <li
//                             className={`submenu ${openMenus.appSettings ? "open" : ""}`}
//                           >
//                             <div
//                               className={`subdrop ${openMenus.appSettings ? "active" : ""
//                                 }`}
//                               onClick={() => toggleMenu("appSettings", true)}
//                             >
//                               <span className="menu-item">
//                                 <TbDeviceMobile className="icons" />
//                                 <span>App Settings</span>
//                               </span>
//                               <span
//                                 className={`menu-arrow ${openMenus.appSettings ? "rotated" : ""
//                                   }`}
//                               />
//                             </div>
//                             {openMenus.appSettings && (
//                               <ul>
//                                 <li
//                                   className={`submenu ${openMenus.invoiceSettings ? "open" : ""
//                                     }`}
//                                 >
//                                   <div
//                                     className={`subdrop ${openMenus.invoiceSettings ? "active" : ""
//                                       }`}
//                                     onClick={() => toggleMenu("invoiceSettings")}
//                                   >
//                                     <span>Invoice</span>
//                                     <span
//                                       className={`menu-arrow ${openMenus.invoiceSettings ? "rotated" : ""
//                                         }`}
//                                     />
//                                   </div>
//                                   {openMenus.invoiceSettings && (
//                                     <ul>
//                                       <li>
//                                         <Link
//                                           to="/invoice-settings"
//                                           onClick={handleLinkClick}
//                                         >
//                                           Invoice Settings
//                                         </Link>
//                                       </li>
//                                       <li>
//                                         <Link
//                                           to="/invoice-template"
//                                           onClick={handleLinkClick}
//                                         >
//                                           Invoice Template
//                                         </Link>
//                                       </li>
//                                     </ul>
//                                   )}
//                                 </li>

//                                 <li>
//                                   <Link
//                                     to="/printer-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Printer
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link to="/pos-settings" onClick={handleLinkClick}>
//                                     POS
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link to="/custom-fields" onClick={handleLinkClick}>
//                                     Custom Fields
//                                   </Link>
//                                 </li>
//                               </ul>
//                             )}
//                           </li>

//                           {/* System Settings */}
//                           <li
//                             className={`submenu ${openMenus.systemSettings ? "open" : ""
//                               }`}
//                           >
//                             <div
//                               className={`subdrop ${openMenus.systemSettings ? "active" : ""
//                                 }`}
//                               onClick={() => toggleMenu("systemSettings", true)}
//                             >
//                               <span className="menu-item">
//                                 <TbDeviceDesktop className="icons" />
//                                 <span>System Settings</span>
//                               </span>
//                               <span
//                                 className={`menu-arrow ${openMenus.systemSettings ? "rotated" : ""
//                                   }`}
//                               />
//                             </div>
//                             {openMenus.systemSettings && (
//                               <ul>
//                                 {/* Email */}
//                                 <li
//                                   className={`submenu ${openMenus.emailSettings ? "open" : ""
//                                     }`}
//                                 >
//                                   <div
//                                     // className={`subdrop ${openMenus.emailSettings ? 'active' : ''}`}
//                                     onClick={() => toggleMenu("emailSettings")}
//                                   >
//                                     <span>Email</span>
//                                     <span
//                                       className={`menu-arrow ${openMenus.emailSettings ? "rotated" : ""
//                                         }`}
//                                     />
//                                   </div>
//                                   {openMenus.emailSettings && (
//                                     <ul>
//                                       <li>
//                                         <Link
//                                           to="/email-settings"
//                                           onClick={handleLinkClick}
//                                         >
//                                           Email Settings
//                                         </Link>
//                                       </li>
//                                       <li>
//                                         <Link
//                                           to="/email-template"
//                                           onClick={handleLinkClick}
//                                         >
//                                           Email Template
//                                         </Link>
//                                       </li>
//                                     </ul>
//                                   )}
//                                 </li>

//                                 {/* SMS */}
//                                 <li
//                                   className={`submenu ${openMenus.smsSettings ? "open" : ""
//                                     }`}
//                                 >
//                                   <div
//                                     // className={`subdrop ${openMenus.smsSettings ? 'active' : ''}`}
//                                     onClick={() => toggleMenu("smsSettings")}
//                                   >
//                                     <span>SMS</span>
//                                     <span
//                                       className={`menu-arrow ${openMenus.smsSettings ? "rotated" : ""
//                                         }`}
//                                     />
//                                   </div>
//                                   {openMenus.smsSettings && (
//                                     <ul>
//                                       <li>
//                                         <Link
//                                           to="/sms-settings"
//                                           onClick={handleLinkClick}
//                                         >
//                                           SMS Settings
//                                         </Link>
//                                       </li>
//                                       <li>
//                                         <Link
//                                           to="/sms-template"
//                                           onClick={handleLinkClick}
//                                         >
//                                           SMS Template
//                                         </Link>
//                                       </li>
//                                     </ul>
//                                   )}
//                                 </li>

//                                 <li>
//                                   <Link to="/otp-settings" onClick={handleLinkClick}>
//                                     OTP
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link to="/gdpr-settings" onClick={handleLinkClick}>
//                                     GDPR Cookies
//                                   </Link>
//                                 </li>
//                               </ul>
//                             )}
//                           </li>

//                           {/* Financial Settings */}
//                           <li
//                             className={`submenu ${openMenus.financialSettings ? "open" : ""
//                               }`}
//                           >
//                             <div
//                               className={`subdrop ${openMenus.financialSettings ? "active" : ""
//                                 }`}
//                               onClick={() => toggleMenu("financialSettings", true)}
//                             >
//                               <span className="menu-item">
//                                 <TbSettingsDollar className="icons" />
//                                 <span>Financial Settings</span>
//                               </span>
//                               <span
//                                 className={`menu-arrow ${openMenus.financialSettings ? "rotated" : ""
//                                   }`}
//                               />
//                             </div>
//                             {openMenus.financialSettings && (
//                               <ul>
//                                 <li>
//                                   <Link
//                                     to="/payment-gateway-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Payment Gateway
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link
//                                     to="/bank-settings-grid"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Bank Accounts
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link to="/tax-rates" onClick={handleLinkClick}>
//                                     Tax Rates
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link
//                                     to="/currency-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Currencies
//                                   </Link>
//                                 </li>
//                               </ul>
//                             )}
//                           </li>

//                           {/* Other Settings */}
//                           <li
//                             className={`submenu ${openMenus.otherSettings ? "open" : ""
//                               }`}
//                           >
//                             <div
//                               className={`subdrop ${openMenus.otherSettings ? "active" : ""
//                                 }`}
//                               onClick={() => toggleMenu("otherSettings", true)}
//                             >
//                               <span className="menu-item">
//                                 <TbSettings2 className="icons" />
//                                 <span>Other Settings</span>
//                               </span>
//                               <span
//                                 className={`menu-arrow ${openMenus.otherSettings ? "rotated" : ""
//                                   }`}
//                               />
//                             </div>
//                             {openMenus.otherSettings && (
//                               <ul>
//                                 <li>
//                                   <Link
//                                     to="/storage-settings"
//                                     onClick={handleLinkClick}
//                                   >
//                                     Storage
//                                   </Link>
//                                 </li>
//                                 <li>
//                                   <Link to="/ban-ip-address" onClick={handleLinkClick}>
//                                     Ban IP Address
//                                   </Link>
//                                 </li>
//                               </ul>
//                             )}
//                           </li>

//                           {/* Logout */}

//                           <li>
//                             <Link to="/logout" onClick={handleLinkClick}>
//                               <span className="menu-item">
//                                 <TbLogout className="icons" />
//                                 <span>Logout</span>
//                               </span>
//                             </Link>
//                           </li>
//                         </ul>
//                       </li>
//                       {/* <li className="submenu-open">
//                         <ul>
//                           <li className="submenu">
//                             <a href="javascript:void(0);" className="active subdrop">
//                               <i className="ti ti-settings fs-18" />
//                               <span className="fs-14 fw-medium ms-2">General Settings</span>
//                               <span className="menu-arrow" />
//                             </a>
//                             <ul>
//                               <li><a href="general-settings.html" className="active">Profile</a></li>
//                               <li><a href="security-settings.html">Security</a></li>
//                               <li><a href="notification.html">Notifications</a></li>
//                               <li><a href="connected-apps.html">Connected Apps</a></li>
//                             </ul>
//                           </li>
//                           <li className="submenu">
//                             <a href="javascript:void(0);">
//                               <i className="ti ti-world fs-18" />
//                               <span className="fs-14 fw-medium ms-2">Website Settings</span>
//                               <span className="menu-arrow" />
//                             </a>
//                             <ul>
//                               <li><a href="system-settings.html">System Settings</a></li>
//                               <li><a href="company-settings.html">Company Settings </a></li>
//                               <li><a href="localization-settings.html">Localization</a></li>
//                               <li><a href="prefixes.html">Prefixes</a></li>
//                               <li><a href="preference.html">Preference</a></li>
//                               <li><a href="appearance.html">Appearance</a></li>
//                               <li><a href="social-authentication.html">Social Authentication</a></li>
//                               <li><a href="language-settings.html">Language</a></li>
//                             </ul>
//                           </li>
//                           <li className="submenu">
//                             <a href="javascript:void(0);">
//                               <i className="ti ti-device-mobile fs-18" />
//                               <span className="fs-14 fw-medium ms-2">App Settings</span>
//                               <span className="menu-arrow" />
//                             </a>
//                             <ul>
//                               <li><a href="invoice-settings.html">Invoice Settings</a></li>
//                               <li><a href="invoice-templates.html">Invoice Templates</a></li>
//                               <li><a href="printer-settings.html">Printer </a></li>
//                               <li><a href="pos-settings.html">POS</a></li>
//                               <li><a href="signatures.html">Signatures</a></li>
//                               <li><a href="custom-fields.html">Custom Fields</a></li>
//                             </ul>
//                           </li>
//                           <li className="submenu">
//                             <a href="javascript:void(0);">
//                               <i className="ti ti-device-desktop fs-18" />
//                               <span className="fs-14 fw-medium ms-2">System Settings</span>
//                               <span className="menu-arrow" />
//                             </a>
//                             <ul>
//                               <li className="submenu submenu-two"><a href="javascript:void(0);">Email<span className="menu-arrow inside-submenu" /></a>
//                                 <ul>
//                                   <li><a href="email-settings.html">Email Settings</a></li>
//                                   <li><a href="email-templates.html">Email Templates</a></li>
//                                 </ul>
//                               </li>
//                               <li className="submenu submenu-two"><a href="javascript:void(0);">SMS<span className="menu-arrow inside-submenu" /></a>
//                                 <ul>
//                                   <li><a href="sms-settings.html">SMS Settings</a></li>
//                                   <li><a href="sms-templates.html">SMS Templates</a></li>
//                                 </ul>
//                               </li>
//                               <li><a href="otp-settings.html">OTP</a></li>
//                               <li><a href="gdpr-settings.html">GDPR Cookies</a></li>
//                             </ul>
//                           </li>
//                           <li className="submenu">
//                             <a href="javascript:void(0);">
//                               <i className="ti ti-settings-dollar fs-18" />
//                               <span className="fs-14 fw-medium ms-2">Financial Settings</span>
//                               <span className="menu-arrow" />
//                             </a>
//                             <ul>
//                               <li><a href="payment-gateway-settings.html">Payment Gateway</a></li>
//                               <li><a href="bank-settings-grid.html">Bank Accounts </a></li>
//                               <li><a href="tax-rates.html">Tax Rates</a></li>
//                               <li><a href="currency-settings.html">Currencies</a></li>
//                             </ul>
//                           </li>
//                           <li className="submenu">
//                             <a href="javascript:void(0);">
//                               <i className="ti ti-settings-2 fs-18" />
//                               <span className="fs-14 fw-medium ms-2">Other Settings</span>
//                               <span className="menu-arrow" />
//                             </a>
//                             <ul>
//                               <li><a href="storage-settings.html">Storage</a></li>
//                               <li><a href="ban-ip-address.html">Ban IP Address </a></li>
//                             </ul>
//                           </li>
//                         </ul>
//                       </li> */}
//                     </ul>
//                   </div>
//                 </div>
//               </div>



//               <div className="card flex-fill mb-0">
//                 <div className="card-header">
//                   <h4 className="fs-18 fw-bold">Profile</h4>
//                 </div>
//                 <div className="card-body">
//                   <form action="https://dreamspos.dreamstechnologies.com/html/template/general-settings.html">
//                     <div className="card-title-head">
//                       <h6 className="fs-16 fw-bold mb-3">
//                         <span className="fs-16 me-2"><i className="ti ti-user" /></span>
//                         Basic Information
//                       </h6>
//                     </div>
//                     <div className="profile-pic-upload">
//                       <div className="profile-pic">
//                         <span>
//                           <i className="ti ti-circle-plus mb-1 fs-16" /> Add Image
//                         </span>
//                       </div>
//                       <div className="new-employee-field">
//                         <div className="mb-0">
//                           <div className="image-upload mb-0">
//                             <input type="file" />
//                             <div className="image-uploads">
//                               <h4>Upload Image</h4>
//                             </div>
//                           </div>
//                           <span className="fs-13 fw-medium mt-2">
//                             Upload an image below 2 MB, Accepted File format JPG, PNG
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row mb-3">
//                       <div className="col-md-4">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             First Name <span className="text-danger">*</span>
//                           </label>
//                           <input type="text" className="form-control" />
//                         </div>
//                       </div>
//                       <div className="col-md-4">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Last Name <span className="text-danger">*</span>
//                           </label>
//                           <input type="text" className="form-control" />
//                         </div>
//                       </div>
//                       <div className="col-md-4">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             User Name <span className="text-danger">*</span>
//                           </label>
//                           <input type="text" className="form-control" />
//                         </div>
//                       </div>
//                       <div className="col-md-4">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Phone Number <span className="text-danger">*</span>
//                           </label>
//                           <input type="text" className="form-control" />
//                         </div>
//                       </div>
//                       <div className="col-md-4">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Email <span className="text-danger">*</span>
//                           </label>
//                           <input type="email" className="form-control" />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="card-title-head">
//                       <h6 className="fs-16 fw-bold mb-3">
//                         <span className="fs-16 me-2"><i className="ti ti-map-pin" /></span>
//                         Address Information
//                       </h6>
//                     </div>
//                     <div className="row">
//                       <div className="col-md-12">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Address <span className="text-danger">*</span>
//                           </label>
//                           <input type="email" className="form-control" />
//                         </div>
//                       </div>
//                       <div className="col-md-6">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Country <span className="text-danger">*</span>
//                           </label>
//                           <select className="select">
//                             <option>Select</option>
//                             <option>USA</option>
//                             <option>India</option>
//                             <option>French</option>
//                             <option>Australia</option>
//                           </select>
//                         </div>
//                       </div>
//                       <div className="col-md-6">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             State <span className="text-danger">*</span>
//                           </label>
//                           <select className="select">
//                             <option>Select</option>
//                             <option>Alaska</option>
//                             <option>Mexico</option>
//                             <option>Tasmania</option>
//                           </select>
//                         </div>
//                       </div>
//                       <div className="col-md-6">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             City <span className="text-danger">*</span>
//                           </label>
//                           <select className="select">
//                             <option>Select</option>
//                             <option>Anchorage</option>
//                             <option>Tijuana</option>
//                             <option>Hobart</option>
//                           </select>
//                         </div>
//                       </div>
//                       <div className="col-md-6">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Postal Code <span className="text-danger">*</span>
//                           </label>
//                           <input type="text" className="form-control" />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-end settings-bottom-btn mt-0">
//                       <button type="button" className="btn btn-secondary me-2">Cancel</button>
//                       <button type="submit" className="btn btn-primary">Save Changes</button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/*  */}
//     </div>

//   )
// }

// export default Setting


import React from 'react'
// import '../styles/setting/setting.css'
import { useSidebar } from '../Context/sidetoggle/SidebarContext';
import { TbDeviceDesktop, TbDeviceMobile, TbLogout, TbSettings, TbSettings2, TbSettingsDollar, TbWorld } from 'react-icons/tb';
import { Link,Outlet } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';

const Setting = () => {
  const { openMenus, toggleMenu, mobileOpen, handleMobileToggle, handleLinkClick } = useSidebar();
    const { user } = useAuth();
  const id = user?._id;
  return (
    <div className="page-wrapper">
  <div className="content settings-content">
    <div className="page-header">
      <div className="add-item d-flex">
        <div className="page-title">
          <h4 className="fw-bold">Settings</h4>
          <h6>Manage your settings on portal</h6>
        </div>
      </div>
      <ul className="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh">
            <i className="ti ti-refresh" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header">
            <i className="ti ti-chevron-up" />
          </a>
        </li>
      </ul>
    </div>
    <div className="row">
      <div className="col-xl-12 col-lg-4 col-md-12">
        <div className="settings-wrapper d-flex">
          <div className="settings-sidebar" id="sidebar2">
            <div className="sidebar-inner slimscroll">
              <div id="sidebar-menu5" className="sidebar-menu">
                <h4 className="fw-bold fs-18 mb-2 pb-2">Settings</h4>
                <ul>
                  <li className="submenu-open">
                    <ul>
                      {/* <li className="submenu"> */}
                       <li className={`submenu ${openMenus.generalSettings ? "open" : ""  }`}>
                        <a className={`subdrop ${openMenus.generalSettings ? "active" : ""}`}onClick={() => toggleMenu("generalSettings", true)}>     
                          <TbSettings className="fs-18"/>
                          <span className="fs-14 fw-medium ms-2">General Settings</span>
                           <span className={`menu-arrow ${openMenus.generalSettings ? "rotated" : "" }`} />
                        </a>
                         {openMenus.generalSettings && (
                              <ul>
                                {/* <li>
                                  <Link
                                    to="/Purchase-settings"
                                    onClick={handleLinkClick}
                                  >
                                    Purchase
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/warehouse-settings"
                                    onClick={handleLinkClick}
                                  >
                                    Warehouse
                                  </Link>
                                </li> */}
                                <li>
                                  <Link
                                    to={`profile/${id}`}
                                    onClick={handleLinkClick}
                                  >
                                    Profile
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/security-settings"
                                    onClick={handleLinkClick}
                                  >
                                    Security
                                  </Link>
                                </li>
                                {/* <li>
                                  <Link to="/notification" onClick={handleLinkClick}>
                                    Notifications
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/connected-apps" onClick={handleLinkClick}>
                                    Connected Apps
                                  </Link>
                                </li> */}
                              </ul>
                            )}
                          </li>
                          
                      <li className={`submenu ${openMenus.websiteSettings ? "open" : "" }`}>
                        <a className={`subdrop ${openMenus.websiteSettings ? "active" : ""
                                }`}
                              onClick={() => toggleMenu("websiteSettings", true)}>
                          <TbWorld className=" fs-18" />
                          <span className="fs-14 fw-medium ms-2">Website Settings</span>
                          <span className={`menu-arrow ${openMenus.websiteSettings ? "rotated" : "" }`} />
                        </a>
                         {openMenus.websiteSettings && (
                              <ul>
                                {/* <li>
                                  <Link to="/system-settings" onClick={handleLinkClick}>
                                    System Settings
                                  </Link>
                                </li> */}
                                <li>
                                  <Link
                                    to="/company-settings"
                                    onClick={handleLinkClick}
                                  >
                                    Company Settings
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/localization-settings"
                                    onClick={handleLinkClick}
                                  >
                                    Localization
                                  </Link>
                                </li>
                                {/* <li>
                                  <Link to="/prefixes" onClick={handleLinkClick}>
                                    Prefixes
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/preference" onClick={handleLinkClick}>
                                    Preference
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/appearance" onClick={handleLinkClick}>
                                    Appearance
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/social-authentication"
                                    onClick={handleLinkClick}
                                  >
                                    Social Authentication
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/language-settings"
                                    onClick={handleLinkClick}
                                  >
                                    Language
                                  </Link>
                                </li> */}
                              </ul>
                            
                            )}
                     
                      </li>

                      {/* <li className={`submenu ${openMenus.appSettings ? "open" : ""  }`}>
                        <a className={`subdrop ${openMenus.appSettings ? "active" : "" }`}  onClick={() => toggleMenu("appSettings", true)}>
                          <TbDeviceMobile className=" fs-18" />
                          <span className="fs-14 fw-medium ms-2">App Settings</span>
                          <span className={`menu-arrow ${openMenus.appSettings ? "rotated" : ""}`} />
                        </a>
                         {openMenus.appSettings && (
                           <ul>
                          <li><Link to="/invoice-settings" onClick={handleLinkClick}>Invoice Settings</Link></li>            
                          <li><Link to="/invoice-template" >Invoice Templates</Link></li>
                          <li><Link to="printer-settings">Printer </Link></li>
                          <li><Link to="pos-settings">POS</Link></li>
                          <li><Link to="signatures">Signatures</Link></li>
                          <li><Link to="custom-fields">Custom Fields</Link></li>
                        </ul>
                             
                            )}
                      </li>

                      <li className={`submenu ${openMenus.systemSettings ? "open" : ""  }`}>
                        <a className={`subdrop ${openMenus.systemSettings ? "active" : ""  }`}
                              onClick={() => toggleMenu("systemSettings", true)}>
                              
                          <TbDeviceDesktop className=" fs-18" />
                          <span className="fs-14 fw-medium ms-2">System Settings</span>
                          <span className={`menu-arrow ${openMenus.systemSettings ? "rotated" : ""}`} />
                        </a>
                        {openMenus.systemSettings && (
                        <ul>
                          <li className="submenu submenu-two"><a href="javascript:void(0);">Email<span className="menu-arrow inside-submenu" /></a>
                            <ul>
                              <li><a href="email-settings.html">Email Settings</a></li>
                              <li><a href="email-templates.html">Email Templates</a></li>
                            </ul>
                          </li>
                          <li className="submenu submenu-two"><a href="javascript:void(0);">SMS<span className="menu-arrow inside-submenu" /></a>
                            <ul>
                              <li><a href="sms-settings.html">SMS Settings</a></li>
                              <li><a href="sms-templates.html">SMS Templates</a></li>
                            </ul>
                          </li>
                          <li><a href="otp-settings.html">OTP</a></li>
                          <li><a href="gdpr-settings.html">GDPR Cookies</a></li>
                        </ul>
                        )}
                      </li>

                      <li className={`submenu ${openMenus.financialSettings ? "open" : ""  }`}>
                        <a className={`subdrop ${openMenus.financialSettings ? "active" : "" }`}onClick={() => toggleMenu("financialSettings", true)}>  
                          <TbSettingsDollar className=" fs-18" />
                          <span className="fs-14 fw-medium ms-2">Financial Settings</span>
                          <span className={`menu-arrow ${openMenus.financialSettings ? "rotated" : ""}`} />
                        </a>
                        {openMenus.financialSettings && (
                           <ul>
                          <li><a href="payment-gateway-settings.html">Payment Gateway</a></li>
                          <li><a href="bank-settings-grid.html">Bank Accounts </a></li>
                          <li><a href="tax-rates.html">Tax Rates</a></li>
                          <li><a href="currency-settings.html">Currencies</a></li>
                        </ul>)}
                       
                      </li>
                      <li className={`submenu ${openMenus.otherSettings ? "open" : ""  }`}>
                        <a className={`subdrop ${openMenus.otherSettings ? "active" : "" }`}onClick={() => toggleMenu("otherSettings", true)}>
   
                          <TbSettings2 className="fs-18" />
                          <span className="fs-14 fw-medium ms-2">Other Settings</span>
                          <span className={`menu-arrow ${openMenus.otherSettings ? "rotated" : ""}`} />
                        </a>
                        {openMenus.otherSettings && (<ul>
                          <li><a href="storage-settings.html">Storage</a></li>
                          <li><a href="ban-ip-address.html">Ban IP Address </a></li>
                        </ul>)}
                        
                      </li> */}
                    </ul>								
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* <div className="card flex-fill mb-0">
            <div className="card-header">
              <h4 className="fs-18 fw-bold">Profile</h4>
            </div>
            <div className="card-body">
              <form action="https://dreamspos.dreamstechnologies.com/html/template/general-settings.html">
                <div className="card-title-head">
                  <h6 className="fs-16 fw-bold mb-3">
                    <span className="fs-16 me-2"><i className="ti ti-user" /></span> 
                    Basic Information
                  </h6>
                </div>
                <div className="profile-pic-upload">
                  <div className="profile-pic">
                    <span>
                      <i className="ti ti-circle-plus mb-1 fs-16" /> Add Image
                    </span>
                  </div>
                  <div className="new-employee-field">
                    <div className="mb-0">
                      <div className="image-upload mb-0">
                        <input type="file" />
                        <div className="image-uploads">
                          <h4>Upload Image</h4>
                        </div>
                      </div>
                      <span className="fs-13 fw-medium mt-2">
                        Upload an image below 2 MB, Accepted File format JPG, PNG
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">
                        User Name <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input type="email" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="card-title-head">
                  <h6 className="fs-16 fw-bold mb-3">
                    <span className="fs-16 me-2"><i className="ti ti-map-pin" /></span> 
                    Address Information
                  </h6>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Address <span className="text-danger">*</span>
                      </label>
                      <input type="email" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Country <span className="text-danger">*</span>
                      </label>
                      <select className="select">
                        <option>Select</option>
                        <option>USA</option>
                        <option>India</option>
                        <option>French</option>
                        <option>Australia</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        State <span className="text-danger">*</span>
                      </label>
                      <select className="select">
                        <option>Select</option>
                        <option>Alaska</option>
                        <option>Mexico</option>
                        <option>Tasmania</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        City <span className="text-danger">*</span>
                      </label>
                      <select className="select">
                        <option>Select</option>
                        <option>Anchorage</option>
                        <option>Tijuana</option>
                        <option>Hobart</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Postal Code <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="text-end settings-bottom-btn mt-0">
                  <button type="button" className="btn btn-secondary me-2">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div> */}
          <div className=""><Outlet/></div>
        </div>
      </div>

      {/* <div className="col-xl-8 col-lg-8 col-md-12">Outlet</div> */}
    </div>
  </div>

</div>

  )
}

export default Setting




// import React from 'react'
// import { ToastContainer, toast } from 'react-toastify';

// const Setting = () => {
//   const notify = () => toast("Wow so easy!");

//   return (
//     <div>
//     <button onClick={notify}>Notify!</button>
//     <ToastContainer />
//   </div>
//   )
// }

// export default Setting

