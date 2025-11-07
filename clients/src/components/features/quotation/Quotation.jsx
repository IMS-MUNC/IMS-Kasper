// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const data = [
//   { name: "Jan", revenue: 12000, expense: -8000 },
//   { name: "Feb", revenue: 22000, expense: -12000 },
//   { name: "Mar", revenue: 23000, expense: -15000 },
//   { name: "Apr", revenue: 15000, expense: -10000 },
//   { name: "May", revenue: 17000, expense: -14000 },
//   { name: "Jun", revenue: 25000, expense: -18000 },
//   { name: "Jul", revenue: 20000, expense: -12000 },
//   { name: "Aug", revenue: 18000, expense: -9000 },
//   { name: "Sep", revenue: 14000, expense: -10000 },
//   { name: "Oct", revenue: 12000, expense: -11000 },
//   { name: "Nov", revenue: 10000, expense: -12000 },
//   { name: "Dec", revenue: 20000, expense: -16000 },
// ];

// export default function SalesStaticsChart() {
//   return (
//     <div className="w-full h-[350px] bg-white p-4 rounded-xl shadow">
//       <h2 className="text-lg font-semibold mb-4">Sales Statics</h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           {/* Revenue (Green) */}
//           <Bar dataKey="revenue" fill="#1E9C76" barSize={25} />
//           {/* Expense (Red, negative values) */}
//           <Bar dataKey="expense" fill="#E74C3C" barSize={25} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';

export default function GstLookup() {
  const [gstin, setGstin] = useState('27AAGCB1286Q1Z4'); // default sample
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!gstin.trim()) {
      setError('Please enter a GSTIN.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.get(
        `${BASE_URL}/api/gst/${encodeURIComponent(gstin)}`
      );
      setResponse(res.data); // same as backend/WhiteBooks response
    } catch (err) {
      setError(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 200 }}>
      <h3>GST Search (WhiteBooks Sandbox)</h3>

      <div style={{ marginBottom: 10 }}>
        <label>GSTIN:&nbsp;</label>
        <input
          type="text"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          placeholder="Enter GSTIN (e.g. 27AAGCB1286Q1Z4)"
          style={{ padding: 5, width: 250 }}
        />
      </div>

      <button onClick={handleSearch} disabled={loading} style={{ padding: '6px 12px' }}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && (
        <pre style={{ color: 'red', marginTop: 12 }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

      {response && (
        <>
          <h4 style={{ marginTop: 20 }}>Raw response (exact)</h4>
          <pre style={{ maxHeight: 400, overflow: 'auto', background: '#f5f5f5', padding: 10 }}>
            {JSON.stringify(response, null, 2)}
          </pre>

          <h4>Parsed fields</h4>
          <div>
            <strong>Legal name:</strong> {response?.data?.lgnm || '—'} <br />
            <strong>Trade name:</strong> {response?.data?.tradeNam || '—'} <br />
            <strong>GSTIN:</strong> {response?.data?.gstin || '—'} <br />
            <strong>Status:</strong> {response?.data?.sts || response?.status_desc || '—'} <br />
            <strong>State:</strong> {response?.data?.stj || '—'} <br />
            <strong>Pincode:</strong> {response?.data?.pradr?.addr?.pncd || '—'} <br />
            <strong>Address line:</strong>{' '}
            {response?.data?.pradr?.addr?.bnm
              ? `${response.data.pradr.addr.bno || ''} ${response.data.pradr.addr.bnm}, ${response.data.pradr.addr.loc}`
              : '—'}
          </div>
        </>
      )}
    </div>
  );
}


// start of GstLookup.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../../pages/config/config';

// export default function GstLookup() {
//   const [gstin, setGstin] = useState('27AAGCB1286Q1Z4'); // default from your sample
//   const [email, setEmail] = useState('khanmushtfa123@gmail.com');
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);

//   const handleSearch = async () => {
//     setLoading(true); setError(null); setResponse(null);
//     try {
//       const res = await axios.get(`${BASE_URL}/api/gst/${encodeURIComponent(gstin)}`, {
//         params: { email }
//       });
//       setResponse(res.data); // this will be exactly the WhiteBooks response shape
//     } catch (err) {
//       setError(err?.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//    <div className="page-wrapper">
//      <div className='' style={{ padding: 20 }}>
//       <h3>GST Search </h3>
//       <div>
//         <label>GSTIN: </label>
//         <input value={gstin} onChange={e => setGstin(e.target.value)} />
//       </div>
//       {/* <div>
//         <label>Registered Email (optional): </label>
//         <input value={email} onChange={e => setEmail(e.target.value)} />
//       </div> */}
//       <button onClick={handleSearch} disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>

//       {error && <pre style={{ color: 'red' }}>{JSON.stringify(error, null, 2)}</pre>}

//       {response && (
//         <>
//           <h4>Raw response (exact)</h4>
//           <pre style={{ maxHeight: 400, overflow: 'auto', background: '#f5f5f5', padding: 10 }}>
//             {JSON.stringify(response, null, 2)}
//           </pre>

//           <h4>Parsed fields</h4>
//           <div>
//             <strong>Legal name:</strong> {response?.data?.lgnm || '—'} <br/>
//             <strong>Trade name:</strong> {response?.data?.tradeNam || '—'} <br/>
//             <strong>GSTIN:</strong> {response?.data?.gstin || '—'} <br/>
//             <strong>Status:</strong> {response?.data?.sts || response?.status_desc || '—'} <br/>
//             <strong>State:</strong> {response?.data?.stj || '—'} <br/>
//             <strong>Pincode:</strong> {response?.data?.pradr?.addr?.pncd || '—'} <br/>
//             <strong>Address line:</strong> {response?.data?.pradr?.addr?.bnm ? `${response.data.pradr.addr.bno || ''} ${response.data.pradr.addr.bnm}, ${response.data.pradr.addr.loc}` : '—'}
//           </div>
//         </>
//       )}
//     </div>
//    </div>
//   );
// }
// end of GstLookup.jsx


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts";
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";

// const BASE_URL = "http://localhost:5000"; // 🔧 apna API base URL daalna

// export default function ProductStatsWithFilter() {
//   const [sales, setSales] = useState([]);
//   const [purchases, setPurchases] = useState([]);
//   const [data, setData] = useState([]);

//   const [filterType, setFilterType] = useState("month"); // "week" | "month" | "custom"
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   // ✅ Calculate date range based on filter
//   const getDateRange = () => {
//     const now = new Date();
//     let start = null;
//     let end = now;

//     if (filterType === "week") {
//       const firstDay = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
//       start = firstDay;
//     } else if (filterType === "month") {
//       start = new Date(now.getFullYear(), now.getMonth(), 1); // 1st of month
//     } else if (filterType === "custom") {
//       start = startDate;
//       end = endDate;
//     }

//     return {
//       startDate: start ? start.toISOString().slice(0, 10) : "",
//       endDate: end ? end.toISOString().slice(0, 10) : "",
//     };
//   };

//   // ✅ Fetch Sales
//   const fetchSales = async () => {
//     try {
//       const { startDate, endDate } = getDateRange();
//       const res = await axios.get(`${BASE_URL}/api/sales`, {
//         params: { startDate, endDate, limit: 1000 },
//       });
//       setSales(res.data.sales || []);
//     } catch (err) {
//       console.error("Error fetching sales:", err);
//     }
//   };

//   // ✅ Fetch Purchases
//   const fetchPurchases = async () => {
//     try {
//       const { startDate, endDate } = getDateRange();
//       const res = await axios.get(`${BASE_URL}/api/purchases`, {
//         params: { startDate, endDate, limit: 1000 },
//       });
//       setPurchases(res.data.purchases || []);
//     } catch (err) {
//       console.error("Error fetching purchases:", err);
//     }
//   };

//   // ✅ Aggregate Data Product-wise
//   useEffect(() => {
//     const productMap = {};

//     sales.forEach((sale) => {
//       (sale.products || []).forEach((pr) => {
//         const name = pr.productName || pr.name || "N/A";
//         if (!productMap[name]) {
//           productMap[name] = {
//             name,
//             salesQty: 0,
//             salesAmount: 0,
//             purchaseQty: 0,
//             purchaseAmount: 0,
//           };
//         }
//         productMap[name].salesQty += pr.saleQty || 0;
//         productMap[name].salesAmount += (pr.saleQty || 0) * (pr.sellingPrice || 0);
//       });
//     });

//     purchases.forEach((purchase) => {
//       (purchase.products || []).forEach((pr) => {
//         const name = pr.productName || pr.name || "N/A";
//         if (!productMap[name]) {
//           productMap[name] = {
//             name,
//             salesQty: 0,
//             salesAmount: 0,
//             purchaseQty: 0,
//             purchaseAmount: 0,
//           };
//         }
//         productMap[name].purchaseQty += pr.quantity || 0;
//         productMap[name].purchaseAmount += (pr.quantity || 0) * (pr.purchasePrice || 0);
//       });
//     });

//     setData(Object.values(productMap));
//   }, [sales, purchases]);

//   // ✅ Refetch when filter changes
//   useEffect(() => {
//     fetchSales();
//     fetchPurchases();
//   }, [filterType, startDate, endDate]);

//   return (
//     <div className="page-wrapper shadow-md rounded-2xl">
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//         <div>📊 Product-wise Sales vs Purchases</div>

//         {/* 🔹 Filters */}
//         <div className="flex gap-2 items-center">
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="border px-3 py-2 rounded"
//           >
//             <option value="week">This Week</option>
//             <option value="month">This Month</option>
//             <option value="custom">Custom</option>
//           </select>

//           {filterType === "custom" && (
//             <div className="flex gap-2">
//               <DatePicker
//                 selected={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 placeholderText="Start Date"
//                 className="border px-2 py-1 rounded"
//               />
//               <DatePicker
//                 selected={endDate}
//                 onChange={(date) => setEndDate(date)}
//                 placeholderText="End Date"
//                 className="border px-2 py-1 rounded"
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       <div>
//         {data.length === 0 ? (
//           <p className="text-muted">No data available</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={450}>
//             <BarChart data={data}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="salesQty" fill="#1368EC" name="Sales Qty" />
//               <Bar dataKey="purchaseQty" fill="#10b981" name="Purchase Qty" />
//               <Bar dataKey="salesAmount" fill="#f59e0b" name="Sales Amount" />
//               <Bar dataKey="purchaseAmount" fill="#ef4444" name="Purchase Amount" />
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// }


// 3rd
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts";

// const BASE_URL = "http://localhost:5000"; // 🔧 apna API base URL daalna

// export default function SalesPurchaseProductStats() {
//   const [sales, setSales] = useState([]);
//   const [purchases, setPurchases] = useState([]);
//   const [data, setData] = useState([]);

//   // ✅ Fetch Sales
//   const fetchSales = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/sales?limit=1000`);
//       setSales(res.data.sales || []);
//     } catch (err) {
//       console.error("Error fetching sales:", err);
//     }
//   };

//   // ✅ Fetch Purchases
//   const fetchPurchases = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/purchases?limit=1000`);
//       setPurchases(res.data.purchases || []);
//     } catch (err) {
//       console.error("Error fetching purchases:", err);
//     }
//   };

//   // ✅ Prepare Product-wise Chart Data
//   useEffect(() => {
//     const productMap = {};

//     // ---- Sales aggregation ----
//     sales.forEach((sale) => {
//       (sale.products || []).forEach((pr) => {
//         const name = pr.productName || pr.name || "N/A";
//         if (!productMap[name]) {
//           productMap[name] = { name, salesQty: 0, salesAmount: 0, purchaseQty: 0, purchaseAmount: 0 };
//         }
//         productMap[name].salesQty += pr.saleQty || 0;
//         productMap[name].salesAmount += (pr.saleQty || 0) * (pr.sellingPrice || 0);
//       });
//     });

//     // ---- Purchases aggregation ----
//     purchases.forEach((purchase) => {
//       (purchase.products || []).forEach((pr) => {
//         const name = pr.productName || pr.name || "N/A";
//         if (!productMap[name]) {
//           productMap[name] = { name, salesQty: 0, salesAmount: 0, purchaseQty: 0, purchaseAmount: 0 };
//         }
//         productMap[name].purchaseQty += pr.quantity || 0;
//         productMap[name].purchaseAmount += (pr.quantity || 0) * (pr.purchasePrice || 0);
//       });
//     });

//     // Convert object to array
//     const chartData = Object.values(productMap);

//     setData(chartData);
//   }, [sales, purchases]);

//   useEffect(() => {
//     fetchSales();
//     fetchPurchases();
//   }, []);

//   return (
//     <div className="page-wrapper shadow-md rounded-2xl">
//       {/* <CardHeader>
//         <CardTitle>Product-wise Sales vs Purchases</CardTitle>
//       </CardHeader> */}
//       <div className="content">
//         {data.length === 0 ? (
//           <p className="text-muted">No data available</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={data}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="salesQty" fill="#1368EC" name="Sales Quantity" />
//               <Bar dataKey="purchaseQty" fill="#10b981" name="Purchase Quantity" />
//               <Bar dataKey="salesAmount" fill="#f59e0b" name="Sales Amount" />
//               <Bar dataKey="purchaseAmount" fill="#ef4444" name="Purchase Amount" />
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts";

// const BASE_URL = "http://localhost:5000"; // 🔧 apna API base url daalna

// export default function SalesPurchaseStats() {
//   const [sales, setSales] = useState([]);
//   const [purchases, setPurchases] = useState([]);
//   const [data, setData] = useState([]);

//   // ✅ Fetch Sales
//   const fetchSales = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/sales?limit=1000`);
//       setSales(res.data.sales || []);
//     } catch (err) {
//       console.error("Error fetching sales:", err);
//     }
//   };

//   // ✅ Fetch Purchases
//   const fetchPurchases = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/purchases?limit=1000`);
//       setPurchases(res.data.purchases || []);
//     } catch (err) {
//       console.error("Error fetching purchases:", err);
//     }
//   };

//   // ✅ Prepare Chart Data
//   useEffect(() => {
//     const salesTotal = sales.reduce((sum, s) => {
//       return (
//         sum +
//         (s.products || []).reduce(
//           (prodSum, pr) =>
//             prodSum + (pr.saleQty || 0) * (pr.sellingPrice || 0),
//           0
//         )
//       );
//     }, 0);

//     const salesQty = sales.reduce((sum, s) => {
//       return sum + (s.products || []).reduce((q, pr) => q + (pr.saleQty || 0), 0);
//     }, 0);

//     const purchaseTotal = purchases.reduce((sum, p) => {
//       // Agar grandTotal hai toh yeh line use karo:
//       // return sum + (p.grandTotal || 0);

//       return (
//         sum +
//         (p.products || []).reduce(
//           (prodSum, pr) =>
//             prodSum + (pr.quantity || 0) * (pr.purchasePrice || 0),
//           0
//         )
//       );
//     }, 0);

//     const purchaseQty = purchases.reduce((sum, p) => {
//       return sum + (p.products || []).reduce((q, pr) => q + (pr.quantity || 0), 0);
//     }, 0);

//     setData([
//       {
//         name: "Sales",
//         Quantity: salesQty,
//         Amount: salesTotal,
//       },
//       {
//         name: "Purchases",
//         Quantity: purchaseQty,
//         Amount: purchaseTotal,
//       },
//     ]);
//   }, [sales, purchases]);

//   useEffect(() => {
//     fetchSales();
//     fetchPurchases();
//   }, []);

//   return (
//     <div className="page-wrapper shadow-md rounded-2xl">
//       {/* <CardHeader>
//         <CardTitle>Sales vs Purchases</CardTitle>
//       </CardHeader> */}
//       <div>
//         {data.length === 0 ? (
//           <p className="text-muted">No data available</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={data}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="Quantity" fill="#1368EC" barSize={40} />
//               <Bar dataKey="Amount" fill="#10b981" barSize={40} />
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// }



// import React from 'react'

// const Quotation = () => {
//   return (
//     <div>
//       <div className="page-wrapper">
//   <div className="content">
//     <div className="page-header">
//       <div className="add-item d-flex">
//         <div className="page-title">
//           <h4>Quotation List</h4>
//           <h6>Manage Your Quotation</h6>
//         </div>
//       </div>
//       <ul className="table-top-head">
//         <li>
//           <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
//         </li>
//         <li>
//           <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
//         </li>
//         <li>
//           <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i className="ti ti-refresh" /></a>
//         </li>
//         <li>
//           <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
//         </li>
//       </ul>
//       <div className="page-btn">
//         <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-quotation"><i className="ti ti-circle-plus me-1" />Add Quotation</a>
//       </div>
//     </div>
//     {/* /product list */}
//     <div className="card">
//       <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
//         <div className="search-set">
//           <div className="search-input">
//             <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
//           </div>
//         </div>
//         <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
//           <div className="dropdown me-2">
//             <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//               Product
//             </a>
//             <ul className="dropdown-menu  dropdown-menu-end p-3">
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Lenovo IdeaPad 3</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Beats Pro</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Nike Jordan</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Apple Series 5 Watch</a>
//               </li>
//             </ul>
//           </div>
//           <div className="dropdown me-2">
//             <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//               Customer
//             </a>
//             <ul className="dropdown-menu  dropdown-menu-end p-3">
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Carl Evans</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Minerva Rameriz</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Robert Lamon</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Patricia Lewis</a>
//               </li>
//             </ul>
//           </div>
//           <div className="dropdown me-2">
//             <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//               Status
//             </a>
//             <ul className="dropdown-menu  dropdown-menu-end p-3">
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Sent</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Pending</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Ordered</a>
//               </li>
//             </ul>
//           </div>
//           <div className="dropdown">
//             <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//               Sort By : Last 7 Days
//             </a>
//             <ul className="dropdown-menu  dropdown-menu-end p-3">
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Recently Added</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Ascending</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Desending</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Last Month</a>
//               </li>
//               <li>
//                 <a href="javascript:void(0);" className="dropdown-item rounded-1">Last 7 Days</a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div className="card-body p-0">
//         <div className="table-responsive">
//           <table className="table datatable">
//             <thead className="thead-light">
//               <tr>
//                 <th className="no-sort">
//                   <label className="checkboxs">
//                     <input type="checkbox" id="select-all" />
//                     <span className="checkmarks" />
//                   </label>
//                 </th>
//                 <th>Product Name</th>
//                 <th>Custmer Name</th>
//                 <th>Status</th>
//                 <th>Total</th>
//                 <th className="no-sort" />
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>
//                   <label className="checkboxs">
//                     <input type="checkbox" />
//                     <span className="checkmarks" />
//                   </label>
//                 </td>
//                 <td>
//                   <div className="d-flex align-items-center me-2">
//                     <a href="javascript:void(0);" className="avatar avatar-md me-2">
//                       <img src="assets/img/products/stock-img-01.png" alt="product" />
//                     </a>
//                     <a href="javascript:void(0);">Lenovo 3rd Generation</a>
//                   </div>
//                 </td>
//                 <td>
//                   <div className="d-flex align-items-center">
//                     <a href="javascript:void(0);" className="avatar avatar-md me-2">
//                       <img src="assets/img/users/user-27.jpg" alt="product" />
//                     </a>
//                     <a href="javascript:void(0);">Carl Evans</a>
//                   </div>
//                 </td>
//                 <td><span className="badge badge-success">Sent</span></td>
//                 <td>$550</td>
//                 <td>
//                   <div className="edit-delete-action d-flex align-items-center">
//                     <a className="me-2 p-2 mb-0 d-flex align-items-center border p-1 rounded" href="javascript:void(0);">
//                       <i data-feather="eye" className="action-eye" />
//                     </a>
//                     <a className="me-2 p-2 mb-0 d-flex align-items-center border p-1 rounded" data-bs-toggle="modal" data-bs-target="#edit-quotation">
//                       <i data-feather="edit" className="feather-edit" />
//                     </a>
//                     <a className="me-2 p-2 mb-0 d-flex align-items-center border p-1 rounded" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete">
//                       <i data-feather="trash-2" className="feather-trash-2" />
//                     </a>
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//     {/* /product list */}
//   </div>

// </div>

//     </div>
//   )
// }

// export default Quotation
