import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import calendarIcon from "../../../assets/img/date.png";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PaymentHistory = () => {
  const data = [
    // {
    //   date: "12 Jul 2025",
    //   from: "Electricity",
    //   type: "Short Circuit",
    //   invoiceNo: "UPI",
    //   amount: "Shop",
    //   paymentMode: "UPI",
    //   status: "Due",
    // },
    // {
    //   date: "12 Jul 2025",
    //   from: "Electricity",
    //   type: "Short Circuit",
    //   invoiceNo: "UPI",
    //   amount: "Shop",
    //   paymentMode: "UPI",
    //   status: "Paid",
    // },
    // {
    //   date: "12 Jul 2025",
    //   from: "Electricity",
    //   type: "Short Circuit",
    //   invoiceNo: "UPI",
    //   amount: "Shop",
    //   paymentMode: "UPI",
    //   status: "Paid",
    //   actions: "₹3839",
    // },
    // {
    //   date: "12 Jul 2025",
    //   from: "Electricity",
    //   type: "Short Circuit",
    //   invoiceNo: "UPI",
    //   amount: "Shop",
    //   paymentMode: "UPI",
    //   status: "Due",
    // },
    // {
    //   date: "12 Jul 2025",
    //   from: "Electricity",
    //   type: "Short Circuit",
    //   invoiceNo: "UPI",
    //   amount: "Shop",
    //   paymentMode: "UPI",
    //   status: "Paid",
    // },
  ];
  const data2 = [
    // {
    //   date: "12 Jul 2025",
    //   to: "Electricity",
    //   type: "Short Circuit",
    //   invoiceNo: "UPI",
    //   amount: "Shop",
    //   paymentMode: "UPI",
    //   status: "Due",
    // },
    // {
    //   date: "12 Jul 2025",
    //   to: "Electricity",
    //   type: "Short Circuit",
    //   invoiceNo: "UPI",
    //   amount: "Shop",
    //   paymentMode: "UPI",
    //   status: "Paid",
    // },
    // {
    //   date: "12 Jul 2025",
    //   to: "Electricity",
    //   type: "Short Circuit",
    //   invoiceNo: "UPI",
    //   amount: "Shop",
    //   paymentMode: "UPI",
    //   status: "Paid",
    // },
    // {
    //   date: "12 Jul 2025",
    //   to: "Electricity",
    //   type: "Short Circuit",
    //   invoiceNo: "UPI",
    //   amount: "Shop",
    //   paymentMode: "UPI",
    //   status: "Due",
    // },
    // {
    //   date: "12 Jul 2025",
    //   to: "Electricity",
    //   type: "Short Circuit",
    //   invoiceNo: "UPI",
    //   amount: "Shop",
    //   paymentMode: "UPI",
    //   status: "Paid",
    // },
  ];

  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-03-31"),
      key: "selection",
    },
  ]);
  const [activeTab, setActiveTab] = useState("inflow");

  const handleChange = (item) => {
    setRange([item.selection]);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
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
          {/* Header */}
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
              Payment History
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

          {/* Tabs */}
          <div
            style={{
              borderTop: "1px solid #E6E6E6",
              borderBottom: "1px solid #E6E6E6",
            }}
          >
            <div
              style={{
                padding: "10px 20px",
                display: "flex",
                gap: "10px",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: "400",
                fontSize: "16px",
              }}
            >
              <button
                onClick={() => setActiveTab("inflow")}
                style={{
                  border: "none",
                  backgroundColor: "white",
                  color: "#080808ff",
                  borderBottom:
                    activeTab === "inflow" ? "2px solid grey" : "none",
                }}
              >
                Inflow
              </button>
              <button
                onClick={() => setActiveTab("outflow")}
                style={{
                  backgroundColor: "white",
                  border: "none",
                  borderBottom:
                    activeTab === "outflow" ? "2px solid grey" : "none",
                }}
              >
                Outflow
              </button>
            </div>
          </div>

          {/* Filters and Calendar */}
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ padding: "15px 20px" }}
          >
            <div
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontWeight: "400",
                fontSize: "16px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                style={{
                  border: "none",
                  backgroundColor: "#E6E6E6",
                  color: "#262626",
                  padding: "3px 7px",
                }}
              >
                All
              </button>
              <button
                style={{
                  border: "none",
                  backgroundColor: "#e6e6e60c",
                  color: "#262626",
                  padding: "3px 7px",
                }}
              >
                B2B
              </button>
              {activeTab === "inflow" && (
                <>
                  <button
                    style={{
                      border: "none",
                      backgroundColor: "#e6e6e60c",
                      color: "#262626",
                      padding: "3px 7px",
                    }}
                  >
                    B2C
                  </button>
                  <button
                    style={{
                      border: "none",
                      backgroundColor: "#e6e6e60c",
                      color: "#262626",
                      padding: "3px 7px",
                    }}
                  >
                    Retailer
                  </button>
                </>
              )}
              {activeTab === "outflow" && (
                <button
                  style={{
                    border: "none",
                    backgroundColor: "#e6e6e60c",
                    color: "#262626",
                    padding: "3px 7px",
                  }}
                >
                  Supplier
                </button>
              )}
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

          {/* Tables */}
          {activeTab === "inflow" ? (
            <InflowTable data={data} />
          ) : (
            <OutflowTable data={data2} />
          )}
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

// Subcomponents for table reuse
const InflowTable = ({ data }) => (
  <div className="table-responsive">
    <table className="table datatable">
      <thead className="thead-light">
        <tr>
          <th style={{ padding: "15px 20px" }}>
            <input type="checkbox" />
          </th>
          <th style={{ padding: "15px 20px" }}>Date</th>
          <th style={{ padding: "15px 20px" }}>From</th>
          <th style={{ padding: "15px 20px" }}>Type</th>
          <th style={{ padding: "15px 20px" }}>Invoice No.</th>
          <th style={{ padding: "15px 20px" }}>Amount</th>
          <th style={{ padding: "15px 20px" }}>Payment Mode</th>
          <th style={{ padding: "15px 20px" }}>Status</th>
          <th style={{ padding: "15px 20px" }}>Actions</th>
        </tr>
      </thead>
      <tbody
        style={{
          color: "#262626",
          fontFamily: '"Roboto", sans-serif',
          fontWeight: "400",
          fontSize: "16px",
        }}
      >
        {data.length === 0 ? (
          <>
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                No record found.
              </td>
            </tr>
          </>
        ) : (
          data.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #E6E6E6" }}>
              <td style={{ padding: "10px 20px" }}>
                <input type="checkbox" />
              </td>
              <td style={{ padding: "10px 20px" }}>{item.date}</td>
              <td style={{ padding: "10px 20px" }}>{item.from}</td>
              <td style={{ padding: "10px 20px" }}>{item.type}</td>
              <td style={{ padding: "10px 20px" }}>{item.invoiceNo}</td>
              <td style={{ padding: "10px 20px" }}>{item.amount}</td>
              <td style={{ padding: "10px 20px" }}>{item.paymentMode}</td>
              <td style={{ padding: "10px 20px" }}>
                <span
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    backgroundColor:
                      item.status === "Due" ? "#FCE4E6" : "#DFFFE0",
                    color: item.status === "Due" ? "#491E1F" : "#1E4921",
                  }}
                >
                  {item.status}
                </span>
              </td>
              <td
                style={{
                  padding: "10px 20px",
                  fontWeight: "800",
                  color: "black",
                }}
              >
                ...
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const OutflowTable = ({ data }) => (
  <div className="table-responsive">
    <table className="table datatable">
      <thead className="thead-light">
        <tr>
          <th style={{ padding: "15px 20px" }}>
            <input type="checkbox" />
          </th>
          <th style={{ padding: "15px 20px" }}>Date</th>
          <th style={{ padding: "15px 20px" }}>To</th>
          <th style={{ padding: "15px 20px" }}>Type</th>
          <th style={{ padding: "15px 20px" }}>Invoice No.</th>
          <th style={{ padding: "15px 20px" }}>Amount</th>
          <th style={{ padding: "15px 20px" }}>Payment Mode</th>
          <th style={{ padding: "15px 20px" }}>Status</th>
          <th style={{ padding: "15px 20px" }}>Actions</th>
        </tr>
      </thead>
      <tbody
        style={{
          color: "#262626",
          fontFamily: '"Roboto", sans-serif',
          fontWeight: "400",
          fontSize: "16px",
        }}
      >
        {data.length === 0 ? (
          <>
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                No record found.
              </td>
            </tr>
          </>
        ) : (data.map((item, index) => (
          <tr key={index} style={{ borderBottom: "1px solid #E6E6E6" }}>
            <td style={{ padding: "10px 20px" }}>
              <input type="checkbox" />
            </td>
            <td style={{ padding: "10px 20px" }}>{item.date}</td>
            <td style={{ padding: "10px 20px" }}>{item.to}</td>
            <td style={{ padding: "10px 20px" }}>{item.type}</td>
            <td style={{ padding: "10px 20px" }}>{item.invoiceNo}</td>
            <td style={{ padding: "10px 20px" }}>{item.amount}</td>
            <td style={{ padding: "10px 20px" }}>{item.paymentMode}</td>
            <td style={{ padding: "10px 20px" }}>
              <span
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  backgroundColor:
                    item.status === "Due" ? "#FCE4E6" : "#DFFFE0",
                  color: item.status === "Due" ? "#491E1F" : "#1E4921",
                }}
              >
                {item.status}
              </span>
            </td>
            <td style={{ padding: "10px 20px" }}>...</td>
          </tr>
        )))}
      </tbody>
    </table>
  </div>
);

export default PaymentHistory;
