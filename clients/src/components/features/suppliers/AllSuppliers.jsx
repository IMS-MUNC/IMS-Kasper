import React, { useEffect, useState } from "react";
import "./AllSupplier.css";

import AddSupplierModals from "../../../pages/Modal/suppliers/AddSupplierModals";
import BASE_URL from "../../../pages/config/config";
import {
  TbCirclePlus,
  TbEdit,
  TbEye,
  TbRefresh,
  TbTrash,
} from "react-icons/tb";
import ViewSupplierModal from "../../../pages/Modal/suppliers/ViewSupplierModal";
import { Link } from "react-router-dom";
import { FaFileExcel, FaFilePdf, FaPencilAlt } from "react-icons/fa";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function formatAddress(billing) {
  if (!billing) return "";
  let parts = [];
  if (billing.address1) parts.push(billing.address1);
  if (billing.address2) parts.push(billing.address2);
  if (billing.city?.cityName) parts.push(billing.city.cityName);
  if (billing.state?.stateName) parts.push(billing.state.stateName);
  if (billing.country?.name) parts.push(billing.country.name);
  if (billing.pincode) parts.push(billing.pincode);
  return parts.join(", ");
}

function formatShipping(shipping) {
  if (!shipping) return "";
  let parts = [];
  if (shipping.address1) parts.push(shipping.address1);
  if (shipping.address2) parts.push(shipping.address2);
  if (shipping.city?.cityName) parts.push(shipping.city.cityName);
  if (shipping.state?.stateName) parts.push(shipping.state.stateName);
  if (shipping.country?.name) parts.push(shipping.country.name);
  if (shipping.pincode) parts.push(shipping.pincode);
  return parts.join(", ");
}

function AllSuppliers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

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

  const handleDeleteSupplier = async (id,firstName) => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;
   
    try {
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/api/suppliers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
       toast.success("Supplier deleted successfully");
      fetchSuppliers();
     Swal.fire("Deleted!", `Supplier "${firstName}" has been deleted.`, "success");
    } catch (err) {
      // handle error
       console.error("Delete error:", err);
            toast.error("Failed to delete Supplier");
    }
  };

  // Filtered suppliers based on status
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.firstName?.toLowerCase().includes(searchTerm.toLowerCase().trim()) +
      s.lastName?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesStatus = selectedStatus
      ? (s.status ? "Active" : "Inactive") === selectedStatus
      : true;
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredSuppliers.slice(startIndex, endIndex);

  // console.log(paginatedData[6]?.shipping.country.name);

  // const [showViewModal, setShowViewModal] = useState(false);
  const [viewSupplierId, setViewSupplierId] = useState(null);

  const handleBulkDelete = async () => {
     const confirmed = await DeleteAlert({});
    if (!confirmed) return;
    if (selectedIds.length === 0) {
      alert("Please select at least one supplier.");
      return;
    }
    // if (!window.confirm(`Delete ${selectedIds.length} selected suppliers?`))
    //   return;

    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`${BASE_URL}/api/suppliers/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      Swal.fire("Deleted!", `${selectedIds.length} Supplier has been deleted.`, "success");
      toast.success("Selected categories deleted");
      setSelectedIds([]);
      fetchSuppliers();
    } catch (err) {
      console.error("Bulk delete failed", err);
    }
  };

  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("Category", 14, 15);
    const tableColumns = [
      "Code",
      "Supplier",
      "Email",
      "Phone",
      "Country",
      "Status",
    ];

    const tableRows = paginatedData.map((e) => [
      e.supplierCode,
      e.firstName + " " + e.lastName,
      e.email,
      e.phone,
      e.billing?.country?.name || e.shipping?.country?.name || "-",
      e.status == true ? "Active" : "Inactive",
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [155, 155, 155],
        textColor: "white",
      },
      theme: "striped",
    });

    doc.save("Suppliers.pdf");
  };

  const handleExcel = () => {
    const tableColumns = [
      "Code",
      "Supplier",
      "Email",
      "Phone",
      "Country",
      "Status",
    ];

    const tableRows = paginatedData.map((e) => [
      e.supplierCode,
      e.firstName + " " + e.lastName,
      e.email,
      e.phone,
      e.billing?.country?.name || e.shipping?.country?.name || "-",
      // e.billing?.country?.name ||e?.shipping?.country?.name || '-',
      e.status == true ? "Active" : "Inactive",
    ]);

    const data = [tableColumns, ...tableRows];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "Suppliers.xlsx");
  };

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
          <ul className="table-top-head">
            <li>
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
                  <TbTrash className="me-1" /> Delete ({selectedIds.length})
                  Selected
                </button>
                // </div>
              )}
            </li>
            <li className="me-2">
              
                <button
                data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"
                  type="button"
                  
                  
                    className="fs-20"
                   style={{ backgroundColor: 'white', color: '', padding: '6px 6px', display: 'flex', alignItems: 'center', border: '1px solid #e8eaebff', cursor: 'pointer', borderRadius: '4px' }}
                  onClick={handlePdf}
                >
                  <FaFilePdf style={{ color: "red" }} />
                </button>
              </li>
           
            <li className="me-2">   
                <button
                data-bs-toggle="tooltip" data-bs-placement="top"
                  type="button"
                  title="Export Excel"
                  className="fs-20"
                    style={{ backgroundColor: 'white', color: '', padding: '6px 6px', display: 'flex', alignItems: 'center', border: '1px solid #e8eaebff', cursor: 'pointer', borderRadius: '4px' }}
                  onClick={handleExcel}
                >
                  <FaFileExcel style={{ color: "green" }} />
                </button>
            </li>
            <li className="me-2">
              {/* <li> */}
                <button
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Refresh"
                  onClick={() => location.reload()}
                  className="fs-20"
                  // style={{
                  //   backgroundColor: "white",
                  //   color: "",
                  //   padding: "5px 5px",
                  //   display: "flex",
                  //   alignItems: "center",
                  //   border: "1px solid #e8eaebff",
                  //   cursor: "pointer",
                  //   borderRadius: "4px",
                  // }}
                   style={{ backgroundColor: 'white', color: '', padding: '6px 6px', display: 'flex', alignItems: 'center', border: '1px solid #e8eaebff', cursor: 'pointer', borderRadius: '4px' }}

                >
                  <TbRefresh className="ti ti-refresh" />
                </button>
              </li>
            {/* </li> */}
            {/* <li className="me-2">
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
            </li> */}
          </ul>
          <div className="page-btn">
            <button
              onClick={() => {
                setShowAddModal(true);
              }}
              // className="add-btn"
              className="btn btn-primary"
            >
              <TbCirclePlus />
              Add Supplier
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search Suppliers ..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>

            <div className="dropdown">
              <a
                className=" btn btn-white btn-md d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                Sort by : {selectedStatus || "Status"}
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
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th className="no-sort">
                      <label className="checkboxs">
                        {/* <input type="checkbox" id="select-all" /> */}
                        <input
                          type="checkbox"
                          checked={
                            selectedIds.length === paginatedData.length &&
                            paginatedData.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(paginatedData.map((s) => s._id));
                            } else {
                              setSelectedIds([]);
                            }
                          }}
                        />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Code</th>
                    <th>Supplier</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Country</th>
                    <th>Status</th>
                    <th className="no-sort text-center" > Action </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((supplier) => (
                    <tr key={supplier._id}>
                      <td>
                        <label className="checkboxs">
                          {/* <input type="checkbox" /> */}
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(supplier._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds([...selectedIds, supplier._id]);
                              } else {
                                setSelectedIds(
                                  selectedIds.filter(
                                    (id) => id !== supplier._id
                                  )
                                );
                              }
                            }}
                          />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td>{supplier.supplierCode}</td>
                      <td>
                        <div className="d-flex align-items-center">
                         
                          <a href="#" className="">
                           
                            {supplier.images && supplier.images.length > 0 ? (
                            <div className="avatar-placeholder rounded" style={{ width: "30px", height: "30px", overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                              src={supplier.images && supplier.images.length > 0 ? supplier.images[0].url : ""}
                              
                              style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: '' }}
                            />
                            </div>
                          ) : (
                            <div className="avatar-placeholder rounded d-flex align-items-center justify-content-center" style={{ width: "30px", height: "30px", backgroundColor: '#6c757d', color: 'white', fontWeight: 'bold' }}>
                              {supplier.firstName?.charAt(0).toUpperCase() || "N/A"}
                            </div>
                          )}
                          </a>
                          <div className="ms-2">
                            <p className="text-gray-9 mb-0">
                              <a href="#">
                                {supplier.firstName} {supplier.lastName}
                              </a>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{supplier.email}</td>
                      <td>{supplier.phone}</td>

                      {/* <td>{supplier?.country}</td> */}
                      <td>
                        {supplier?.billing?.country?.name ||
                          supplier?.shipping?.country?.name ||
                          "-"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            supplier.status ? "badge-success" : "badge-danger"
                          } d-inline-flex align-items-center badge-xs`}
                        >
                          <i className="ti ti-point-filled me-1" />
                          {supplier.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          {/* <a className="me-2 p-2" title="View"   onClick={() => {
                    setViewSupplierId(supplier._id);
                  }}>
                        <TbEye  className="feather-view" />
                      </a> */}
                          {/* <Link
                            className="me-2 p-2"
                            to={`/viewsupplier/${supplier._id}`}
                            title="View"
                            style={{ color: "inherit", padding: "8px" }}
                          >
                            <TbEye className="feather-view" />
                          </Link> */}

                          <a
                            className="me-2 p-2"
                            href="#"
                            title="Edit"
                            onClick={() => {
                              setEditSupplier(supplier);
                              setShowEditModal(true);
                            }}
                          >
                            <TbEdit className="feather-edit" />
                          </a>
                          <a
                            className="p-2"
                            href="#"
                            title="Delete"
                            onClick={() => handleDeleteSupplier(supplier._id, supplier.firstName)}
                          >
                            <TbTrash className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="d-flex justify-content-end gap-3"
              style={{ padding: "10px 20px" }}
            >
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-select w-auto"
              >
                <option value={10}>10 Per Page</option>
                <option value={25}>25 Per Page</option>
                <option value={50}>50 Per Page</option>
                <option value={100}>100 Per Page</option>
              </select>
              <span
                style={{
                  backgroundColor: "white",
                  boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
                  padding: "7px",
                  borderRadius: "5px",
                  border: "1px solid #e4e0e0ff",
                  color: "gray",
                }}
              >
                {filteredSuppliers.length === 0
                  ? "0 of 0"
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredSuppliers.length
                    )} of ${filteredSuppliers.length}`}
                <button
                  style={{
                    border: "none",
                    color: "grey",
                    backgroundColor: "white",
                  }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <GrFormPrevious />
                </button>{" "}
                <button
                  style={{ border: "none", backgroundColor: "white" }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <MdNavigateNext />
                </button>
              </span>
            </div>
          </div>
        </div>
        {/* /product list */}
        {showAddModal && !showEditModal && (
          <AddSupplierModals
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchSuppliers();
            }}
          />
        )}
        {showEditModal && (
          <AddSupplierModals
            onClose={() => {
              setShowEditModal(false);
              setEditSupplier(null);
            }}
            onSuccess={() => {
              setShowEditModal(false);
              setEditSupplier(null);
              fetchSuppliers();
            }}
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

// old code
// import React, { useEffect, useState } from "react";
// import "./AllSupplier.css";

// import AddSupplierModals from "../../../pages/Modal/suppliers/AddSupplierModals";
// import BASE_URL from "../../../pages/config/config";
// import { TbCirclePlus, TbEdit, TbEye, TbTrash } from 'react-icons/tb'
// import ViewSupplierModal from "../../../pages/Modal/suppliers/ViewSupplierModal";
// import { Link } from "react-router-dom";

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

// function AllSuppliers() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [showModal, setShowModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [suppliers, setSuppliers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editSupplier, setEditSupplier] = useState(null);
//   const [selectedIds, setSelectedIds] = useState([]);

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   const fetchSuppliers = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${BASE_URL}/api/suppliers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       setSuppliers(data);
//     } catch (err) {
//       // handle error
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSupplier = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this supplier?')) return;
//     try {
//       const token = localStorage.getItem("token");

//       await fetch(`${BASE_URL}/api/suppliers/${id}`, {
//         method: 'DELETE', headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       fetchSuppliers();
//     } catch (err) {
//       // handle error
//     }
//   };

//   // Pagination logic
//   const totalItems = suppliers.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedData = suppliers.slice(startIndex, endIndex);

//   console.log(paginatedData);

//   // const [showViewModal, setShowViewModal] = useState(false);
//   const [viewSupplierId, setViewSupplierId] = useState(null);

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

//   return (

//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4>Suppliers</h4>
//               <h6>Manage your suppliers</h6>
//             </div>
//           </div>
//           <ul className="table-top-head">
//             <li>
//               {/* <button
//                 className="btn btn-danger me-2"
//                 onClick={handleBulkDelete}
//                 disabled={selectedIds.length === 0}
//               >
//                 <TbTrash className="me-1" /> Delete Selected
//               </button> */}

//               {selectedIds.length > 0 && (
//                 // <div className="d-flex align-items-center mb-2">

//                 <button
//                   className="btn btn-danger ms-3"
//                   onClick={handleBulkDelete}
//                 >
//                   <TbTrash className="me-1" /> Delete ({selectedIds.length}) Selected
//                 </button>
//                 // </div>
//               )}

//             </li>
//             <li className="me-2">
//               <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
//             </li>
//             <li className="me-2">
//               <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
//             </li>
//             <li className="me-2">
//               <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i className="ti ti-refresh" /></a>
//             </li>
//             <li className="me-2">
//               <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
//             </li>
//           </ul>
//           <div className="page-btn">
//             <button onClick={() => { setShowAddModal(true); }} className="add-btn">
//               <TbCirclePlus />Add Supplier
//             </button>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
//             <div className="search-set">
//               <div className="search-input">
//                 <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
//               </div>
//             </div>
//             <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
//               <div className="dropdown">
//                 <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//                   Status
//                 </a>
//                 <ul className="dropdown-menu  dropdown-menu-end p-3">
//                   <li>
//                     <a href="javascript:void(0);" className="dropdown-item rounded-1">Active</a>
//                   </li>
//                   <li>
//                     <a href="javascript:void(0);" className="dropdown-item rounded-1">Inactive</a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable">
//                 <thead className="thead-light">
//                   <tr>
//                     <th className="no-sort">
//                       <label className="checkboxs">
//                         {/* <input type="checkbox" id="select-all" /> */}
//                         <input
//                           type="checkbox"
//                           checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setSelectedIds(paginatedData.map(s => s._id));
//                             } else {
//                               setSelectedIds([]);
//                             }
//                           }}
//                         />
//                         <span className="checkmarks" />
//                       </label>
//                     </th>
//                     <th>Code</th>
//                     <th>Supplier</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                     <th>Country</th>
//                     <th>Status</th>
//                     <th className="no-sort" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedData.map((supplier) => (
//                     <tr key={supplier._id}>
//                       <td>
//                         <label className="checkboxs">
//                           {/* <input type="checkbox" /> */}
//                           <input
//                             type="checkbox"
//                             checked={selectedIds.includes(supplier._id)}
//                             onChange={(e) => {
//                               if (e.target.checked) {
//                                 setSelectedIds([...selectedIds, supplier._id]);
//                               } else {
//                                 setSelectedIds(selectedIds.filter(id => id !== supplier._id));
//                               }
//                             }}
//                           />
//                           <span className="checkmarks" />
//                         </label>
//                       </td>
//                       <td>{supplier.supplierCode}</td>
//                       <td>
//                         <div className="d-flex align-items-center">
//                           {/* <a href="#" className="avatar avatar-md">
//                         <img src={supplier.image ? `/uploads/${supplier.image}` : "assets/img/supplier/supplier-01.png"} className="img-fluid rounded-2" alt="img" />
//                       </a> */}
//                           <a href="#" className="avatar avatar-md">
//                             <img
//                               src={
//                                 supplier.images && supplier.images.length > 0
//                                   ? supplier.images[0].url
//                                   : "assets/img/supplier/supplier-01.png"
//                               }
//                               className="img-fluid rounded-2"
//                               alt={`${supplier.firstName?.charAt(0) || ""}${supplier.lastName?.charAt(0) || ""}`}
//                             />
//                           </a>
//                           <div className="ms-2">
//                             <p className="text-gray-9 mb-0"><a href="#">{supplier.firstName} {supplier.lastName}</a></p>
//                           </div>
//                         </div>
//                       </td>
//                       <td>{supplier.email}</td>
//                       <td>{supplier.phone}</td>
//                       <td>{supplier.country?.name}</td>
//                       <td>
//                         <span className={`badge ${supplier.status ? 'badge-success' : 'badge-danger'} d-inline-flex align-items-center badge-xs`}>
//                           <i className="ti ti-point-filled me-1" />{supplier.status ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="action-table-data">
//                         <div className="edit-delete-action">
//                           {/* <a className="me-2 p-2" title="View"   onClick={() => {
//                     setViewSupplierId(supplier._id);
//                   }}>
//                         <TbEye  className="feather-view" />
//                       </a> */}
//                           <Link className="me-2 p-2"
//                             to={`/viewsupplier/${supplier._id}`}
//                             title="View"
//                             style={{ color: "inherit", padding: "8px" }}
//                           >
//                             <TbEye className="feather-view" />
//                           </Link>

//                           <a className="me-2 p-2" href="#" title="Edit" onClick={() => { setEditSupplier(supplier); setShowEditModal(true); }}>
//                             <TbEdit className="feather-edit" />
//                           </a>
//                           <a className="p-2" href="#" title="Delete" onClick={() => handleDeleteSupplier(supplier._id)}>
//                             <TbTrash className="feather-trash-2" />
//                           </a>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}

//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         {/* /product list */}
//         {showAddModal && !showEditModal && (
//           <AddSupplierModals
//             onClose={() => setShowAddModal(false)}
//             onSuccess={() => { setShowAddModal(false); fetchSuppliers(); }}
//           />
//         )}
//         {showEditModal && (
//           <AddSupplierModals
//             onClose={() => { setShowEditModal(false); setEditSupplier(null); }}
//             onSuccess={() => { setShowEditModal(false); setEditSupplier(null); fetchSuppliers(); }}
//             editSupplier={editSupplier}
//           />
//         )}

//         {viewSupplierId && (
//           <ViewSupplierModal
//             supplierId={viewSupplierId}
//             onClose={() => {
//               setViewSupplierId(null);
//             }}
//           />
//         )}
//       </div>

//     </div>

//     // <div className="all-supplier-container">
//     //   <div className="supplier-header">
//     //     <Link
//     //       to="/"
//     //       style={{
//     //         textDecoration: "none",
//     //         color: "#676767",
//     //         marginBottom: "20px",
//     //       }}
//     //     >
//     //       Supplier
//     //     </Link>

//     //     {/* Three-Box */}
//     //     <div className="three-box">
//     //       {/* All Parties */}
//     //       <div className="money-bag">
//     //         <div>
//     //           {/* <img src={MoneyBag} alt="money" /> */}
//     //         </div>
//     //         <div className="bag-content">
//     //           <span style={{ color: "#676767", marginTop: "50px" }}>
//     //             All Parties
//     //           </span>
//     //           <br />
//     //           <span style={{ textAlign: "left" }}>
//     //             <b>14</b>
//     //           </span>
//     //         </div>
//     //       </div>

//     //       {/* To Receive */}
//     //       <div className="radio-active">
//     //         <div>
//     //           {/* <img src={RadioActive} alt="money" /> */}
//     //         </div>
//     //         <div className="bag-content">
//     //           <span style={{ color: "#676767", marginTop: "50px" }}>
//     //             To Receive
//     //           </span>
//     //           <br />
//     //           <span style={{ textAlign: "left" }}>
//     //             <b>₹12,75,987</b>
//     //           </span>
//     //         </div>
//     //       </div>

//     //       {/* To Pay */}
//     //       <div className="Circle-logo">
//     //         <div>
//     //           {/* <img src={CircleLogo} alt="money" /> */}
//     //         </div>
//     //         <div className="bag-content">
//     //           <span style={{ color: "#676767", marginTop: "50px" }}>
//     //             To Pay{" "}
//     //           </span>
//     //           <br />
//     //           <span style={{ textAlign: "left" }}>
//     //             <b>₹5,987</b>
//     //           </span>
//     //         </div>
//     //       </div>
//     //     </div>

//     //     {/* Search Category & Add Supplier */}
//     //     <div className="sea-cat-add">
//     //       {/* Search */}
//     //       <div style={{ display: "flex", justifyContent: "space-between" }}>
//     //         <div style={{ display: "flex", gap: "50px" }}>
//     //           <div className="search">
//     //             <FaSearch />
//     //             <input
//     //               type="search"
//     //               placeholder="Search"
//     //               style={{
//     //                 border: "none",
//     //                 textAlign: "left",
//     //                 width: "100%",
//     //                 outline: "none",
//     //               }}
//     //             />
//     //           </div>

//     //           {/* Category */}
//     //           <div className="select-category">
//     //             <select
//     //               name=""
//     //               id=""
//     //               style={{
//     //                 border: "1px solid #e6e6e6",
//     //                 backgroundColor: "#ffffff",
//     //                 borderRadius: "8px",
//     //                 padding: "10px 20px",
//     //                 textAlign: "left", // ensures text is aligned left
//     //                 direction: "ltr",
//     //                 width: "200px", // optional: fixed width
//     //                 outline: "none",
//     //               }}
//     //             >
//     //               <option value="">Select Category</option>
//     //             </select>
//     //           </div>
//     //         </div>
//     //       </div>

//     //       {/* Add Supplier Button*/}

//     //       <div className="Add-supplier-link">
//     //         <Link
//     //           to="/AddSupplier"
//     //           style={{
//     //             padding: "8px 15px",
//     //             backgroundColor: "#1368EC",
//     //             color: "white",
//     //             borderRadius: "8px",
//     //             border: "none",
//     //             textDecoration: "none",
//     //           }}
//     //         >
//     //           Add Supplier
//     //         </Link>
//     //       </div>
//     //     </div>

//     //     {/* Toolbar */}
//     //     <div
//     //       style={{
//     //         backgroundColor: "white",
//     //         marginTop: "30px",
//     //         borderRadius: "8px",
//     //       }}
//     //     >
//     //       <div className="overview">
//     //         <div>
//     //           <div className="toolbars">
//     //             <div>
//     //               <h3>All Supplier</h3>
//     //             </div>
//     //             <div className="toolbar-actions">
//     //               <select
//     //                 style={{
//     //                   border: "1px solid #e6e6e6",
//     //                   borderRadius: "8px",
//     //                   padding: "10px 20px",
//     //                   outline: "none",
//     //                   backgroundColor: "white",
//     //                   color: "#333",
//     //                 }}
//     //               >
//     //                 <option value="">Select warehouse</option>
//     //               </select>
//     //             </div>
//     //           </div>

//     //           <div className="toolbar-actions-th" style={{justifyContent:'space-between', alignItems:'center'}}>
//     //             <div className="toolbar-titles">
//     //               <button className="toolbar-filter-btn">All</button>
//     //             </div>

//     //             <div style={{ display: "flex", gap: "16px",marginTop: "10px",marginBottom: "10px", padding:'0px 20px' }}>
//     //               <div
//     //                 style={{
//     //                   display: "flex",
//     //                   alignItems: "center",
//     //                   border: "1px solid #E6E6E6",
//     //                   backgroundColor: "#FFFFFF",
//     //                   borderRadius: "6px",
//     //                   padding: "10px",
//     //                   gap: "10px",
//     //                 }}
//     //               >
//     //                 <span>
//     //                   <CiSearch />
//     //                 </span>
//     //                 <span>
//     //                   <IoFilter />
//     //                 </span>
//     //               </div>

//     //               {/* up & down icon */}
//     //               <div
//     //                 style={{
//     //                   border: "1px solid #E6E6E6",
//     //                   backgroundColor: "#FFFFFF",
//     //                   borderRadius: "6px",
//     //                   padding: "10px",
//     //                 }}
//     //               >
//     //                 <span>
//     //                   <LuArrowUpDown />
//     //                 </span>
//     //               </div>
//     //             </div>
//     //           </div>
//     //         </div>
//     //       </div>

//     //       {/* table Container */}
//     //       <div style={{ backgroundColor: "white" }}>
//     //         <table className="product-table">
//     //           <thead>
//     //             <tr style={{ color: "#676767" }}>
//     //               <th>
//     //                 <input type="checkbox" />
//     //               </th>
//     //               <th>Supplier</th>
//     //               <th>Category</th>
//     //               <th>Supplier Type </th>
//     //               <th>Balance</th>
//     //             </tr>
//     //           </thead>
//     //           <tbody>
//     //             {paginatedData.map((sales, index) => (
//     //               <tr key={index}>
//     //                 <td>
//     //                   <input type="checkbox" />
//     //                 </td>
//     //                 <td>{sales.supplier}</td>
//     //                 <td>
//     //                   {Array.isArray(sales.category) ? (
//     //                     sales.category.map((cat, i) => (
//     //                       <span key={i} className="category-chip">
//     //                         {" "}
//     //                         {cat}{" "}
//     //                       </span>
//     //                     ))
//     //                   ) : (
//     //                     <span className="category-chip">
//     //                       {" "}
//     //                       {sales.category}{" "}
//     //                     </span>
//     //                   )}
//     //                 </td>

//     //                 <td>{sales.supplierType}</td>
//     //                 <td>
//     //                   <span
//     //                     className={
//     //                       sales.balance.trim().startsWith("+")
//     //                         ? "balance-positive"
//     //                         : "balance-negative"
//     //                     }
//     //                   >
//     //                     {sales.balance}
//     //                   </span>
//     //                 </td>
//     //               </tr>
//     //             ))}
//     //           </tbody>
//     //         </table>

//     //         <div className="pagination">
//     //           <div className="pagination-boxx">{itemsPerPage} per page</div>
//     //           <div className="pagination-boxx pagination-info">
//     //             <span>
//     //               {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
//     //               {totalItems}
//     //             </span>
//     //             <span style={{ color: "grey" }}> | </span>
//     //             <button
//     //               disabled={currentPage === 1}
//     //               onClick={() =>
//     //                 setCurrentPage((prev) => Math.max(prev - 1, 1))
//     //               }
//     //               className="pagination-arrow"
//     //             >
//     //               <FaAngleLeft />
//     //             </button>
//     //             <button
//     //               disabled={currentPage === totalPages}
//     //               onClick={() =>
//     //                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//     //               }
//     //               className="pagination-arrow"
//     //             >
//     //               <FaChevronRight />
//     //             </button>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </div>
//     // </div>
//   );
// }

// export default AllSuppliers;
