// import React from 'react'
// import { FaFileExcel, FaFilePdf } from 'react-icons/fa'
// import { TbEdit, TbEye, TbTrash } from 'react-icons/tb'
// import AddWarehouseModal from '../../../pages/Modal/warehouse/AddWarehouseModal'

// const Warehouse = () => {
//     return (
//         <div className="page-wrapper">
//             <div className="content">
//                 <div className="page-header">
//                     <div className="add-item d-flex">
//                         <div className="page-title">
//                             <h4>Warehouses</h4>
//                             <h6>Manage your warehouses</h6>
//                         </div>
//                     </div>
//                     <div className="table-top-head me-2">
//                         <li><button type="button" className="icon-btn" title="Pdf">
//                             <FaFilePdf /></button></li>
//                         <li><label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls"
//                             hidden />
//                             <FaFileExcel style={{ color: "green" }} /></label></li>
//                         <li><button type="button" className="icon-btn" title="Export Excel">
//                             <FaFileExcel /></button></li>
//                     </div>
//                     <div className="page-btn">
//                         <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-warehouse"><i
//                             className="ti ti-circle-plus me-1" />Add Warehouse</a>
//                     </div>
//                 </div>
//                 {/* /product list */}
//                 <div className="card">
//                     <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
//                         <div className="search-set">
//                             <div className="search-input">
//                                 <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
//                             </div>
//                         </div>
//                         <div
//                             className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
//                             <div className="dropdown">
//                                 <a href="javascript:void(0);"
//                                     className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
//                                     data-bs-toggle="dropdown">
//                                     Status
//                                 </a>
//                                 <ul className="dropdown-menu  dropdown-menu-end p-3">
//                                     <li>
//                                         <a href="javascript:void(0);" className="dropdown-item rounded-1">Active</a>
//                                     </li>
//                                     <li>
//                                         <a href="javascript:void(0);" className="dropdown-item rounded-1">Inactive</a>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="card-body p-0">
//                         <div className="table-responsive">
//                             <table className="table datatable">
//                                 <thead className="thead-light">
//                                     <tr>
//                                         <th className="no-sort">
//                                             <label className="checkboxs">
//                                                 <input type="checkbox" id="select-all" />
//                                                 <span className="checkmarks" />
//                                             </label>
//                                         </th>
//                                         <th>Warehouse</th>
//                                         <th>Contact Person</th>
//                                         <th>Phone</th>
//                                         <th>Total Products</th>
//                                         <th>Stock</th>
//                                         <th>Qty</th>
//                                         <th>Created On</th>
//                                         <th>status</th>
//                                         <th className="no-sort" />
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     <tr>
//                                         <td>
//                                             <label className="checkboxs">
//                                                 <input type="checkbox" />
//                                                 <span className="checkmarks" />
//                                             </label>
//                                         </td>
//                                         <td className="text-gray-9">Lavish Warehouse </td>
//                                         <td>
//                                             <div className="d-flex align-items-center">
//                                                 <a href="#" className="avatar avatar-md"><img
//                                                     src="assets/img/warehouse/avatar-01.png"
//                                                     className="img-fluid rounded-2" alt="img" /></a>
//                                                 <div className="ms-2">
//                                                     <p className="mb-0"><a href="#" className="text-default">Chad Taylor</a>
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td>
//                                             +12498345785
//                                         </td>
//                                         <td>10</td>
//                                         <td>
//                                             600
//                                         </td>
//                                         <td>
//                                             80
//                                         </td>
//                                         <td>
//                                             24 Dec 2024
//                                         </td>
//                                         <td>
//                                             <span className="badge badge-success d-inline-flex align-items-center badge-xs">
//                                                 <i className="ti ti-point-filled me-1" />Active
//                                             </span>
//                                         </td>
//                                         <td className="action-table-data">
//                                             <div className="edit-delete-action">
//                                                 <a className="me-2 p-2"

//                                                 >
//                                                     <TbEye />
//                                                 </a>

//                                                 <a className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-role">
//                                                     <TbEdit />
//                                                 </a>

//                                                 <a className="p-2">
//                                                     <TbTrash />
//                                                 </a>
//                                             </div>
//                                         </td>

//                                     </tr>

//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//                 {/* /product list */}
//             </div>
//             <AddWarehouseModal />
//         </div>

//     )
// }

// export default Warehouse

/* -----------------------------------------------------------------
   src/pages/Warehouse/Warehouse.jsx
------------------------------------------------------------------ */
// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { TbEdit, TbEye, TbTrash } from "react-icons/tb";
// import BASE_URL from "../../../pages/config/config";
// import AddWarehouseModal from "../../../pages/Modal/warehouse/AddWarehouseModal";

// const Warehouse = () => {
//     /* ---------------- state ---------------- */
//     const [warehouses, setWarehouses] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const [mapOpen, setMapOpen] = useState(false);
//     const [selectedRackSet, setSelectedRack] = useState([]);

//     /* -------------- helpers --------------- */
//     const formatDate = (iso) =>
//         new Date(iso).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//         });

//     /* --------------- fetch ---------------- */
//     const fetchWarehouses = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`${BASE_URL}/api/warehouse`);
//             setWarehouses(res.data.data);         // { success, data }
//         } catch (err) {
//             setError(err);
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchWarehouses();
//         const listener = () => fetchWarehouses();
//         window.addEventListener("warehouse-added", listener);
//         return () => window.removeEventListener("warehouse-added", listener);
//     }, [fetchWarehouses]);

//     /* -------------- open map -------------- */
//     const openRackMap = (racks) => {
//         setSelectedRack(racks);
//         setMapOpen(true);
//     };

//     /* --------------- render --------------- */
//     return (
//         <div className="page-wrapper">
//             <div className="content">
//                 {/* ---------- Header ---------- */}
//                 <div className="page-header">
//                     <div className="add-item d-flex">
//                         <div className="page-title">
//                             <h4>Warehouses</h4>
//                             <h6>Manage your warehouses</h6>
//                         </div>
//                     </div>

//                     <div className="table-top-head me-2">
//                         <button className="icon-btn" title="Pdf">
//                             <FaFilePdf />
//                         </button>
//                         <button className="icon-btn" title="Export Excel">
//                             <FaFileExcel />
//                         </button>
//                     </div>

//                     <div className="page-btn">
//                         <button
//                             className="btn btn-primary"
//                             data-bs-toggle="modal"
//                             data-bs-target="#add-warehouse"
//                         >
//                             <i className="ti ti-circle-plus me-1" />
//                             Add Warehouse
//                         </button>
//                     </div>
//                 </div>

//                 {/* ---------- Table ---------- */}
//                 <div className="card">
//                     <div className="card-body p-0">
//                         {loading ? (
//                             <p className="p-4 mb-0">Loading warehouses…</p>
//                         ) : error ? (
//                             <p className="p-4 text-danger">
//                                 Failed to load warehouses. Please try again.
//                             </p>
//                         ) : warehouses.length === 0 ? (
//                             <p className="p-4 mb-0">No warehouses found.</p>
//                         ) : (
//                             <div className="table-responsive">
//                                 <table className="table">
//                                     <thead className="thead-light">
//                                         <tr>
//                                             <th>#</th>
//                                             <th>Warehouse</th>
//                                             <th>Contact Person</th>
//                                             <th>Phone</th>
//                                             <th>Space (sq ft)</th>
//                                             <th>Items</th>
//                                             <th>Racks</th>
//                                             <th>Capacity</th>
//                                             <th>Created On</th>
//                                             <th>Status</th>
//                                             <th />
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {warehouses.map((w, idx) => (
//                                             <tr key={w._id}>
//                                                 <td>{idx + 1}</td>
//                                                 <td>{w.warehouseName}</td>
//                                                 <td>
//                                                     {w.contactPerson
//                                                         ? `${w.contactPerson.firstName} ${w.contactPerson.lastName}`
//                                                         : "--"}
//                                                 </td>
//                                                 <td>{w.phone}</td>
//                                                 <td>{w.space}</td>
//                                                 <td>{w.items}</td>
//                                                 <td>{w.racks?.length ?? 0}</td>
//                                                 <td>{w.capacityEstimate ?? "--"}</td>
//                                                 <td>{formatDate(w.createdAt)}</td>
//                                                 <td>
//                                                     <span
//                                                         className={`badge ${w.status === "Active"
//                                                             ? "badge-success"
//                                                             : "badge-danger"
//                                                             }`}
//                                                     >
//                                                         {w.status}
//                                                     </span>
//                                                 </td>

//                                                 <td className="action-table-data">
//                                                     <div className="edit-delete-action d-flex gap-2">
//                                                         <button
//                                                             className="btn btn-sm btn-light"
//                                                             onClick={() => openRackMap(w.racks)}
//                                                             title="View Rack Map"
//                                                         >
//                                                             <TbEye />
//                                                         </button>
//                                                         <button className="btn btn-sm btn-light">
//                                                             <TbEdit />
//                                                         </button>
//                                                         <button className="btn btn-sm btn-light">
//                                                             <TbTrash />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* ---------- Rack‑layout modal ---------- */}
//             {mapOpen && (
//                 <div
//                     className="modal fade show d-block"
//                     style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//                 >
//                     <div className="modal-dialog modal-lg modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Warehouse Rack Layout</h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={() => setMapOpen(false)}
//                                 />
//                             </div>
//                             <div className="modal-body">
//                                 <div className="row">
//                                     {selectedRackSet.map((rack) => (
//                                         <div className="col-2 mb-3" key={rack.rackLabel}>
//                                             <div className="border p-1 bg-light text-center rounded">
//                                                 <strong>{rack.rackLabel}</strong>
//                                                 {rack.levels.map((lvl) => (
//                                                     <div
//                                                         key={lvl.level}
//                                                         className="bg-primary text-white mt-1 py-1 rounded"
//                                                         style={{ fontSize: "10px" }}
//                                                     >
//                                                         {lvl.barcode}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="modal-footer">
//                                 <button
//                                     className="btn btn-secondary"
//                                     onClick={() => setMapOpen(false)}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ---------- Add‑Warehouse modal ---------- */}
//             <AddWarehouseModal
//                 afterSave={() => window.dispatchEvent(new Event("warehouse-added"))}
//             />
//         </div>
//     );
// };

// export default Warehouse;

/* -----------------------------------------------------------------
   src/pages/Warehouse/Warehouse.jsx // previous
------------------------------------------------------------------ */
// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { TbEdit, TbEye, TbTrash } from "react-icons/tb";
// import BASE_URL from "../../../pages/config/config";
// import AddWarehouseModal from "../../../pages/Modal/warehouse/AddWarehouseModal";

// const Warehouse = () => {
//     /* ---------------- state ---------------- */
//     const [warehouses, setWarehouses] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const [mapOpen, setMapOpen] = useState(false);
//     const [selectedRack, setSelectedRack] = useState([]);

//     /* -------------- helpers --------------- */
//     const formatDate = (iso) =>
//         new Date(iso).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//         });

//     const totalBarcodes = (racks = []) =>
//         racks.reduce((sum, r) => sum + r.levels.length, 0);

//     /* --------------- fetch ---------------- */
//     const fetchWarehouses = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`${BASE_URL}/api/warehouse`); // <- endpoint
//             setWarehouses(res.data.data); // backend: { success, data }

//         } catch (err) {
//             setError(err);
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchWarehouses();
//         const listener = () => fetchWarehouses();
//         window.addEventListener("warehouse-added", listener);
//         return () => window.removeEventListener("warehouse-added", listener);
//     }, [fetchWarehouses]);

//     /* ---------- map modal handlers -------- */
//     const openRackMap = (racks) => {
//         setSelectedRack(racks);
//         setMapOpen(true);
//     };

//     /* --------------- render --------------- */
//     return (
//         <div className="page-wrapper">
//             <div className="content">
//                 {/* ---------- Header ---------- */}
//                 <div className="page-header">
//                     <div className="add-item d-flex">
//                         <div className="page-title">
//                             <h4>Warehouses</h4>
//                             <h6>Manage your warehouses</h6>
//                         </div>
//                     </div>

//                     <div className="table-top-head me-2">
//                         <button className="icon-btn" title="Pdf">
//                             <FaFilePdf />
//                         </button>
//                         <button className="icon-btn" title="Export Excel">
//                             <FaFileExcel />
//                         </button>
//                     </div>

//                     <div className="page-btn">
//                         <button
//                             className="btn btn-primary"
//                             data-bs-toggle="modal"
//                             data-bs-target="#add-warehouse"
//                         >
//                             <i className="ti ti-circle-plus me-1" />
//                             Add Warehouse
//                         </button>
//                     </div>
//                 </div>

//                 {/* ---------- Table ---------- */}
//                 <div className="card">
//                     <div className="card-body p-0">
//                         {loading ? (
//                             <p className="p-4 mb-0">Loading warehouses…</p>
//                         ) : error ? (
//                             <p className="p-4 text-danger">Failed to load warehouses.</p>
//                         ) : warehouses.length === 0 ? (
//                             <p className="p-4 mb-0">No warehouses found.</p>
//                         ) : (
//                             <div className="table-responsive">
//                                 <table className="table">
//                                     <thead className="thead-light">
//                                         <tr>
//                                             <th>#</th>
//                                             <th>Warehouse</th>
//                                             <th>Contact Person</th>
//                                             <th>Phone</th>
//                                             <th>Space (sq ft)</th>
//                                             <th>Items</th>
//                                             <th>Racks</th>
//                                             <th>Capacity</th>
//                                             <th>Barcodes</th>
//                                             <th>Created On</th>
//                                             <th>Status</th>
//                                             <th />
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                     {console.log('warehouse', warehouses)}
//                                         {warehouses.map((w, idx) => (

//                                             <tr key={w._id}>
//                                                 <td>{idx + 1}</td>
//                                                 <td>{w.warehouseName}</td>
//                                                 <td>
//                                                     {w.contactPerson
//                                                         ? `${w.contactPerson.firstName} ${w.contactPerson.lastName}`
//                                                         : "--"}
//                                                 </td>
//                                                 <td>{w.phone}</td>
//                                                 <td>{w.space}</td>
//                                                 <td>{w.items}</td>
//                                                 <td>{w.racks?.length ?? 0}</td>
//                                                 <td>{w.capacityEstimate ?? "--"}</td>
//                                                 <td>{totalBarcodes(w.racks)}</td>
//                                                 <td>{formatDate(w.createdAt)}</td>
//                                                 <td>
//                                                     <span
//                                                         className={`badge ${w.status === "Active"
//                                                             ? "badge-success"
//                                                             : "badge-danger"
//                                                             }`}
//                                                     >
//                                                         {w.status}
//                                                     </span>
//                                                 </td>
//                                                 <td className="action-table-data">
//                                                     <div className="edit-delete-action d-flex gap-2">
//                                                         <button
//                                                             className="btn btn-sm btn-light"
//                                                             onClick={() => openRackMap(w.racks)}
//                                                             title="View Rack Map"
//                                                         >
//                                                             <TbEye />
//                                                         </button>
//                                                         <button className="btn btn-sm btn-light">
//                                                             <TbEdit />
//                                                         </button>
//                                                         <button className="btn btn-sm btn-light">
//                                                             <TbTrash />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* ---------- Rack‑layout modal ---------- */}
//             {/* {mapOpen && (
//                 <div
//                     className="modal fade show d-block"
//                     style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//                 >
//                     <div className="modal-dialog modal-lg modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Warehouse Rack Layout</h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={() => setMapOpen(false)}
//                                 />
//                             </div>
//                             <div className="modal-body">
//                                 <div className="row">
//                                     {selectedRack.map((rack) => (
//                                         <div className="col-2 mb-3" key={rack.rackLabel}>
//                                             <div className="border p-1 bg-light text-center rounded">
//                                                 <strong>{rack.rackLabel}</strong>
//                                                 <div style={{ fontSize: "10px" }}>
//                                                     {rack.levels.length} barcodes
//                                                 </div>
//                                                 {rack.levels.map((lvl) => (
//                                                     <div
//                                                         key={lvl.level}
//                                                         className="bg-primary text-white mt-1 py-1 rounded"
//                                                         style={{ fontSize: "10px" }}
//                                                     >
//                                                         {lvl.barcode}
//                                                         <small className="d-block">
//                                                             {lvl.barcode.length} chars
//                                                         </small>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="modal-footer">
//                                 <button
//                                     className="btn btn-secondary"
//                                     onClick={() => setMapOpen(false)}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )} */}

//             {/* ---------- Rack‑layout modal ---------- */}
//             {mapOpen && (
//                 <div
//                     className="modal fade show d-block"
//                     style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//                 >
//                     <div className="modal-dialog modal-lg modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Warehouse Rack Layout</h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={() => setMapOpen(false)}
//                                 />
//                             </div>

//                             <div className="modal-body">
//                                 <div className="row">
//                                     {selectedRack.map((rack) => (
//                                         <div className="col-2 mb-3" key={rack.rackLabel}>
//                                             <div className="border p-1 bg-light text-center rounded">
//                                                 {/* ① rackLabel */}
//                                                 <strong>{rack.rackLabel}</strong>

//                                                 {/* ② shelfLevels + ③ capacity */}
//                                                 <div style={{ fontSize: "10px" }}>
//                                                     {rack.shelfLevels} levels • cap {rack.capacity}
//                                                 </div>

//                                                 {/* ④ barcode count */}
//                                                 {/* <div style={{ fontSize: "10px" }}>
//                                                     {rack.levels.length} barcodes
//                                                 </div> */}

//                                                 {/* individual barcodes */}
//                                                 {rack.levels.map((lvl) => (
//                                                     <div
//                                                         key={lvl.level}
//                                                         className="bg-primary text-white mt-1 py-1 rounded"
//                                                         style={{ fontSize: "10px" }}
//                                                     >
//                                                         {lvl.barcode}
//                                                         <small className="d-block">
//                                                             {lvl.barcode.length} chars
//                                                         </small>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="modal-footer">
//                                 <button className="btn btn-secondary" onClick={() => setMapOpen(false)}>
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ---------- Add‑Warehouse modal ---------- */}
//             <AddWarehouseModal
//                 afterSave={() => window.dispatchEvent(new Event("warehouse-added"))}
//             />
//         </div>
//     );
// };

// export default Warehouse;

// final gvet code
// src/pages/Warehouse/Warehouse.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { TbEdit, TbEye, TbTrash } from "react-icons/tb";
// import BASE_URL from "../../../pages/config/config";
// import AddWarehouseModal from "../../../pages/Modal/warehouse/AddWarehouseModal";
// // import "./Warehouse.css"; /* optional custom styles */

// const Warehouse = () => {
//     /* ----------------------- state ----------------------- */
//     const [warehouses, setWarehouses] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     console.log(warehouses);

//     /* --------------------- helpers ----------------------- */
//     const formatDate = (iso) =>
//         new Date(iso).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//         });

//     /* -------------------- fetch data --------------------- */
//     useEffect(() => {
//         const fetchActive = async () => {
//             setLoading(true);
//             try {
//                 const res = await axios.get(`${BASE_URL}/api/warehouse`);
//                 setWarehouses(res.data.data); // API returns { success, data }
//             } catch (err) {
//                 setError(err);
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchActive();

//         /* optional: refresh after modal close */
//         const listener = () => fetchActive();
//         window.addEventListener("warehouse-added", listener); // see modal

//         return () => window.removeEventListener("warehouse-added", listener);
//     }, []);

//     /* -------------------- render UI ---------------------- */
//     return (
//         <div className="page-wrapper">
//             <div className="content">
//                 {/* ---------- Header ---------- */}
//                 <div className="page-header">
//                     <div className="add-item d-flex">
//                         <div className="page-title">
//                             <h4>Active Warehouses</h4>
//                             <h6>Manage your warehouses</h6>
//                         </div>
//                     </div>

//                     <div className="table-top-head me-2">
//                         <button className="icon-btn" title="Pdf">
//                             <FaFilePdf />
//                         </button>
//                         <button className="icon-btn" title="Export Excel">
//                             <FaFileExcel />
//                         </button>
//                     </div>

//                     <div className="page-btn">
//                         <button
//                             className="btn btn-primary"
//                             data-bs-toggle="modal"
//                             data-bs-target="#add-warehouse"
//                         >
//                             <i className="ti ti-circle-plus me-1" />
//                             Add Warehouse
//                         </button>
//                     </div>
//                 </div>

//                 {/* ---------- Table ---------- */}
//                 <div className="card">
//                     <div className="card-body p-0">
//                         {loading ? (
//                             <p className="p-4 mb-0">Loading warehouses…</p>
//                         ) : error ? (
//                             <p className="p-4 text-danger">
//                                 Failed to load warehouses. Please try again.
//                             </p>
//                         ) : warehouses.length === 0 ? (
//                             <p className="p-4 mb-0">No active warehouses found.</p>
//                         ) : (
//                             <div className="table-responsive">
//                                 <table className="table">
//                                     <thead className="thead-light">
//                                         <tr>
//                                             <th>#</th>
//                                             <th>Warehouse</th>
//                                             <th>Contact Person</th>
//                                             <th>Phone</th>
//                                             <th>Space (sq ft)</th>
//                                             <th>Items</th>
//                                             <th>Created On</th>
//                                             <th>Status</th>
//                                             <th />
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {warehouses.map((w, idx) => (
//                                             <tr key={w._id}>
//                                                 <td>{idx + 1}</td>
//                                                 <td>{w.warehouseName}</td>
//                                                 <td>
//                                                     {w.contactPerson
//                                                         ? `${w.contactPerson.firstName} ${w.contactPerson.lastName}`
//                                                         : "--"}
//                                                 </td>
//                                                 <td>{w.phone}</td>
//                                                 <td>{w.space}</td>
//                                                 <td>{w.items}</td>
//                                                 <td>{formatDate(w.createdAt)}</td>
//                                                 <td>
//                                                     <span
//                                                         className={`badge ${w.status === "Active" ? "badge-success" : "badge-danger"
//                                                             }`}
//                                                     >
//                                                         {w.status}
//                                                     </span>
//                                                 </td>

//                                                 <td className="action-table-data">
//                                                     <div className="edit-delete-action d-flex gap-2">
//                                                         <button className="btn btn-sm btn-light">
//                                                             <TbEye />
//                                                         </button>
//                                                         <button className="btn btn-sm btn-light">
//                                                             <TbEdit />
//                                                         </button>
//                                                         <button className="btn btn-sm btn-light">
//                                                             <TbTrash />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* ---------- Modal ---------- */}
//             <AddWarehouseModal
//                 afterSave={() => window.dispatchEvent(new Event("warehouse-added"))}
//             />
//         </div>
//     );
// };

// export default Warehouse;

// import React from 'react'
// import { MdOutlineWatchLater } from "react-icons/md";
// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css'
// import "../../../styles/warehouse/warehouse.css"
// import { FaCircle } from "react-icons/fa";
// import { SiHomeassistantcommunitystore } from "react-icons/si";
// import { GiHomeGarage } from "react-icons/gi";
// import logo from '../../../assets/img/warehouse/home.png';
// const warehouseData = [
//     {
//         id: 1,
//         name: "Warehouse Noida",
//         location: "Noida, Sec-32",
//         manager: "Ajay Mehta",
//         items: 232,
//         valuation: "$73,569",
//         capacity: 80
//     },
//     {
//         id: 2,
//         name: "Warehouse Mumbai",
//         location: "Mumbai, BKC",
//         manager: "Sneha Patil",
//         items: 190,
//         valuation: "$65,420",
//         capacity: 75
//     },
//     {
//         id: 3,
//         name: "Warehouse Delhi",
//         location: "Delhi, Okhla",
//         manager: "Ravi Kumar",
//         items: 210,
//         valuation: "$70,300",
//         capacity: 68
//     }
// ];

// const OwnedwarehouseData = [
//     {
//         id: 1,
//         name: "Warehouse Noida",
//         location: "Noida, Sec-32",
//         manager: "Ajay Mehta",
//         items: 232,
//         valuation: "$73,569",
//         capacity: 80
//     },
//     {
//         id: 2,
//         name: "Warehouse Mumbai",
//         location: "Mumbai, BKC",
//         manager: "Sneha Patil",
//         items: 190,
//         valuation: "$65,420",
//         capacity: 75
//     },
//     {
//         id: 3,
//         name: "Warehouse Delhi",
//         location: "Delhi, Okhla",
//         manager: "Ravi Kumar",
//         items: 210,
//         valuation: "$70,300",
//         capacity: 68
//     }
// ];

// const ThirdwarehouseData = [
//     {
//         id: 1,
//         name: "Warehouse Noida",
//         location: "Noida, Sec-32",
//         manager: "Ajay Mehta",
//         items: 232,
//         valuation: "$73,569",
//         capacity: 80
//     },
//     {
//         id: 2,
//         name: "Warehouse Mumbai",
//         location: "Mumbai, BKC",
//         manager: "Sneha Patil",
//         items: 190,
//         valuation: "$65,420",
//         capacity: 75
//     },
// ];

// const InactivewarehouseData = [
//     {
//         id: 1,
//         name: "Warehouse Noida",
//         location: "Noida, Sec-32",
//         manager: "Ajay Mehta",
//         items: 232,
//         valuation: "$73,569",
//         capacity: 80
//     }
// ];

// function Warehouse() {
//     return (
//         <div className='container'>
//             <div >SelectWarehouse</div>
//             <div className="warehouse-wrapper">
//                 <table class="table">

//                     <thead>
//                         <tr>
//                             <th className='col' scope="col"> <span style={{ color: "#007AFF", height: "25px", width: "25px" }}><MdOutlineWatchLater /></span> Recently added</th>
//                             <th className='col' scope="col">out of Items</th>
//                             <th className='col' scope="col">Warehouse Valution</th>
//                             <th className='col' >Capacity Used </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {warehouseData.map((warehouse, index) => (
//                             <tr key={warehouse.id}>
//                                 <td scope="row">
//                                     <div className='name'>{index + 1}. {warehouse.name} </div>  <div className='recentd'>{warehouse.location} • {warehouse.manager}</div> </td>
//                                 <td>{warehouse.items}</td>
//                                 <td>{warehouse.valuation}</td>
//                                 <td className='progressbar'>
//                                     <div className="progressbar-wrapper">
//                                         <CircularProgressbar value={warehouse.capacity} text={`${warehouse.capacity}%`} />
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                     <thead>
//                         <tr>
//                             <th className='col' scope="col"><span style={{ color: "#007AFF" }} ><GiHomeGarage /></span> Owned Warehouse</th>
//                             {/* <th className='col' scope="col">out of Items</th>
//       <th className='col' scope="col">Warehouse Valution</th>
//       <th className='col' scope="col">Capacity Used</th> */}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {warehouseData.map((warehouse, index) => (
//                             <tr key={warehouse.id}>
//                                 <td scope="row">
//                                     <div className='name'>{index + 1}. {warehouse.name} </div>  <div className='recentd'>{warehouse.location} • {warehouse.manager}</div> </td>
//                                 <td>{warehouse.items}</td>
//                                 <td>{warehouse.valuation}</td>
//                                 <td className='progressbar'>
//                                     <div className="progressbar-wrapper">
//                                         <CircularProgressbar value={warehouse.capacity} text={`${warehouse.capacity}%`} />
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                     <thead>
//                         <tr>
//                             <th className='col' scope="col"> <span style={{ color: "#007AFF" }} ><SiHomeassistantcommunitystore /></span> Third Party Warehouses</th>
//                             {/* <th className='col' scope="col">out of Items</th>
//       <th className='col' scope="col">Warehouse Valution</th>
//       <th className='col' scope="col">Capacity Used</th> */}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {ThirdwarehouseData.map((warehouse, index) => (
//                             <tr key={warehouse.id}>
//                                 <td scope="row">
//                                     <div className='name'>{index + 1}. {warehouse.name} </div>  <div className='recentd'>{warehouse.location} • {warehouse.manager}</div> </td>
//                                 <td>{warehouse.items}</td>
//                                 <td>{warehouse.valuation}</td>
//                                 <td className='progressbar'>
//                                     <div className="progressbar-wrapper">
//                                         <CircularProgressbar value={warehouse.capacity} text={`${warehouse.capacity}%`} />
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                     <thead>
//                         <tr>
//                             <th className='col' scope="col"> <span style={{ color: "red" }}><FaCircle /></span>  Inactive warehouse</th>

//                         </tr>
//                     </thead>
//                     <tbody>
//                         {InactivewarehouseData.map((warehouse, index) => (
//                             <tr key={warehouse.id}>
//                                 <td scope="row">
//                                     <div className='name'>{index + 1}. {warehouse.name} </div>  <div className='recentd'>{warehouse.location} • {warehouse.manager}</div> </td>
//                                 <td>{warehouse.items}</td>
//                                 <td>{warehouse.valuation}</td>
//                                 <td className='progressbar'>
//                                     <div className="progressbar-wrapper">
//                                         <CircularProgressbar value={warehouse.capacity} text={`${warehouse.capacity}%`} />
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//             <div lassName="image-box" >
//                 <img className='homelogo' src={logo} alt="home" />
//             </div>

//         </div>
//     )
// }

// export default Warehouse

// new code for werehouse

import React, { useCallback, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { PiWarehouseFill } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import BASE_URL from "../../../pages/config/config";
import AddWarehouseModal from "../../../pages/Modal/warehouse/AddWarehouseModal";
import axios from "axios";

function Warehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState([]);

  // const toggleFavourite = (warehouse) => {
  //   setFavourites((prev) => {
  //     const exists = prev.find((fav) => fav._id === warehouse._id);
  //     if (exists) {
  //       return prev.filter((fav) => fav._id !== warehouse._id);
  //     } else {
  //       return [...prev, warehouse];
  //     }
  //   });
  // };

  const toggleFavourite = async (warehouse) => {
    try {
      const response = await axios.patch(`${BASE_URL}/api/warehouse/${warehouse._id}/toggle-favorite`);
      setWarehouses((prev) =>
        prev.map((wh) =>
          wh._id === warehouse._id ? { ...wh, isFavorite: response.data.warehouse.isFavorite } : wh
        )
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };
 

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/warehouse`); // <- endpoint

      setWarehouses(res.data.data); 
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  }, []);

  const fetchSales = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/sales`);
      setSales(res.data.sales);
    } catch (err) {
      console.error("Error fetching sales:", err);
      setSales([]);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
    fetchProducts();
    fetchSales();
  }, [fetchWarehouses, fetchProducts, fetchSales]);

  const salesMap = sales.reduce((acc, sale) => {
    if (!sale.products || !Array.isArray(sale.products)) return acc;
    sale.products.forEach((p) => {
      if (!p || !p.productId) return;
      const pid = typeof p.productId === "object" ? p.productId._id : p.productId;
      if (!pid) return;
      if (!acc[pid]) acc[pid] = 0;
      acc[pid] += p.saleQty || 0;
    });
    return acc;
  }, {});
  return (
    <div>
      {/* Warehouse header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#676767",
            display: "flex",
            gap: "16px",
            fontWeight: "500",
          }}
        >
          <span>Warehouse</span>
          <span>
            <MdArrowForwardIos style={{ color: "#b0afafff" }} />
          </span>
          <span>All Warehouse </span>
        </div>

        {/* Add Warehouse */}

        <Link to="/AddWarehouse">
          <button
            style={{
              border: "1px solid #1450AE",
              backgroundColor: "#1368EC",
              color: "white",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            Add Warehouse
          </button>
        </Link>
      </div>

      {/* Recently Accessed */}
      <div
        style={{
          fontWeight: "500",
          fontSize: "16px",
          color: "#262626",
          marginTop: "20px",
        }}
      >
        <span>Recently Accessed</span>

        {/* Cards */}

        <div
          style={{
            fontWeight: "500",
            fontSize: "16px",
            color: "#262626",
            marginTop: "10px",
            paddingBottom: "4px",
          }}
        >
          {/* Cards */}

          <div style={{ marginTop: "2px" }}>
            <div className="row">
              {console.log("wre", warehouses)}
              {warehouses.map((item) => { const filteredProducts = products.filter(
                (p) => p.warehouseName === item.warehouseName
              );
              const totalRevenue = filteredProducts.reduce((sum, p) => {
                const soldUnits = salesMap[p._id] || 0;
                const price = parseFloat(p.sellingPrice) || 0;
                return sum + soldUnits * price;
              }, 0);

              return (
                
                <div className="col-3" key={item._id}>
                  <div
                    style={{
                      backgroundColor: "#f9f9f9",
                      padding: "10px",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "30px",
                      height: "150px", 
                      position: "relative", 
                    }}
                  >
                    {/* WH-006 and Heart - Left Side */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: "10px",
                      }}
                    >
                      {/* Left: WH-006 */}
                      <div
                        style={{
                          backgroundColor: "#f1f1f1",
                          border: "1px solid #e6e6e6",
                          borderRadius: "8px",
                          padding: "10px ",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          <PiWarehouseFill
                            style={{
                              color: "#1368EC",
                              fontSize: "20px",
                              fontWeight: "bold",
                            }}
                          />
                          {item.warehouseName}
                        </span>
                      </div>

                      {/* Right: Heart icon */}
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: "#f1f1f1",
                          borderRadius: "8px",
                          width: "fit-content",
                        }}
                      >
                        <FaHeart
                          onClick={() => toggleFavourite(item)}
                          style={{
                            cursor: "pointer",
                            // color: favourites.some(
                            //   (fav) => fav._id === item._id
                            // )
                            //   ? "red"
                            //   : "#1368EC",
                            // fontWeight: "500",
                            // fontSize: "26px",
                            color: item.isFavorite ? "red" : "#1368EC",
                            fontWeight: "500",
                            fontSize: "26px",
                          }}
                        />
                      </div>
                    </div>

                    {/* Bottom Section (Address + Arrow) */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        right: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      {/* Address */}
                      <div>
                        <p style={{ margin: "0", fontWeight: "500" }}>
                          {/* Delhi - Ram Prashad */}
                          {item?.city}
                          &nbsp;-&nbsp;{item?.warehouseOwner}
                          {/* {item?.contactPerson?.lastName} */}
                        </p>
                        <span style={{ color: "#1368EC" }}>₹{totalRevenue.toLocaleString("en-IN")}</span>
                        <span style={{ marginLeft: "4px" }}>
                          Stock Valuation
                        </span>
                      </div>

                      {/* Arrow */}
                      <div>
                        <Link to={`/WarehouseDetails/${item._id}`}>
                          <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* favrouite */}

      <div
        style={{
          fontWeight: "500",
          fontSize: "16px",
          color: "#262626",
          marginTop: "10px",
          paddingBottom: "4px",
        }}
      >
        <span>Favourite</span>
        {/* hwkbf */}

        <div style={{ marginTop: "2px" }}>
          <div className="row">
            {warehouses
              .filter((item) => item.isFavorite)
              .map((fav) => (
                <div className="col-3" key={fav._id}>
                  <div
                    style={{
                      backgroundColor: "#f9f9f9",
                      padding: "10px",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      height: "150px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#f1f1f1",
                          border: "1px solid #e6e6e6",
                          borderRadius: "8px",
                          padding: "10px",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          <PiWarehouseFill
                            style={{
                              color: "#1368EC",
                              fontSize: "20px",
                              fontWeight: "bold",
                            }}
                          />
                          {fav.warehouseName}
                        </span>
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: "#f1f1f1",
                          borderRadius: "8px",
                          width: "fit-content",
                        }}
                      >
                        <FaHeart
                          onClick={() => toggleFavourite(fav)}
                          style={{
                            cursor: "pointer",
                            color: "red",
                            fontWeight: "500",
                            fontSize: "26px",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        right: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <div>
                        <p style={{ margin: "0", fontWeight: "500" }}>
                          {fav.city} - {fav.warehouseOwner}
                        </p>
                        <span style={{ color: "#1368EC" }}>
                          ₹{(
                            products
                              .filter((p) => p.warehouseName === fav.warehouseName)
                              .reduce((sum, p) => {
                                const soldUnits = salesMap[p._id] || 0;
                                const price = parseFloat(p.sellingPrice) || 0;
                                return sum + soldUnits * price;
                              }, 0)
                          ).toLocaleString("en-IN")}
                        </span>
                        <span style={{ marginLeft: "4px" }}>
                          Stock Valuation
                        </span>
                      </div>
                      <div>
                        <Link to={`/WarehouseDetails/${fav._id}`}>
                          <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {warehouses.filter((item) => item.isFavorite).length === 0 && (
              <p>No favourites yet.</p>
            )}
          </div>
        </div>
      </div>

      

      {/* Owened Warehouse */}

      <div
        style={{
          fontWeight: "500",
          fontSize: "16px",
          color: "#262626",
          marginTop: "10px",
          paddingBottom: "4px",
        }}
      >
        <span>Owened</span>

        {/* Cards */}

        <div style={{ marginTop: "2px" }}>
          <div className="row">
            <div className="col-3">
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "10px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  height: "150px",
                  position: "relative", // for absolute positioning inside
                }}
              >
                {/* WH-006 and Heart - Left Side */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                >
                  {/* Left: WH-006 */}
                  <div
                    style={{
                      backgroundColor: "#f1f1f1",
                      border: "1px solid #e6e6e6",
                      borderRadius: "8px",
                      padding: "10px ",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <PiWarehouseFill
                        style={{
                          color: "#1368EC",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      />{" "}
                      WH-001
                    </span>
                  </div>

                  {/* Right: Heart icon */}
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "#f1f1f1",
                      borderRadius: "8px",
                      width: "fit-content",
                    }}
                  >
                    <FaHeart
                      style={{
                        color: "#1368EC",
                        fontWeight: "500",
                        fontSize: "26px",
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Section (Address + Arrow) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    right: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  {/* Address */}
                  <div>
                    <p style={{ margin: "0", fontWeight: "500" }}>
                      Noida - Suraj Kumar
                    </p>
                    <span style={{ color: "#1368EC" }}>$76,986 </span>
                    <span style={{ marginLeft: "4px" }}>Stock Valuation</span>
                  </div>

                  {/* Arrow */}
                  <div>
                    <Link to="/WarehouseDetails">
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Columns (2nd) */}
          </div>
        </div>
      </div>

      {/* Third-Party warehouse */}

      <div
        style={{
          fontWeight: "500",
          fontSize: "16px",
          color: "#262626",
          marginTop: "10px",
          paddingBottom: "4px",
        }}
      >
        <span>Third-Party warehouse</span>

        {/* Cards */}

        <div style={{ marginTop: "2px" }}>
          <div className="row">
            <div className="col-3">
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "10px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  height: "150px", // Set a fixed or min height
                  position: "relative", // for absolute positioning inside
                }}
              >
                {/* WH-006 and Heart - Left Side */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                >
                  {/* Left: WH-006 */}
                  <div
                    style={{
                      backgroundColor: "#f1f1f1",
                      border: "1px solid #e6e6e6",
                      borderRadius: "8px",
                      padding: "10px ",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <PiWarehouseFill
                        style={{
                          color: "#1368EC",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      />{" "}
                      Warehouse Delhi
                    </span>
                  </div>

                  {/* Right: Heart icon */}
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "#f1f1f1",
                      borderRadius: "8px",
                      width: "fit-content",
                    }}
                  >
                    <FaHeart
                      style={{
                        color: "#1368EC",
                        fontWeight: "500",
                        fontSize: "26px",
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Section (Address + Arrow) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    right: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  {/* Address */}
                  <div>
                    <p style={{ margin: "0", fontWeight: "500" }}>
                      Delhi - Ram Prashad
                    </p>
                    <span style={{ color: "#1368EC" }}>$76,986 </span>
                    <span style={{ marginLeft: "4px" }}>Stock Valuation</span>
                  </div>

                  {/* Arrow */}
                  <div>
                    <Link to="/WarehouseDetails">
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Warehouse;



