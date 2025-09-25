import React, { useEffect, useState } from "react";
import "./AllSupplier.css";

import AddSupplierModals from "../../../pages/Modal/suppliers/AddSupplierModals";
import BASE_URL from "../../../pages/config/config";
import { TbCirclePlus, TbEdit, TbEye, TbRefresh, TbTrash } from 'react-icons/tb'
import ViewSupplierModal from "../../../pages/Modal/suppliers/ViewSupplierModal";
import { Link } from "react-router-dom";
import { FaFileExcel, FaFilePdf, FaPencilAlt } from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// function formatAddress(billing) {
//   if (!billing) return '';
//   let parts = [];
//   if (billing.address1) parts.push(billing.address1);
//   if (billing.address2) parts.push(billing.address2);
//   if (billing.city?.cityName) parts.push(billing.city.cityName);
//   if (billing.state?.stateName) parts.push(billing.state.stateName);
//   if (billing.country?.name) parts.push(billing.country.name);
//   if (billing.pincode) parts.push(billing.pincode);
//   return parts.join(', ');
// }


// function formatShipping(shipping) {
//   if (!shipping) return '';
//   let parts = [];
//   if (shipping.address1) parts.push(shipping.address1);
//   if (shipping.address2) parts.push(shipping.address2);
//   if (shipping.city?.cityName) parts.push(shipping.city.cityName);
//   if (shipping.state?.stateName) parts.push(shipping.state.stateName);
//   if (shipping.country?.name) parts.push(shipping.country.name);
//   if (shipping.pincode) parts.push(shipping.pincode);
//   return parts.join(', ');
// }

function AllSuppliers() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");


  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/api/suppliers/${id}`, {
        method: 'DELETE', headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSuppliers();
    } catch (err) {
      // handle error
    }
  };

// <<<<<<< akashDev

//   const filteredSuppliers = suppliers.filter((supplier) => {
//     const fullName = `${supplier.firstName} ${supplier.lastName}`.toLowerCase();
//     const matchSearch = supplier.supplierCode?.toLowerCase().includes(searchTerm.toLowerCase()) || fullName.includes(searchTerm.toLowerCase());
//     const matchesStatus = selectedStatus === "" || (selectedStatus === "active" && supplier.status) || (selectedStatus === "inactive" && !supplier.status);
//     return matchSearch && matchesStatus;
//   })
// =======
  // Filtered suppliers based on status
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesStatus = selectedStatus
      ? (s.status ? "Active" : "Inactive") === selectedStatus
      : true;
    return matchesStatus;
  });
// >>>>>>> main

  // Pagination logic
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredSuppliers.slice(startIndex, endIndex);

  // console.log(paginatedData[6]?.shipping.country.name);


  // const [showViewModal, setShowViewModal] = useState(false);
  const [viewSupplierId, setViewSupplierId] = useState(null);

// <<<<<<< akashDev
// =======
//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) {
//       alert("Please select at least one supplier.");
//       return;
//     }
//     if (!window.confirm(`Delete ${selectedIds.length} selected suppliers?`)) return;

//     try {
//       const token = localStorage.getItem("token");
//       await Promise.all(
//         selectedIds.map(id =>
//           fetch(`${BASE_URL}/api/suppliers/${id}`, {
//             method: "DELETE",
//             headers: { Authorization: `Bearer ${token}` },
//           })
//         )
//       );
//       setSelectedIds([]);
//       fetchSuppliers();
//     } catch (err) {
//       console.error("Bulk delete failed", err);
//     }
//   };

//   const handlePdf = () => {
//     const doc = new jsPDF();
//     doc.text("Category", 14, 15);
//     const tableColumns = ["Code", "Supplier", "Email", "Phone", "Country", "Status"];

//     const tableRows = paginatedData.map((e) => [
//       e.supplierCode,
//       e.firstName + " " + e.lastName,
//       e.email,
//       e.phone,
//       e?.shipping?.country?.name || '-',
//       e.status,
//     ]);

//     autoTable(doc, {
//       head: [tableColumns],
//       body: tableRows,
//       startY: 20,
//       styles: {
//         fontSize: 8,
//       },
//       headStyles: {
//         fillColor: [155, 155, 155],
//         textColor: "white",
//       },
//       theme: "striped",
//     });

//     doc.save("Suppliers.pdf");
//   };

//   const handleExcel = () => {

//     const tableColumns = ["Code", "Supplier", "Email", "Phone", "Country", "Status"];

//     const tableRows = paginatedData.map((e) => [
//       e.supplierCode,
//       e.firstName + " " + e.lastName,
//       e.email,
//       e.phone,
//       e?.shipping?.country?.name || '-',
//       e.status,
//     ]);

//     const data = [tableColumns, ...tableRows];

//     const worksheet = XLSX.utils.aoa_to_sheet(data);

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

//     XLSX.writeFile(workbook, "Suppliers.xlsx");
//   };

// >>>>>>> main
  return (

    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Suppliers</h4>
              <h6>Manage your suppliers</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
// <<<<<<< akashDev
//               <button type="button" className="icon-btn" title="Pdf">
//                 <FaFilePdf />
//               </button>
//             </li>
//             <li>
//               <button type="button" className="icon-btn" title="Export Excel">
//                 <FaFileExcel />
//               </button>
// =======
              {/* <button
                className="btn btn-danger me-2"
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0}
              >
                <TbTrash className="me-1" /> Delete Selected
              </button> */}

              {selectedIds.length > 0 && (
                // <div className="d-flex align-items-center mb-2">

                <button
                  className="btn btn-danger ms-3"
                  onClick={handleBulkDelete}
                >
                  <TbTrash className="me-1" /> Delete ({selectedIds.length}) Selected
                </button>
                // </div>
              )}


            </li>
            <li className="me-2">
              <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
                {/* <label className="" title="">Export : </label> */}
                <button
                  type="button"
                  title="Pdf"
                  style={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    border: "none",
                  }}
                  onClick={handlePdf}
                >
                  <FaFilePdf style={{ color: "red" }} />
                </button>

              </li>
            </li>
            <li className="me-2">
              <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
                {/* <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a> */}
                <button
                  type="button"
                  title="Export Excel"
                  style={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    border: "none",
                  }}
                  onClick={handleExcel}
                >
                  <FaFileExcel style={{ color: "green" }} />
                </button>
              </li>
            </li>
            <li className="me-2">
              <li>
                <button data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" onClick={() => location.reload()} className="fs-20" style={{ backgroundColor: 'white', color: '', padding: '5px 5px', display: 'flex', alignItems: 'center', border: '1px solid #e8eaebff', cursor: 'pointer', borderRadius: '4px' }}><TbRefresh className="ti ti-refresh" /></button>
              </li>
// >>>>>>> main
            </li>
            {/* <li className="me-2">
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
            </li> */}
          </ul>
          <div className="page-btn">
            <button onClick={() => { setShowAddModal(true); }} className="add-btn">
              <TbCirclePlus />Add Supplier
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown">
                <a
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  {selectedStatus || "Status"}
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <button

                      className="dropdown-item rounded-1"
                      onClick={() => setSelectedStatus("")}
                    >
                      All
                    </button>
                  </li>
                  <li>
                    <button

                      className="dropdown-item rounded-1"
                      onClick={() => setSelectedStatus("Active")}
                    >
                      Active
                    </button>
                  </li>
                  <li>
                    <button

                      className="dropdown-item rounded-1"
                      onClick={() => setSelectedStatus("Inactive")}
                    >
                      Inactive
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr style={{ borderTop: "1px solid #e4e0e0ff", textAlign: "center" }}>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Code</th>
                    <th>Supplier</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Country</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log("paginatedData", paginatedData)}
                  {paginatedData.map((supplier) => (
                    <tr key={supplier._id} style={{ textAlign: "center" }}>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td>{supplier.supplierCode}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {/* <a href="#" className="avatar avatar-md">
                        <img src={supplier.image ? `/uploads/${supplier.image}` : "assets/img/supplier/supplier-01.png"} className="img-fluid rounded-2" alt="img" />
                      </a> */}
                          <a href="#" className="avatar avatar-md">
                            <img
                              src={
                                supplier.images && supplier.images.length > 0
                                  ? supplier.images[0].url
                                  : "assets/img/supplier/supplier-01.png"
                              }
                              className="img-fluid rounded-2"
                              alt={`${supplier.firstName?.charAt(0) || ""}${supplier.lastName?.charAt(0) || ""}`}
                            />
                          </a>
                          <div className="ms-2">
                            <p className="text-gray-9 mb-0"><a href="#">{supplier.firstName} {supplier.lastName}</a></p>
                          </div>
                        </div>
                      </td>
                      <td>{supplier.email}</td>
                      <td>{supplier.phone}</td>

//                       <td>{supplier.billing?.country?.name}</td>


                      {/* <td>{supplier?.country}</td> */}
                      <td>{supplier?.billing?.country?.name || supplier?.shipping?.country?.name || '-'}</td>

                      <td>
                        <span className={`badge ${supplier.status ? 'badge-success' : 'badge-danger'} d-inline-flex align-items-center badge-xs`}>
                          <i className="ti ti-point-filled me-1" />{supplier.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          {/* <a className="me-2 p-2" title="View"   onClick={() => {
                    setViewSupplierId(supplier._id);
                  }}>
                        <TbEye  className="feather-view" />
                      </a> */}
                          <Link className="me-2 p-2"
                            to={`/viewsupplier/${supplier._id}`}
                            title="View"
                            style={{ color: "inherit", padding: "8px" }}
                          >
                            <TbEye className="feather-view" />
                          </Link>




                          <a className="me-2 p-2" href="#" title="Edit" onClick={() => { setEditSupplier(supplier); setShowEditModal(true); }}>
                            <TbEdit className="feather-edit" />
                          </a>
                          <a className="p-2" href="#" title="Delete" onClick={() => handleDeleteSupplier(supplier._id)}>
                            <TbTrash className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* /product list */}
        {showAddModal && !showEditModal && (
          <AddSupplierModals
            onClose={() => setShowAddModal(false)}
            onSuccess={() => { setShowAddModal(false); fetchSuppliers(); }}
          />
        )}
        {showEditModal && (
          <AddSupplierModals
            onClose={() => { setShowEditModal(false); setEditSupplier(null); }}
            onSuccess={() => { setShowEditModal(false); setEditSupplier(null); fetchSuppliers(); }}
            editSupplier={editSupplier}
          />
        )}

        {viewSupplierId && (
          <ViewSupplierModal
            supplierId={viewSupplierId}
            onClose={() => {
              setViewSupplierId(null);
            }}
          />
        )}
      </div>

    </div>

    // <div className="all-supplier-container">
    //   <div className="supplier-header">
    //     <Link
    //       to="/"
    //       style={{
    //         textDecoration: "none",
    //         color: "#676767",
    //         marginBottom: "20px",
    //       }}
    //     >
    //       Supplier
    //     </Link>

    //     {/* Three-Box */}
    //     <div className="three-box">
    //       {/* All Parties */}
    //       <div className="money-bag">
    //         <div>
    //           {/* <img src={MoneyBag} alt="money" /> */}
    //         </div>
    //         <div className="bag-content">
    //           <span style={{ color: "#676767", marginTop: "50px" }}>
    //             All Parties
    //           </span>
    //           <br />
    //           <span style={{ textAlign: "left" }}>
    //             <b>14</b>
    //           </span>
    //         </div>
    //       </div>

    //       {/* To Receive */}
    //       <div className="radio-active">
    //         <div>
    //           {/* <img src={RadioActive} alt="money" /> */}
    //         </div>
    //         <div className="bag-content">
    //           <span style={{ color: "#676767", marginTop: "50px" }}>
    //             To Receive
    //           </span>
    //           <br />
    //           <span style={{ textAlign: "left" }}>
    //             <b>₹12,75,987</b>
    //           </span>
    //         </div>
    //       </div>

    //       {/* To Pay */}
    //       <div className="Circle-logo">
    //         <div>
    //           {/* <img src={CircleLogo} alt="money" /> */}
    //         </div>
    //         <div className="bag-content">
    //           <span style={{ color: "#676767", marginTop: "50px" }}>
    //             To Pay{" "}
    //           </span>
    //           <br />
    //           <span style={{ textAlign: "left" }}>
    //             <b>₹5,987</b>
    //           </span>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Search Category & Add Supplier */}
    //     <div className="sea-cat-add">
    //       {/* Search */}
    //       <div style={{ display: "flex", justifyContent: "space-between" }}>
    //         <div style={{ display: "flex", gap: "50px" }}>
    //           <div className="search">
    //             <FaSearch />
    //             <input
    //               type="search"
    //               placeholder="Search"
    //               style={{
    //                 border: "none",
    //                 textAlign: "left",
    //                 width: "100%",
    //                 outline: "none",
    //               }}
    //             />
    //           </div>

    //           {/* Category */}
    //           <div className="select-category">
    //             <select
    //               name=""
    //               id=""
    //               style={{
    //                 border: "1px solid #e6e6e6",
    //                 backgroundColor: "#ffffff",
    //                 borderRadius: "8px",
    //                 padding: "10px 20px",
    //                 textAlign: "left", // ensures text is aligned left
    //                 direction: "ltr",
    //                 width: "200px", // optional: fixed width
    //                 outline: "none",
    //               }}
    //             >
    //               <option value="">Select Category</option>
    //             </select>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Add Supplier Button*/}

    //       <div className="Add-supplier-link">
    //         <Link
    //           to="/AddSupplier"
    //           style={{
    //             padding: "8px 15px",
    //             backgroundColor: "#1368EC",
    //             color: "white",
    //             borderRadius: "8px",
    //             border: "none",
    //             textDecoration: "none",
    //           }}
    //         >
    //           Add Supplier
    //         </Link>
    //       </div>
    //     </div>

    //     {/* Toolbar */}
    //     <div
    //       style={{
    //         backgroundColor: "white",
    //         marginTop: "30px",
    //         borderRadius: "8px",
    //       }}
    //     >
    //       <div className="overview">
    //         <div>
    //           <div className="toolbars">
    //             <div>
    //               <h3>All Supplier</h3>
    //             </div>
    //             <div className="toolbar-actions">
    //               <select
    //                 style={{
    //                   border: "1px solid #e6e6e6",
    //                   borderRadius: "8px",
    //                   padding: "10px 20px",
    //                   outline: "none",
    //                   backgroundColor: "white",
    //                   color: "#333",
    //                 }}
    //               >
    //                 <option value="">Select warehouse</option>
    //               </select>
    //             </div>
    //           </div>

    //           <div className="toolbar-actions-th" style={{justifyContent:'space-between', alignItems:'center'}}>
    //             <div className="toolbar-titles">
    //               <button className="toolbar-filter-btn">All</button>
    //             </div>

    //             <div style={{ display: "flex", gap: "16px",marginTop: "10px",marginBottom: "10px", padding:'0px 20px' }}>
    //               <div
    //                 style={{
    //                   display: "flex",
    //                   alignItems: "center",
    //                   border: "1px solid #E6E6E6",
    //                   backgroundColor: "#FFFFFF",
    //                   borderRadius: "6px",
    //                   padding: "10px",
    //                   gap: "10px",
    //                 }}
    //               >
    //                 <span>
    //                   <CiSearch />
    //                 </span>
    //                 <span>
    //                   <IoFilter />
    //                 </span>
    //               </div>

    //               {/* up & down icon */}
    //               <div
    //                 style={{
    //                   border: "1px solid #E6E6E6",
    //                   backgroundColor: "#FFFFFF",
    //                   borderRadius: "6px",
    //                   padding: "10px",
    //                 }}
    //               >
    //                 <span>
    //                   <LuArrowUpDown />
    //                 </span>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* table Container */}
    //       <div style={{ backgroundColor: "white" }}>
    //         <table className="product-table">
    //           <thead>
    //             <tr style={{ color: "#676767" }}>
    //               <th>
    //                 <input type="checkbox" />
    //               </th>
    //               <th>Supplier</th>
    //               <th>Category</th>
    //               <th>Supplier Type </th>
    //               <th>Balance</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {paginatedData.map((sales, index) => (
    //               <tr key={index}>
    //                 <td>
    //                   <input type="checkbox" />
    //                 </td>
    //                 <td>{sales.supplier}</td>
    //                 <td>
    //                   {Array.isArray(sales.category) ? (
    //                     sales.category.map((cat, i) => (
    //                       <span key={i} className="category-chip">
    //                         {" "}
    //                         {cat}{" "}
    //                       </span>
    //                     ))
    //                   ) : (
    //                     <span className="category-chip">
    //                       {" "}
    //                       {sales.category}{" "}
    //                     </span>
    //                   )}
    //                 </td>

    //                 <td>{sales.supplierType}</td>
    //                 <td>
    //                   <span
    //                     className={
    //                       sales.balance.trim().startsWith("+")
    //                         ? "balance-positive"
    //                         : "balance-negative"
    //                     }
    //                   >
    //                     {sales.balance}
    //                   </span>
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>

    //         <div className="pagination">
    //           <div className="pagination-boxx">{itemsPerPage} per page</div>
    //           <div className="pagination-boxx pagination-info">
    //             <span>
    //               {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
    //               {totalItems}
    //             </span>
    //             <span style={{ color: "grey" }}> | </span>
    //             <button
    //               disabled={currentPage === 1}
    //               onClick={() =>
    //                 setCurrentPage((prev) => Math.max(prev - 1, 1))
    //               }
    //               className="pagination-arrow"
    //             >
    //               <FaAngleLeft />
    //             </button>
    //             <button
    //               disabled={currentPage === totalPages}
    //               onClick={() =>
    //                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    //               }
    //               className="pagination-arrow"
    //             >
    //               <FaChevronRight />
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default AllSuppliers;
