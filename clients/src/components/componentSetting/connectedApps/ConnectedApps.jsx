import React, { useState } from "react";
import calebdar_logo from "../../../assets/images/calendar.svg"
import figma_logo from "../../../assets/images/figma.svg"
import dropbox_logo from "../../../assets/images/dropbox.svg"
import stack_logo from "../../../assets/images/stack.svg"
import github_logo from "../../../assets/images/github.svg"
import email_logo from "../../../assets/images/email.svg"
const ConnectedApps = () => {
  const [isOnCalendar, setIsOnCalendar] = useState(false);
  const [isOnFigma, setIsOnFigma] = useState(false);
  const [isOnDropbox, setIsOnDropbox] = useState(false);
  const [isOnStack, setIsOnStack] = useState(false);
  const [isOnGithub, setIsOnGithub] = useState(false);
  const [isOnEmail, setIsOnEmail] = useState(false);
  return (
    <div>
      <div
        className="connected-apps-container"
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          border: "1px solid rgb(211, 211, 211)",
        }}
      >
        <div>
          <h1 className="py-2 px-3" style={{ fontSize: "17px" }}>
            Connected Apps
          </h1>
          <hr style={{ margin: "0" }} />
        </div>
        <div className="connected-apss-content py-3 px-3" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{
                border: "1px solid rgb(211, 211, 211)",
                padding: "5px 15px",
                width: "100%",
                height: "150px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <img style={{ width: "15%" }} src={calebdar_logo} alt="calebdar_logo" />
                <button style={{ border: "1px solid #007AFF", color: "#007AFF", backgroundColor: "white", height: "30px", borderRadius: "5px" }}>Connected</button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <span>Calendar</span>
                <div
                  onClick={() => setIsOnCalendar(!isOnCalendar)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnCalendar ? "#00C389" : "#ccc",
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
                      transform: isOnCalendar ? "translateX(23px)" : "translateX(0px)",
                    }}
                  ></div>
                </div>

              </div>
            </div>

            <div
              style={{
                border: "1px solid rgb(211, 211, 211)",
                padding: "5px 15px",
                width: "100%",
                height: "150px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <img style={{ width: "15%" }} src={figma_logo} alt="calebdar_logo" />
                <button style={{ border: "1px solid #007AFF", color: "#007AFF", backgroundColor: "white", height: "30px", borderRadius: "5px" }}>Connected</button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <span>Figma</span>
                <div
                  onClick={() => setIsOnFigma(!isOnFigma)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnFigma ? "#00C389" : "#ccc",
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
                      transform: isOnFigma ? "translateX(23px)" : "translateX(0px)",
                    }}
                  ></div>
                </div>

              </div>
            </div>

            <div
              style={{
                border: "1px solid rgb(211, 211, 211)",
                padding: "5px 15px",
                width: "100%",
                height: "150px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <img style={{ width: "15%" }} src={dropbox_logo} alt="calebdar_logo" />
                <button style={{ border: "1px solid #007AFF", color: "#007AFF", backgroundColor: "white", height: "30px", borderRadius: "5px" }}>Connected</button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <span>Dropbox</span>
                <div
                  onClick={() => setIsOnDropbox(!isOnDropbox)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnDropbox ? "#00C389" : "#ccc",
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
                      transform: isOnDropbox ? "translateX(23px)" : "translateX(0px)",
                    }}
                  ></div>
                </div>

              </div>
            </div>

          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{
                border: "1px solid rgb(211, 211, 211)",
                padding: "5px 15px",
                width: "100%",
                height: "150px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <img style={{ width: "15%" }} src={stack_logo} alt="calebdar_logo" />
                <button style={{ border: "1px solid #007AFF", color: "#007AFF", backgroundColor: "white", height: "30px", borderRadius: "5px" }}>Connected</button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <span>Stack</span>
                <div
                  onClick={() => setIsOnStack(!isOnStack)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnStack ? "#00C389" : "#ccc",
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
                      transform: isOnStack ? "translateX(23px)" : "translateX(0px)",
                    }}
                  ></div>
                </div>

              </div>
            </div>

            <div
              style={{
                border: "1px solid rgb(211, 211, 211)",
                padding: "5px 15px",
                width: "100%",
                height: "150px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <img style={{ width: "15%" }} src={github_logo} alt="calebdar_logo" />
                <button style={{ border: "1px solid #007AFF", color: "#007AFF", backgroundColor: "white", height: "30px", borderRadius: "5px" }}>Connected</button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <span>Github</span>
                <div
                  onClick={() => setIsOnGithub(!isOnGithub)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnGithub ? "#00C389" : "#ccc",
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
                      transform: isOnGithub ? "translateX(23px)" : "translateX(0px)",
                    }}
                  ></div>
                </div>

              </div>
            </div>

            <div
              style={{
                border: "1px solid rgb(211, 211, 211)",
                padding: "5px 15px",
                width: "100%",
                height: "150px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <img style={{ width: "15%" }} src={email_logo} alt="calebdar_logo" />
                <button style={{ border: "1px solid #007AFF", color: "#007AFF", backgroundColor: "white", height: "30px", borderRadius: "5px" }}>Connected</button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <span>Email</span>
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
                      transform: isOnEmail ? "translateX(23px)" : "translateX(0px)",
                    }}
                  ></div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedApps;
