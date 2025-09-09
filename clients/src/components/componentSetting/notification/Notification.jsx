import React, { useState } from "react";

const Notification = () => {
  const [isOnMobileNoti, setIsOnMobileNoti] = useState(false);
  const [isOndesktopNoti, setIsOnDesktopNoti] = useState(false);
  const [isOnEmailNoti, setIsOnEmailNoti] = useState(false);
  const [isOnMsmsNoti, setIsOnMsmsNoti] = useState(false);
  const [isOnPush, setIsOnPush] = useState(false);
  const [isOnSms, setIsOnSms] = useState(false);
  const [isOnEmail, setIsOnEmail] = useState(false);
  const [isOnPush2, setIsOnPush2] = useState(false);
  const [isOnSms2, setIsOnSms2] = useState(false);
  const [isOnEmail2, setIsOnEmail2] = useState(false);
  const [isOnPush3, setIsOnPush3] = useState(false);
  const [isOnSms3, setIsOnSms3] = useState(false);
  const [isOnEmail3, setIsOnEmail3] = useState(false);
  const [isOnPush4, setIsOnPush4] = useState(false);
  const [isOnSms4, setIsOnSms4] = useState(false);
  const [isOnEmail4, setIsOnEmail4] = useState(false);
  const [isOnPush5, setIsOnPush5] = useState(false);
  const [isOnSms5, setIsOnSms5] = useState(false);
  const [isOnEmail5, setIsOnEmail5] = useState(false);
  const [isOnPush6, setIsOnPush6] = useState(false);
  const [isOnSms6, setIsOnSms6] = useState(false);
  const [isOnEmail6, setIsOnEmail6] = useState(false);

  return (
    <div>
      <div
        className="notification-container"
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          border: "1px solid rgb(211, 211, 211)",
        }}
      >
        <div>
          <h1 className="py-2 px-3" style={{ fontSize: "17px" }}>
            Notification
          </h1>
          <hr style={{ margin: "0" }} />
        </div>
        <div className="notification-content px-3 py-3 d-flex flex-column gap-3">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "500" }}>Mobile Push Notification</span>
            <span>
              {" "}
              <div
                onClick={() => setIsOnMobileNoti(!isOnMobileNoti)}
                style={{
                  width: "47px",
                  height: "24px",
                  backgroundColor: isOnMobileNoti ? "#00C389" : "#ccc",
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
                    transform: isOnMobileNoti
                      ? "translateX(23px)"
                      : "translateX(0px)",
                  }}
                ></div>
              </div>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "500" }}>Desktop Notification</span>
            <span>
              {" "}
              <div
                onClick={() => setIsOnDesktopNoti(!isOndesktopNoti)}
                style={{
                  width: "47px",
                  height: "24px",
                  backgroundColor: isOndesktopNoti ? "#00C389" : "#ccc",
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
                    transform: isOndesktopNoti
                      ? "translateX(23px)"
                      : "translateX(0px)",
                  }}
                ></div>
              </div>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "500" }}>Email Notification</span>
            <span>
              {" "}
              <div
                onClick={() => setIsOnEmailNoti(!isOnEmailNoti)}
                style={{
                  width: "47px",
                  height: "24px",
                  backgroundColor: isOnEmailNoti ? "#00C389" : "#ccc",
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
                    transform: isOnEmailNoti
                      ? "translateX(23px)"
                      : "translateX(0px)",
                  }}
                ></div>
              </div>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "500" }}>MSMS Notification</span>
            <span>
              {" "}
              <div
                onClick={() => setIsOnMsmsNoti(!isOnMsmsNoti)}
                style={{
                  width: "47px",
                  height: "24px",
                  backgroundColor: isOnMsmsNoti ? "#00C389" : "#ccc",
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
                    transform: isOnMsmsNoti
                      ? "translateX(23px)"
                      : "translateX(0px)",
                  }}
                ></div>
              </div>
            </span>
          </div>

          <table style={{ border: "1px solid rgb(211, 211, 211)" }}>
            <thead
              style={{
                border: "1px solid rgb(211, 211, 211)",
                backgroundColor: "#f1f1f1",
                color: "#444343",
              }}
            >
              <tr>
                <th style={{ padding: "15px 10px" }}>General Notification</th>
                <th style={{ padding: "15px 10px" }}>Push</th>
                <th style={{ padding: "15px 10px" }}>SMS</th>
                <th style={{ padding: "15px 10px" }}>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ border: "1px solid rgb(211, 211, 211)" }}>
                <td style={{ padding: "15px 10px" }}>Payment</td>
                <td style={{ padding: "15px 10px" }}>
                  {" "}
                  <div
                    onClick={() => setIsOnPush(!isOnPush)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnPush ? "#00C389" : "#ccc",
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
                        transform: isOnPush
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnSms(!isOnSms)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnSms ? "#00C389" : "#ccc",
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
                        transform: isOnSms
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnEmail(!isOnEmail)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnEmail ? "#00C389" : "#ccc",
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
                        transform: isOnEmail
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
              <tr style={{ border: "1px solid rgb(211, 211, 211)" }}>
                <td style={{ padding: "15px 10px" }}>Transaction</td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnPush2(!isOnPush2)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnPush2 ? "#00C389" : "#ccc",
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
                        transform: isOnPush2
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnSms2(!isOnSms2)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnSms2 ? "#00C389" : "#ccc",
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
                        transform: isOnSms2
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnEmail2(!isOnEmail2)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnEmail2 ? "#00C389" : "#ccc",
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
                        transform: isOnEmail2
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "15px 10px" }}>Email Verification</td>
                <td style={{ padding: "15px 10px" }}>
                  {" "}
                  <div
                    onClick={() => setIsOnPush3(!isOnPush3)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnPush3 ? "#00C389" : "#ccc",
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
                        transform: isOnPush3
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnSms3(!isOnSms3)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnSms3 ? "#00C389" : "#ccc",
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
                        transform: isOnSms3
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnEmail3(!isOnEmail3)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnEmail3 ? "#00C389" : "#ccc",
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
                        transform: isOnEmail3
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
              <tr style={{ border: "1px solid rgb(211, 211, 211)" }}>
                <td style={{ padding: "15px 10px" }}>OTP</td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnPush4(!isOnPush4)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnPush4 ? "#00C389" : "#ccc",
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
                        transform: isOnPush4
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnSms4(!isOnSms4)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnSms4 ? "#00C389" : "#ccc",
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
                        transform: isOnSms4
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnEmail4(!isOnEmail4)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnEmail4 ? "#00C389" : "#ccc",
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
                        transform: isOnEmail4
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
              <tr style={{ border: "1px solid rgb(211, 211, 211)" }}>
                <td style={{ padding: "15px 10px" }}>Activity</td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnPush5(!isOnPush5)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnPush5 ? "#00C389" : "#ccc",
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
                        transform: isOnPush5
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnSms5(!isOnSms5)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnSms5 ? "#00C389" : "#ccc",
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
                        transform: isOnSms5
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <div
                    onClick={() => setIsOnEmail5(!isOnEmail5)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnEmail5 ? "#00C389" : "#ccc",
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
                        transform: isOnEmail5
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
              <tr style={{ border: "1px solid rgb(211, 211, 211)" }}>
                <td style={{ padding: "15px 10px" }}>Account</td>
                <td style={{ padding: "15px 10px" }}>
                     <div
                    onClick={() => setIsOnPush6(!isOnPush6)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnPush6 ? "#00C389" : "#ccc",
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
                        transform: isOnPush6
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                    <div
                    onClick={() => setIsOnSms6(!isOnSms6)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnSms6 ? "#00C389" : "#ccc",
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
                        transform: isOnSms6
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
                <td style={{ padding: "15px 10px" }}>
                     <div
                    onClick={() => setIsOnEmail6(!isOnEmail6)}
                    style={{
                      width: "47px",
                      height: "24px",
                      backgroundColor: isOnEmail6 ? "#00C389" : "#ccc",
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
                        transform: isOnEmail6
                          ? "translateX(23px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notification;
