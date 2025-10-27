import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../../pages/config/config";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";
import RingLoader from "../../../../utils/Loader/Loader";

const Stock = (logoSrc) => {
  const [stockData, setStockData] = useState([]);
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/stock/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStockData(res.data.summary || []);
        setTotals(res.data.totals || {});
      } catch (err) {
        setError("Failed to fetch stock summary");
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("Stock Summary", 14, 10);

    const tableColumn = [
      "Product",
      "HSN Code",
      "Stock In",
      "Stock Out",
      "Purchase Return",
      "Sale Return",
      "Current Stock",
      "Purchase Amount",
      "Sales Amount",
      "Profit",
    ];

    const tableRows = stockData.map((item) => [
      item.product,
      item.hsnCode || "-",
      item.stockIn,
      item.stockOut,
      item.purchaseReturn,
      item.saleReturn,
      item.currentStock,
      item.purchaseAmount,
      item.salesAmount,
      item.profit,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("stock_summary.pdf");
  };

  const handleExcel = () => {
    const worksheetData = stockData.map((item) => ({
      Product: item.product,
      "HSN Code": item.hsnCode || "-",
      "Stock In": item.stockIn,
      "Stock Out": item.stockOut,
      "Purchase Return": item.purchaseReturn,
      "Sale Return": item.saleReturn,
      "Current Stock": item.currentStock,
      "Purchase Amount": item.purchaseAmount,
      "Sales Amount": item.salesAmount,
      Profit: item.profit,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Summary");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "stock_summary.xlsx");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4 className="fw-bold">Stock Summary</h4>
            <h6>Inventory overview and profit/loss</h6>
          </div>
          <div
            className="table-top-head me-2"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
              className="icon-btn"
            >
              <label className="" title="">
                Export :{" "}
              </label>
              <button
                onClick={handlePdf}
                title="Download PDF"
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                }}
              >
                <FaFilePdf className="fs-20" style={{ color: "red" }} />
              </button>
              <button
                onClick={handleExcel}
                title="Download Excel"
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                }}
              >
                <FaFileExcel className="fs-20" style={{ color: "orange" }} />
              </button>
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
              className="icon-btn"
            >
              <label className="" title="">
                Import :{" "}
              </label>
              <label className="" title="Import Excel">
                <button
                  type="button"
                  // onClick={handleImportClick}
                  style={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    border: "none",
                  }}
                >
                  <FaFileExcel style={{ color: "green" }} />
                </button>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  // ref={fileInputRef}
                  style={{ display: "none" }}
                />
              </label>
            </div>
        
          </div>
        </div>
        {/* Totals Card */}
        {/* <div className="row mb-3">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Purchase Qty</h6>
                <div className="fw-bold fs-10">
                  {totals.totalPurchaseQty ?? "-"}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Purchase Return Qty</h6>
                <div className="fw-bold fs-10">
                  {totals.totalPurchaseReturnQty ?? "-"}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Sale Qty</h6>
                <div className="fw-bold fs-10">
                  {totals.totalSaleQty ?? "-"}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Sale Return</h6>
                <div className="fw-bold fs-10">
                  {totals.totalSaleReturn ?? "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Purchase Amount</h6>
                <div className="fw-bold fs-10">
                  ₹{totals.totalPurchaseAmount?.toLocaleString() ?? "-"}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Sales Amount</h6>
                <div className="fw-bold fs-10">
                  ₹{totals.totalSalesAmount?.toLocaleString() ?? "-"}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Stock Value</h6>
                <div className="fw-bold fs-10">
                  ₹{totals.totalAvailableStockValue?.toLocaleString() ?? "-"}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Profit/Loss</h6>
                <div
                  className="fw-bold fs-10"
                  style={{
                    color: (totals.totalProfit ?? 0) >= 0 ? "green" : "red",
                  }}
                >
                  {totals.totalProfit ?? "-"}
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="card">
          <div className="card-body p-0">
            {loading ? (
              // <div className="text-center p-4">Loading...</div>
      
       <RingLoader progress={100} />
    
            ) : error ? (
              <div className="text-danger p-4">{error}</div>
            ) : (
              <div className="table-responsive">
                <table className="table datatable">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>HSN Code</th>
                      <th>Stock In</th>
                      <th>Stock Out</th>
                      <th>Purchase Return</th>
                      <th>Sale Return</th>
                      <th>Current Stock</th>
                      <th>Purchase Amount</th>
                      <th>Sales Amount</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No data
                        </td>
                      </tr>
                    ) : (
                      stockData.map((item) => (
                        <tr key={item.productId}>
                          <td>
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.product}
                                style={{
                                  width: 36,
                                  height: 36,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                  marginRight: 8,
                                }}
                              />
                            )}
                            {item.product}
                          </td>
                          <td>{item.hsnCode || "-"}</td>
                          <td>{item.stockIn}</td>
                          <td>{item.stockOut}</td>
                          <td>{item.purchaseReturn}</td>
                          <td>{item.saleReturn}</td>
                          <td>{item.currentStock}</td>
                          <td>{item.purchaseAmount}</td>
                          <td>{item.salesAmount}</td>
                          <td
                            style={{
                              color: item.profit >= 0 ? "green" : "red",
                            }}
                          >
                            {item.profit}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;

// import React, { useEffect, useState } from "react";
// import { Bar } from 'react-chartjs-2';
// import { Line } from 'react-chartjs-2';
// import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
// Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
// import BASE_URL from "../../../../pages/config/config";
// import axios from "axios"; // Make sure axios is imported
// import { toast } from "react-toastify";
// import { TbEdit, TbRefresh, TbTrash } from "react-icons/tb";
// import { GrFormPrevious } from 'react-icons/gr';
// import { MdNavigateNext } from 'react-icons/md';
// import dash1 from "../../../../assets/img/icons/dash1.svg";
// import dash2 from "../../../../assets/img/icons/dash2.svg";
// import dash3 from "../../../../assets/img/icons/dash3.svg";
// import dash4 from "../../../../assets/img/icons/dash4.svg";
// import Sales from "../../sales/Sales";
// import Stock from "../../inventory/stock/Stock";

// const ManageStock = () => {
//   const [chartType, setChartType] = useState('bar');
//   const [showPurchase, setShowPurchase] = useState(true);
//   const [showReturn, setShowReturn] = useState(true);
//   const [logs, setLogs] = useState([]);

//   const [filters, setFilters] = useState({
//     productName: "",
//     startDate: "",
//     endDate: "",
//     page: 1,
//     limit: 10,
//   });
//   const [pagination, setPagination] = useState({
//     totalPages: 0,
//     currentPage: 1,
//     totalRecords: 0,
//   });

//   // Selection states for bulk operations
//   const [selectedLogs, setSelectedLogs] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);

//   // Pagination state
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Calculate total quantity, total price, and total return quantity for all stock history (not just current page)
//   const [allTotals, setAllTotals] = useState({ totalQuantity: 0, totalPrice: 0, totalReturnQty: 0, totalReturnAmount: 0, availableQty: 0, availablePrice: 0 });

//   // Date validation state
//   const [dateError, setDateError] = useState("");

//   useEffect(() => {
//     fetchStockHistory();
//   }, [filters]);

//   // Manage selectAll state based on selected items
//   useEffect(() => {
//     if (logs.length > 0) {
//       const currentPageLogIds = logs.map(log => log._id);
//       const allCurrentPageSelected = currentPageLogIds.every(id => selectedLogs.includes(id));
//       setSelectAll(allCurrentPageSelected && currentPageLogIds.length > 0);
//     } else {
//       setSelectAll(false);
//     }
//   }, [selectedLogs, logs]);

//   // Reset selections when page changes
//   useEffect(() => {
//     setSelectedLogs([]);
//     setSelectAll(false);
//   }, [filters.page]);

//   // Sync filters.limit with itemsPerPage
//   useEffect(() => {
//     setFilters(prev => ({ ...prev, limit: itemsPerPage, page: 1 }));
//   }, [itemsPerPage]);

//   // Fetch totals using the new aggregation endpoint
//   const fetchAllTotals = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(`${BASE_URL}/api/stock-history/totals`, {
//         params: {
//           productName: filters.productName,
//           startDate: filters.startDate,
//           endDate: filters.endDate
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success && response.data.totals) {
//         setAllTotals(response.data.totals);
//       } else {
//         setAllTotals({ totalQuantity: 0, totalPrice: 0, totalReturnQty: 0, totalReturnAmount: 0, availableQty: 0, availablePrice: 0 });
//       }
//     } catch (err) {
//       console.error("Error fetching totals:", err);
//       setAllTotals({ totalQuantity: 0, totalPrice: 0, totalReturnQty: 0, totalReturnAmount: 0, availableQty: 0, availablePrice: 0 });
//     }
//   };

//   useEffect(() => {
//     fetchAllTotals();
//     // eslint-disable-next-line
//   }, [filters.productName, filters.startDate, filters.endDate]);

//   const fetchStockHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(`${BASE_URL}/api/stock-history`, {
//         params: filters,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const { logs, totalPages, currentPage, totalRecords } = response.data;

//       setLogs(logs);
//       setPagination({ totalPages, currentPage, totalRecords });
//     } catch (error) {
//       console.error("Error fetching stock history:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     const newFilters = { ...filters, [name]: value };

//     // Date validation
//     if (name === 'startDate' || name === 'endDate') {
//       const startDate = name === 'startDate' ? value : filters.startDate;
//       const endDate = name === 'endDate' ? value : filters.endDate;

//       if (startDate && endDate) {
//         const start = new Date(startDate);
//         const end = new Date(endDate);

//         if (start > end) {
//           toast.error("End date cannot be earlier than start date. Select a valid date range.");
//           return; // Don't update filters if validation fails
//         } else {
//           setDateError(""); // Clear error if validation passes
//         }
//       } else {
//         setDateError(""); // Clear error if one of the dates is empty
//       }
//     }

//     setFilters(newFilters);
//   };

//   const handlePageChange = (page) => {
//     setFilters({ ...filters, page });
//   };

//   // Selection handlers
//   const handleLogSelect = (logId) => {
//     setSelectedLogs(prev => {
//       if (prev.includes(logId)) {
//         return prev.filter(id => id !== logId);
//       } else {
//         return [...prev, logId];
//       }
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedLogs([]);
//     } else {
//       const currentPageLogIds = logs.map(log => log._id);
//       setSelectedLogs(currentPageLogIds);
//     }
//     setSelectAll(!selectAll);
//   };

//   const handleBulkDelete = async () => {
//     if (selectedLogs.length === 0) {
//       toast.error('Please select items to delete');
//       return;
//     }

//     if (window.confirm(`Are you sure you want to delete ${selectedLogs.length} selected item(s)?`)) {
//       try {
//         const token = localStorage.getItem("token");
//         const deletePromises = selectedLogs.map(logId =>
//           axios.delete(`${BASE_URL}/api/stock-history/${logId}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           })
//         );

//         await Promise.all(deletePromises);

//         toast.success(`Successfully deleted ${selectedLogs.length} item(s)`);
//         setSelectedLogs([]);
//         setSelectAll(false);

//         // Refresh the data
//         fetchStockHistory();
//         // Recalculate totals
//         fetchAllTotals();
//       } catch (error) {
//         console.error('Error deleting items:', error);
//         toast.error('Failed to delete selected items');
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this log?")) return;

//     try {
//       const token = localStorage.getItem("token");

//       await axios.delete(`${BASE_URL}/api/stock-history/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success("Stock history deleted");
//       fetchStockHistory(); // refresh
//       fetchAllTotals(); // recalculate totals
//     } catch (err) {
//       console.error("Delete error:", err);
//       toast.error("Failed to delete log");
//     }
//   };

//   // Calculate total quantity and total price
//   const totalQuantity = logs.reduce((sum, log) => sum + (Number(log.quantityChanged) || 0), 0);
//   const totalPrice = logs.reduce((sum, log) => sum + (Number(log.priceChanged) || 0), 0);

//   // Chart data logic
//   const chartLabels = [];
//   const chartValues = [];
//   const chartColors = [];
//   if (showPurchase) {
//     chartLabels.push('Purchase');
//     chartValues.push(allTotals.totalQuantity);
//     chartColors.push('#007AFF');
//   }
//   if (showReturn) {
//     chartLabels.push('Return');
//     chartValues.push(Math.abs(allTotals.totalReturnQty));
//     chartColors.push('#FF6384');
//   }
//   const chartData = {
//     labels: chartLabels,
//     datasets: [
//       {
//         label: 'Quantity',
//         data: chartValues,
//         backgroundColor: chartColors,
//         borderColor: chartColors,
//         fill: chartType === 'line' ? false : true,
//       },
//     ],
//   };
//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: { enabled: true },
//     },
//     scales: {
//       x: { title: { display: true, text: 'Type' } },
//       y: { title: { display: true, text: 'Quantity' }, beginAtZero: true },
//     },
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="row">
//           <div className="col-xl-3 col-sm-6 col-12 d-flex">
//             <div className="card dash-widget w-100">
//               <div className="card-body d-flex align-items-center">
//                 <div className="dash-widgetimg">
//                   <span><img src={dash1} alt="img" /></span>
//                 </div>
//                 <div className="dash-widgetcontent">
//                   <h5 className="mb-1"><span className="counters" data-count={allTotals.totalQuantity}>{allTotals.totalQuantity}</span></h5>
//                   <p className="mb-0">Total Quantity</p>
//                   {/* <p className="mb-0">Total Purchase Due</p> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-xl-3 col-sm-6 col-12 d-flex">
//             <div className="card dash-widget dash1 w-100">
//               <div className="card-body d-flex align-items-center">
//                 <div className="dash-widgetimg">
//                   <span><img src={dash2} alt="img" /></span>
//                 </div>
//                 <div className="dash-widgetcontent">
//                   <h5 className="mb-1"><span className="counters" data-count={allTotals.totalReturnQty}>{allTotals.totalReturnQty}</span></h5>
//                   <p className="mb-0">Total Return Qty</p>
//                   {/* <p className="mb-0">Total Sales Due</p> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* <div className="col-xl-3 col-sm-6 col-12 d-flex">
//         <div className="card dash-widget dash2 w-100">
//           <div className="card-body d-flex align-items-center">
//             <div className="dash-widgetimg">
//               <span><img src="assets/img/icons/dash3.svg" alt="img" /></span>
//             </div>
//             <div className="dash-widgetcontent">
//               <h5 className="mb-1">₹<span className="counters" data-count={totalPrice.toFixed(2)}>{totalPrice.toFixed(2)}</span></h5>
//               <p className="mb-0">Total Amount</p>
//             </div>
//           </div>
//         </div>
//       </div> */}
//           <div className="col-xl-3 col-sm-6 col-12 d-flex">
//             <div className="card dash-widget dash2 w-100">
//               <div className="card-body d-flex align-items-center">
//                 <div className="dash-widgetimg">
//                   <span><img src={dash3} alt="img" /></span>
//                 </div>
//                 <div className="dash-widgetcontent">
//                   <h5 className="mb-1">₹<span className="counters" data-count={allTotals.totalPrice.toFixed(2)}>{allTotals.totalPrice.toFixed(2)}</span></h5>
//                   <p className="mb-0">Total Purchsae Amount</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-xl-3 col-sm-6 col-12 d-flex">
//             <div className="card dash-widget dash3 w-100">
//               <div className="card-body d-flex align-items-center">
//                 <div className="dash-widgetimg">
//                   <span><img src={dash4} alt="img" /></span>
//                 </div>
//                 <div className="dash-widgetcontent">
//                   <h5 className="mb-1">₹<span className="counters" data-count={allTotals.totalReturnAmount.toFixed(2)}>{allTotals.totalReturnAmount.toFixed(2)}</span></h5>
//                   <p className="mb-0">Total Return Amount</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* Button trigger modal */}
//         {/*  Purchase history */}
//         <div className="card">
//           <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
//             <div className="search-set">
//               <div className="search-input">
//                 <input
//                   type="text"
//                   name="productName"
//                   className="form-control "
//                   placeholder="Search Product"
//                   value={filters.productName}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </div>
//             <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
//               {selectedLogs.length > 0 && (
//                 <div>
//                   <button
//                     data-bs-toggle="tooltip"
//                     data-bs-placement="top"
//                     title="Delete Selected"
//                     onClick={handleBulkDelete}
//                     className="fs-15"
//                     style={{
//                       backgroundColor: '#dc3545',
//                       color: 'white',
//                       padding: '5px 10px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       border: '1px solid #dc3545',
//                       cursor: 'pointer',
//                       borderRadius: '4px',
//                       marginRight: '10px'
//                     }}
//                   >
//                     <TbTrash className="me-1" /> Delete ({selectedLogs.length})
//                   </button>
//                 </div>
//               )}
//               From:
//               <div className="dropdown me">
//                 <input
//                   type="date"
//                   name="startDate"
//                   className="form-control"
//                   value={filters.startDate}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               -to-
//               <div className="dropdown me-2">
//                 <input
//                   type="date"
//                   name="endDate"
//                   className="form-control"
//                   value={filters.endDate}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               {dateError && (
//                 <div className="alert alert-danger mt-2 mb-0" role="alert" style={{ fontSize: '0.875rem' }}>
//                   <i className="fas fa-exclamation-triangle me-2"></i>
//                   {dateError}
//                 </div>
//               )}

//             </div>
//           </div>
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable">
//                 <thead className="thead-light">
//                   <tr>
//                     <th className="no-sort">
//                       <label className="checkboxs">
//                         <input
//                           type="checkbox"
//                           id="select-all"
//                           checked={selectAll}
//                           onChange={handleSelectAll}
//                         />
//                         <span className="checkmarks" />
//                       </label>
//                     </th>
//                     <th>Product</th>
//                     <th>HSN Code</th>
//                     <th>Refrence</th>
//                     <th>Supplier</th>
//                     <th>Status</th>
//                     <th>Purchase Price</th>
//                     <th>Available  Qty</th>
//                     <th>Stock Value</th>
//                     <th className="no-sort" >Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>

//                   {logs.length > 0 ? (
//                     logs.map(log => (
//                       <tr key={log._id}>

//                         <td>
//                           <label className="checkboxs">
//                             <input
//                               type="checkbox"
//                               checked={selectedLogs.includes(log._id)}
//                               onChange={() => handleLogSelect(log._id)}
//                             />
//                             <span className="checkmarks" />
//                           </label>
//                         </td>

//                         <td>
//                           <div className="d-flex align-items-center">
//                             <a className="avatar avatar-md me-2">
//                               {log.product?.image && (
//                                 <img src={log.product?.image} alt={log.productName} className="media-image" />
//                               )}
//                             </a>
//                             <a>{log.product?.productName || log.name || 'N/A'}</a>
//                           </div>
//                         </td>

//                         <td>{log.product?.hsnCode}</td>
//                         <td>{
//                           log.notes && typeof log.notes === 'string'
//                             ? (log.notes.match(/PUR-\d+/) ? log.notes.match(/PUR-\d+/)[0] : log.notes)
//                             : '-'
//                         }</td>
//                         <td>{log.product?.supplier?.firstName || '-'} {log.product?.supplier?.lastName} </td>
//                         <td>{log.type || "N/A"}</td>
//                         <td>{log.priceChanged || '-'}</td>
//                         <td>{log.quantityChanged || '-'} {log.unit}</td>
//                         <td className='text-success'>{(Number(log.quantityChanged) * Number(log.priceChanged || 0)).toFixed(2)}</td>
//                         <td className="d-flex">
//                           <div className="d-flex align-items-center edit-delete-action">
//                             {/* <a className="me-2 border rounded d-flex align-items-center p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-stock">
//                               <TbEdit data-feather="edit" className="feather-edit" />
//                             </a> */}
//                             <button
//                               className="p-2 border rounded d-flex align-items-center btn btn-link text-decoration-none"
//                               onClick={() => handleDelete(log._id)}
//                               title="Delete"
//                             >
//                               <TbTrash data-feather="trash-2" className="feather-trash-2 text-black" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="8" className="text-center">No products found.</td>
//                     </tr>
//                   )}

//                 </tbody>
//               </table>
//             </div>

//           </div>
//           {/* pagination */}
//           <div
//             className="d-flex justify-content-end gap-3"
//             style={{ padding: "10px 20px" }}
//           >
//             <select
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//               }}
//               className="form-select w-auto"
//             >
//               <option value={10}>10 Per Page</option>
//               <option value={25}>25 Per Page</option>
//               <option value={50}>50 Per Page</option>
//               <option value={100}>100 Per Page</option>
//             </select>
//             <span
//               style={{
//                 backgroundColor: "white",
//                 boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
//                 padding: "7px",
//                 borderRadius: "5px",
//                 border: "1px solid #e4e0e0ff",
//                 color: "gray",
//               }}
//             >
//               {pagination.totalRecords === 0
//                 ? "0 of 0"
//                 : `${(pagination.currentPage - 1) * itemsPerPage + 1}-${Math.min(
//                   pagination.currentPage * itemsPerPage,
//                   pagination.totalRecords
//                 )} of ${pagination.totalRecords}`}
//               <button
//                 style={{
//                   border: "none",
//                   color: "grey",
//                   backgroundColor: "white",
//                 }}
//                 onClick={() => handlePageChange(Math.max(pagination.currentPage - 1, 1))}
//                 disabled={pagination.currentPage === 1}
//               >
//                 <GrFormPrevious />
//               </button>{" "}
//               <button
//                 style={{ border: "none", backgroundColor: "white" }}
//                 onClick={() => handlePageChange(Math.min(pagination.currentPage + 1, pagination.totalPages))}
//                 disabled={pagination.currentPage === pagination.totalPages}
//               >
//                 <MdNavigateNext />
//               </button>
//             </span>
//           </div>
//         </div>
//         {/* Purchase history */}
//         <Stock/>
//       </div>

//     </div>

//   )
// }

// export default ManageStock
