import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import "../../../styles/auth.css";
import { TbBell, TbCirclePlus, TbCommand, TbDeviceLaptop, TbDotsVertical, TbLanguage, TbMail, TbMaximize, TbSearch, TbSettings } from 'react-icons/tb';
import UsFlag from "../../../assets/img/flags/us-flag.svg"
import English from "../../../assets/img/flags/english.svg"
import Arabic from "../../../assets/img/flags/arabic.svg"

function Navbar() {
  const mobileBtnRef = useRef(null);
  const fullscreenBtnRef = useRef(null);
  const toggleBtnRef = useRef(null);

  useEffect(() => {
    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    };

    const handleMobileToggle = () => {
      document.body.classList.toggle('slide-nav');
      document.querySelector('.sidebar-overlay')?.classList.toggle('opened');
      document.documentElement.classList.add('menu-opened');
      document.getElementById('task_window')?.classList.remove('opened');
    };

    const handleHoverExpand = (e) => {
      const isMini = document.body.classList.contains('mini-sidebar');
      const toggleVisible = toggleBtnRef.current?.offsetParent !== null;
      if (isMini && toggleVisible) {
        const inside = e.target.closest('.sidebar, .header-left');
        if (inside) {
          document.body.classList.add('expand-menu');
          document.querySelectorAll('.subdrop + ul').forEach(ul => ul.style.display = 'block');
        } else {
          document.body.classList.remove('expand-menu');
          document.querySelectorAll('.subdrop + ul').forEach(ul => ul.style.display = 'none');
        }
      }
    };

    fullscreenBtnRef.current?.addEventListener('click', handleFullscreen);
    mobileBtnRef.current?.addEventListener('click', handleMobileToggle);
    document.addEventListener('mouseover', handleHoverExpand);

    return () => {
      fullscreenBtnRef.current?.removeEventListener('click', handleFullscreen);
      mobileBtnRef.current?.removeEventListener('click', handleMobileToggle);
      document.removeEventListener('mouseover', handleHoverExpand);
    };
  }, []);

  return (
    <div className="header">
      <div className="main-header">
        {/* Logo */}
        <div className="header-left active">
          <Link to="/" className="logo logo-normal">
            <img src="/assets/img/logo.svg" alt="Logo" />
          </Link>
          <Link to="/" className="logo logo-white">
            <img src="/assets/img/logo-white.svg" alt="Logo" />
          </Link>
          <Link to="/" className="logo-small">
            <img src="/assets/img/logo-small.png" alt="Logo" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <a id="mobile_btn" className="mobile_btn" href="#sidebar" ref={mobileBtnRef}>
          <span className="bar-icon"><span /><span /><span /></span>
        </a>

        {/* Dummy Toggle Button for Sidebar Hover Expand */}
        <button id="toggle_btn" ref={toggleBtnRef} style={{ display: 'none' }}></button>

        {/* Header Right Menu */}
        
        <ul className="nav user-menu">
          {/* Search */}
          <li className="nav-item nav-searchinputs">
            <div className="top-nav-search">
              <button className="responsive-search"><TbSearch /></button>
              <form className="dropdown">
                <div className="searchinputs input-group dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                  <input type="text" placeholder="Search" />
                  {/* <div className="search-addon"><span><TbSearch  /></span></div>
                  <span className="input-group-text">
                    <kbd className="d-flex align-items-center">
                      <TbCommand alt="cmd" className="me-1" />K
                    </kbd>
                  </span> */}
                </div>
                <div className="dropdown-menu search-dropdown"></div>
              </form>
            </div>
          </li>

          {/* Store Dropdown */}
          <li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
            <a className="dropdown-toggle nav-link select-store" data-bs-toggle="dropdown" href="#">
              <span className="user-info">
                <span className="user-letter">
                  <img src="/assets/img/store/store-01.png" alt="Store" className="img-fluid" />
                </span>
                <span className="user-detail">
                  <span className="user-name">Freshmart</span>
                </span>
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <Link className="dropdown-item" to="#"><img src="/assets/img/store/store-01.png" alt="Store" /> Freshmart</Link>
              <Link className="dropdown-item" to="#"><img src="/assets/img/store/store-02.png" alt="Store" /> Grocery Apex</Link>
            </div>
          </li>

          {/* Add New Dropdown */}
          <li className="nav-item dropdown link-nav">
            <button className="btn btn-primary btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
              {/* <i className="ti ti-circle-plus me-1" /> */}
              < TbCirclePlus className="me-1" />
               Add New
            </button>
            <div className="dropdown-menu dropdown-xl dropdown-menu-center">
              <div className="row g-2">
                <div className="col-md-2">
                  <Link to="/category-list" className="link-item">
                    <span className="link-icon"><i className="ti ti-brand-codepen" /></span>
                    <p>Category</p>
                  </Link>
                </div>
                <div className="col-md-2">
                  <Link to="/add-product" className="link-item">
                    <span className="link-icon"><i className="ti ti-square-plus" /></span>
                    <p>Product</p>
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* POS Button */}
          <li className="nav-item pos-nav">
            <Link to="/pos" className="btn btn-dark btn-md d-inline-flex align-items-center">
              {/* <i className="ti ti-device-laptop me-1" /> */}
              <TbDeviceLaptop className=" me-1" />
               POS
            </Link>
          </li>

          {/* Language Switcher */}
          <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              <img src={UsFlag} alt="Language" />
              {/* <TbLanguage /> */}
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <button className="dropdown-item"><img src={English} alt="English" /> English</button>
              <button className="dropdown-item"><img src={Arabic} alt="Arabic" /> Arabic</button>
            </div>
          </li>

          {/* Fullscreen */}
          <li className="nav-item nav-item-box">
            <a id="btnFullscreen" ref={fullscreenBtnRef}>
              <TbMaximize />
            </a>
          </li>

          {/* Email */}
          <li className="nav-item nav-item-box">
            <Link to="/email">
              <TbMail />
              <span className="badge rounded-pill">1</span>
            </Link>
          </li>

          {/* Notifications */}
          {/* <li className="nav-item dropdown nav-item-box">
            <a className="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#">
              <TbBell className='ti' />
            </a>
            <div className="dropdown-menu notifications"></div>
          </li> */}

<li className="nav-item dropdown nav-item-box">
  <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown" onClick={(e) => e.preventDefault()}>
    <TbBell/>
  </a>
  <div className="dropdown-menu notifications">
    <div className="topnav-dropdown-header">
      <h5 className="notification-title">Notifications</h5>
      <a href="#" className="clear-noti" onClick={(e) => e.preventDefault()}>Mark all as read</a>
    </div>
    <div className="noti-content">
      <ul className="notification-list">
        <li className="notification-message">
          <Link to="/activities">
            <div className="media d-flex">
              <span className="avatar flex-shrink-0">
                <img alt="Img" src="assets/img/profiles/avatar-13.jpg" />
              </span>
              <div className="flex-grow-1">
                <p className="noti-details">
                  <span className="noti-title">James Kirwin</span> confirmed his order. Order No: #78901. Estimated delivery: 2 days
                </p>
                <p className="noti-time">4 mins ago</p>
              </div>
            </div>
          </Link>
        </li>
        <li className="notification-message">
          <Link to="/activities">
            <div className="media d-flex">
              <span className="avatar flex-shrink-0">
                <img alt="Img" src="assets/img/profiles/avatar-03.jpg" />
              </span>
              <div className="flex-grow-1">
                <p className="noti-details">
                  <span className="noti-title">Leo Kelly</span> cancelled his order scheduled for 17 Jan 2025
                </p>
                <p className="noti-time">10 mins ago</p>
              </div>
            </div>
          </Link>
        </li>
        <li className="notification-message">
          <Link to="/activities" className="recent-msg">
            <div className="media d-flex">
              <span className="avatar flex-shrink-0">
                <img alt="Img" src="assets/img/profiles/avatar-17.jpg" />
              </span>
              <div className="flex-grow-1">
                <p className="noti-details">
                  Payment of $50 received for Order #67890 from <span className="noti-title">Antonio Engle</span>
                </p>
                <p className="noti-time">05 mins ago</p>
              </div>
            </div>
          </Link>
        </li>
        <li className="notification-message">
          <Link to="/activities" className="recent-msg">
            <div className="media d-flex">
              <span className="avatar flex-shrink-0">
                <img alt="Img" src="assets/img/profiles/avatar-02.jpg" />
              </span>
              <div className="flex-grow-1">
                <p className="noti-details">
                  <span className="noti-title">Andrea</span> confirmed his order. Order No: #73401. Estimated delivery: 3 days
                </p>
                <p className="noti-time">4 mins ago</p>
              </div>
            </div>
          </Link>
        </li>
      </ul>
    </div>
    <div className="topnav-dropdown-footer d-flex align-items-center gap-3">
      <button className="btn btn-secondary btn-md w-100" type="button">Cancel</button>
      <Link to="/activities" className="btn btn-primary btn-md w-100">View all</Link>
    </div>
  </div>
</li>


          {/* Settings */}
          <li className="nav-item nav-item-box">
            <Link to="/general-settings"><TbSettings  className="ti" /></Link>
          </li>

          {/* Profile */}
          <li className="nav-item dropdown has-arrow main-drop profile-nav">
            <a className="nav-link userset" data-bs-toggle="dropdown" href="#">
              <span className="user-info p-0">
                <span className="user-letter">
                  <img src="/assets/img/profiles/avator1.jpg" alt="User" />
                </span>
              </span>
            </a>
            <div className="dropdown-menu menu-drop-user">
              <div className="profileset d-flex align-items-center">
                <span className="user-img me-2"><img src="/assets/img/profiles/avator1.jpg" alt="User" /></span>
                <div>
                  <h6 className="fw-medium">John Smilga</h6>
                  <p>Admin</p>
                </div>
              </div>
              <Link className="dropdown-item" to="/profile"><i className="ti ti-user-circle me-2" /> My Profile</Link>
              <Link className="dropdown-item" to="/sales-report"><i className="ti ti-file-text me-2" /> Reports</Link>
              <Link className="dropdown-item" to="/general-settings"><i className="ti ti-settings-2 me-2" /> Settings</Link>
              <hr className="my-2" />
              <Link className="dropdown-item logout pb-0" to="/signin"><i className="ti ti-logout me-2" /> Logout</Link>
            </div>
          </li>
        </ul>

        {/* Mobile Menu (3 dots) */}
        <div className="dropdown mobile-user-menu">
          <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">
            <TbDotsVertical />
          </a>
          <div className="dropdown-menu dropdown-menu-end">
            <Link className="dropdown-item" to="/profile">My Profile</Link>
            <Link className="dropdown-item" to="/general-settings">Settings</Link>
            <Link className="dropdown-item" to="/signin">Logout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;


// import React from 'react'

// import "../../../styles/auth.css"
// // import "../../../styles/style.css"

// function Navbar() {
//   return (
// <div className="header">
//   <div className="main-header">
//     {/* Logo */}
//     <div className="header-left active">
//       <a href="index.html" className="logo logo-normal">
//         <img src="assets/img/logo.svg" alt="Img" />
//       </a>
//       <a href="index.html" className="logo logo-white">
//         <img src="assets/img/logo-white.svg" alt="Img" />
//       </a>
//       <a href="index.html" className="logo-small">
//         <img src="assets/img/logo-small.png" alt="Img" />
//       </a>
//     </div>
//     {/* /Logo */}
//     <a id="mobile_btn" className="mobile_btn" href="#sidebar">
//       <span className="bar-icon">
//         <span />
//         <span />
//         <span />
//       </span>
//     </a>
//     {/* Header Menu */}
//     <ul className="nav user-menu">
//       {/* Search */}
//       <li className="nav-item nav-searchinputs">
//         <div className="top-nav-search">
//           <a href="javascript:void(0);" className="responsive-search">
//             <i className="fa fa-search" />
//           </a>
//           <form action="#" className="dropdown">
//             <div className="searchinputs input-group dropdown-toggle" id="dropdownMenuClickable" data-bs-toggle="dropdown" data-bs-auto-close="outside">
//               <input type="text" placeholder="Search" />
//               <div className="search-addon">
//                 <span><i className="ti ti-search" /></span>
//               </div>
//               <span className="input-group-text">
//                 <kbd className="d-flex align-items-center"><img src="assets/img/icons/command.svg" alt="img" className="me-1" />K</kbd>
//               </span>
//             </div>
//             <div className="dropdown-menu search-dropdown" aria-labelledby="dropdownMenuClickable">
//               <div className="search-info">
//                 <h6><span><i data-feather="search" className="feather-16" /></span>Recent Searches
//                 </h6>
//                 <ul className="search-tags">
//                   <li><a href="javascript:void(0);">Products</a></li>
//                   <li><a href="javascript:void(0);">Sales</a></li>
//                   <li><a href="javascript:void(0);">Applications</a></li>
//                 </ul>
//               </div>
//               <div className="search-info">
//                 <h6><span><i data-feather="help-circle" className="feather-16" /></span>Help</h6>
//                 <p>How to Change Product Volume from 0 to 200 on Inventory management</p>
//                 <p>Change Product Name</p>
//               </div>
//               <div className="search-info">
//                 <h6><span><i data-feather="user" className="feather-16" /></span>Customers</h6>
//                 <ul className="customers">
//                   <li><a href="javascript:void(0);">Aron Varu<img src="assets/img/profiles/avator1.jpg" alt="Img" className="img-fluid" /></a></li>
//                   <li><a href="javascript:void(0);">Jonita<img src="assets/img/profiles/avatar-01.jpg" alt="Img" className="img-fluid" /></a></li>
//                   <li><a href="javascript:void(0);">Aaron<img src="assets/img/profiles/avatar-10.jpg" alt="Img" className="img-fluid" /></a></li>
//                 </ul>
//               </div>
//             </div>
//           </form>
//         </div>
//       </li>
//       {/* /Search */}
//       {/* Select Store */}
//       <li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
//         <a href="javascript:void(0);" className="dropdown-toggle nav-link select-store" data-bs-toggle="dropdown">
//           <span className="user-info">
//             <span className="user-letter">
//               <img src="assets/img/store/store-01.png" alt="Store Logo" className="img-fluid" />
//             </span>
//             <span className="user-detail">
//               <span className="user-name">Freshmart</span>
//             </span>
//           </span>
//         </a>
//         <div className="dropdown-menu dropdown-menu-right">
//           <a href="javascript:void(0);" className="dropdown-item">
//             <img src="assets/img/store/store-01.png" alt="Store Logo" className="img-fluid" />Freshmart
//           </a>
//           <a href="javascript:void(0);" className="dropdown-item">
//             <img src="assets/img/store/store-02.png" alt="Store Logo" className="img-fluid" />Grocery Apex
//           </a>
//           <a href="javascript:void(0);" className="dropdown-item">
//             <img src="assets/img/store/store-03.png" alt="Store Logo" className="img-fluid" />Grocery Bevy
//           </a>
//           <a href="javascript:void(0);" className="dropdown-item">
//             <img src="assets/img/store/store-04.png" alt="Store Logo" className="img-fluid" />Grocery Eden
//           </a>
//         </div>
//       </li>
//       {/* /Select Store */}
//       <li className="nav-item dropdown link-nav">
//         <a href="javascript:void(0);" className="btn btn-primary btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//           <i className="ti ti-circle-plus me-1" />Add New
//         </a>
//         <div className="dropdown-menu dropdown-xl dropdown-menu-center">
//           <div className="row g-2">
//             <div className="col-md-2">
//               <a href="category-list.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-brand-codepen" />
//                 </span>
//                 <p>Category</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="add-product.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-square-plus" />
//                 </span>
//                 <p>Product</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="category-list.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-shopping-bag" />
//                 </span>
//                 <p>Purchase</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="online-orders.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-shopping-cart" />
//                 </span>
//                 <p>Sale</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="expense-list.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-file-text" />
//                 </span>
//                 <p>Expense</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="quotation-list.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-device-floppy" />
//                 </span>
//                 <p>Quotation</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="sales-returns.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-copy" />
//                 </span>
//                 <p>Return</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="users.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-user" />
//                 </span>
//                 <p>User</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="customers.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-users" />
//                 </span>
//                 <p>Customer</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="sales-report.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-shield" />
//                 </span>
//                 <p>Biller</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="suppliers.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-user-check" />
//                 </span>
//                 <p>Supplier</p>
//               </a>
//             </div>
//             <div className="col-md-2">
//               <a href="stock-transfer.html" className="link-item">
//                 <span className="link-icon">
//                   <i className="ti ti-truck" />
//                 </span>
//                 <p>Transfer</p>
//               </a>
//             </div>
//           </div>
//         </div>
//       </li>
//       <li className="nav-item pos-nav">
//         <a href="pos.html" className="btn btn-dark btn-md d-inline-flex align-items-center">
//           <i className="ti ti-device-laptop me-1" />POS
//         </a>
//       </li>
//       {/* Flag */}
//       <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
//         <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="javascript:void(0);" role="button">
//           <img src="assets/img/flags/us-flag.svg" alt="Language" className="img-fluid" />
//         </a>
//         <div className="dropdown-menu dropdown-menu-right">
//           <a href="javascript:void(0);" className="dropdown-item">
//             <img src="assets/img/flags/english.svg" alt="Img" height={16} />English
//           </a>
//           <a href="javascript:void(0);" className="dropdown-item">
//             <img src="assets/img/flags/arabic.svg" alt="Img" height={16} />Arabic
//           </a>
//         </div>
//       </li>
//       {/* /Flag */}
//       <li className="nav-item nav-item-box">
//         <a href="javascript:void(0);" id="btnFullscreen">
//           <i className="ti ti-maximize" />
//         </a>
//       </li>
//       <li className="nav-item nav-item-box">
//         <a href="email.html">
//           <i className="ti ti-mail" />
//           <span className="badge rounded-pill">1</span>
//         </a>
//       </li>
//       {/* Notifications */}
//       <li className="nav-item dropdown nav-item-box">
//         <a href="javascript:void(0);" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
//           <i className="ti ti-bell" />
//         </a>
//         <div className="dropdown-menu notifications">
//           <div className="topnav-dropdown-header">
//             <h5 className="notification-title">Notifications</h5>
//             <a href="javascript:void(0)" className="clear-noti">Mark all as read</a>
//           </div>
//           <div className="noti-content">
//             <ul className="notification-list">
//               <li className="notification-message">
//                 <a href="activities.html">
//                   <div className="media d-flex">
//                     <span className="avatar flex-shrink-0">
//                       <img alt="Img" src="assets/img/profiles/avatar-13.jpg" />
//                     </span>
//                     <div className="flex-grow-1">
//                       <p className="noti-details"><span className="noti-title">James Kirwin</span> confirmed his order.  Order No: #78901.Estimated delivery: 2 days</p>
//                       <p className="noti-time">4 mins ago</p>
//                     </div>
//                   </div>
//                 </a>
//               </li>
//               <li className="notification-message">
//                 <a href="activities.html">
//                   <div className="media d-flex">
//                     <span className="avatar flex-shrink-0">
//                       <img alt="Img" src="assets/img/profiles/avatar-03.jpg" />
//                     </span>
//                     <div className="flex-grow-1">
//                       <p className="noti-details"><span className="noti-title">Leo Kelly</span> cancelled his order scheduled for  17 Jan 2025</p>
//                       <p className="noti-time">10 mins ago</p>
//                     </div>
//                   </div>
//                 </a>
//               </li>
//               <li className="notification-message">
//                 <a href="activities.html" className="recent-msg">
//                   <div className="media d-flex">
//                     <span className="avatar flex-shrink-0">
//                       <img alt="Img" src="assets/img/profiles/avatar-17.jpg" />
//                     </span>
//                     <div className="flex-grow-1">
//                       <p className="noti-details">Payment of $50 received for Order #67890 from <span className="noti-title">Antonio Engle</span></p>
//                       <p className="noti-time">05 mins ago</p>
//                     </div>
//                   </div>
//                 </a>
//               </li>
//               <li className="notification-message">
//                 <a href="activities.html" className="recent-msg">
//                   <div className="media d-flex">
//                     <span className="avatar flex-shrink-0">
//                       <img alt="Img" src="assets/img/profiles/avatar-02.jpg" />
//                     </span>
//                     <div className="flex-grow-1">
//                       <p className="noti-details"><span className="noti-title">Andrea</span> confirmed his order.  Order No: #73401.Estimated delivery: 3 days</p>
//                       <p className="noti-time">4 mins ago</p>
//                     </div>
//                   </div>
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div className="topnav-dropdown-footer d-flex align-items-center gap-3">
//             <a href="#" className="btn btn-secondary btn-md w-100">Cancel</a>
//             <a href="activities.html" className="btn btn-primary btn-md w-100">View all</a>
//           </div>
//         </div>
//       </li>
//       {/* /Notifications */}
//       <li className="nav-item nav-item-box">
//         <a href="general-settings.html"><i className="ti ti-settings" /></a>
//       </li>
//       <li className="nav-item dropdown has-arrow main-drop profile-nav">
//         <a href="javascript:void(0);" className="nav-link userset" data-bs-toggle="dropdown">
//           <span className="user-info p-0">
//             <span className="user-letter">
//               <img src="assets/img/profiles/avator1.jpg" alt="Img" className="img-fluid" />
//             </span>
//           </span>
//         </a>
//         <div className="dropdown-menu menu-drop-user">
//           <div className="profileset d-flex align-items-center">
//             <span className="user-img me-2">
//               <img src="assets/img/profiles/avator1.jpg" alt="Img" />
//             </span>
//             <div>
//               <h6 className="fw-medium">John Smilga</h6>
//               <p>Admin</p>
//             </div>
//           </div>
//           <a className="dropdown-item" href="profile.html"><i className="ti ti-user-circle me-2" />MyProfile</a>
//           <a className="dropdown-item" href="sales-report.html"><i className="ti ti-file-text me-2" />Reports</a>
//           <a className="dropdown-item" href="general-settings.html"><i className="ti ti-settings-2 me-2" />Settings</a>
//           <hr className="my-2" />
//           <a className="dropdown-item logout pb-0" href="signin.html"><i className="ti ti-logout me-2" />Logout</a>
//         </div>
//       </li>
//     </ul>
//     {/* /Header Menu */}
//     {/* Mobile Menu */}
//     <div className="dropdown mobile-user-menu">
//       <a href="javascript:void(0);" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v" /></a>
//       <div className="dropdown-menu dropdown-menu-right">
//         <a className="dropdown-item" href="profile.html">My Profile</a>
//         <a className="dropdown-item" href="general-settings.html">Settings</a>
//         <a className="dropdown-item" href="signin.html">Logout</a>
//       </div>
//     </div>
//     {/* /Mobile Menu */}
//   </div>
// </div>

//   )
// }

// export default Navbar