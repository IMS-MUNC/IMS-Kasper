import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import BASE_URL from "../../../pages/config/config";
import { TbEdit, TbRefresh, TbTrash, TbEye } from "react-icons/tb";
import PDF from '../../../assets/img/icons/pdf.svg'
import EXCEL from '../../../assets/img/icons/excel.svg'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";

function StockMovementLog() {
  const [activeTab, setActiveTab] = useState("All");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [purchases, setPurchases] = useState([]);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/purchases`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      setPurchases(res.data.purchases);
      // console.log("new log data", res.data.purchases);

    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const filteredPurchases = purchases.filter((purchase) => {
    if (activeTab === "All") return true;
    if (activeTab === "Stock In") return purchase.status === "Received";
    if (activeTab === "Stock Out") return purchase.status === "Ordered";
    if (activeTab === "Transfer") return purchase.status === "Transfer";
    if (activeTab === "Processing") return purchase.status === "Processing";
    return true;
  });

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${ampm} - ${day}-${month}-${year}`;
  }

  const handleCellClick = (stock) => {
    setSelectedStock(stock);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedStock(null);
  };


  const quantity = selectedStock?.products?.[0]?.product?.quantity
    ? parseInt(selectedStock.products[0].product.quantity)
    : 0;

  const unitPrice = 5000;
  const subtotal = quantity * unitPrice;
  const cgst = 9;
  const sgst = 9;
  const shippingCharges = 300;
  const totalPrice =
    subtotal +
    (subtotal * cgst) / 100 +
    (subtotal * sgst) / 100 +
    shippingCharges;

  // Function to download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Movement Log", 14, 20);

    const tableColumn = [
      "Product",
      "Time",
      "QTY",
      "Movement Type",
      "Source/Destination",
      "Reference/Note",
    ];
    const tableRows = filteredPurchases.map((purchase) => [
      purchase.products[0]?.product?.productName || "N/A",
      formatDateTime(purchase.createdAt),
      purchase.products[0]?.product?.quantity || "0",
      purchase.status,
      purchase.supplier
        ? `${purchase.supplier.firstName} ${purchase.supplier.lastName} ${purchase.supplier.email}`
        : "N/A",
      purchase.referenceNumber || "N/A",
    ]);

    // Use autoTable directly
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [100, 100, 100] },
      styles: { fontSize: 10 },
    });

    doc.save("Stock_Movement_Log.pdf");
  };

  // Function to download Excel
  const downloadExcel = () => {
    const worksheetData = filteredPurchases.map((purchase) => ({
      Product: purchase.products[0]?.product?.productName || "N/A",
      Time: formatDateTime(purchase.createdAt),
      Quantity: purchase.products[0]?.product?.quantity || 0,
      "Movement Type": purchase.status,
      "Source/Destination": purchase.supplier
        ? `${purchase.supplier.firstName} ${purchase.supplier.lastName} ${purchase.supplier.email}`
        : "N/A",
      "Reference/Note": purchase.referenceNumber || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Movement Log");
    XLSX.writeFile(workbook, "Stock_Movement_Log.xlsx");
  };



  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title me-auto">
            <h4 className="fw-bold">Stock Movement Log</h4>
            <h6>Manage your stocks Movements</h6>
          </div>
          <ul className="table-top-head low-stock-top-head">
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" onClick={downloadPDF} ><img src={PDF} alt="pdf" /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel" onClick={downloadExcel} ><img src={EXCEL} alt="excel" /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" onClick={() => location.reload()}><TbRefresh className="ti ti-refresh" /></a>
            </li>
            {/* <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
            </li> */}
            <li>
              {/* <a href="#" className="btn btn-secondary w-auto shadow-none" data-bs-toggle="modal" data-bs-target="#send-email"><i data-feather="mail" className="feather-mail" />Send Email</a> */}
            </li>
          </ul>
        </div>
        <div className="mb-4">



          <div className="tab-content" id="pills-tabContent">
            {/* low stock */}
            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
              {/* /product list */}
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-0">
                    <ul className="nav nav-pills d-flex me-2 mb-0" id="pills-tab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link${activeTab === 'All' ? ' active' : ''}`}
                          id="pills-all-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-all"
                          type="button"
                          role="tab"
                          aria-controls="pills-all"
                          aria-selected={activeTab === 'All'}
                          onClick={() => setActiveTab('All')}
                        >
                          All
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link${activeTab === 'Stock In' ? ' active' : ''}`}
                          id="pills-stockin-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-stockin"
                          type="button"
                          role="tab"
                          aria-controls="pills-stockin"
                          aria-selected={activeTab === 'Stock In'}
                          onClick={() => setActiveTab('Stock In')}
                        >
                          Stock In
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link${activeTab === 'Stock Out' ? ' active' : ''}`}
                          id="pills-stockout-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-stockout"
                          type="button"
                          role="tab"
                          aria-controls="pills-stockout"
                          aria-selected={activeTab === 'Stock Out'}
                          onClick={() => setActiveTab('Stock Out')}
                        >
                          Stock Out
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link${activeTab === 'Transfer' ? ' active' : ''}`}
                          id="pills-transfer-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-transfer"
                          type="button"
                          role="tab"
                          aria-controls="pills-transfer"
                          aria-selected={activeTab === 'Transfer'}
                          onClick={() => setActiveTab('Transfer')}
                        >
                          Transfer
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link${activeTab === 'Processing' ? ' active' : ''}`}
                          id="pills-processing-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-processing"
                          type="button"
                          role="tab"
                          aria-controls="pills-processing"
                          aria-selected={activeTab === 'Processing'}
                          onClick={() => setActiveTab('Processing')}
                        >
                          Processing
                        </button>
                      </li>
                    </ul>

                    {/* <div className="notify d-flex bg-white p-1 px-2 border rounded">
              <div className="status-toggle text-secondary d-flex justify-content-between align-items-center">
                <input type="checkbox" id="user2" className="check" defaultChecked />
                <label htmlFor="user2" className="checktoggle me-2">checkbox</label>
                Notify
              </div>
            </div> */}
                  </div>
                  <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                    {/* <div className="dropdown me-2">
                      <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                        Warehouse
                      </a>
                      <ul className="dropdown-menu  dropdown-menu-end p-3">
                        <li>
                          <a className="dropdown-item rounded-1">w1</a>
                        </li>
                        <li>
                          <a className="dropdown-item rounded-1">w2</a>
                        </li>

                      </ul>
                    </div> */}
                    {/* <div className="dropdown me-2">
                      <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                        Store
                      </a>
                      <ul className="dropdown-menu  dropdown-menu-end p-3">
                        <li>
                          <a  className="dropdown-item rounded-1">James Kirwin</a>
                        </li>
                        <li>
                          <a  className="dropdown-item rounded-1">Francis Chang</a>
                        </li>
                        <li>
                          <a  className="dropdown-item rounded-1">Antonio Engle</a>
                        </li>
                        <li>
                          <a  className="dropdown-item rounded-1">Leo Kelly</a>
                        </li>
                      </ul>
                    </div>
                    <div className="dropdown">
                      <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                        Category
                      </a>
                      <ul className="dropdown-menu  dropdown-menu-end p-3">
                        <li>
                          <a  className="dropdown-item rounded-1">Computers</a>
                        </li>
                        <li>
                          <a  className="dropdown-item rounded-1">Electronics</a>
                        </li>
                        <li>
                          <a  className="dropdown-item rounded-1">Shoe</a>
                        </li>
                        <li>
                          <a  className="dropdown-item rounded-1">Electronics</a>
                        </li>
                      </ul>
                    </div> */}
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table datatable">
                      <thead className="thead-light">
                        <tr>
                          <th className="no-sort">
                            <label className="checkboxs">
                              <input type="checkbox" id="select-all" />
                              <span className="checkmarks" />
                            </label>
                          </th>
                          <th>Product</th>
                          <th>Time</th>
                          <th>QTY</th>
                          <th>Movement Type</th>
                          <th>Source/Destination</th>
                          <th>Reference/Note</th>
                          <th className="no-sort" />
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPurchases.length > 0 ? (
                          filteredPurchases.map(purchase => (
                            <tr key={purchase._id} onClick={() => handleCellClick(purchase)} style={{ cursor: "pointer" }}>
                              <td>
                                <label className="checkboxs">
                                  <input type="checkbox" />
                                  <span className="checkmarks" />
                                </label>
                              </td>
                              <td> {purchase.products[0]?.product?.productName}</td>
                              {/* <td>{product.store || 'N/A'}</td> */}
                              <td>{formatDateTime(purchase.createdAt)}</td>
                              <td onClick={() => handleCellClick(purchase)}>
                                {purchase.products[0]?.product?.quantity}
                              </td>
                              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                                {(() => {
                                  const type = purchase.status.trim().toLowerCase();
                                  let backgroundColor = "#D3D3D3";
                                  let textColor = "#000";

                                  if (type === "received") {
                                    backgroundColor = "#DFFFE0";
                                    textColor = "#2BAE66";
                                  } else if (type === "ordered") {
                                    backgroundColor = "#FCE4E6";
                                    textColor = "#D64550";
                                  } else if (type === "transfer") {
                                    backgroundColor = "#D4E4FF";
                                    textColor = "#2F80ED";
                                  } else if (type === "processing") {
                                    backgroundColor = "#FFF3CD";
                                    textColor = "#856404";
                                  }
                                  return (
                                    <span
                                      style={{
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                        color: textColor,
                                        backgroundColor,
                                      }}
                                    >
                                      {purchase.status}
                                    </span>
                                  );
                                })()}
                              </td>


                              <td>{purchase.supplier.firstName + " " + purchase.supplier.lastName + " " + purchase.supplier.email || "N/A"}</td>
                              <td> {purchase.referenceNumber || "N/A"}</td>
                              {/* <td>{product.quantityAlert} {product.unit}</td> */}
                              <td className="action-table-data">
                                <div className="edit-delete-action">
                                  {/* <a className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-stock">
                                     <TbEdit data-feather="edit" className="feather-edit" /> 
                                  </a>*/}
                                  <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" >
                                    <TbEye data-feather="eye" className="feather-eye" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center text-muted">No low stock products.</td>
                          </tr>
                        )}

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* /product list */}
            </div>


          </div>
        </div>
      </div>
      {isPopupOpen && selectedStock && (
        <div
          // style={{
          //   position: "fixed",
          //   top: 10,
          //   left: 0,
          //   width: "100%",
          //   height: "100%",
          //   background: "rgba(0,0,0,0.5)",
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   // marginBottom: "20px"
          //   // padding: "120px",
          // }}
          style={{
            position: "fixed",
            top: 70,
            left: 0,

            width: "100%",
            height: "90%", // Commented out: Reverted to original
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // padding: "90px",
            zIndex: 1000, // Commented out: Reverted to original
            padding: "200px", // Commented out: Reverted to original
          }}
        >
          <div
            // style={{
            //   backgroundColor: "#fff",
            //   padding: "24px",
            //   gap: "24px",
            //   borderRadius: "8px",
            //   maxWidth: "800px",
            //   // maxHeight: "700px",
            //   width: "95%",
            // }}
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              gap: "24px",
              borderRadius: "8px",
              maxWidth: "800px",
              width: "95%",
              maxHeight: "90vh",
              overflowY: "auto", // Commented out: Reverted to original
              position: "relative",
              // Commented out: Reverted to original
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <span
                style={{
                  border: "1px solid #676767",
                  backgroundColor:
                    selectedStock.status === "Ordered" ? "#ED2F42" : "#2fed45",
                  padding: "8px",
                  borderRadius: "4px",
                  color: "#fff",
                }}
              >
                {selectedStock.status}
              </span>
              <select
                style={{
                  border: "1px solid #e6e6e6",
                  backgroundColor: "#ffffff",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                {" "}
                {selectedStock.status === "Ordered" ? (
                  <option value="">In Transit</option>
                ) : (
                  <option value="">Reached</option>
                )}
              </select>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              <span>
                Reference No :{" "}
                <strong>{selectedStock.referenceNumber || "N/A"}</strong>
              </span>
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
            <div
              style={{
                marginTop: "10px",
                border: "1px solid #e6e6e6",
                borderRadius: "16px",
                padding: "16px",
                backgroundColor: "#fff",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "40px",
                }}
              >
                <div>
                  <span>Customer</span>
                  <br />
                  <span>
                    {/* <span>{selectedStock.supplier?.supplierName || "N/A"}</span> */}
                    <span>{selectedStock.supplier.firstName + " " + selectedStock.supplier.lastName || "N/A"}</span>
                  </span>
                </div>
                <div>
                  <span>From Warehouse</span>
                  <br />
                  {/* {console.log("NOLE ", selectedStock.products[0]?.product)
                  } */}
                  <span>

                    {selectedStock.products[0]?.product?.warehouse
                      ?.warehouseName || "N/A"}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: "30px" }}>
                <span style={{ fontSize: "16px", color: "#262626", fontWeight: "bold" }}>
                  Products
                </span>
                <div
                  style={{
                    border: "1px solid #e6e6e6",
                    borderRadius: "8px",
                    marginTop: "10px",
                    overflowX: "auto",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f5f5f5",
                          color: "#444",
                          textAlign: "left",
                          fontWeight: "400"
                        }}
                      >
                        <th style={{ padding: "10px" }}>
                          <input type="checkbox" />
                        </th>
                        <th style={{ padding: "10px" }}>Product</th>
                        <th style={{ padding: "10px" }}>SKU</th>
                        <th style={{ padding: "10px" }}>Quantity</th>
                        <th style={{ padding: "10px" }}>Unit Price</th>
                        <th style={{ padding: "10px" }}>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                        <td style={{ padding: "10px" }}>
                          <input type="checkbox" />
                        </td>
                        <td style={{ padding: "10px" }}>
                          {selectedStock.products[0]?.product?.productName}
                        </td>
                        <td style={{ padding: "10px" }}>
                          SKU{selectedStock.products[0]?.product?.sku || "N/A"}
                        </td>

                        <td style={{ padding: "10px" }}>{quantity}</td>
                        <td style={{ padding: "10px" }}>₹{unitPrice}</td>
                        <td style={{ padding: "10px" }}>
                          ₹{(quantity * unitPrice).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subtotal Section */}
              <div style={{ paddingTop: "10px", marginBottom: "20px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                  }}
                >
                  <tbody>
                    <tr style={{}}>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        Subtotal
                      </td>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        ₹{subtotal.toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{}}>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        CGST ({cgst}%)
                      </td>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        ₹{((subtotal * cgst) / 100).toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        SGST ({sgst}%)
                      </td>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        ₹{((subtotal * sgst) / 100).toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        Shipping Charges
                      </td>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        ₹{shippingCharges.toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{ borderTop: "1px solid #e6e6e6" }}>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        Total Price
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{totalPrice.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Other Info */}
              <div
                style={{
                  border: "1px solid #e6e6e6",
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  gap: "16px",
                  marginTop: "10px",
                  padding: "16px",
                }}
              >
                <span style={{ fontSize: "16px", color: "#262626" }}>
                  Other Info
                </span>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <span>Payments Method</span>
                    <br />
                    <input
                      type="text"
                      placeholder="Net Banking"
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "10px 16px",
                        color: "#000000",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div>
                    <span>Courier Partner</span>
                    <br />
                    <input
                      type="text"
                      placeholder="Shiprocket"
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "10px 16px",
                        color: "#000000",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div>
                    <span>Arrival Time</span>
                    <br />
                    <input
                      type="text"
                      placeholder="2:45 PM"
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "10px 16px",
                        color: "#000000",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closePopup}
              style={{
                marginTop: "15px",
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                float: "right",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    // <div className="page-wrapper"  >
    //   <div className="content">
    //       <div >
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //         border: "1px solid #e6e6e6",
    //         padding: "16px 24px",
    //         borderTopLeftRadius: "8px",
    //         borderTopRightRadius: "8px",
    //         backgroundColor: "#fff",
    //       }}
    //     >
    //       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    //         <span
    //           style={{
    //             fontFamily: "roboto",
    //             fontWeight: "500",
    //             fontSize: "18px",
    //             color: "#676767",
    //           }}
    //         >
    //           Warehouses
    //         </span>
    //         <span>
    //           <IoIosArrowForward
    //             style={{
    //               fontFamily: "roboto",
    //               fontWeight: "500",
    //               fontSize: "18px",
    //               color: "#676767",
    //             }}
    //           />
    //         </span>
    //         <span
    //           style={{
    //             fontFamily: "roboto",
    //             fontWeight: "500",
    //             fontSize: "18px",
    //             color: "#262626",
    //           }}
    //         >
    //           Stock Movement Log
    //         </span>
    //       </div>
    //       <div
    //         style={{
    //           border: "1px solid #e6e6e6",
    //           borderRadius: "4px",
    //           padding: "8px",
    //           gap: "8px",
    //           backgroundColor: "#fff",
    //         }}
    //       >
    //         <select name="" id="" style={{ border: "none", outline: "none" }}>
    //           <option
    //             value=""
    //             style={{
    //               border: "none",
    //               outline: "none",
    //               color: "#676767",
    //               fontFamily: "roboto",
    //               fontWeight: "400",
    //               fontSize: "16px",
    //             }}
    //           >
    //             Select Warehouse
    //           </option>
    //         </select>
    //       </div>
    //     </div>

    //     {/* <div
    //       style={{
    //         display: "flex",
    //         backgroundColor: "#fff",
    //         padding: "8px 24px",
    //         borderBottom: "1px solid #e6e6e6",
    //         borderLeft: "1px solid #e6e6e6",
    //         borderRight: "1px solid #e6e6e6",
    //         gap: "18px",
    //       }}
    //     >
    //       <div
    //         style={{
    //           gap: "18px",
    //           justifyContent: "space-between",
    //           display: "flex",
    //           fontFamily: "Roboto",
    //           fontWeight: "400",
    //           fontSize: "16px",
    //           color: "#262626",
    //           alignItems: "center",
    //         }}
    //       >
    //         {["All", "Stock In", "Stock Out", "Transfer", "Processing"].map(
    //           (tab) => (
    //             <span
    //               key={tab}
    //               onClick={() => setActiveTab(tab)}
    //               style={{
    //                 borderRadius: "4px",
    //                 padding: "8px",
    //                 backgroundColor: activeTab === tab ? "#d1d1d1" : "#f1f1f1",
    //                 cursor: "pointer",
    //               }}
    //             >
    //               {tab}
    //             </span>
    //           )
    //         )}
    //       </div>
    //     </div> */}
    //     {/* <div
    //       style={{
    //         backgroundColor: "#ffffff",
    //         borderBottom: "1px solid #e6e6e6",
    //         borderBottomLeftRadius: "8px",
    //         borderBottomRightRadius: "8px",
    //         maxWidth: "100%",
    //         overflowX: "auto",
    //       }}
    //     >
    //       <table
    //         style={{
    //           width: "100%",
    //           borderCollapse: "collapse",
    //           fontFamily: "Arial",
    //           fontSize: "14px",
    //         }}
    //       >
    //         <thead>
    //           <tr
    //             style={{
    //               backgroundColor: "#f5f5f5",
    //               color: "#444",
    //               textAlign: "left",
    //             }}
    //           >
    //             <th style={{ padding: "10px" }}>
    //               <input type="checkbox" />
    //             </th>
    //             <th style={{ padding: "10px" }}>Product</th>
    //             <th style={{ padding: "10px" }}>Time</th>
    //             <th style={{ padding: "10px" }}>QTY</th>
    //             <th style={{ padding: "10px" }}>Movement Type</th>
    //             <th style={{ padding: "10px" }}>Source/Destination</th>
    //             <th style={{ padding: "10px" }}>Reference/Note</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {filteredPurchases.map((purchase) => (
    //             <tr
    //               key={purchase._id}
    //               style={{
    //                 borderBottom: "1px solid #d3d3d3",
    //                 transition: "background-color 0.2s",
    //               }}
    //               onClick={() => handleCellClick(purchase)}
    //             >
    //               <td 
    //                 style={{ padding: "10px" }}
    //               >
    //                 <input type="checkbox" />
    //               </td>
    //               <td
    //                 style={{ padding: "10px" }}
    //               >
    //                 {purchase.products[0]?.product?.productName}
    //               </td>
    //               <td
    //                 style={{ padding: "10px" }}
    //               >
    //                 {formatDateTime(purchase.createdAt)}
    //               </td>
    //               <td
    //                 style={{ padding: "10px" }}
    //                 onClick={() => handleCellClick(purchase)}
    //               >
    //                 {purchase.products[0]?.product?.quantity}
    //               </td>
    //               <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
    //                 {(() => {
    //                   const type = purchase.status.trim().toLowerCase(); 
    //                   let backgroundColor = "#D3D3D3";
    //                   let textColor = "#000";

    //                   if (type === "received") {
    //                     backgroundColor = "#DFFFE0";
    //                     textColor = "#2BAE66";
    //                   } else if (type === "ordered") {
    //                     backgroundColor = "#FCE4E6";
    //                     textColor = "#D64550";
    //                   } else if (type === "transfer") {
    //                     backgroundColor = "#D4E4FF";
    //                     textColor = "#2F80ED";
    //                   } else if (type === "processing") {
    //                     backgroundColor = "#FFF3CD";
    //                     textColor = "#856404";
    //                   }
    //                   return (
    //                     <span
    //                       style={{
    //                         padding: "4px 12px",
    //                         borderRadius: "20px",
    //                         fontSize: "13px",
    //                         fontWeight: "500",
    //                         color: textColor,
    //                         backgroundColor,
    //                       }}
    //                     >
    //                       {purchase.status}
    //                     </span>
    //                   );
    //                 })()}
    //               </td>
    //               <td
    //                 style={{ padding: "10px" }}
    //               >
    //                 {purchase.products[0]?.product?.warehouse?.warehouseName}
    //               </td>
    //               <td
    //                 style={{ padding: "10px" }}
    //               >
    //                 {purchase.referenceNumber || "N/A"}
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div> */}

    //     {isPopupOpen && selectedStock && (
    //       <div
    //         style={{
    //           position: "fixed",
    //           top: 70,
    //           left: 0,
    //           width: "100%",
    //           height: "90%",
    //           background: "rgba(0,0,0,0.5)",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           padding: "90px",
    //         }}
    //       >
    //         <div
    //           style={{
    //             backgroundColor: "#fff",
    //             padding: "24px",
    //             gap: "24px",
    //             borderRadius: "8px",
    //             maxWidth: "800px",
    //             width: "95%",
    //           }}
    //         >
    //           <div
    //             style={{
    //               display: "flex",
    //               gap: "16px",
    //               alignItems: "center",
    //               marginBottom: "15px",
    //             }}
    //           >
    //             <span
    //               style={{
    //                 border: "1px solid #676767",
    //                 backgroundColor:
    //                   selectedStock.status === "Ordered" ? "#ED2F42" : "#2fed45",
    //                 padding: "8px",
    //                 borderRadius: "4px",
    //                 color: "#fff",
    //               }}
    //             >
    //               {selectedStock.status}
    //             </span>
    //             <select
    //               style={{
    //                 border: "1px solid #e6e6e6",
    //                 backgroundColor: "#ffffff",
    //                 padding: "8px",
    //                 borderRadius: "4px",
    //               }}
    //             >
    //               {" "}
    //               {selectedStock.status === "Ordered" ? (
    //                 <option value="">In Transit</option>
    //               ) : (
    //                 <option value="">Reached</option>
    //               )}
    //             </select>
    //           </div>
    //           <div
    //             style={{
    //               display: "flex",
    //               justifyContent: "space-between",
    //               fontSize: "14px",
    //               marginBottom: "10px",
    //             }}
    //           >
    //             <span>
    //               Reference No :{" "}
    //               <strong>{selectedStock.referenceNumber || "N/A"}</strong>
    //             </span>
    //             <span>Date: {new Date().toLocaleDateString()}</span>
    //           </div>
    //           <div
    //             style={{
    //               marginTop: "10px",
    //               border: "1px solid #e6e6e6",
    //               borderRadius: "16px",
    //               padding: "16px",
    //               backgroundColor: "#fff",
    //               marginBottom: "20px",
    //             }}
    //           >
    //             <div
    //               style={{
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 marginBottom: "40px",
    //               }}
    //             >
    //               <div>
    //                 <span>Customer</span>
    //                 <br />
    //                 <span>
    //                   <span>{selectedStock.supplier?.supplierName || "N/A"}</span>
    //                 </span>
    //               </div>
    //               <div>
    //                 <span>From Warehouse</span>
    //                 <br />
    //                 <span>
    //                   {selectedStock.products[0]?.product?.warehouse
    //                     ?.warehouseName || "N/A"}
    //                 </span>
    //               </div>
    //             </div>
    //             <div style={{ marginBottom: "30px" }}>
    //               <span style={{ fontSize: "16px", color: "#262626", fontWeight:"bold" }}>
    //                 Products
    //               </span>
    //               <div
    //                 style={{
    //                   border: "1px solid #e6e6e6",
    //                   borderRadius: "8px",
    //                   marginTop: "10px",
    //                   overflowX: "auto",
    //                 }}
    //               >
    //                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
    //                   <thead>
    //                     <tr
    //                       style={{
    //                         backgroundColor: "#f5f5f5",
    //                         color: "#444",
    //                         textAlign: "left",
    //                         fontWeight:"400"
    //                       }}
    //                     >
    //                       <th style={{ padding: "10px" }}>
    //                         <input type="checkbox" />
    //                       </th>
    //                       <th style={{ padding: "10px" }}>Product</th>
    //                       <th style={{ padding: "10px" }}>SKU</th>
    //                       <th style={{ padding: "10px" }}>Quantity</th>
    //                       <th style={{ padding: "10px" }}>Unit Price</th>
    //                       <th style={{ padding: "10px" }}>Total Price</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
    //                       <td style={{ padding: "10px" }}>
    //                         <input type="checkbox" />
    //                       </td>
    //                       <td style={{ padding: "10px" }}>
    //                         {selectedStock.products[0]?.product?.productName}
    //                       </td>
    //                       <td style={{ padding: "10px" }}>
    //                         SKU{selectedStock.products[0]?.product?.sku || "N/A"}
    //                       </td>

    //                       <td style={{ padding: "10px" }}>{quantity}</td>
    //                       <td style={{ padding: "10px" }}>₹{unitPrice}</td>
    //                       <td style={{ padding: "10px" }}>
    //                         ₹{(quantity * unitPrice).toLocaleString()}
    //                       </td>
    //                     </tr>
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>

    //             {/* Subtotal Section */}
    //             <div style={{ paddingTop: "10px", marginBottom: "20px" }}>
    //               <table
    //                 style={{
    //                   width: "100%",
    //                   borderCollapse: "collapse",
    //                   fontSize: "14px",
    //                 }}
    //               >
    //                 <tbody>
    //                   <tr style={{}}>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       Subtotal
    //                     </td>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       ₹{subtotal.toLocaleString()}
    //                     </td>
    //                   </tr>
    //                   <tr style={{}}>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       CGST ({cgst}%)
    //                     </td>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       ₹{((subtotal * cgst) / 100).toLocaleString()}
    //                     </td>
    //                   </tr>
    //                   <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       SGST ({sgst}%)
    //                     </td>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       ₹{((subtotal * sgst) / 100).toLocaleString()}
    //                     </td>
    //                   </tr>
    //                   <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       Shipping Charges
    //                     </td>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       ₹{shippingCharges.toLocaleString()}
    //                     </td>
    //                   </tr>
    //                   <tr style={{ borderTop: "1px solid #e6e6e6" }}>
    //                     <td
    //                       style={{
    //                         padding: "10px",
    //                         textAlign: "right",
    //                         fontWeight: "bold",
    //                       }}
    //                     >
    //                       Total Price
    //                     </td>
    //                     <td
    //                       style={{
    //                         padding: "10px",
    //                         textAlign: "right",
    //                         fontWeight: "bold",
    //                       }}
    //                     >
    //                       ₹{totalPrice.toLocaleString()}
    //                     </td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </div>

    //             {/* Other Info */}
    //             <div
    //               style={{
    //                 border: "1px solid #e6e6e6",
    //                 backgroundColor: "#ffffff",
    //                 borderRadius: "16px",
    //                 gap: "16px",
    //                 marginTop: "10px",
    //                 padding: "16px",
    //               }}
    //             >
    //               <span style={{ fontSize: "16px", color: "#262626" }}>
    //                 Other Info
    //               </span>
    //               <div
    //                 style={{ display: "flex", justifyContent: "space-between" }}
    //               >
    //                 <div>
    //                   <span>Payments Method</span>
    //                   <br />
    //                   <input
    //                     type="text"
    //                     placeholder="Net Banking"
    //                     style={{
    //                       border: "1px solid #c2c2c2",
    //                       padding: "10px 16px",
    //                       color: "#000000",
    //                       borderRadius: "8px",
    //                     }}
    //                   />
    //                 </div>
    //                 <div>
    //                   <span>Courier Partner</span>
    //                   <br />
    //                   <input
    //                     type="text"
    //                     placeholder="Shiprocket"
    //                     style={{
    //                       border: "1px solid #c2c2c2",
    //                       padding: "10px 16px",
    //                       color: "#000000",
    //                       borderRadius: "8px",
    //                     }}
    //                   />
    //                 </div>
    //                 <div>
    //                   <span>Arrival Time</span>
    //                   <br />
    //                   <input
    //                     type="text"
    //                     placeholder="2:45 PM"
    //                     style={{
    //                       border: "1px solid #c2c2c2",
    //                       padding: "10px 16px",
    //                       color: "#000000",
    //                       borderRadius: "8px",
    //                     }}
    //                   />
    //                 </div>
    //               </div>
    //             </div>
    //           </div>

    //           {/* Close Button */}
    //           <button
    //             onClick={closePopup}
    //             style={{
    //               marginTop: "15px",
    //               padding: "8px 16px",
    //               backgroundColor: "#dc3545",
    //               color: "#fff",
    //               border: "none",
    //               borderRadius: "4px",
    //               cursor: "pointer",
    //               float: "right",
    //             }}
    //           >
    //             Close
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    //   </div>
    // </div>
  );
}

export default StockMovementLog;
