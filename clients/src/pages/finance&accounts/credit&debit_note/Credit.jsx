import React, { useState, useEffect } from "react";
import { MdNavigateNext } from "react-icons/md";
import "./Credit.css";

const Credit = () => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const imageUrl = localStorage.getItem("previewImage");
    if (imageUrl) {
      setPreviewUrl(imageUrl);
    }
  }, []);
  return (
   <div className="page-wrapper">\
   <div className="content">
     <div>
      <div>
        <span
          style={{
            color: "#676767",
            fontSize: "18px",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: "500",
          }}
        >
          Accounting & Finance
          <MdNavigateNext />
        </span>
        {/* <span style={{color:"#676767", fontSize:"18px", fontFamily:'"Roboto", sans-serif',fontWeight:"500"}}>Expense Report<MdNavigateNext /></span> */}
        <span
          style={{
            color: "#262626",
            fontSize: "18px",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: "500",
          }}
        >
          (Customer Name)
        </span>
      </div>
      <div
        className="d-flex gap-3"
        style={{ margin: "20px auto", width: "1000px",}}
      >
        <div style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",borderRadius:"8px" }}>
          <div
            style={{
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#262626",
                  fontSize: "18px",
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: "500",
                }}
              >
                Credit Note
              </span>
              <span
                style={{
                  color: "#262626",
                  fontSize: "18px",
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: "400",
                }}
              >
                12/08/2025
              </span>
            </div>
            <div className="d-flex justify-content-between gap-2">
              <div className="d-flex flex-column">
                <span
                  style={{
                    color: "#262626",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "500",
                  }}
                >
                  Customer
                </span>
                <span
                  style={{
                    color: "#676767",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "500",
                  }}
                >
                  Tea
                </span>
              </div>
              <div className="d-flex flex-column">
                <span
                  style={{
                    color: "#262626",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "500",
                  }}
                >
                  Invoice No.
                </span>
                <span
                  style={{
                    color: "#676767",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "500",
                  }}
                >
                  BNA1231
                </span>
              </div>
              <div className="d-flex flex-column">
                <span
                  style={{
                    color: "#262626",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "500",
                  }}
                >
                  Total Amount
                </span>
                <span
                  style={{
                    color: "#676767",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "500",
                  }}
                >
                  ₹ 87,987.00
                </span>
              </div>
            </div>
            <div className="d-flex flex-column">
              <label
                htmlFor=""
                style={{
                  color: "#262626",
                  fontSize: "16px",
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: "500",
                }}
              >
                Reason
              </label>
              <select id="reason" name="reason" class="reason-select">
                <option value="">Select Reason</option>
                <option value="damaged">Damaged Product</option>
                <option value="wrong-item">Wrong Item Received</option>
                <option value="late-delivery">Late Delivery</option>
                <option value="quality-issue">Quality Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <table
              className="table-container-credit"
              style={{
                border: "1px solid #F1F1F1",
                borderRadius: "8px",
                fontFamily: '"Roboto", sans-serif',
                
              }}
            >
              <thead
                style={{ backgroundColor: "#F1F1F1", borderRadius: "8px" }}
              >
                <tr style={{}}>
                  <th style={{ padding: "10px 50px", color: "#676767" }}>
                    Product For Return
                  </th>
                  <th style={{ padding: "10px  50px ", color: "#676767" }}>
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <td
                    style={{
                      padding: "15px 50px",
                      color: "#676767",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <span>
                      <input  type="checkbox" className="checkbox-credit"/>
                    </span>
                    Denim Jeans
                  </td>
                  <td style={{ padding: "15px 50px", color: "#676767" }}>
                    <span>
                      <input style={{border:"1px solid #F1F1F1", outline:"none", borderRadius:"8px", padding:"8px 20px"}} type="text" placeholder="2" />
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "15px 50px",
                      color: "#676767",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <span>
                      <input type="checkbox" className="checkbox-credit"/>
                    </span>
                   Touser
                  </td>
                  <td style={{ padding: "15px 50px", color: "#676767" }}>
                    <span>
                      <input style={{border:"1px solid #F1F1F1", outline:"none", borderRadius:"8px", padding:"8px 20px"}} type="text" placeholder="0" />
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "15px 50px",
                      color: "#676767",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <span>
                      <input type="checkbox" className="checkbox-credit"/>
                    </span>
                    Tshirt
                  </td>
                  <td style={{ padding: "15px 50px", color: "#676767" }}>
                    <span>
                      <input style={{border:"1px solid #F1F1F1", outline:"none", borderRadius:"8px", padding:"8px 20px"}} type="text" placeholder="2" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
           
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column">
                <span
                  style={{
                    color: "#262626",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "400",
                  }}
                >
                  Payment Mode
                </span>
                <span
                  style={{
                    color: "#676767",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "400",
                  }}
                >
                  UPI
                </span>
              </div>
              <div className="d-flex flex-column">
                <span
                  style={{
                    color: "#262626",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "400",
                  }}
                >
                  Paid To
                </span>
                <span
                  style={{
                    color: "#676767",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "400",
                  }}
                >
                  Shop
                </span>
              </div>
              <div className="d-flex flex-column">
                <span
                  style={{
                    color: "#262626",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "400",
                  }}
                >
                  Amount
                </span>
                <span
                  style={{
                    color: "#676767",
                    fontSize: "16px",
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "400",
                  }}
                >
                  Chair
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "white",
              margin: "20px auto",
              width: "800px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div
              style={{
                color: "#262626",
                fontSize: "16px",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: "500",
              }}
            >
              <span>Receipt Image</span>
            </div>

            <div>
              <span
                style={{
                  color: "#262626",
                  fontSize: "16px",
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: "400",
                }}
              >
                Invoice
              </span>
              <div
                style={{
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "14px",
                  border: "2px dashed #C2C2C2",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  height: "200px",
                  color: "#676767",
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Uploaded"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                ) : (
                  "No image uploaded"
                )}
              </div>
            </div>
             <div className="d-flex flex-column gap-2">
              <span
                style={{
                  color: "#262626",
                  fontSize: "16px",
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: "500",
                }}
              >
                Notes
              </span>
              <textarea
                name=""
                id=""
                placeholder="For Office guest"
                style={{
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "14px",
                  border: "2px dashed #C2C2C2",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  height: "120px",
                  color: "#676767",
                  backgroundColor: "#FBFBFB",
                }}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3">
         
           <select name="" id=""  style={{
              border: "1px solid #676767",
              backgroundColor: "#69E277",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              width: "90px",
              height: "30px",
              borderRadius: "4px",
              outline:"none"
            }}>
            <option value="">Returned</option>
            <option value="">Refund</option>
           </select>
          <button
            style={{
              border: "none",
              backgroundColor: "#464545ff",
              color: "white",
              borderRadius: "4px",
              width: "40px",
              height: "30px",
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
   </div>
   </div>
  );
};

export default Credit;
