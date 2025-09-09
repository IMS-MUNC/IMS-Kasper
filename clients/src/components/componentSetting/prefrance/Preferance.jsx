import React, { useState } from 'react'

const Preferance = () => {
     const [isOnPrefMaintanace, setIsOnPrefMaintanace] = useState(false);
  const [isOnPrefCoupon, setIsOnPrefCoupon] = useState(false);
  const [isOnPrefOffers, setIsOnPrefOffers] = useState(false);
  const [isOnMultiLanguage, setIsOnMultiLanguage] = useState(false);
  const [isOnMultiCurrency, setIsOnMultiCurrency] = useState(false);
  const [isOnSMS, setIsOnSMS] = useState(false);
  const [isOnStores, setIsOnStores] = useState(false);
  const [isOnWarehouses, setIsOnWarehouses] = useState(false);
  const [isOnBarcode, setIsOnBarcode] = useState(false);
  const [isOnQRCode, setIsOnQRCode] = useState(false);
  const [isOnHRMS, setIsOnHRMS] = useState(false);
  return (
    <div>
        <div className="preferance-container"
           style={{
          backgroundColor: "white",
          borderRadius: "5px",
          border: "1px solid rgb(211, 211, 211)",
        }}
        >
             <div>
          <h1 className="py-2 px-3" style={{ fontSize: "17px" }}>
            Preferance
          </h1>
          <hr style={{ margin: "0" }} />
        </div>

        <div className="preferance-content px-3 py-3" style={{display:"flex", flexDirection:"column", gap:"20px"}}>
            <div style={{display:"flex", justifyContent:"space-between", gap:"20px"}}>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <span>Maintenance Mode</span>
                      <div
                  onClick={() => setIsOnPrefMaintanace(!isOnPrefMaintanace)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnPrefMaintanace ? "#00C389" : "#ccc",
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
                      transform: isOnPrefMaintanace
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <span>Copoun</span>
                      <div
                  onClick={() => setIsOnPrefCoupon(!isOnPrefCoupon)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnPrefCoupon ? "#00C389" : "#ccc",
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
                      transform: isOnPrefCoupon
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <span>Offers</span>
                      <div
                  onClick={() => setIsOnPrefOffers(!isOnPrefOffers)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnPrefOffers ? "#00C389" : "#ccc",
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
                      transform: isOnPrefOffers
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", gap:"20px"}}>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <span>MultiLanguage</span>
                      <div
                  onClick={() => setIsOnMultiLanguage(!isOnMultiLanguage)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnMultiLanguage ? "#00C389" : "#ccc",
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
                      transform: isOnMultiLanguage
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <span>Multicurrency</span>
                      <div
                  onClick={() => setIsOnMultiCurrency(!isOnMultiCurrency)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnMultiCurrency ? "#00C389" : "#ccc",
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
                      transform: isOnMultiCurrency
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <span>SMS</span>
                      <div
                  onClick={() => setIsOnSMS(!isOnSMS)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnSMS ? "#00C389" : "#ccc",
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
                      transform: isOnSMS
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", gap:"20px"}}>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <span>Stores</span>
                      <div
                  onClick={() => setIsOnStores(!isOnStores)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnStores ? "#00C389" : "#ccc",
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
                      transform: isOnStores
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <span>Warehouses</span>
                      <div
                  onClick={() => setIsOnWarehouses(!isOnWarehouses)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnWarehouses ? "#00C389" : "#ccc",
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
                      transform: isOnWarehouses
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <span>Barcode</span>
                      <div
                  onClick={() => setIsOnBarcode(!isOnBarcode)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnBarcode ? "#00C389" : "#ccc",
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
                      transform: isOnBarcode
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
            </div>
            <div style={{display:"flex",  gap:"20px"}}>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"32%"}}>
                    <span>QR Code</span>
                      <div
                  onClick={() => setIsOnQRCode(!isOnQRCode)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnQRCode ? "#00C389" : "#ccc",
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
                      transform: isOnQRCode
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
                <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"20px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"32%"}}>
                    <span>HRMS</span>
                      <div
                  onClick={() => setIsOnHRMS(!isOnHRMS)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnHRMS ? "#00C389" : "#ccc",
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
                      transform: isOnHRMS
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div>
                {/* <div style={{
          border: "1px solid rgb(211, 211, 211)", padding:"10px 15px", borderRadius:"5px",display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <span>Offers</span>
                      <div
                  onClick={() => setIsOnPrefOffers(!isOnPrefOffers)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnPrefOffers ? "#00C389" : "#ccc",
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
                      transform: isOnPrefOffers
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                </div> */}
            </div>
             <div style={{display:"flex", justifyContent:"end", gap:"10px"}}>
              <button className="settingbtn" style={{border:"none", padding:"10px", backgroundColor:"#81BDff", color:"white", borderRadius:"5px"}}>Cancel</button>
              <button className="settingbtn" style={{border:"none", padding:"10px", backgroundColor:"#007AFF", color:"white", borderRadius:"5px"}}>Save Changes</button>
            </div>
        </div>

        </div>
    </div>
  )
}

export default Preferance