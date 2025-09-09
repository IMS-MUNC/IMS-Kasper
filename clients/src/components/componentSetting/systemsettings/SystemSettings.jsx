import React, { useState } from "react";
import captcha from "../../../assets/images/captcha.svg";
import analytics from "../../../assets/images/analyticks.svg";
import adsense from "../../../assets/images/adsence.svg";
import map from "../../../assets/images/map.svg";
import { TbTool } from "react-icons/tb";
import "./system-settings.css";

const SystemSettings = () => {
  const [isOnCaptcha, setIsOnCaptcha] = useState(false);
  const [isOnAnalytics, setIsOnAnalytics] = useState(false);
  const [isOnAdsense, setIsOnAdsense] = useState(false);
  const [isOnMap, setIsOnMap] = useState(false);
  return (
    <div>
      <div
        className="system-settings-container"
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          border: "1px solid rgb(211, 211, 211)",
        }}
      >
        <div>
          <h1 className="py-2 px-3" style={{ fontSize: "17px" }}>
            System Settings
          </h1>
          <hr style={{ margin: "0" }} />
        </div>
        <div className="system-settings-content py-3 px-3 d-flex flex-column gap-3">
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              className="system-settings-box"
              style={{
                padding: "20px 15px",
                border: "1px solid rgb(211, 211, 211)",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                borderRadius: "5px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      width: "45px",
                      height: "45px",
                      border: "1px solid  rgb(211, 211, 211)",
                      borderRadius: "5px",
                    }}
                  >
                    <img src={captcha} alt="captcha" />
                  </span>
                  <span>Google Captcha</span>
                </div>
                <div
                  onClick={() => setIsOnAdsense(!isOnAdsense)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnAdsense ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnAdsense
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
              </div>
              <p style={{ margin: "0", color: "#646363" }}>
                Captcha helps protect you from spam and password decryption
              </p>
              <div>
                <button
                  className="system-settings-btn"
                  style={{
                    border: "none",
                    backgroundColor: "#007AFF",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    display: "flex",
                    alignItems: 'center'
                  }}
                >
                  <TbTool /> View Integration
                </button>
              </div>
            </div>
            <div
              className="system-settings-box"
              style={{
                padding: "20px 15px",
                border: "1px solid rgb(211, 211, 211)",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                width: "100%",
                borderRadius: "5px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      width: "45px",
                      height: "45px",
                      border: "1px solid  rgb(211, 211, 211)",
                      borderRadius: "5px",
                    }}
                  >
                    <img src={analytics} alt="analytics" />
                  </span>
                  <span>Google Analytics</span>
                </div>
                <div
                  onClick={() => setIsOnAnalytics(!isOnAnalytics)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnAnalytics ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnAnalytics
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
              </div>
              <p style={{ margin: "0", color: "#646363" }}>
                Provides statistics and basic analytical tools for SEO and
                marketing purposes.
              </p>
              <div>
                <button
                  className="system-settings-btn"
                  style={{
                    border: "none",
                    backgroundColor: "#007AFF",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    display: "flex",
                    alignItems: 'center'
                  }}
                >
                  <TbTool />  View Integration
                </button>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              className="system-settings-box"
              style={{
                padding: "20px 15px",
                border: "1px solid rgb(211, 211, 211)",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                width: "100%",
                borderRadius: "5px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      width: "45px",
                      height: "45px",
                      border: "1px solid  rgb(211, 211, 211)",
                      borderRadius: "5px",
                    }}
                  >
                    <img src={adsense} alt="adsense" />
                  </span>
                  <span>Google Adsense Code</span>
                </div>
                <div
                  onClick={() => setIsOnCaptcha(!isOnCaptcha)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnCaptcha ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnCaptcha
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
              </div>
              <p style={{ margin: "0", color: "#646363" }}>
                Provides a way for publishers to earn money from their online
                content.
              </p>
              <div>
                <button
                  className="system-settings-btn"
                  style={{
                    border: "none",
                    backgroundColor: "#007AFF",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    display: "flex",
                    alignItems: 'center'
                  }}
                >
                  <TbTool />  View Integration
                </button>
              </div>
            </div>
            <div
              className="system-settings-box"
              style={{
                padding: "20px 15px",
                border: "1px solid rgb(211, 211, 211)",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                width: "100%",
                borderRadius: "5px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      width: "45px",
                      height: "45px",
                      border: "1px solid  rgb(211, 211, 211)",
                      borderRadius: "5px",
                    }}
                  >
                    <img src={map} alt="map" />
                  </span>
                  <span>Google Map</span>
                </div>
                <div
                  onClick={() => setIsOnMap(!isOnMap)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnMap ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnMap
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
              </div>
              <p style={{ margin: "0", color: "#646363" }}>
                Provides detailed information about geographical regions and
                sites worldwide.
              </p>
              <div>
                <button
                  className="system-settings-btn"
                  style={{
                    border: "none",
                    backgroundColor: "#007AFF",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    display: "flex",
                    alignItems: 'center'
                  }}
                >
                  <TbTool />  View Integration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
