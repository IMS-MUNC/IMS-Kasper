import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import BASE_URL from "../../../../pages/config/config";
import axios from "axios"; // Make sure axios is imported
import { toast } from "react-toastify";
import { TbEdit, TbTrash } from "react-icons/tb";


const ManageStock = () => {
  const [chartType, setChartType] = useState('bar');
  const [showPurchase, setShowPurchase] = useState(true);
  const [showReturn, setShowReturn] = useState(true);
    const [logs, setLogs] = useState([]);

  console.log(logs);

  const [filters, setFilters] = useState({
    productName: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 1,
    totalRecords: 0,
  });

  // Calculate total quantity, total price, and total return quantity for all stock history (not just current page)
  const [allTotals, setAllTotals] = useState({ totalQuantity: 0, totalPrice: 0, totalReturnQty: 0, totalReturnAmount: 0, availableQty: 0, availablePrice: 0 });

  useEffect(() => {
    fetchStockHistory();
  }, [filters]);

  useEffect(() => {
    // Fetch all logs for global totals (ignore pagination)
    const fetchAllTotals = async () => {
      try {
            const token = localStorage.getItem("token");

        const response = await axios.get(`${BASE_URL}/api/stock-history`, {
          params: { ...filters, page: 1, limit: 1000000 },
          headers: {
        Authorization: `Bearer ${token}`,
      }, // large limit to get all
        });
        const allLogs = response.data.logs || [];
        let totalQuantity = 0;
        let totalPrice = 0;
        let totalReturnQty = 0;
        let totalReturnPrice = 0;
        let totalReturnAmount = 0;
        allLogs.forEach(log => {
          const qty = Number(log.quantityChanged) || 0;
          const price = Number(log.priceChanged) || 0;
          if (log.type && log.type.toLowerCase() === 'return') {
            totalReturnQty -= qty;
            totalReturnPrice += price;
            totalReturnAmount += price * qty;
          } else {
            totalQuantity += qty;
            totalPrice += price;
          }
        });
        // Available = total - return
        const availableQty = totalQuantity - totalReturnQty;
        const availablePrice = totalPrice - totalReturnPrice;
        setAllTotals({ totalQuantity, totalPrice, totalReturnQty, totalReturnAmount, availableQty, availablePrice });
      } catch (err) {
        setAllTotals({ totalQuantity: 0, totalPrice: 0, totalReturnQty: 0, totalReturnAmount: 0, availableQty: 0, availablePrice: 0 });
      }
    };
    fetchAllTotals();
    // eslint-disable-next-line
  }, [filters.productName, filters.startDate, filters.endDate]);

  const fetchStockHistory = async () => {
    try {
          const token = localStorage.getItem("token");

      const response = await axios.get(`${BASE_URL}/api/stock-history`, {
        params: filters,
        headers: {
        Authorization: `Bearer ${token}`,
      },
      });

      const { logs, totalPages, currentPage, totalRecords } = response.data;

      setLogs(logs);
      setPagination({ totalPages, currentPage, totalRecords });
    } catch (error) {
      console.error("Error fetching stock history:", error);
    }
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;

    try {
          const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/stock-history/${id}`,{
        headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      toast.success("Stock history deleted");
      fetchStockHistory(); // refresh
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete log");
    }
  };

  // Calculate total quantity and total price
  const totalQuantity = logs.reduce((sum, log) => sum + (Number(log.quantityChanged) || 0), 0);
  const totalPrice = logs.reduce((sum, log) => sum + (Number(log.priceChanged) || 0), 0);

  // Chart data logic
  const chartLabels = [];
  const chartValues = [];
  const chartColors = [];
  if (showPurchase) {
    chartLabels.push('Purchase');
    chartValues.push(allTotals.totalQuantity);
    chartColors.push('#007AFF');
  }
  if (showReturn) {
    chartLabels.push('Return');
    chartValues.push(Math.abs(allTotals.totalReturnQty));
    chartColors.push('#FF6384');
  }
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Quantity',
        data: chartValues,
        backgroundColor: chartColors,
        borderColor: chartColors,
        fill: chartType === 'line' ? false : true,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: 'Type' } },
      y: { title: { display: true, text: 'Quantity' }, beginAtZero: true },
    },
  };

  return (
    <div className="page-wrapper">
  <div className="content">
    <div className="row">
      <div className="col-xl-3 col-sm-6 col-12 d-flex">
        <div className="card dash-widget w-100">
          <div className="card-body d-flex align-items-center">
            <div className="dash-widgetimg">
              <span><img src="assets/img/icons/dash1.svg" alt="img" /></span>
            </div>
            <div className="dash-widgetcontent">
              <h5 className="mb-1"><span className="counters" data-count={allTotals.totalQuantity}>{allTotals.totalQuantity}</span></h5>
              <p className="mb-0">Total Quantity</p>
              {/* <p className="mb-0">Total Purchase Due</p> */}
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-sm-6 col-12 d-flex">
        <div className="card dash-widget dash1 w-100">
          <div className="card-body d-flex align-items-center">
            <div className="dash-widgetimg">
              <span><img src="assets/img/icons/dash2.svg" alt="img" /></span>
            </div>
            <div className="dash-widgetcontent">
              <h5 className="mb-1"><span className="counters" data-count={allTotals.totalReturnQty}>{allTotals.totalReturnQty}</span></h5>
              <p className="mb-0">Total Return Qty</p>
              {/* <p className="mb-0">Total Sales Due</p> */}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="col-xl-3 col-sm-6 col-12 d-flex">
        <div className="card dash-widget dash2 w-100">
          <div className="card-body d-flex align-items-center">
            <div className="dash-widgetimg">
              <span><img src="assets/img/icons/dash3.svg" alt="img" /></span>
            </div>
            <div className="dash-widgetcontent">
              <h5 className="mb-1">₹<span className="counters" data-count={totalPrice.toFixed(2)}>{totalPrice.toFixed(2)}</span></h5>
              <p className="mb-0">Total Amount</p>
            </div>
          </div>
        </div>
      </div> */}
      <div className="col-xl-3 col-sm-6 col-12 d-flex">
        <div className="card dash-widget dash2 w-100">
          <div className="card-body d-flex align-items-center">
            <div className="dash-widgetimg">
              <span><img src="assets/img/icons/dash3.svg" alt="img" /></span>
            </div>
            <div className="dash-widgetcontent">
              <h5 className="mb-1">₹<span className="counters" data-count={allTotals.totalPrice.toFixed(2)}>{allTotals.totalPrice.toFixed(2)}</span></h5>
              <p className="mb-0">Total Purchsae Amount</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-sm-6 col-12 d-flex">
        <div className="card dash-widget dash3 w-100">
          <div className="card-body d-flex align-items-center">
            <div className="dash-widgetimg">
              <span><img src="assets/img/icons/dash4.svg" alt="img" /></span>
            </div>
            <div className="dash-widgetcontent">
              <h5 className="mb-1">₹<span className="counters" data-count={allTotals.totalReturnAmount.toFixed(2)}>{allTotals.totalReturnAmount.toFixed(2)}</span></h5>
              <p className="mb-0">Total Return Amount</p>
            </div>
          </div>
        </div>
      </div>
    
    </div>
    {/* Button trigger modal */}
   
    {/*  Purchase history */}
      <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="search-set">
                  <div className="search-input">
                      <input
                          type="text"
                          className="form-control "
                          placeholder="Search Product"
                          value={filters.productName}
                          onChange={handleInputChange}
                      />
                  </div>
              </div>
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                  <div className="dropdown me-2">
               <input
                    type="date"
                    name="startDate"
                    className="form-control"
                    value={filters.startDate}
                    onChange={handleInputChange}
                  />                      
                  </div>
                  <div className="dropdown me-2">
                      <input
                        type="date"
                        name="endDate"
                        className="form-control"
                        value={filters.endDate}
                        onChange={handleInputChange}
                      />
                  </div>
                  
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
                              <th>HSN Code</th>
                              <th>Refrence</th>
                              <th>Supplier</th>
                               <th>Status</th>
                              <th>Purchase Price</th>
                              <th>Available  Qty</th>
                              <th>Stock Value</th>
                              <th className="no-sort" />
                          </tr>
                      </thead>
                      <tbody>

                          {logs.length > 0 ? (
                              logs.map(log => (
                                  <tr key={log._id}>

                                      <td>
                                          <label className="checkboxs">
                                              <input type="checkbox" />
                                              <span className="checkmarks" />
                                          </label>
                                      </td>

                                      <td>
                                          <div className="d-flex align-items-center">
                                              <a className="avatar avatar-md me-2">
                                                  {log.product?.image && (
                                                      <img src={log.product?.image} alt={log.productName} className="media-image" />
                                                  )}
                                              </a>
                                              <a>{log.product?.productName || log.name || 'N/A'}</a>
                                          </div>
                                      </td>

                                      <td>{log.product?.hsnCode}</td>
                                      <td>{
                                        log.notes && typeof log.notes === 'string'
                                          ? (log.notes.match(/PUR-\d+/) ? log.notes.match(/PUR-\d+/)[0] : log.notes)
                                          : '-'
                                      }</td>
                                      <td>{log.supplierName || '-'}</td>
                                      <td>{log.type || "N/A"}</td>
                                      <td>{log.priceChanged || '-'}</td>
                                      <td>{log.quantityChanged || '-'} {log.unit}</td>
                                      <td className='text-success'>{(Number(log.quantityChanged) * Number(log.priceChanged || 0)).toFixed(2)}</td>
                                      <td className="d-flex">
                                          <div className="d-flex align-items-center edit-delete-action">
                                              <a className="me-2 border rounded d-flex align-items-center p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-stock">
                                                  <TbEdit data-feather="edit" className="feather-edit" />
                                              </a>
                                              <a className="p-2 border rounded d-flex align-items-center"  data-bs-toggle="modal" data-bs-target="#delete">
                                                  <TbTrash data-feather="trash-2" className="feather-trash-2" />
                                              </a>
                                          </div>
                                      </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                  <td colSpan="8" className="text-center">No products found.</td>
                              </tr>
                          )}


                      </tbody>
                  </table>
              </div>
              
          </div>
            {/* Pagination Controls */}
<div className="d-flex justify-content-between align-items-center mb-0 p-2">
<div>
<span>Page {pagination.currentPage} of {pagination.totalPages}</span>

</div>
<div>
<span>Total Record: {pagination.totalRecords}</span>
</div>

<div>
<button className="btn btn-sm btn-outline-primary me-2" disabled={pagination.currentPage === 1} onClick={() => handlePageChange(pagination.currentPage - 1)}>Previous</button>
                <button className="btn btn-sm btn-outline-primary" disabled={pagination.currentPage === pagination.totalPages} onClick={() => handlePageChange(pagination.currentPage + 1)}>Next</button>
</div>

</div>
      </div>
    {/* Purchase history */}
  </div>

</div>

  )
}

export default ManageStock




// // src/components/StockHistory.jsx
// import React, { useEffect, useState } from "react";
// import BASE_URL from "../../../../pages/config/config";
// import axios from "axios"; // Make sure axios is imported
// import { toast } from "react-toastify";


// const StockHistory = () => {
//   const [logs, setLogs] = useState([]);

//   console.log(logs);

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

//   // Calculate total quantity, total price, and total return quantity for all stock history (not just current page)
//   const [allTotals, setAllTotals] = useState({ totalQuantity: 0, totalPrice: 0, totalReturnQty: 0, availableQty: 0, availablePrice: 0 });

//   useEffect(() => {
//     fetchStockHistory();
//   }, [filters]);

//   useEffect(() => {
//     // Fetch all logs for global totals (ignore pagination)
//     const fetchAllTotals = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/api/stock-history`, {
//           params: { ...filters, page: 1, limit: 1000000 }, // large limit to get all
//         });
//         const allLogs = response.data.logs || [];
//         let totalQuantity = 0;
//         let totalPrice = 0;
//         let totalReturnQty = 0;
//         let totalReturnPrice = 0;
//         allLogs.forEach(log => {
//           const qty = Number(log.quantityChanged) || 0;
//           const price = Number(log.priceChanged) || 0;
//           if (log.type && log.type.toLowerCase() === 'return') {
//             totalReturnQty -= qty;
//             totalReturnPrice += price;
//           } else {
//             totalQuantity += qty;
//             totalPrice += price;
//           }
//         });
//         // Available = total - return
//         const availableQty = totalQuantity - totalReturnQty;
//         const availablePrice = totalPrice - totalReturnPrice;
//         setAllTotals({ totalQuantity, totalPrice, totalReturnQty, availableQty, availablePrice });
//       } catch (err) {
//         setAllTotals({ totalQuantity: 0, totalPrice: 0, totalReturnQty: 0, availableQty: 0, availablePrice: 0 });
//       }
//     };
//     fetchAllTotals();
//     // eslint-disable-next-line
//   }, [filters.productName, filters.startDate, filters.endDate]);

//   const fetchStockHistory = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/stock-history`, {
//         params: filters,
//       });

//       const { logs, totalPages, currentPage, totalRecords } = response.data;

//       setLogs(logs);
//       setPagination({ totalPages, currentPage, totalRecords });
//     } catch (error) {
//       console.error("Error fetching stock history:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handlePageChange = (page) => {
//     setFilters({ ...filters, page });
//   };


//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this log?")) return;

//     try {
//       await axios.delete(`${BASE_URL}/api/stock-history/${id}`);
//       toast.success("Stock history deleted");
//       fetchStockHistory(); // refresh
//     } catch (err) {
//       console.error("Delete error:", err);
//       toast.error("Failed to delete log");
//     }
//   };

//   // Calculate total quantity and total price
//   const totalQuantity = logs.reduce((sum, log) => sum + (Number(log.quantityChanged) || 0), 0);
//   const totalPrice = logs.reduce((sum, log) => sum + (Number(log.priceChanged) || 0), 0);

//   return (
//     <div className="container mt-4">
//       <h4>Stock History</h4>

//       {/* Summary Cards for ALL stock history */}
//       <div className="row mb-4">
//         <div className="col-md-2">
//           <div className="card text-center border-primary">
//             <div className="card-body">
//               <h6 className="card-title">Total Quantity (All)</h6>
//               <h4 className="card-text text-primary">{allTotals.totalQuantity}</h4>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-2">
//           <div className="card text-center border-success">
//             <div className="card-body">
//               <h6 className="card-title">Total Price (All)</h6>
//               <h4 className="card-text text-success">₹{allTotals.totalPrice.toFixed(2)}</h4>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-2">
//           <div className="card text-center border-warning">
//             <div className="card-body">
//               <h6 className="card-title">Total Return Qty (All)</h6>
//               <h4 className="card-text text-warning">{allTotals.totalReturnQty}</h4>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card text-center border-info">
//             <div className="card-body">
//               <h6 className="card-title">Available Quantity (All)</h6>
//               <h4 className="card-text text-info">{allTotals.availableQty}</h4>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card text-center border-dark">
//             <div className="card-body">
//               <h6 className="card-title">Available Price (All)</h6>
//               <h4 className="card-text text-dark">₹{allTotals.availablePrice.toFixed(2)}</h4>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="row mb-4">
//         <div className="col-md-3">
//           <div className="card text-center border-primary">
//             <div className="card-body">
//               <h6 className="card-title">Total Quantity</h6>
//               <h4 className="card-text text-primary">{totalQuantity}</h4>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card text-center border-success">
//             <div className="card-body">
//               <h6 className="card-title">Total Price</h6>
//               <h4 className="card-text text-success">₹{totalPrice.toFixed(2)}</h4>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-3">
//           {/* <input
//             type="text"
//             name="product"
//             className="form-control"
//             placeholder="Product ID"
//             value={filters.product}
//             onChange={handleInputChange}
//           /> */}
//           <input
//             type="text"
//             name="productName" // <-- should match backend filter
//             className="form-control"
//             placeholder="Product Name"
//             value={filters.productName}
//             onChange={handleInputChange}
//           />

//         </div>

//         <div className="col-md-3">
//           <input
//             type="date"
//             name="startDate"
//             className="form-control"
//             value={filters.startDate}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="col-md-3">
//           <input
//             type="date"
//             name="endDate"
//             className="form-control"
//             value={filters.endDate}
//             onChange={handleInputChange}
//           />
//         </div>
//       </div>

//       <table className="table table-bordered">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Product Name</th>
//             <th>Product Code</th>
//             <th>Status</th>
//             <th>New Quantity</th>
//             <th>new Purchase Price</th>
//             <th>Action</th>

//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((log) => (
//             <tr key={log._id}>
//               <td>{new Date(log.date).toLocaleDateString()}</td>
//               <td>{log.product?.productName || "N/A"}</td>
//               <td>{log.product?.itemBarcode || "N/A"}</td>
//               <td>{log.type || "N/A"}</td>
//               <td>{log.quantityChanged}</td>
//               <td>{log.priceChanged}</td>
//               {/* <td>{log.action}</td> */}
//               <td>
//                 <button
//                   className="btn btn-sm btn-warning me-2"
//                   onClick={() => handleEdit(log)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="btn btn-sm btn-danger"
//                   onClick={() => handleDelete(log._id)}
//                 >
//                   Delete
//                 </button>
//               </td>


//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="d-flex justify-content-between">
//         <p>Total Records: {pagination.totalRecords}</p>
//         <div>
//           {Array.from({ length: pagination.totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => handlePageChange(i + 1)}
//               className={`btn btn-sm mx-1 ${pagination.currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
//                 }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockHistory;


