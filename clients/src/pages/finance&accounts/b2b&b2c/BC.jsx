import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css
import calendarIcon from "../../../assets/img/date.png";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const BC = () => {
  const data = [
    //  { invoiceNo: "1232", buyerBusinessName:"ABC Pvt Ltd", gstNo: "27AAJCB1234C1Z", date: "21-Jul-25", products: "Paint Buckets", qty: "100 Pcs",amount:"₹38393",tax:"₹348",total:"₹5433.08" ,status:"Partial",receivedAmount:"₹8767",paymentMode:"UPI"},
    //  { invoiceNo: "1332", buyerBusinessName: "Shivam Traders", gstNo: "07BTRP2341N1Y", date: "21-Jul-25", products: "Paint Buckets", qty: "2000 Bags",amount:"₹38393",tax:"₹348",total:"₹5433 .08",status:"Paid",receivedAmount:"₹8767",paymentMode:"Cheque" },
    //  { invoiceNo: "1232", buyerBusinessName: "GreenMart Ltd", gstNo: "07BTRP2341N1Y", date: "21-Jul-25", products: "Cements", qty: "100 Pcs",amount:"₹38393",tax:"₹348",total:"₹5433 .08",status:"Partial",receivedAmount:"₹8767",paymentMode:"UPI" },
    //  { invoiceNo: "1232", buyerBusinessName: "Shivam Traders", gstNo: "07BTRP2341N1Y", date: "22-Jul-25", products: "Cements", qty: "2000 Bags",amount:"₹38393",tax:"₹348",total:"₹5433.08" ,status:"Partial",receivedAmount:"₹8767",paymentMode:"Cheque"},
    //  { invoiceNo: "132", buyerBusinessName: "ABC Pvt Ltd", gstNo: "09JKJH4231A8X", date: "22-Jul-25", products: "Plywoods 19mm", qty: "100 Pcs",amount:"₹38339",tax:"₹348",total:"₹5433.08" ,status:"Paid",receivedAmount:"₹8767",paymentMode:""},
    //  { invoiceNo: "1432", buyerBusinessName: "Shivam Traders", gstNo: "09JKJH4231A8X", date: "23-Jul-25", products: "Plywoods 19mm", qty: "100 Pcs",amount:"₹3839.4",tax:"₹348",total:"₹5433.08" ,status:"Due",receivedAmount:"₹8767",paymentMode:"UPI"},
  ];
  const data2 = [
    //  { invoiceNo: "1232", buyerBusinessName:"ABC Pvt Ltd", gstNo: "27AAJCB1234C1Z", date: "21-Jul-25", products: "Paint Buckets", qty: "100 Pcs",amount:"₹38393",tax:"₹348",total:"₹5433.08" ,status:"Partial",receivedAmount:"₹8767",paymentMode:"UPI"},
    //  { invoiceNo: "1332", buyerBusinessName: "Shivam Traders", gstNo: "07BTRP2341N1Y", date: "21-Jul-25", products: "Paint Buckets", qty: "",amount:"₹38393",tax:"₹348",total:"₹5433 .08",status:"Paid",receivedAmount:"₹8767",paymentMode:"Cheque" },
    //  { invoiceNo: "", buyerBusinessName: "GreenMart Ltd", gstNo: "07BTRP2341N1Y", date: "21-Jul-25", products: "", qty: "100 Pcs",amount:"₹38393",tax:"₹348",total:"₹5433 .08",status:"Partial",receivedAmount:"----",paymentMode:"UPI" },
    //  { invoiceNo: "", buyerBusinessName: "", gstNo: "07BTRP2341N1Y", date: "22-Jul-25", products: "Cements", qty: "2000 Bags",amount:"₹38393",tax:"₹348",total:"₹5433.08" ,status:"Partial",receivedAmount:"----",paymentMode:"Cheque"},
  ];
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-03-31"),
      key: "selection",
    },
  ]);

  const handleChange = (item) => {
    setRange([item.selection]);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const [activeTable, setActiveTable] = useState("b2b");
  const handleExport = () => {
    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OverdueReport");

    // Write the workbook and save as Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "OverdueReport.xlsx");
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E6E6E6",
            borderRadius: "8px",
          }}
        >
          <div
            className="d-flex justify-content-between"
            style={{ padding: "20px" }}
          >
            <span
              style={{
                color: "#262626",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: "500",
                fontSize: "18px",
              }}
            >
              B2B & B2C Report
            </span>
            <button
              onClick={handleExport}
              style={{
                border: "none",
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                borderRadius: "4px",
                padding: "5px 8px",
                color: "#676767",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: '"Roboto", sans-serif',
              }}
            >
              Export
            </button>
          </div>
          <div style={{ border: "1px solid #E6E6E6" }}></div>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ padding: "15px 20px" }}
          >
            <div
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontWeight: "400",
                fontSize: "16px",
              }}
            >
              <button
                style={{
                  border: "none",
                  backgroundColor: activeTable === "b2b" ? "#E6E6E6" : "white",
                  color: "#262626",
                  padding: "3px 7px",
                }}
                onClick={() => setActiveTable("b2b")}
              >
                B2B
              </button>
              <button
                style={{
                  border: "none",
                  backgroundColor: activeTable === "b2c" ? "#E6E6E6" : "white",
                  color: "#262626",
                  padding: "3px 7px",
                }}
                onClick={() => setActiveTable("b2c")}
              >
                B2C
              </button>
            </div>
            <div style={{ position: "relative", fontFamily: "Arial" }}>
              <div
                onClick={toggleCalendar}
                style={{
                  border: "1px solid #E6E6E6",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  width: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  backgroundColor: "white",
                }}
              >
                <span style={{ fontSize: "14px", color: "#333" }}>
                  {format(range[0].startDate, "dd/MM/yyyy")} -{" "}
                  {format(range[0].endDate, "dd/MM/yyyy")}
                </span>
                <img
                  src={calendarIcon}
                  alt="calendar"
                  style={{ width: "18px", height: "18px" }}
                />
              </div>

              {showCalendar && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 999,
                    marginTop: "10px",
                    right: "50px",
                  }}
                >
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleChange}
                    moveRangeOnFirstSelection={false}
                    ranges={range}
                    rangeColors={["#1368EC"]}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className="table-responsive"
            style={{ display: activeTable === "b2b" ? "block" : "none" }}
          >
            <table className="table datatable">
              <thead className="thead-light">
                <tr>
                  <th style={{ padding: "15px 20px" }}>
                    <input type="checkbox" />
                  </th>
                  <th style={{ padding: "15px 20px" }}>Invoice no.</th>
                  <th style={{ padding: "15px 20px" }}>Buyer Business Name</th>
                  <th style={{ padding: "15px 20px" }}>GST No.</th>
                  <th style={{ padding: "15px 20px" }}>Date</th>
                  <th style={{ padding: "15px 20px" }}>Products</th>
                  <th style={{ padding: "15px 20px" }}>QTY</th>
                  <th style={{ padding: "15px 20px" }}>Amount</th>
                  <th style={{ padding: "15px 20px" }}>Tax</th>
                  <th style={{ padding: "15px 20px" }}>Total</th>
                  <th style={{ padding: "15px 20px" }}>Status</th>
                  <th style={{ padding: "15px 20px" }}>Received Amount</th>
                  <th style={{ padding: "15px 20px" }}>Payment Mode</th>
                </tr>
              </thead>
              <tbody className="sales-list">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="13"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No B2B found
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #E6E6E6" }}
                    >
                      <td style={{ padding: "10px 20px" }}>
                        <input type="checkbox" />
                      </td>
                      <td style={{ padding: "10px 20px" }}>{item.invoiceNo}</td>
                      <td style={{ padding: "10px 20px" }}>
                        {item.buyerBusinessName}
                      </td>
                      <td style={{ padding: "10px 20px" }}>{item.gstNo}</td>
                      <td style={{ padding: "10px 20px" }}>{item.date}</td>
                      <td style={{ padding: "10px 20px" }}>{item.products}</td>
                      <td style={{ padding: "10px 20px" }}>{item.qty}</td>
                      <td style={{ padding: "10px 20px" }}>{item.amount}</td>
                      <td style={{ padding: "10px 20px" }}>{item.tax}</td>
                      <td style={{ padding: "10px 20px" }}>{item.total}</td>
                      <td style={{ padding: "10px 20px" }}>
                        <span
                          style={{
                            padding: "5px",
                            borderRadius: "5px",
                            backgroundColor:
                              item.status === "Partial"
                                ? "#FDFFE4"
                                : item.status === "Paid"
                                ? "#DFFFE0"
                                : item.status === "Due"
                                ? "#FCE4E6"
                                : "",
                            color:
                              item.status === "Partial"
                                ? "#636D1D"
                                : item.status === "Paid"
                                ? "#1E4921"
                                : item.status === "Due"
                                ? "#491E1F"
                                : "",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 20px" }}>
                        {item.receivedAmount}
                      </td>
                      <td style={{ padding: "10px 20px" }}>
                        {item.paymentMode}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div
            className="table-responsive"
            style={{ display: activeTable === "b2c" ? "block" : "none" }}
          >
            <table className="table datatable">
              <thead className="thead-light">
                <tr>
                  <th style={{ padding: "15px 20px" }}>
                    <input type="checkbox" />
                  </th>
                  <th style={{ padding: "15px 20px" }}>Invoice no.</th>
                  <th style={{ padding: "15px 20px" }}>Buyer Business Name</th>
                  <th style={{ padding: "15px 20px" }}>GST No.</th>
                  <th style={{ padding: "15px 20px" }}>Date</th>
                  <th style={{ padding: "15px 20px" }}>Products</th>
                  <th style={{ padding: "15px 20px" }}>QTY</th>
                  <th style={{ padding: "15px 20px" }}>Amount</th>
                  <th style={{ padding: "15px 20px" }}>Tax</th>
                  <th style={{ padding: "15px 20px" }}>Total</th>
                  <th style={{ padding: "15px 20px" }}>Status</th>
                  <th style={{ padding: "15px 20px" }}>Received Amount</th>
                  <th style={{ padding: "15px 20px" }}>Payment Mode</th>
                </tr>
              </thead>
              <tbody className="sales-list">
                {data2.length === 0 ? (
                  <tr>
                    <td
                      colSpan="13"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No B2C found
                    </td>
                  </tr>
                ) : (
                  data2.map((item, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #E6E6E6" }}
                    >
                      <td style={{ padding: "10px 20px" }}>
                        <input type="checkbox" />
                      </td>
                      <td style={{ padding: "10px 20px" }}>{item.invoiceNo}</td>
                      <td style={{ padding: "10px 20px" }}>
                        {item.buyerBusinessName}
                      </td>
                      <td style={{ padding: "10px 20px" }}>{item.gstNo}</td>
                      <td style={{ padding: "10px 20px" }}>{item.date}</td>
                      <td style={{ padding: "10px 20px" }}>{item.products}</td>
                      <td style={{ padding: "10px 20px" }}>{item.qty}</td>
                      <td style={{ padding: "10px 20px" }}>{item.amount}</td>
                      <td style={{ padding: "10px 20px" }}>{item.tax}</td>
                      <td style={{ padding: "10px 20px" }}>{item.total}</td>
                      <td style={{ padding: "10px 20px" }}>
                        <span
                          style={{
                            padding: "5px",
                            borderRadius: "5px",
                            backgroundColor:
                              item.status === "Partial"
                                ? "#FDFFE4"
                                : item.status === "Paid"
                                ? "#DFFFE0"
                                : item.status === "Due"
                                ? "#FCE4E6"
                                : "",
                            color:
                              item.status === "Partial"
                                ? "#636D1D"
                                : item.status === "Paid"
                                ? "#1E4921"
                                : item.status === "Due"
                                ? "#491E1F"
                                : "",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 20px" }}>
                        {item.receivedAmount}
                      </td>
                      <td style={{ padding: "10px 20px" }}>
                        {item.paymentMode}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            className="d-flex justify-content-end gap-3"
            style={{ padding: "10px 50px" }}
          >
            <span
              style={{
                backgroundColor: "white",
                boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
                padding: "7px",
                borderRadius: "5px",
                border: "1px solid #e4e0e0ff",
              }}
            >
              10 <span style={{ color: "grey" }}>per page</span>
            </span>
            <span
              style={{
                backgroundColor: "white",
                boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
                padding: "7px",
                borderRadius: "5px",
                border: "1px solid #e4e0e0ff",
              }}
            >
              1-4 <span style={{ color: "grey" }}>of 4</span>{" "}
              <button
                style={{
                  border: "none",
                  color: "grey",
                  backgroundColor: "white",
                }}
              >
                <GrFormPrevious />
              </button>{" "}
              <button style={{ border: "none", backgroundColor: "white" }}>
                <MdNavigateNext />
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BC;
