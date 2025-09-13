import React, { useState } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import { MdKeyboardArrowUp, MdOutlineVideoSettings } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CiSettings } from "react-icons/ci";
import { AiOutlineGlobal } from "react-icons/ai";
import { CiMobile2 } from "react-icons/ci";
import { AiOutlineDesktop } from "react-icons/ai";
import { TbSettingsCog } from "react-icons/tb";
import { TbSettings2 } from "react-icons/tb";
import { RxDotFilled } from "react-icons/rx";
import "../styles/Settings.css";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/auth/AuthContext";
import { RiUserSettingsLine } from "react-icons/ri";


const Settings = () => {
  const [showGeneralSettings, setShowGeneralSettings] = useState(false);
  const [showWebsiteSettings, setShowWebsitelSettings] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const [activeMainItem, setActiveMainItem] = useState("");
  const { user } = useAuth();
  const id = user?._id;


  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name))
  }

  const toggleInvoiceDropdown = () => {
    setShowInvoice((prev) => !prev)
  }
  const { t } = useTranslation();

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="mainsetting">
          {/* MAIN-COMPONENT? */}
          <div className="d-flex gap-4">
            <div
              className="left-setting-sidebar">
              <div>
                <h1 className="settingssh1" style={{ fontSize: "17px" }}>{t("settings")}</h1>
                <hr style={{ color: '#9c9c9cff' }} />
              </div>
              <div className="sidebar-nav-link">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "15px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => { toggleDropdown("general"); setActiveMainItem("general") }}
                >
                  <span className="settingssh1" style={{ backgroundColor: activeMainItem === "general" ? "#E3F3FF" : "", border: activeMainItem === "general" ? "1px solid #BBE1FF" : "none", borderRadius: activeMainItem === "general" ? "5px" : "", padding: "8px", display: "flex", alignItems: 'center', gap: "8px" }}>
                    {" "}
                    <RiUserSettingsLine style={{ color: 'gray', color: activeMainItem === "general" ? "#1368EC" : "", }} /> {t("generalSettings")}
                    <RiArrowDropDownLine
                      style={{
                        borderRadius: "50%",
                        width: "30px",
                        height: "25px",
                        fontWeight: 300,
                        transition: "transform 0.3s",
                        transform: openDropdown === "general" ? "rotate(360deg)" : "rotate(270deg)",
                        color: activeMainItem === "general" ? "#1368EC" : "",
                      }}
                    />
                  </span>
                </div>
                {/* DROPDOWN CONTENT */}
                {openDropdown === "general" && (
                  <div
                    style={{
                      paddingBottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Link to={`profile/${id}`} style={{ textDecoration: "none", color: "black" }}
                      onClick={() => setActiveItem("profile")}
                    >
                      {" "}
                      <span
                        className="settingssh1"
                        style={{
                          marginLeft: "10px",
                          marginRight: "10px",
                          padding: "10px",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color: activeItem === "profile" ? "#1368EC" : "#676767"
                        }}
                      >
                        {" "}
                        {t("profile")}
                      </span>
                    </Link>
                    <Link to="/security-settings" style={{ textDecoration: "none", color: "black" }}
                      onClick={() => setActiveItem("security")}
                    >
                      <span
                        className="settingssh1"
                        style={{
                          marginLeft: "10px",
                          marginRight: "10px",
                          padding: "10px",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color: activeItem === "security" ? "#1368EC" : "#676767"
                        }}
                      >
                        {t("security")}
                      </span>
                    </Link>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "15px",
                    cursor: "pointer",
                  }}
                  onClick={() => { toggleDropdown("website"); setActiveMainItem("website") }}
                >
                  <span className="settingssh1" style={{ backgroundColor: activeMainItem === "website" ? "#E3F3FF" : "", border: activeMainItem === "website" ? "1px solid #BBE1FF" : "none", borderRadius: activeMainItem === "website" ? "5px" : "", padding: "8px", display: "flex", alignItems: 'center', gap: "8px" }}>
                    {" "}
                    <MdOutlineVideoSettings style={{ color: activeMainItem === "website" ? "#1368EC" : "" }} /> {t("websiteSettings")}
                    <RiArrowDropDownLine
                      style={{
                        borderRadius: "50%",
                        width: "30px",
                        height: "25px",
                        fontWeight: 300,
                        transition: "transform 0.3s",
                        transform: openDropdown === "website" ? "rotate(360deg)" : "rotate(270deg)",
                        color: activeMainItem === "website" ? "#1368EC" : "",
                      }}
                    />
                  </span>
                </div>
                {/* DROPDOWN CONTENT */}
                {openDropdown === "website" && (
                  <div
                    style={{
                      paddingBottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Link to="company-settings" style={{ textDecoration: "none", color: "black" }} onClick={() => setActiveItem("company-settings")}>
                      <span
                        className="settingssh1"
                        style={{
                          marginLeft: "10px",
                          marginRight: "10px",
                          padding: "10px",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color: activeItem === "company-settings" ? "#1368EC" : "#676767"
                        }}
                      >
                        {t("companySettings")}
                      </span>
                    </Link>
                    <Link to="/language-settings" style={{ textDecoration: "none", color: "black" }} onClick={() => setActiveItem("language-settings")}>
                      <span
                        className="settingssh1"
                        style={{
                          marginLeft: "10px",
                          marginRight: "10px",
                          padding: "10px",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color: activeItem === "language-settings" ? "#1368EC" : "#676767"
                        }}
                      >
                        {t("localization")}
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="right-setting-content w-100">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
