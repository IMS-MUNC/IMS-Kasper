import React, { useState } from "react";
import fb from "../../../assets/images/fb.svg";
import twitter from "../../../assets/images/tw.svg";
import linkdln from "../../../assets/images/linkdln.svg";
import google from "../../../assets/images/google.svg";
import { TbTool } from "react-icons/tb";

const SocialAuthentications = () => {
  const [isOnFb, setIsOnFb] = useState(false);
  const [isOnTw, setIsOnTw] = useState(false);
  const [isOnLin, setIsOnLin] = useState(false);
  const [isOnGoogle, setIsOnGoogle] = useState(false);
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
            Social Authentication
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
                borderRadius:"5px"
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
                    <img src={fb} alt="captcha" />
                  </span>
                  <span>Facebook</span>
                </div>
              
                <div>
                     <button  style={{border:"1px solid #007AFF", color:"#007AFF",backgroundColor:"white", borderRadius:"5px "}}>Connected</button>
                </div>
              </div>
              <p style={{ margin: "0", color: "#646363" }}>
                Connect with friends, family and share updates, photos, moments with people you know.
              </p>
               <hr />
               <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <button
                  className="system-settings-btn"
                  style={{
                    border: "none",
                    backgroundColor: "#007AFF",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    display:"flex",
                    alignItems:'center'
                  }}
                >
                 <TbTool /> View Integration
                </button>
              </div>
                <div
                  onClick={() => setIsOnFb(!isOnFb)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnFb ? "#00C389" : "#ccc",
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
                      transform: isOnFb
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
               </div>
            </div>
           <div
              className="system-settings-box"
              style={{
                padding: "20px 15px",
                border: "1px solid rgb(211, 211, 211)",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                borderRadius:"5px"
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
                    <img src={twitter} alt="captcha" />
                  </span>
                  <span>Twitter</span>
                </div>
              
                <div>
                     <button  style={{border:"1px solid #007AFF", color:"#007AFF",backgroundColor:"white", borderRadius:"5px "}}>Not Connected</button>
                </div>
              </div>
              <p style={{ margin: "0", color: "#646363" }}>
              Communicate and stay connected through the exchange of quick, frequent messages
              </p>
               <hr />
               <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <button
                  className="system-settings-btn"
                  style={{
                    border: "none",
                    backgroundColor: "#007AFF",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    display:"flex",
                    alignItems:'center'
                  }}
                >
                 <TbTool /> View Integration
                </button>
              </div>
                <div
                  onClick={() => setIsOnTw(!isOnTw)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnTw ? "#00C389" : "#ccc",
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
                      transform: isOnTw
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
               </div>
            </div>
          </div>
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
                borderRadius:"5px"
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
                    <img src={linkdln} alt="captcha" />
                  </span>
                  <span>Linkedin</span>
                </div>
              
                <div>
                     <button  style={{border:"1px solid #007AFF", color:"#007AFF",backgroundColor:"white", borderRadius:"5px "}}>Connected</button>
                </div>
              </div>
              <p style={{ margin: "0", color: "#646363" }}>
                Network with people and professional organizations in your industry.
              </p>
               <hr />
               <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <button
                  className="system-settings-btn"
                  style={{
                    border: "none",
                    backgroundColor: "#007AFF",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    display:"flex",
                    alignItems:'center'
                  }}
                >
                 <TbTool /> Connect Now
                </button>
              </div>
                <div
                  onClick={() => setIsOnLin(!isOnLin)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnLin ? "#00C389" : "#ccc",
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
                      transform: isOnLin
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
               </div>
            </div>
           <div
              className="system-settings-box"
              style={{
                padding: "20px 15px",
                border: "1px solid rgb(211, 211, 211)",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                borderRadius:"5px"
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
                    <img src={google} alt="captcha" />
                  </span>
                  <span>Google</span>
                </div>
              
                <div>
                     <button  style={{border:"1px solid #007AFF", color:"#007AFF",backgroundColor:"white", borderRadius:"5px "}}>Connected</button>
                </div>
              </div>
              <p style={{ margin: "0", color: "#646363" }}>
                Google has many special features to help you find exactly what you're looking for.
              </p>
               <hr />
               <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <button
                  className="system-settings-btn"
                  style={{
                    border: "none",
                    backgroundColor: "#007AFF",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    display:"flex",
                    alignItems:'center'
                  }}
                >
                 <TbTool /> View Integration
                </button>
              </div>
                <div
                  onClick={() => setIsOnGoogle(!isOnGoogle)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnGoogle ? "#00C389" : "#ccc",
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
                      transform: isOnGoogle
                        ? "translateX(23px)"
                        : "translateX(0px)",
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

export default SocialAuthentications;
