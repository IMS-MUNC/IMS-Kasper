import React, { useEffect, useState } from 'react'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useSidebar } from '../../../Context/sidetoggle/SidebarContext';
import { TbCalculator, TbCash, TbChartInfographic, TbMaximize, TbPrinter, TbProgress, TbSettings } from 'react-icons/tb';
import Mundc from "../../../assets/img/logo/munclogotm.png"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../config/config';
import axios from 'axios';

const PosHeader = () => {
  const { openMenus, toggleMenu, mobileOpen, handleMobileToggle, handleLinkClick } = useSidebar();

  const [companyImages, setCompanyImages] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const token = localStorage.getItem("token");
  //   const menuData = getMenuData();
  // fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${BASE_URL}/api/companyprofile/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.status === 200) {
          setCompanyImages(res.data.data)
          // console.log("res.data from pos header", res.data.data)
        }
      } catch (error) {    
  console.error("API fetch error:", error.response ? error.response.data : error.message);
        toast.error("Unable to find company details", {
          position: 'top-center'
        })
      }
    }
    fetchCompanyDetails();
  }, []);
  // console.log("Token:", token)
// console.log("Fetching from:", `${BASE_URL}/api/companyprofile/get`)

  return (
    <div className="header pos-header">
      {companyImages ? (
        <>
      {/* Logo */}
      <div className="header-left active">
        <a href="index.html" className="logo logo-normal">
          <img
  style={{ height: "35px", width: "35px" }}
  src={isDarkMode ? companyImages?.companyDarkLogo : companyImages?.companyLogo}
  alt="company logo"
/>

        </a>
        <a href="index.html" className="logo logo-white">
          {/* <img src="assets/img/logo-white.svg" alt="Img" /> */}
          <img  src={isDarkMode ? companyImages?.companyDarkLogo : companyImages?.companyLogo || "No Image"} className="full-logo" alt="Full Logo" />
        </a>
        <a href="index.html" className="logo-small">
          {/* <img src="assets/img/logo-small.png" alt="Img" /> */}
          {/* <img src={Mundc} alt="Img" /> */}
        </a>
      </div>
      {/* /Logo */}
      <a id="mobile_btn" className="mobile_btn d-none" href="#sidebar">
        <span className="bar-icon">
          <span />
          <span />
          <span />
        </span>
      </a>

      {/* Header Menu */}
      <ul className="nav user-menu">
        {/* Search */}
        <li className="nav-item time-nav">
          <span className=" text-white d-inline-flex align-items-center">
            {/* <img src="assets/img/icons/clock-icon.svg" alt="img" className="me-2" />09:25:32 */}
          </span>
        </li>
        {/* /Search */}
        <li className="nav-item pos-nav">
          <a href="/home" className="btn btn-purple btn-md d-inline-flex align-items-center">
            <i className="ti ti-world me-1" />Dashboard
          </a>
        </li>
{/* 
        <li className="nav-item nav-item-box">
          <a href="#" data-bs-toggle="modal" data-bs-target="#calculator" className="bg-orange border-orange text-white"><TbCalculator className="ti ti-calculator" /></a>
        </li>
        <li className="nav-item nav-item-box">
          <a href="javascript:void(0);" id="btnFullscreen" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Maximize">
            <TbMaximize className="ti ti-maximize" />
          </a>
        </li>
        <li className="nav-item nav-item-box" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Cash Register">
          <a href="#" data-bs-toggle="modal" data-bs-target="#cash-register"><TbCash className="ti ti-cash" /></a>
        </li>
        <li className="nav-item nav-item-box" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Print Last Reciept">
          <a href="#"><TbPrinter className="ti ti-printer" /></a>
        </li>
        <li className="nav-item nav-item-box" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Today’s Sale">
          <a href="#" data-bs-toggle="modal" data-bs-target="#today-sale"><TbProgress className="ti ti-progress" /></a>
        </li>
        <li className="nav-item nav-item-box" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Today’s Profit">
          <a href="#" data-bs-toggle="modal" data-bs-target="#today-profit"><TbChartInfographic className="ti ti-chart-infographic" /></a>
        </li>
        <li className="nav-item nav-item-box" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="POS Settings">
          <a href="#"><TbSettings className="ti ti-settings" /></a>
        </li> */}
        {/* <li className="nav-item dropdown has-arrow main-drop profile-nav">
      <a href="javascript:void(0);" className="nav-link userset" data-bs-toggle="dropdown">
        <span className="user-info p-0">
          <span className="user-letter">
            <img src="assets/img/profiles/avator1.jpg" alt="Img" className="img-fluid" />
          </span>
        </span>
      </a>
      <div className="dropdown-menu menu-drop-user">
        <div className="profilename">
          <div className="profileset">
            <span className="user-img"><img src="assets/img/profiles/avator1.jpg" alt="Img" />
              <span className="status online" /></span>
            <div className="profilesets">
              <h6>John Smilga</h6>
              <h5>Super Admin</h5>
            </div>
          </div>
          <hr className="m-0" />
          <a className="dropdown-item" href="profile.html"><i className="me-2" data-feather="user" />My
            Profile</a>
          <a className="dropdown-item" href="general-settings.html"><i className="me-2" data-feather="settings" />Settings</a>
          <hr className="m-0" />
          <a className="dropdown-item logout pb-0" href="signin.html"><img src="assets/img/icons/log-out.svg" className="me-2" alt="img" />Logout</a>
        </div>
      </div>
    </li> */}
      </ul>
      {/* /Header Menu */}
      {/* Mobile Menu */}
      {/* Profile */}

      {/* /Mobile Menu */}
      </>
      ):(
      <p>"No Company Logo Image"</p>)}
    </div>

  )
}

export default PosHeader
