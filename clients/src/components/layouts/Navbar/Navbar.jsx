import React, { useMemo, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "../../../styles/auth.css";
import {
  TbBell,
  TbCirclePlus,
  TbCommand,
  TbDeviceLaptop,
  TbDotsVertical,
  TbFileText,
  TbLanguage,
  TbLogout,
  TbMail,
  TbMaximize,
  TbSearch,
  TbSettings,
  TbUserCircle,
} from "react-icons/tb";
import UsFlag from "../../../assets/img/flags/us-flag.svg";
import English from "../../../assets/img/flags/english.svg";
import Arabic from "../../../assets/img/flags/arabic.svg";
import Hindi from "../../../assets/img/flags/indian-flag.svg";
import Logo from "../../../assets/img/logo/munclogotm.png";
import { useSidebar } from "../../../Context/sidetoggle/SidebarContext";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import axios from "axios";
import BASE_URL from "../../../pages/config/config";
import Profile from "../../../assets/img/profile.jpeg";
import { LanguageContext } from "../../../Context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import Activities from "./activities";
import { useSocket } from "../../../Context/SocketContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { useAuth } from "../../auth/AuthContext";
import { useInbox } from "../../../components/features/Mail/SideBar/InboxContext";
import { getMenuData } from "../Sidebar/MenuData.jsx";
import CategoryModal from "../../../pages/Modal/categoryModals/CategoryModal.jsx";
import { Modal } from "bootstrap";



function Navbar() {
  const { inboxCount, fetchInboxCount } = useInbox();
  // state for company logo
  const [companyImages, setCompanyImages] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));
  // const { language, switchLanguage } = useContext(LanguageContext);
  const mobileBtnRef = useRef(null);
  const fullscreenBtnRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const { mobileOpen, handleMobileToggle } = useSidebar();
  const { users } = useAuth();
  const id = users?._id;

  // user profile
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const userObj = JSON.parse(localStorage.getItem("user"));
  const userId = userObj?.id || userObj?._id; // Handle both id and _id
  const token = localStorage.getItem("token");
  const { connectSocket, getSocket } = useSocket();




  // console.log("User ID:", userId);
  // console.log("Token:", token);
  // console.log("User Object:", userObj);
  // console.log("User Data:", user);

  // Fetch notification count
  const fetchNotificationCount = async () => {
    try {
      if (!userId || !token) return;

      // console.log('🔔 Fetching notification count for user:', userId);

      const response = await fetch(
        `${BASE_URL}/api/notifications/unread/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // console.log('🔔 Notification count received:', data);
        setNotificationCount(data.count || 0);
      } else {
        console.error(
          "🔔 Failed to fetch notification count:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  useEffect(() => {
    if (!userId || !token) return;

    const fetchUser = async () => {
      try {
        // First try to use the user data from localStorage
        if (userObj) {
          setUser(userObj);
        }

        // Then fetch fresh data from the API
        const response = await axios.get(`${BASE_URL}/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUser(response.data);
          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // If API call fails, use localStorage data if available
        if (userObj && !user) {
          setUser(userObj);
        }
      }
    };

    fetchUser();
    fetchNotificationCount(); // Fetch notification count

    // Initialize socket connection for real-time notifications
    const socket = connectSocket(BASE_URL);

    if (socket) {
      // Register current user so server can route events correctly
      try {
        socket.emit("add-user", userId);
      } catch (e) {
        console.error("Failed to register user on socket:", e);
      }

      // Listen for new notifications
      socket.on("new-notification", (notificationData) => {
        setNotificationCount((prev) => prev + 1);
      });
    }

    return () => {
      // Don't disconnect on component unmount, let it stay connected
      // Only disconnect if the user logs out or the app is closed
    };
  }, [userId, token]);

  // if (!user) return <p>Loading user profile...</p>;

  // user profile

  // useEffect(() => {
  //   const handleFullscreen = () => {
  //     if (!document.fullscreenElement) {
  //       document.documentElement.requestFullscreen?.();
  //     } else {
  //       document.exitFullscreen?.();
  //     }
  //   };

  //   const handleMobileToggle = () => {
  //     document.body.classList.toggle('slide-nav');
  //     document.querySelector('.sidebar-overlay')?.classList.toggle('opened');
  //     document.documentElement.classList.add('menu-opened');
  //     document.getElementById('task_window')?.classList.remove('opened');
  //   };

  //   const handleHoverExpand = (e) => {
  //     const isMini = document.body.classList.contains('mini-sidebar');
  //     const toggleVisible = toggleBtnRef.current?.offsetParent !== null;
  //     if (isMini && toggleVisible) {
  //       const inside = e.target.closest('.sidebar, .header-left');
  //       if (inside) {
  //         document.body.classList.add('expand-menu');
  //         document.querySelectorAll('.subdrop + ul').forEach(ul => ul.style.display = 'block');
  //       } else {
  //         document.body.classList.remove('expand-menu');
  //         document.querySelectorAll('.subdrop + ul').forEach(ul => ul.style.display = 'none');
  //       }
  //     }
  //   };

  //   fullscreenBtnRef.current?.addEventListener('click', handleFullscreen);
  //   mobileBtnRef.current?.addEventListener('click', handleMobileToggle);
  //   document.addEventListener('mouseover', handleHoverExpand);

  //   return () => {
  //     fullscreenBtnRef.current?.removeEventListener('click', handleFullscreen);
  //     mobileBtnRef.current?.removeEventListener('click', handleMobileToggle);
  //     document.removeEventListener('mouseover', handleHoverExpand);
  //   };
  // }, []);
  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   try {
  //     await axios.post(`${BASE_URL}/api/auth/logout`);
  //     // Optionally clear localStorage/session
  //     localStorage.removeItem("token");
  //     // Redirect to login page
  //     navigate("/login");
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };
  const handleLogout = () => {
    // Clear authentication-related data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("twoFAToken"); // 👈 Important line
    // localStorage.removeItem("role"); // optional, if you store it
    // localStorage.removeItem("permissions"); // optional

    // Redirect to login
    navigate("/login");
  };

  const { t, i18n } = useTranslation();

  // const handleChangeLanguage = (lang) => {
  //   i18n.changeLanguage(lang);
  //   document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  // };


  const languageOptions = {
    en: { name: t("english"), flag: English },
    hi: { name: t("hindi"), flag: Hindi },
    ar: { name: t("arabic"), flag: Arabic },
  };

  const [currentLang, setCurrentLang] = useState(i18n.language || "en");

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    setCurrentLang(lang);
  };

  // Defensive fallback for languageOptions[currentLang]
  const langObj = languageOptions[currentLang] || languageOptions["en"];

  // Handle unread count changes coming from Activities
  const handleUnreadCountChange = (count) => {
    setNotificationCount(Math.max(0, Number(count) || 0));
  };

  // fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/companyprofile/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          setCompanyImages(res.data.data);
          // console.log("res.data", res.data.data)
        }
      } catch (error) {
        toast.error("Unable to find company details", {
          position: "top-center",
        });
      }
    };
    fetchCompanyDetails();
  }, []);

  useEffect(() => {
    if (companyImages?.companyFavicon) {
      let favicon = document.querySelector("link[rel*='icon']");
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.type = "image/png";
      favicon.href = companyImages.companyFavicon;
    }
  }, [companyImages]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchInboxCount();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  //Search Box
  const menuData = useMemo(() => getMenuData(user, t), [user, t]); // same as sidebar
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setSearchResults([]);
      return;
    }

    // Flatten menuData to get all links
    const allLinks = [];
    menuData.forEach((section) => {
      section.items.forEach((item) => {
        if (item.subItems) {
          item.subItems.forEach((sub) => {
            if (sub.nested) {
              sub.nested.forEach((n) =>
                allLinks.push({ title: n.label, path: n.path, icon: n.icon })
              );
            } else {
              allLinks.push({
                title: sub.label,
                path: sub.path,
                icon: sub.icon,
              });
            }
          });
        } else {
          allLinks.push({
            title: item.label,
            path: item.path,
            icon: item.icon,
          });
        }
      });
    });

    const filtered = allLinks.filter((link) =>
      link.title.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);
  };

  return (
    <div className="header">
      <div className="main-header">
        {companyImages ? (
          <>
            {/* Logo */}
            <div className="header-left active">
              <Link to="/home" className="logo logo-normal">
                <img
                  src={
                    isDarkMode
                      ? companyImages.companyDarkLogo
                      : companyImages.companyLogo
                  }
                  alt="company logo"
                />
                {/* {console.log('cmpylogo', companyImages.companyLogo)} */}
              </Link>
              {/* <Link to="/home" className="logo logo-white">
            <img src="/assets/img/logo-white.svg" alt="Logo" />
          </Link>
          <Link to="/home" className="logo-small">
            <img src="/assets/img/logo-small.png" alt="Logo" />
          </Link> */}
            </div>

            {/* Mobile Toggle */}
            <a
              id="mobile_btn"
              className="mobile_btn"
              onClick={handleMobileToggle}
              ref={mobileBtnRef}
            >
              {mobileOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
              {/* <span className="bar-icon"><span /><span /><span /></span> */}
            </a>

            {/* Dummy Toggle Button for Sidebar Hover Expand */}
            <button
              id="toggle_btn"
              ref={toggleBtnRef}
              style={{ display: "none" }}
            ></button>

            {/* Header Right Menu */}

            <ul className="nav user-menu">
              {/* Search */}
              {/* <li className="nav-item nav-searchinputs">
            <div className="top-nav-search">
              <button className="responsive-search"><TbSearch /></button>
              <form className="dropdown">
                <div className="searchinputs input-group dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                  <input
                   type="text" placeholder="Search"
                  
                  />
                </div>
                <div className="dropdown-menu search-dropdown"></div>
              </form>
            </div>
          </li> */}
              <li className="nav-item nav-searchinputs">
                <div className="top-nav-search">
                  <button className="responsive-search">
                    <TbSearch />
                  </button>
                  <form className="dropdown">
                    <div
                      className="searchinputs input-group dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </div>
                    {searchResults.length > 0 && (
                      <div
                        className=""
                        style={{
                          backgroundColor: "white",
                          width: "200px",
                          minHeight: "auto ",
                          maxHeight: "250px",
                          overflowY: "scroll",
                          position: "absolute",
                          top: "50px",
                          zIndex: "1",
                          padding: "10px 0px",
                          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                          border: "1px solid rgb(230, 230, 230)",
                          borderRadius: "4px",
                        }}
                      >
                        {searchResults.map((result, idx) => (
                          <div
                            key={idx}
                            className="dropdown-item"
                            onClick={() => {
                              navigate(result.path);
                              setSearchQuery("");
                              setSearchResults([]);
                            }}
                            style={{
                              display: "flex",
                              gap: "5px",
                              cursor: "pointer",
                            }}
                          >
                            {result.icon}
                            {result.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </form>
                </div>
              </li>

              {/* Store Dropdown */}
              {/* <li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
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
          </li> */}

              {/* Add New Dropdown */}
              <li className="nav-item dropdown link-nav">
                <button
                  className="btn btn-primary btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <TbCirclePlus className="me-1" style={{ color: "white" }} />
                  {t("addNew")}
                </button>
                <div className="dropdown-menu dropdown-xl dropdown-menu-center">
                  <div className="row g-2">
                    <div className="col-md-2">
                      <Link to="/category-list" className="link-item">
                        <span className="link-icon">
                          <i className="ti ti-brand-codepen" />
                        </span>
                        <p>{t("category")}</p>
                      </Link>
                    </div>
                    <div className="col-md-2">
                      <Link to="/add-product" className="link-item">
                        <span className="link-icon">
                          <i className="ti ti-square-plus" />
                        </span>
                        <p>{t("product")}</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              {/* POS Button */}
              <li className="nav-item pos-nav">
                <Link
                  to="/pos"
                  className="btn btn-dark btn-md d-inline-flex align-items-center"
                >
                  <TbDeviceLaptop
                    className=" me-1"
                    style={{ color: "white" }}
                  />
                  {t("pos")}
                </Link>
              </li>

              {/* Language Switcher */}
              {/* <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              <img src={UsFlag} alt="Language" />
              <TbLanguage />
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <button className="dropdown-item" onClick={() => handleChangeLanguage("en")}><img src={English} alt="English" /> English</button>
              <button className="dropdown-item" onClick={() => handleChangeLanguage("hi")}><img src={Arabic} alt="Hindi" /> Hindi</button>
              <button className="dropdown-item" onClick={() => handleChangeLanguage("ar")}><img src={Arabic} alt="Arabic" /> Arabic</button>
            </div>
          </li> */}
              <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
                {/* <a
              className="nav-link dropdown-toggle d-flex align-items-center gap-1"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-expanded="false"
            > */}
                <a
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={langObj.flag}
                    alt={langObj.name}
                    style={{ width: "20px" }}
                  />
                  {/* <span>{languageOptions[currentLang].name}</span> */}
                  {/* <TbLanguage /> */}
                </a>

                <div className="dropdown-menu dropdown-menu-end">
                  {Object.entries(languageOptions).map(
                    ([code, { name, flag }]) => (
                      <button
                        key={code}
                        className={`dropdown-item d-flex align-items-center ${currentLang === code ? "active" : ""
                          }`}
                        onClick={() => handleChangeLanguage(code)}
                      >
                        <img
                          src={flag}
                          alt={name}
                          style={{ width: "20px", marginRight: "8px" }}
                        />
                        {name}
                      </button>
                    )
                  )}
                </div>
              </li>

              {/* <div className="d-flex gap-2 p-2">
            <button onClick={() => handleChangeLanguage("en")} className="btn btn-sm btn-outline-primary">
              English
            </button>
            <button onClick={() => handleChangeLanguage("hi")} className="btn btn-sm btn-outline-success">
              हिंदी
            </button>
            <button onClick={() => handleChangeLanguage("ar")} className="btn btn-sm btn-outline-danger">
              عربى
            </button>
          </div>
         */}

              {/* Fullscreen */}
              {/* <li className="nav-item nav-item-box">
            <a id="btnFullscreen" ref={fullscreenBtnRef}>
              <TbMaximize />
            </a>
          </li> */}
              <li className="nav-item nav-item-box">
                <a
                  id="btnFullscreen"
                  style={{ cursor: "pointer" }}
                  onClick={handleFullscreen}
                >
                  <TbMaximize />
                </a>
              </li>

              {/* Email */}
              <li className="nav-item nav-item-box">
                <Link to="/mail/inbox" className="position-relative">
                  <TbMail />
                  {inboxCount > 0 && (
                    <span className="badge rounded-pill">{inboxCount}</span>
                  )}
                </Link>
              </li>
              {/* Notifications */}
              <li className="nav-item dropdown nav-item-box">
                <a
                  href="#"
                  className="dropdown-toggle nav-link"
                  data-bs-toggle="dropdown"
                  onClick={(e) => e.preventDefault()}
                >
                  <TbBell style={{ position: "absolute", left: "7px" }} />
                  {notificationCount > 0 && (
                    <span
                      className="badge rounded-pill"
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        backgroundColor: "red",
                        color: "white",
                        fontSize: "10px",
                        minWidth: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        border: "2px solid white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </a>
                <div
                  className="dropdown-menu notifications"
                  style={{ border: "1px solid #E6E6E6", borderRadius: "8px" }}
                >
                  <Activities onUnreadCountChange={handleUnreadCountChange} />
                </div>
              </li>
              {/* Settings */}
              <li className="nav-item nav-item-box">
                <Link to={`profile/${id}`}>
                  <TbSettings className="ti" />
                </Link>
              </li>
              {/* Settings */}
              {/* <li className="nav-item nav-item-box">
            <Link to="/general-settings"><TbSettings className="ti" /></Link>
          </li> */}

              {/* Profile */}
              {userData ? (
                <li className="nav-item dropdown has-arrow main-drop profile-nav">
                  <a
                    className="nav-link userset"
                    data-bs-toggle="dropdown"
                    href="#"
                  >
                    <span className="user-info p-0">
                      <span className="user-letter">
                        {userData?.profileImage?.url ? (
                          <img
                            src={userData.profileImage.url}
                            alt="Profile"
                            style={{
                              width: "40px",
                              height: "30px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-secondary text-white d-flex justify-content-center align-items-center"
                            style={{
                              width: "40px",
                              height: "30px",
                              borderRadius: "50%",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            {userData.firstName?.charAt(0)?.toUpperCase() || ""}
                            {userData.lastName?.charAt(0)?.toUpperCase() || ""}
                          </div>
                        )}
                      </span>
                    </span>
                  </a>
                  <div className="dropdown-menu menu-drop-user">
                    <div className="profileset d-flex align-items-center">
                      <span className="user-img me-2">
                        {userData?.profileImage?.url ? (
                          <img
                            src={userData.profileImage.url}
                            alt="Profile"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-secondary text-white d-flex justify-content-center align-items-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            {user.firstName?.charAt(0)?.toUpperCase() || ""}
                            {user.lastName?.charAt(0)?.toUpperCase() || ""}
                          </div>
                        )}
                      </span>
                      <div>
                        <h6 className="fw-medium" style={{ margin: "0px" }}>
                          {user.firstName} {user.lastName}
                        </h6>
                        <p style={{ marginBottom: "0" }}>
                          {user.role?.roleName || "User"}
                        </p>
                      </div>
                    </div>
                    <Link className="dropdown-item" to={`/profile/${id}`}>
                      <TbUserCircle className="me-2" /> {t("myProfile")}
                    </Link>
                    {/* <Link className="dropdown-item" to="/sales-report">
                  <TbFileText className=" me-2" /> {t("reports")}
                </Link> */}
                    {/* <Link className="dropdown-item" to="/general-settings">
                  <TbSettings className=" me-2" /> {t("settings")}
                </Link> */}
                    {/* <hr className="my-2" /> */}
                    <Link
                      onClick={handleLogout}
                      to="/logout"
                      className="dropdown-item logout pb-0"
                    >
                      <TbLogout className=" me-2" /> {t("logout")}
                    </Link>
                  </div>
                </li>
              ) : (
                <li className="nav-item dropdown has-arrow main-drop profile-nav">
                  <a
                    className="nav-link userset"
                    data-bs-toggle="dropdown"
                    href="#"
                  >
                    <span className="user-info p-0">
                      <span className="user-letter">
                        <div
                          className="bg-secondary text-white d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          {userObj?.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      </span>
                    </span>
                  </a>
                  <div className="dropdown-menu menu-drop-user">
                    <div className="profileset d-flex align-items-center">
                      <span className="user-img me-2">
                        <div
                          className="bg-secondary text-white d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          {userObj?.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      </span>
                      <div>
                        <h6 className="fw-medium">
                          {userObj?.firstName || "User"}{" "}
                          {userObj?.lastName || ""}
                        </h6>
                        <p>{userObj?.role?.roleName || "User"}</p>
                      </div>
                    </div>
                    <Link className="dropdown-item" to="/profile">
                      <TbUserCircle className="me-2" /> {t("myProfile")}
                    </Link>
                    <Link className="dropdown-item" to="/sales-report">
                      <TbFileText className=" me-2" /> {t("reports")}
                    </Link>
                    <Link className="dropdown-item" to="/general-settings">
                      <TbSettings className=" me-2" /> {t("settings")}
                    </Link>
                    <hr className="my-2" />
                    <Link to="/logout" className="dropdown-item logout pb-0">
                      <TbLogout className=" me-2" /> {t("logout")}
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </>
        ) : (
          <p>No Company Logo Image</p>
        )}
        {/* Mobile Menu (3 dots) */}
        <div className="dropdown mobile-user-menu">
          <a
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            href="#"
          >
            <TbDotsVertical />
          </a>
          <div className="dropdown-menu dropdown-menu-end">
            <Link className="dropdown-item" to="/profile">
              {t("myProfile")}
            </Link>
            <Link className="dropdown-item" to="/general-settings">
              {t("settings")}
            </Link>
            <Link to="/logout" className="dropdown-item">
              {t("logout")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import "../../../styles/auth.css";
// import { TbBell, TbCirclePlus, TbCommand, TbDeviceLaptop, TbDotsVertical, TbFileText, TbLanguage, TbLogout, TbMail, TbMaximize, TbSearch, TbSettings, TbUserCircle } from 'react-icons/tb';
// import UsFlag from "../../../assets/img/flags/us-flag.svg"
// import English from "../../../assets/img/flags/english.svg"
// import Arabic from "../../../assets/img/flags/arabic.svg"
// import Logo from "../../../assets/img/logo/munclogotm.png"
// import { useSidebar } from '../../../Context/sidetoggle/SidebarContext';
// import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
// import axios from 'axios';
// import BASE_URL from '../../../pages/config/config';
// import Profile from "../../../assets/img/profile.jpeg";
// import { LanguageContext } from '../../../Context/Language/LanguageContext';
// import { useTranslation } from "react-i18next";

// function Navbar() {
//   // const { language, switchLanguage } = useContext(LanguageContext);
//   const mobileBtnRef = useRef(null);
//   const fullscreenBtnRef = useRef(null);
//   const toggleBtnRef = useRef(null);
//   const { mobileOpen, handleMobileToggle } = useSidebar();

//   // user profile
//   const [user, setUser] = useState(null);
//   const userObj = JSON.parse(localStorage.getItem("user"));
//   const userId = userObj?.id; // or userObj?._id based on your schema
//   const token = localStorage.getItem("token");
//   // console.log("User ID:", userId);
//   // console.log("Token:", token);
//   // console.log("User Object:", userObj);
//   // console.log("User Data:", user);

//   useEffect(() => {
//     if (!userId || !token) return;

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/user/userdata/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUser(res.data);
//       } catch (err) {

//         // console.log("Full URL:", `${BASE_URL}/api/user/userdata/${userId}`);

//         console.error("Profile fetch failed:", err);
//       }
//     };

//     fetchUser();
//   }, [userId, token]);

//   // if (!user) return <p>Loading user profile...</p>;

//   // user profile

//   useEffect(() => {
//     const handleFullscreen = () => {
//       if (!document.fullscreenElement) {
//         document.documentElement.requestFullscreen?.();
//       } else {
//         document.exitFullscreen?.();
//       }
//     };

//     const handleMobileToggle = () => {
//       document.body.classList.toggle('slide-nav');
//       document.querySelector('.sidebar-overlay')?.classList.toggle('opened');
//       document.documentElement.classList.add('menu-opened');
//       document.getElementById('task_window')?.classList.remove('opened');
//     };

//     const handleHoverExpand = (e) => {
//       const isMini = document.body.classList.contains('mini-sidebar');
//       const toggleVisible = toggleBtnRef.current?.offsetParent !== null;
//       if (isMini && toggleVisible) {
//         const inside = e.target.closest('.sidebar, .header-left');
//         if (inside) {
//           document.body.classList.add('expand-menu');
//           document.querySelectorAll('.subdrop + ul').forEach(ul => ul.style.display = 'block');
//         } else {
//           document.body.classList.remove('expand-menu');
//           document.querySelectorAll('.subdrop + ul').forEach(ul => ul.style.display = 'none');
//         }
//       }
//     };

//     fullscreenBtnRef.current?.addEventListener('click', handleFullscreen);
//     mobileBtnRef.current?.addEventListener('click', handleMobileToggle);
//     document.addEventListener('mouseover', handleHoverExpand);

//     return () => {
//       fullscreenBtnRef.current?.removeEventListener('click', handleFullscreen);
//       mobileBtnRef.current?.removeEventListener('click', handleMobileToggle);
//       document.removeEventListener('mouseover', handleHoverExpand);
//     };
//   }, []);

//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await axios.post(`${BASE_URL}/api/auth/logout`);
//       // Optionally clear localStorage/session
//       localStorage.removeItem("token");
//       // Redirect to login page
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const { t, i18n } = useTranslation();

//   // const handleChangeLanguage = (lang) => {
//   //   i18n.changeLanguage(lang);
//   //   document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
//   // };

//   const languageOptions = {
//     en: { name: t("english"), flag: English },
//     hi: { name: t("hindi"), flag: Arabic }, // Replace with Hindi flag if available
//     ar: { name: t("arabic"), flag: Arabic },
//   };

//   const [currentLang, setCurrentLang] = useState(i18n.language || "en");

//   const handleChangeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
//     setCurrentLang(lang);
//   };

//   return (
//     <div className="header">
//       <div className="main-header">
//         {/* Logo */}
//         <div className="header-left active">
//           <Link to="/home" className="logo logo-normal">
//             <img src={Logo} alt="Logo" />
//           </Link>
//           <Link to="/home" className="logo logo-white">
//             <img src="/assets/img/logo-white.svg" alt="Logo" />
//           </Link>
//           <Link to="/home" className="logo-small">
//             <img src="/assets/img/logo-small.png" alt="Logo" />
//           </Link>
//         </div>

//         {/* Mobile Toggle */}
//         <a id="mobile_btn" className="mobile_btn" onClick={handleMobileToggle} ref={mobileBtnRef}>
//           {mobileOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
//           {/* <span className="bar-icon"><span /><span /><span /></span> */}
//         </a>

//         {/* Dummy Toggle Button for Sidebar Hover Expand */}
//         <button id="toggle_btn" ref={toggleBtnRef} style={{ display: 'none' }}></button>

//         {/* Header Right Menu */}

//         <ul className="nav user-menu">
//           {/* Search */}
//           <li className="nav-item nav-searchinputs">
//             <div className="top-nav-search">
//               <button className="responsive-search"><TbSearch /></button>
//               <form className="dropdown">
//                 <div className="searchinputs input-group dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">
//                   <input type="text" placeholder="Search" />
//                 </div>
//                 <div className="dropdown-menu search-dropdown"></div>
//               </form>
//             </div>
//           </li>

//           {/* Store Dropdown */}
//           {/* <li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
//             <a className="dropdown-toggle nav-link select-store" data-bs-toggle="dropdown" href="#">
//               <span className="user-info">
//                 <span className="user-letter">
//                   <img src="/assets/img/store/store-01.png" alt="Store" className="img-fluid" />
//                 </span>
//                 <span className="user-detail">
//                   <span className="user-name">Freshmart</span>
//                 </span>
//               </span>
//             </a>
//             <div className="dropdown-menu dropdown-menu-end">
//               <Link className="dropdown-item" to="#"><img src="/assets/img/store/store-01.png" alt="Store" /> Freshmart</Link>
//               <Link className="dropdown-item" to="#"><img src="/assets/img/store/store-02.png" alt="Store" /> Grocery Apex</Link>
//             </div>
//           </li> */}

//           {/* Add New Dropdown */}
//           <li className="nav-item dropdown link-nav">
//             <button className="btn btn-primary btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//               <TbCirclePlus className="me-1" />
//               {t("addNew")}
//             </button>
//             <div className="dropdown-menu dropdown-xl dropdown-menu-center">
//               <div className="row g-2">
//                 <div className="col-md-2">
//                   <Link to="/category-list" className="link-item">
//                     <span className="link-icon"><i className="ti ti-brand-codepen" /></span>
//                     <p>{t("category")}</p>
//                   </Link>
//                 </div>
//                 <div className="col-md-2">
//                   <Link to="/add-product" className="link-item">
//                     <span className="link-icon"><i className="ti ti-square-plus" /></span>
//                     <p>{t("product")}</p>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </li>

//           {/* POS Button */}
//           <li className="nav-item pos-nav">
//             <Link to="/pos" className="btn btn-dark btn-md d-inline-flex align-items-center">
//               <TbDeviceLaptop className=" me-1" />
//               {t("pos")}
//             </Link>
//           </li>

//           {/* Language Switcher */}
//           {/* <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
//             <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
//               <img src={UsFlag} alt="Language" />
//               <TbLanguage />
//             </a>
//             <div className="dropdown-menu dropdown-menu-end">
//               <button className="dropdown-item" onClick={() => handleChangeLanguage("en")}><img src={English} alt="English" /> English</button>
//               <button className="dropdown-item" onClick={() => handleChangeLanguage("hi")}><img src={Arabic} alt="Hindi" /> Hindi</button>
//               <button className="dropdown-item" onClick={() => handleChangeLanguage("ar")}><img src={Arabic} alt="Arabic" /> Arabic</button>
//             </div>
//           </li> */}
//           <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
//             {/* <a
//               className="nav-link dropdown-toggle d-flex align-items-center gap-1"
//               data-bs-toggle="dropdown"
//               href="#"
//               role="button"
//               aria-expanded="false"
//             > */}
//             <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
//               <img
//                 // src={languageOptions[currentLang].flag}
//                 // alt={languageOptions[currentLang].name}
//                 style={{ width: "20px" }}
//               />
//               {/* <span>{languageOptions[currentLang].name}</span> */}
//               {/* <TbLanguage /> */}
//             </a>

//             <div className="dropdown-menu dropdown-menu-end">
//               {Object.entries(languageOptions).map(([code, { name, flag }]) => (
//                 <button
//                   key={code}
//                   className={`dropdown-item d-flex align-items-center ${currentLang === code ? "active" : ""}`}
//                   onClick={() => handleChangeLanguage(code)}
//                 >
//                   <img src={flag} alt={name} style={{ width: "20px", marginRight: "8px" }} />
//                   {name}
//                 </button>
//               ))}
//             </div>
//           </li>

//           {/* <div className="d-flex gap-2 p-2">
//             <button onClick={() => handleChangeLanguage("en")} className="btn btn-sm btn-outline-primary">
//               English
//             </button>
//             <button onClick={() => handleChangeLanguage("hi")} className="btn btn-sm btn-outline-success">
//               हिंदी
//             </button>
//             <button onClick={() => handleChangeLanguage("ar")} className="btn btn-sm btn-outline-danger">
//               عربى
//             </button>
//           </div>
//          */}

//           {/* Fullscreen */}
//           <li className="nav-item nav-item-box">
//             <a id="btnFullscreen" ref={fullscreenBtnRef}>
//               <TbMaximize />
//             </a>
//           </li>

//           {/* Email */}
//           <li className="nav-item nav-item-box">
//             <Link to="/mail">
//               <TbMail />
//               <span className="badge rounded-pill">1</span>
//             </Link>
//           </li>
//           <li className="nav-item dropdown nav-item-box">
//             <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown" onClick={(e) => e.preventDefault()}>
//               <TbBell />
//             </a>
//             <div className="dropdown-menu notifications">
//               <div className="topnav-dropdown-header">
//                 <h5 className="notification-title">{t("notifications")}</h5>
//                 <a href="#" className="clear-noti" onClick={(e) => e.preventDefault()}>{t("markAllAsRead")}</a>
//               </div>
//               <div className="noti-content">
//                 <ul className="notification-list">
//                   <li className="notification-message">
//                     <Link to="/activities">
//                       <div className="media d-flex">
//                         <span className="avatar flex-shrink-0">
//                           <img alt="Img" src="assets/img/profiles/avatar-13.jpg" />
//                         </span>
//                         <div className="flex-grow-1">
//                           <p className="noti-details">
//                             <span className="noti-title">James Kirwin</span> confirmed his order. Order No: #78901. Estimated delivery: 2 days
//                           </p>
//                           <p className="noti-time">4 mins ago</p>
//                         </div>
//                       </div>
//                     </Link>
//                   </li>
//                   <li className="notification-message">
//                     <Link to="/activities">
//                       <div className="media d-flex">
//                         <span className="avatar flex-shrink-0">
//                           <img alt="Img" src="assets/img/profiles/avatar-03.jpg" />
//                         </span>
//                         <div className="flex-grow-1">
//                           <p className="noti-details">
//                             <span className="noti-title">Leo Kelly</span> cancelled his order scheduled for 17 Jan 2025
//                           </p>
//                           <p className="noti-time">10 mins ago</p>
//                         </div>
//                       </div>
//                     </Link>
//                   </li>
//                   <li className="notification-message">
//                     <Link to="/activities" className="recent-msg">
//                       <div className="media d-flex">
//                         <span className="avatar flex-shrink-0">
//                           <img alt="Img" src="assets/img/profiles/avatar-17.jpg" />
//                         </span>
//                         <div className="flex-grow-1">
//                           <p className="noti-details">
//                             Payment of $50 received for Order #67890 from <span className="noti-title">Antonio Engle</span>
//                           </p>
//                           <p className="noti-time">05 mins ago</p>
//                         </div>
//                       </div>
//                     </Link>
//                   </li>
//                   <li className="notification-message">
//                     <Link to="/activities" className="recent-msg">
//                       <div className="media d-flex">
//                         <span className="avatar flex-shrink-0">
//                           <img alt="Img" src="assets/img/profiles/avatar-02.jpg" />
//                         </span>
//                         <div className="flex-grow-1">
//                           <p className="noti-details">
//                             <span className="noti-title">Andrea</span> confirmed his order. Order No: #73401. Estimated delivery: 3 days
//                           </p>
//                           <p className="noti-time">4 mins ago</p>
//                         </div>
//                       </div>
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//               <div className="topnav-dropdown-footer d-flex align-items-center gap-3">
//                 <button className="btn btn-secondary btn-md w-100" type="button">{t("cancel")}</button>
//                 <Link to="/activities" className="btn btn-primary btn-md w-100">{t("viewAll")}</Link>
//               </div>
//             </div>
//           </li>
//           {/* Settings */}
//           <li className="nav-item nav-item-box">
//             <Link to="/general-settings"><TbSettings className="ti" /></Link>
//           </li>

//           {/* Profile */}
//           {user ? (
//             <li className="nav-item dropdown has-arrow main-drop profile-nav">
//               <a className="nav-link userset" data-bs-toggle="dropdown" href="#">
//                 <span className="user-info p-0">
//                   <span className="user-letter">
//                     {/* <img src={Profile} alt="User" /> */}

//                     {user.profileImage &&
//                       user.profileImage.length > 0 ? (
//                       <img
//                         src={user.profileImage[0].url}
//                         alt="Profile"
//                         // style={{
//                         //   width: "50px",
//                         //   height: "50px",
//                         //   borderRadius: "10%",
//                         // }}
//                       />
//                     ) : (
//                       <div
//                         className="bg-secondary text-white  d-flex justify-content-center align-items-center"
//                         style={{ width: "40px", height: "40px" }}
//                       >
//                         {user.firstName?.charAt(0)}
//                         {user.lastName?.charAt(0)}
//                       </div>
//                     )}
//                   </span>
//                 </span>
//               </a>
//               <div className="dropdown-menu menu-drop-user">
//                 <div className="profileset d-flex align-items-center">
//                   <span className="user-img me-2">
//                      {user.profileImage &&
//                     user.profileImage.length > 0 ? (
//                     <img
//                       src={user.profileImage[0].url}
//                       alt="Profile"

//                     />
//                   ) : (
//                     <div
//                       className="bg-secondary text-white  d-flex justify-content-center align-items-center"
//                       style={{ width: "40px", height: "40px" }}
//                     >
//                       {user.firstName?.charAt(0)}
//                       {user.lastName?.charAt(0)}
//                     </div>
//                   )}</span>
//                   <div>
//                     <h6 className="fw-medium"> {user.firstName} {user.lastName}</h6>
//                     <p>{user.role?.roleName}</p>
//                   </div>
//                 </div>
//                 <Link className="dropdown-item" to="/profile"><TbUserCircle className="me-2" /> {t("myProfile")}</Link>
//                 <Link className="dropdown-item" to="/sales-report"><TbFileText className=" me-2" /> {t("reports")}</Link>
//                 <Link className="dropdown-item" to="/general-settings"><TbSettings className=" me-2" /> {t("settings")}</Link>
//                 <hr className="my-2" />
//                 <Link className="dropdown-item logout pb-0" onClick={handleLogout}><TbLogout className=" me-2" /> {t("logout")}</Link>
//               </div>
//             </li>
//           ) : (
//             <p>Loading user profile...</p>
//           )}

//         </ul>

//         {/* Mobile Menu (3 dots) */}
//         <div className="dropdown mobile-user-menu">
//           <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">
//             <TbDotsVertical />
//           </a>
//           <div className="dropdown-menu dropdown-menu-end">
//             <Link className="dropdown-item" to="/profile">{t("myProfile")}</Link>
//             <Link className="dropdown-item" to="/general-settings">{t("settings")}</Link>
//             <Link className="dropdown-item" onClick={handleLogout}>{t("logout")}</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Navbar;
