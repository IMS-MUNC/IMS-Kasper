// import React, { useState } from 'react';
// import './OverdueReport.css';

// const OverdueReport = () => {
//   const [showFilters, setShowFilters] = useState(false);

//   const toggleFilters = () => {
//     setShowFilters(prev => !prev);
//   };

//   return (
//     <div className="overdue-container">
//       <div className="overdue-header">
//         <h3>Overdue Report</h3>
//         <button className="toggle-button" onClick={toggleFilters}>Export</button>
//       </div>

//       <div className="overdue-tabs">
//         <div className="overdue-tab active">All</div>
//         <div className="overdue-tab">Retailer</div>
//         <div className="overdue-tab">Wholesaler</div>
//         <div className="overdue-tab">+</div>
//       </div>

//       {showFilters && (
//         <div className="search-filter-bar">
//           <input className="search-box" type="text" placeholder="Search Here" />
//           <div className="filter-tags">
//             <div className="filter-tag">Category</div>
//             <div className="filter-tag">Stock Level</div>
//             <div className="filter-tag">Warehouse</div>
//             <div className="filter-tag">Expiration</div>
//           </div>
//         </div>
//       )}

//       <table className="data-table">
//         <thead>
//           <tr>
//             <th><input type="checkbox" /></th>
//             <th>Name</th>
//             <th>Invoice No.</th>
//             <th>Due Date</th>
//             <th>Days Overdue</th>
//             <th>Status</th>
//             <th>Amount Due</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td><input type="checkbox" /></td>
//             <td>Rohan Kumar</td>
//             <td>1244</td>
//             <td>12 Jul 2025</td>
//             <td>13 Days</td>
//             <td><span className="badge partial">Partial</span></td>
//             <td>₹ 46,005.00</td>
//           </tr>
//           <tr>
//             <td><input type="checkbox" /></td>
//             <td>Anaya</td>
//             <td>2435</td>
//             <td>12 Jul 2025</td>
//             <td>23 Days</td>
//             <td><span className="badge unpaid">UnPaid</span></td>
//             <td>₹ 54,005.00</td>
//           </tr>
//         </tbody>
//       </table>

//       <div className="pagination">
//         <span>25 per page</span>
//         <span>1–25 of 369</span>
//       </div>
//     </div>
//   );
// };

// export default OverdueReport;

import React, { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { BsFilter } from "react-icons/bs";
import { PiArrowsDownUpLight } from "react-icons/pi";
import "./OverdueReport.css";
import logotable from "../../../assets/img/logotable.png";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { CgSortAz } from "react-icons/cg";
import { TbArrowsSort } from "react-icons/tb";
import { IoIosSearch } from "react-icons/io";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import BASE_URL from "../../config/config";

const OverdueReport = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  const [searchdrop, setSearchDrop] = useState(false);
  const handleSearchDropChange = () => {
    setSearchDrop(true);
  };
  const [categoryValue, setCategoryValue] = useState("");
  const handleCategoryChange = (e) => {
    setCategoryValue(e.target.value);
  };

  const [socketValue, setSocketValue] = useState("");
  const handleSocketChange = (e) => {
    setSocketValue(e.target.value);
  };

  const [warehouseValue, setWarehouseValue] = useState("");
  const handleWarehouseChange = (e) => {
    setWarehouseValue(e.target.value);
  };

  const [exprationValue, setExprationValue] = useState("");
  const handleExprationChange = (e) => {
    setExprationValue(e.target.value);
  };
  const handleClear = () => {
    setSearchDrop(false);
    setCategoryValue("");
    setSocketValue("");
    setWarehouseValue("");
    setExprationValue("");
  };
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false);

  // const fetchOverdueData = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get("/api/sales", {

  //       params: { paymentStatus: "Overdue" },
  //     });
  //     console.log('kkkkk' , res.data.sale);

  //     // agar API filter nahi karti to manually filter
  //     const overdue = res.data.sales.filter(
  //       (s) => s.paymentStatus?.toLowerCase() === "overdue"
  //     );

  //     // table ke liye shape bana diya
  //     const mapped = overdue.map((item) => ({
  //       name: item.customer?.customer || "-",
  //       invoice: item.referenceNumber || "-",
  //       dueDate: item.dueDate
  //         ? new Date(item.dueDate).toLocaleDateString()
  //         : "-",
  //       overdue: "-", // abhi placeholder hai
  //       status: item.paymentStatus || "-",
  //       amount: item.dueAmount ? `₹ ${item.dueAmount}` : "₹ 0",
  //     }));

  //     setData(mapped);
  //   } catch (err) {
  //     console.error("Error fetching overdue sales:", err);
  //     setData([]);
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   fetchOverdueData();
  // }, []);
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/sales`);
      const data = res.data.sales;
      setSales(res.data.sales);
      console.log("sal", data);
    } catch (err) {
      setSales([]);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);
  // pagination states
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 8;

  // const fetchSales = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/api/sales`);
  //     setSales(res.data.sales || []);
  //   } catch (err) {
  //     setSales([]);
  //   }
  // };

  // useEffect(() => {
  //   fetchSales();
  // }, []);

  // // pagination logic
  // const totalPages = Math.ceil(sales.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = sales.slice(indexOfFirstItem, indexOfLastItem);

  // const handlePrev = () => {
  //   if (currentPage > 1) setCurrentPage(currentPage - 1);
  // };

  // const handleNext = () => {
  //   if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  // };

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
          <div style={{ borderBottom: "1px solid #E6E6E6" }}>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ padding: "20px" }}
            >
              <span
                style={{
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: "500",
                  fontSize: "18px",
                  color: "#262626",
                }}
              >
                Overdue Report
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
          </div>
          {/* <div className='overdue-btn-container d-flex justify-content-between' style={{ padding: "10px 20px" }}>
            <div className='d-flex gap-2' style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "400", fontSize: "16px" }}>
               <button style={{ border: "none", backgroundColor: "#E6E6E6", color: "#262626", padding: "3px 7px" }}>All</button>
               <button style={{ border: "none", backgroundColor: "white", color: "#262626", padding: "3px 7px" }}>Retailer</button>
               <button style={{ border: "none", backgroundColor: "white", color: "#262626", padding: "3px 7px" }}>Wholesaler</button>
               <button style={{ border: "none", backgroundColor: "white", color: "#262626", padding: "3px 7px" }}>+</button>
            </div>
            <div className='d-flex gap-2' style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "400", fontSize: "16px" }}>
               <button onClick={toggleFilter} className='overdue-filter-btn' style={{ border: "none", backgroundColor: "#FFFFFF", boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px", color: "#676767", fontSize: "20px", }}><IoMdSearch /><BsFilter /></button>
               <button style={{ border: "none", backgroundColor: "#FFFFFF", boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px", color: "#676767", fontSize: "20px", }}><PiArrowsDownUpLight /></button>
            </div>
         </div>
         <div className={`ovredue-filter-selection ${filterOpen ? 'open' : ''}`} style={{ padding: "10px 20px", display: "flex", gap: "15px", }}>
            <button style={{ borderRadius: "4px", fontFamily: '"Roboto", sans-serif', border: "none", backgroundColor: "#FFFFFF", boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px", color: "#676767", fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "17px" }}>Filter</span><BsFilter /></button>
            <select name="" id="" style={{ fontFamily: '"Roboto", sans-serif', border: "2px dotted grey", fontSize: "17px", backgroundColor: "#FFFFFF", color: "#676767", padding: "2px", outline: "none", borderRadius: "4px" }}>
               <option value="">Category</option>
               <option value="">Home</option>
            </select>
            <select name="" id="" style={{ fontFamily: '"Roboto", sans-serif', border: "2px dotted grey", fontSize: "17px", backgroundColor: "#FFFFFF", color: "#676767", padding: "2px", outline: "none", borderRadius: "4px" }}>
               <option value="">Stock Level</option>
               <option value="">Stock 1</option>
            </select>
            <select name="" id="" style={{ fontFamily: '"Roboto", sans-serif', border: "2px dotted grey", fontSize: "17px", backgroundColor: "#FFFFFF", color: "#676767", padding: "2px", outline: "none", borderRadius: "4px" }}>
               <option value="">Warehouse</option>
               <option value="">Wholsale</option>
            </select>
            <select name="" id="" style={{ fontFamily: '"Roboto", sans-serif', border: "2px dotted grey", fontSize: "17px", backgroundColor: "#FFFFFF", color: "#676767", padding: "2px", outline: "none", borderRadius: "4px" }}>
               <option value="">Expiration</option>
               <option value="">Wholsale</option>
            </select>
         </div> */}
          <div className="toolbar-action-th">
            <div className="toolbar-titles">
              {searchdrop ? (
                <>
                  <div
                    style={{
                      border: "none",
                      marginLeft: "20px",
                      alignItems: "center",
                      display: "flex",
                      fontFamily: '"Roboto", sans-serif',
                    }}
                  >
                    <IoIosSearch style={{ fontSize: "18px" }} />
                    <input
                      type="text"
                      placeholder="Search Here"
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: "16px",
                        color: "grey",
                      }}
                    />
                  </div>
                </>
              ) : (
                <div
                  className="d-flex gap-2"
                  style={{
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "400",
                    fontSize: "16px",
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
                      backgroundColor: "white",
                      color: "#262626",
                      padding: "3px 7px",
                    }}
                  >
                    Retailer
                  </button>
                  <button
                    style={{
                      border: "none",
                      backgroundColor: "white",
                      color: "#262626",
                      padding: "3px 7px",
                    }}
                  >
                    Wholesaler
                  </button>
                  <button
                    style={{
                      border: "none",
                      backgroundColor: "white",
                      color: "#262626",
                      padding: "3px 7px",
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            <div className="toolbar-action" style={{ marginTop: "4px" }}>
              {searchdrop ? (
                <>
                  <button className="icon-btn" onClick={handleClear}>
                    <TbArrowsSort style={{ color: "#676767" }} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="icon-btn "
                    value={searchdrop}
                    onClick={handleSearchDropChange}
                  >
                    <IoSearch style={{ color: "#676767" }} />{" "}
                    <CgSortAz style={{ color: "#676767", fontSize: "22px" }} />
                  </button>
                </>
              )}
            </div>
          </div>
          {searchdrop ? (
            <>
              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                  borderBottom: "2px solid #E6E6E6",
                }}
              >
                <div
                  className="toolbar-titles"
                  style={{ marginTop: "4px", display: "flex", gap: "10px" }}
                >
                  <div
                    style={{
                      padding: "0px 10px 0px 3px",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <button
                      style={{
                        borderRadius: "4px",
                        fontFamily: '"Roboto", sans-serif',
                        border: "none",
                        backgroundColor: "#FFFFFF",
                        boxShadow:
                          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                        color: "#676767",
                        fontSize: "22px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {" "}
                      Filter <CgSortAz style={{ fontSize: "30px" }} />
                    </button>
                  </div>

                  <div
                    style={{
                      border: categoryValue
                        ? "2px dashed #1368EC"
                        : "2px dashed #ccc",
                      padding: "0px 10px 0px 3px",
                      alignItems: "center",
                      display: "flex",
                      borderRadius: "6px",
                    }}
                    value={categoryValue}
                    onChange={handleCategoryChange}
                  >
                    <select
                      className="icon-btn"
                      style={{
                        outline: "none",
                        border: "none",
                        color: categoryValue ? "#1368EC" : "#555252",
                      }}
                    >
                      <option value="" style={{ color: "#555252" }}>
                        Category
                      </option>
                      <option value="c1" style={{ color: "#555252" }}>
                        Category 1
                      </option>
                      <option value="c2" style={{ color: "#555252" }}>
                        Category 2
                      </option>
                    </select>
                  </div>

                  <div
                    style={{
                      border: socketValue
                        ? "2px dashed #1368EC"
                        : "2px dashed #ccc",
                      padding: "0px 10px 0px 3px",
                      alignItems: "center",
                      display: "flex",
                      borderRadius: "6px",
                    }}
                    value={socketValue}
                    onChange={handleSocketChange}
                  >
                    <select
                      className="icon-btn"
                      style={{
                        outline: "none",
                        border: "none",
                        color: socketValue ? "#1368EC" : "#555252",
                      }}
                    >
                      <option value="" style={{ color: "#555252" }}>
                        Socket Level
                      </option>
                      <option value="sl1" style={{ color: "#555252" }}>
                        Last 7 days
                      </option>
                    </select>
                  </div>

                  <div
                    style={{
                      border: warehouseValue
                        ? "2px dashed #1368EC"
                        : "2px dashed #ccc",
                      padding: "0px 10px 0px 3px",
                      alignItems: "center",
                      display: "flex",
                      borderRadius: "6px",
                    }}
                    value={warehouseValue}
                    onChange={handleWarehouseChange}
                  >
                    <select
                      className="icon-btn"
                      style={{
                        outline: "none",
                        border: "none",
                        color: warehouseValue ? "#1368EC" : "#555252",
                      }}
                    >
                      <option value="" style={{ color: "#555252" }}>
                        Warehouse
                      </option>
                      <option value="wh1" style={{ color: "#555252" }}>
                        Warehouse 1
                      </option>
                    </select>
                  </div>

                  <div
                    style={{
                      border: exprationValue
                        ? "2px dashed #1368EC"
                        : "2px dashed #ccc",
                      padding: "0px 10px 0px 3px",
                      alignItems: "center",
                      display: "flex",
                      borderRadius: "6px",
                    }}
                    value={exprationValue}
                    onChange={handleExprationChange}
                  >
                    <select
                      className="icon-btn"
                      style={{
                        outline: "none",
                        border: "none",
                        color: exprationValue ? "#1368EC" : "#555252",
                      }}
                    >
                      <option value="" style={{ color: "#555252" }}>
                        Expiration
                      </option>
                      <option value="e1" style={{ color: "#555252" }}>
                        Expiration 1
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="table-responsive">
            <table className="table datatable">
              <thead className="thead-light">
                <tr>
                  <th style={{ padding: "15px 20px" }}>
                    <input type="checkbox" />
                  </th>
                  <th style={{ padding: "15px 20px" }}>Name</th>
                  <th style={{ padding: "15px 20px" }}>Invoice No.</th>
                  <th style={{ padding: "15px 20px" }}>Due Date</th>
                  <th style={{ padding: "15px 20px" }}>Days Overdue</th>
                  <th style={{ padding: "15px 20px" }}>Status</th>
                  <th style={{ padding: "15px 20px" }}>Amount Due</th>
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
                {sales.length === 0 ? (
                  <>
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No overdue sales found.
                      </td>
                    </tr>
                  </>
                ) : (
                  sales.map((item, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #E6E6E6" }}
                    >
                      <td style={{ padding: "5px 20px" }}>
                        <input type="checkbox" />
                      </td>
                      <td style={{ padding: "5px 20px" }}>
                        <img src={item.images} alt="image" />
                        {item.customer.name}
                      </td>
                      <td style={{ padding: "5px 20px" }}>
                        {item.referenceNumber}
                      </td>
                      <td style={{ padding: "5px 20px" }}>{item.dueDate}</td>
                      <td style={{ padding: "5px 20px" }}>{item.overdue}</td>
                      <td style={{ padding: "5px 20px" }}>
                        <span
                          style={{
                            padding: "5px",
                            borderRadius: "5px",
                            backgroundColor:
                              item.status === "Pending"
                                ? "#FDFFE4"
                                : item.status === "Complete"
                                ? "#FCE4E6"
                                : "",
                            color:
                              item.status === "Pending"
                                ? "#636D1D"
                                : item.status === "Complete"
                                ? "#491E1F"
                                : "",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: "5px 20px" }}>{item.dueAmount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div
              className="d-flex justify-content-end gap-3"
              style={{ padding: "10px 20px" }}
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
            {/* <div
          className="d-flex justify-content-end gap-3"
          style={{ padding: "10px 20px" }}
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
            {itemsPerPage} <span style={{ color: "grey" }}>per page</span>
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
            {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sales.length)}{" "}
            <span style={{ color: "grey" }}>of {sales.length}</span>{" "}
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              style={{
                border: "none",
                color: currentPage === 1 ? "#ccc" : "grey",
                backgroundColor: "white",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              <GrFormPrevious />
            </button>{" "}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              style={{
                border: "none",
                color: currentPage === totalPages ? "#ccc" : "grey",
                backgroundColor: "white",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              <MdNavigateNext />
            </button>
          </span>
        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverdueReport;
