import React, { useEffect, useState } from "react";
import "./AllSupplier.css";
import AddSupplierModals from "../../../pages/Modal/suppliers/AddSupplierModals";
import BASE_URL from "../../../pages/config/config";
import { TbCirclePlus, TbEdit, TbEye, TbTrash } from 'react-icons/tb'
import ViewSupplierModal from "../../../pages/Modal/suppliers/ViewSupplierModal";
import { Link } from "react-router-dom";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";

function formatAddress(billing) {
  if (!billing) return '';
  let parts = [];
  if (billing.address1) parts.push(billing.address1);
  if (billing.address2) parts.push(billing.address2);
  if (billing.city?.cityName) parts.push(billing.city.cityName);
  if (billing.state?.stateName) parts.push(billing.state.stateName);
  if (billing.country?.name) parts.push(billing.country.name);
  if (billing.pincode) parts.push(billing.pincode);
  return parts.join(', ');
}


function formatShipping(shipping) {
  if (!shipping) return '';
  let parts = [];
  if (shipping.address1) parts.push(shipping.address1);
  if (shipping.address2) parts.push(shipping.address2);
  if (shipping.city?.cityName) parts.push(shipping.city.cityName);
  if (shipping.state?.stateName) parts.push(shipping.state.stateName);
  if (shipping.country?.name) parts.push(shipping.country.name);
  if (shipping.pincode) parts.push(shipping.pincode);
  return parts.join(', ');
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); //for active , inactive

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


  const filteredSuppliers = suppliers.filter((supplier) => {
    const fullName = `${supplier.firstName} ${supplier.lastName}`.toLowerCase();
    const matchSearch = supplier.supplierCode?.toLowerCase().includes(searchTerm.toLowerCase()) || fullName.includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "" || (selectedStatus === "active" && supplier.status) || (selectedStatus === "inactive" && !supplier.status);
    return matchSearch && matchesStatus;
  })

  // Pagination logic
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredSuppliers.slice(startIndex, endIndex);


  // const [showViewModal, setShowViewModal] = useState(false);
  const [viewSupplierId, setViewSupplierId] = useState(null);

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
              <button type="button" className="icon-btn" title="Pdf">
                <FaFilePdf />
              </button>
            </li>
            <li>
              <button type="button" className="icon-btn" title="Export Excel">
                <FaFileExcel />
              </button>
            </li>
          </div>
          <div className="page-btn">
            <button
              style={{
                boxShadow: "rgba(0, 0, 0, 0.25)",
                backgroundColor: "#1368EC",
                borderRadius: "4px",
                border: "1px solid #1450AE",
              }}
              onClick={() => { setShowAddModal(true); }} className="add-btn">
              <span
                style={{
                  padding: "8px",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "14px",
                  color: "#FFFFFF",
                }}
              >
                <TbCirclePlus />Add Supplier
              </span>
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input type="text"
                  placeholder="Search by Code or Name"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ borderRadius: '4px', padding: '6px 12px', border: '1px solid #ccc' }}
                />
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown">
                <button
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  {selectedStatus === "" ? "Status" : selectedStatus === "active" ? "Active" : "Inactive"}
                </button>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <button className="dropdown-item rounded-1" onClick={() => setSelectedStatus("")}>All</button>
                  </li>
                  <li>
                    <button className="dropdown-item rounded-1" onClick={() => setSelectedStatus("active")}>Active</button>
                  </li>
                  <li>
                    <button className="dropdown-item rounded-1" onClick={() => setSelectedStatus("inactive")}>InActive</button>
                  </li>
                </ul>
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
                    <th>Code</th>
                    <th>Supplier</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Country</th>
                    <th>Status</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((supplier) => (
                    <tr key={supplier._id}>
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
                      <td>{supplier.country?.name}</td>
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
            {/*  */}
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
            {/*  */}
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
  );
}

export default AllSuppliers;
