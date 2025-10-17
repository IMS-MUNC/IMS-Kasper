import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaDownload, FaEdit, FaFilter, FaPlus, FaSearch, FaTrashAlt } from "react-icons/fa";
import { TbCirclePlus, TbEdit, TbEye, TbRefresh, TbTrash } from 'react-icons/tb'
import { CiSearch } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { LuArrowUpDown } from "react-icons/lu";
import { FaExclamationTriangle } from "react-icons/fa";
import { GrFormPrevious } from "react-icons/gr";
import { FaFileExcel, FaFilePdf, FaPencilAlt } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import "./AllCustomers.css";
import { Link } from "react-router-dom";
import AddCustomerModal from "../../../pages/Modal/customerModals/AddCustomerModal";
import EditCustomerModal from "../../../pages/Modal/customerModals/EditCustomerModal";
import BASE_URL from "../../../pages/config/config";
import { FiMoreVertical } from "react-icons/fi";
import { TbMoneybag } from "react-icons/tb";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { autoTable } from "jspdf-autotable";
import * as XLSX from "xlsx";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";

function formatAddress(billing) {
  if (!billing) return '';
  let parts = [];
  if (billing.address1) parts.push(billing.address1);
  if (billing.address2) parts.push(billing.address2);
  if (billing.city?.cityName) parts.push(billing.city.cityName);
  if (billing.state?.stateName) parts.push(billing.state.stateName);
  if (billing.country?.name) parts.push(billing.country.name);
  if (billing.postalCode) parts.push(billing.postalCode);
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
  if (shipping.postalCode) parts.push(shipping.postalCode);
  return parts.join(', ');
}

function AllCustomers({ onClose }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [customerStats, setCustomerStats] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    stockLevel: "",
    warehouse: "",
    expiration: "",
  });
    const [selectedStatus, setSelectedStatus] = useState("");


  useEffect(() => {
    fetchCustomers();
    fetchSales();
  }, []);

  // Sync selectAll state with selectedCustomers (only for current page)
  useEffect(() => {
    const currentPageCustomers = getCurrentPageCustomers();
    const currentPageCustomerIds = currentPageCustomers.map(customer => customer._id);

    if (currentPageCustomerIds.length === 0) {
      setSelectAll(false);
    } else {
      const allCurrentPageSelected = currentPageCustomerIds.every(id =>
        selectedCustomers.includes(id)
      );
      setSelectAll(allCurrentPageSelected);
    }
  }, [selectedCustomers, customers, currentPage, itemsPerPage, search, filters, selectedStatus]);

  // const fetchCustomers = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/api/customers`);
  //     setCustomers(res.data);
  //   } catch (err) {
  //     setCustomers([]);
  //   }
  // };
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(res.data);
    } catch (err) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/sales`, {
        params: {
          limit: 1000, // Fetch all sales to calculate statistics
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSales(res.data.sales || []);
      calculateCustomerStats(res.data.sales || []);
    } catch (err) {
      setSales([]);
      setCustomerStats({});
    }
  };

  const calculateCustomerStats = (salesData) => {
    const stats = {};

    salesData.forEach(sale => {
      const customerId = sale.customer?._id || sale.customer?.id;
      if (customerId) {
        if (!stats[customerId]) {
          stats[customerId] = {
            orderCount: 0,
            totalAmount: 0,
            dueAmount: 0,
          };
        }
        stats[customerId].orderCount += 1;
        stats[customerId].totalAmount += parseFloat(sale.grandTotal || 0);
        stats[customerId].dueAmount += parseFloat(sale.dueAmount || 0);
      }
    });

    setCustomerStats(stats);
  };


  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };


  // Edit and Delete handlers
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    const confirmed = await DeleteAlert({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      confirmButtonText: "Yes, delete it!"
    });
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Customer deleted successfully!");

      fetchCustomers();
    } catch (err) {
      toast.error("Failed to delete customer.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) return;

    const confirmed = await DeleteAlert({
      title: "Are you sure?",
      text: `You won't be able to revert the deletion of ${selectedCustomers.length} customer${selectedCustomers.length > 1 ? 's' : ''}!`,
      confirmButtonText: "Yes, delete them!"
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await Promise.all(
        selectedCustomers.map((id) =>
          axios.delete(`${BASE_URL}/api/customers/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      toast.success(`${selectedCustomers.length} customers deleted successfully!`);
      setSelectedCustomers([]);
      fetchCustomers();
    } catch (err) {
      toast.error("Failed to delete selected customers.");
    }
  };

  // const filtered = customers.filter(c =>
  //   c.name?.toLowerCase().includes(search.toLowerCase())
  // );

  // Updated filter logic to include filter state
  const filtered = customers.filter((c) => {
    return (
      c.name?.toLowerCase().includes(search.toLowerCase()) &&
      (!filters.category || c.category === filters.category) &&
      (!filters.stockLevel || c.stockLevel === filters.stockLevel) &&
      (!filters.warehouse || c.warehouse === filters.warehouse) &&
      (!filters.expiration || c.expiration === filters.expiration) &&
      (selectedStatus === "" || (selectedStatus === "Active" && c.status === true) || (selectedStatus === "Inactive" && c.status === false))
    );
  });
  // Original filter logic
  /* const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  ); */

  // Enhanced pagination functions from ExpriedProduct.jsx
  const getCurrentPageCustomers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Handle individual customer selection
  const handleCustomerSelect = (customerId) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };


  // Handle select all for current page
  const handleSelectAll = () => {
    const currentPageCustomers = getCurrentPageCustomers();
    const currentPageCustomerIds = currentPageCustomers.map(customer => customer._id);

    if (selectAll) {
      // Deselect all current page customers
      setSelectedCustomers(prev => prev.filter(id => !currentPageCustomerIds.includes(id)));
    } else {
      // Select all current page customers
      setSelectedCustomers(prev => {
        const newSelected = [...prev];
        currentPageCustomerIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  // New handler for filter changes
  const handleFilterChange = (e, filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: e.target.value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDownloadPDF = () => {
  // Filter customers based on selectedCustomers (_id)
  const dataToExport = selectedCustomers.length > 0
    ? customers.filter(customer => selectedCustomers.includes(customer._id))
    : customers; // Export all customers if none are selected

  if (dataToExport.length === 0) {
    toast.warn("No customers available to export.");
    return;
  }

  try {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Customer List with Order Statistics", 14, 20);

    const tableColumn = ["S.No", "Name", "Phone", "Email", "Address", "Total Orders", "Total Spent", "Status"];
    const tableRows = dataToExport.map((c, i) => [
      i + 1,
      c.name || "N/A",
      c.phone || "N/A",
      c.email || "N/A",
      formatAddress(c.billing) || "N/A",
      `${customerStats[c._id]?.orderCount || 0} times`,
      `Rs. ${(customerStats[c._id]?.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      c.status == true ? 'Active' : 'Inactive',
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 6 },
    });

    doc.save("customers-with-order-stats.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF.");
  }
};

  const handleExcel = () => {

    const dataToExport = selectedCustomers.length > 0
    ? customers.filter(customer => selectedCustomers.includes(customer._id))
    : customers; // Export all customers if none are selected

  if (dataToExport.length === 0) {
    toast.warn("No customers available to export.");
    return;
  }

    try {
      const tableColumn = ["S.No", "Name", "Phone", "Email", "Address", "Total Orders", "Total Spent", "Status"];

      const tableRows = dataToExport.map((c, i) => [
        i + 1,
        c.name || "N/A",
        c.phone || "N/A",
        c.email || "N/A",
        formatAddress(c.billing) || "N/A",
        `${customerStats[c._id]?.orderCount || 0} times`,
        `Rs. ${(customerStats[c._id]?.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        c.status == true ? 'Active' : 'Inactive',
      ]);

      const data = [tableColumn, ...tableRows];   

      const worksheet = XLSX.utils.aoa_to_sheet(data);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

      XLSX.writeFile(workbook, "customers.xlsx");
      // toast.success("Excel file exported successfully!");
    } catch (error) {
      console.error("Error generating Excel:", error);
      toast.error("Failed to generate Excel.");
    }
  };

  // NEW: Memoized calculation for selected customer's sales data
  // NEW: Memoized calculation for selected customer's sales data
  const customerSalesData = useMemo(() => {
    if (!selectedCustomer || sales.length === 0) {
      return {
        lastPurchaseDate: null,
        recentOrderItems: [],
      };
    }

    // 1. Filter sales for the selected customer
    const customerOrders = sales.filter(
      (sale) => (sale.customer?._id || sale.customer) === selectedCustomer._id
    );

    if (customerOrders.length === 0) {
      return {
        lastPurchaseDate: null,
        recentOrderItems: [],
      };
    }

    // 2. Sort orders from NEWEST to OLDEST
    const sortedOrders = [...customerOrders].sort(
      (a, b) => new Date(b.salesDate) - new Date(a.salesDate)
    );

    // 3. Get the last purchase date from the newest order
    const lastPurchaseDate = sortedOrders[0].salesDate;

    // 4. CORRECTED LOGIC: First, extract ALL products from the sorted orders, THEN slice.
    const recentOrderItems = sortedOrders
      .slice(0, 5); // NOW, take the first 5 items from that new array

    // This console.log will now show the correct data: an array of product items.
    console.log("Corrected Recent Order Items for Modal:", recentOrderItems);

    return { lastPurchaseDate, recentOrderItems };
  }, [selectedCustomer, sales]);


  useEffect(() => {
setCurrentPage(1);
}, [selectedStatus]);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">All Customer</h4>
              <h6>Manage your Customers</h6>
            </div>
          </div>
          <div className="d-flex gap-2">
            {selectedCustomers.length > 0 && (
              <div className=" d-flex justify-content-between align-items-center">

                <button className="btn btn-danger" onClick={handleBulkDelete}>
                  <FaTrashAlt className="me-1" /> Delete ({selectedCustomers.length}) Selected
                </button>
              </div>
            )}
            <ul className="table-top-head">
              <li>
                <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" onClick={handleDownloadPDF}><FaFilePdf style={{ color: "red", fontSize: '20px' }} /></a>
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
              <li>
                <button data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"
                  onClick={() => location.reload()}
                  className="fs-20"
                  style={{ backgroundColor: 'white', color: '', padding: '6px 6px', display: 'flex', alignItems: 'center', border: '1px solid #e8eaebff', cursor: 'pointer', borderRadius: '4px' }}
                >
                  <TbRefresh className="ti ti-refresh" />
                </button>
              </li>
            </ul>
            <button className="btn btn-primary" onClick={() => { setSelectedCustomer(null); setShowAddModal(true); }}>+ Add Customer</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  // type="text"
                  className="form-control"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}

                  placeholder="Search Customer..."
                />
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              {/* <div className="dropdown me-2">
            <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
              Product
            </a>
            <ul className="dropdown-menu  dropdown-menu-end p-3">
              <li>
                <a className="dropdown-item rounded-1">Lenovo IdeaPad 3</a>
              </li>
              <li>
                <a className="dropdown-item rounded-1">Beats Pro </a>
              </li>
              <li>
                <a className="dropdown-item rounded-1">Nike Jordan</a>
              </li>
              <li>
                <a className="dropdown-item rounded-1">Apple Series 5 Watch</a>
              </li>
            </ul>
          </div> */}
           <div className="dropdown">
              <a
                className="btn btn-white btn-md d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                Sort by : {selectedStatus || "Status"}
                {/* Status */}
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
                  <tr>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input
                          type="checkbox"
                          id="select-all"
                          onChange={handleSelectAll}
                          checked={selectAll}
                        />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Customer Name</th>
                    <th>Contact No.</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Total Order</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                    <th className="no-sort" style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageCustomers().map((customer, index) => (
                    <tr key={index} style={{ cursor: "pointer" }}>
                      <td>
                        <label className="checkboxs">
                          <input
                            type="checkbox"
                            checked={selectedCustomers.includes(customer._id)}
                            onChange={() => handleCustomerSelect(customer._id)}
                          />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td className="" onClick={() => handleCustomerClick(customer)} style={{}}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          
                          {customer.images && customer.images.length > 0 ? (
                            <div style={{width:'30px',height:'30px',objectFit: "cover"}}>
                                    <img
                              src={customer.images && customer.images.length > 0 ? customer.images[0] : ""}
                              className="rounded"
                               style={{ width: "100%", height: "100%",  }}
                            // onError={(e) => { e.target.src = "https://via.placeholder.com/32"; }} // Fallback on error
                            />
                            </div>
                          ) : (
                            <div className="avatar-placeholder rounded d-flex align-items-center justify-content-center" style={{ width: "30px", height: "30px", backgroundColor: '#6c757d', color: 'white', fontWeight: 'bold' }}>
                              {customer.name ? customer.name.charAt(0).toUpperCase() : 'N/A'}
                            </div>
                          )}
                          {customer.name}
                        </div>
                      </td>
                      {/* <td>{customer.address}</td> */}
                      <td>{customer.phone}</td>
                      <td>{customer.email}</td>
                      <td>{(formatAddress(customer.billing)).length > 20 ? formatAddress(customer.billing).slice(0,20) + "..." : formatAddress(customer.billing)}</td>
                      {/* <td>{customer.orders}</td> */}
                      <td>{customerStats[customer._id]?.orderCount || 0} times</td>

                      {/* <td>₹ {(customerStats[customer._id]?.totalAmount || 0)}</td> */}
                      <td>
                         ₹ {(customerStats[customer._id]?.totalAmount || 0).toLocaleString('en-IN', {
                           minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} 
                      </td>

                      <td>
                        <span
                          className={`badge table-badge fw-medium fs-10 ${customer.status == true
                            ? "bg-success"
                            : "bg-danger"
                            }`}
                        >
                          {customer.status == true ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <Link className="me-2 p-2"
                            onClick={() => handleCustomerClick(customer)}
                            title="View"
                            style={{ color: "inherit", padding: "8px" }}
                          >
                            <TbEye className="feather-view" />
                          </Link>
                          <a data-bs-toggle="modal" data-bs-target="#edit-expired-product" className="me-2 p-2" title="Edit" onClick={() => handleEditCustomer(customer)}>
                            <TbEdit data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" title="Delete" onClick={() => handleDeleteCustomer(customer._id)}>
                            <TbTrash data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
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
              {filtered.length === 0
                ? "0 of 0"
                : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filtered.length
                )} of ${filtered.length}`}
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
                  setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filtered.length / itemsPerPage)))
                }
                disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)}
              >
                <MdNavigateNext />
              </button>
            </span>
          </div>
        </div>

        {showAddModal && !showEditModal && (
          <AddCustomerModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => { setShowAddModal(false); fetchCustomers(); }}
          />
        )}
        {showEditModal && selectedCustomer && (
          <EditCustomerModal
            customer={selectedCustomer}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => { setShowEditModal(false); fetchCustomers(); }}
          />
        )}

        {/* Pop Up data */}
        {showModal && selectedCustomer && (
          <div
            className="modal fade show modal-overlay"
            id="add-customer"
            tabIndex="-1"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content" style={{ maxHeight: "100vh", overflowY: "auto" }}>
                <div className="modal-header">
                  <div className="page-title">
                    <span>Customer Details</span> <IoIosArrowForward />{" "}
                    <strong>{selectedCustomer.name}</strong>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    // onClick={onClose}
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="">
                    <div className="card-body">
                      <div className="container-fluid dashboard-page">

                        {/* Top Cards */}
                        <div className="row g-3 mb-4">
                          <div className="col-md-3">
                            <div className="card-box p-3 bg-light d-flex align-items-center gap-3">
                              <div className="card-icon"><TbMoneybag size={24} /></div>
                              <div>
                                <small>Total Spent</small>
                                <h4 className="mb-0">₹ {customerStats[selectedCustomer._id]?.totalAmount || 0}</h4>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card-box p-3 bg-light d-flex align-items-center gap-3">
                              <div className="card-icon">📦</div>
                              <div>
                                <small>Order</small>
                                <h4 className="mb-0">{customerStats[selectedCustomer._id]?.orderCount || 0}</h4>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card-box p-3 bg-light d-flex align-items-center gap-3">
                              <div className="card-icon">📅</div>
                              <div>
                                <small>Initial Purchase Date</small>
                                <h4 className="mb-0">{customerSalesData.lastPurchaseDate
                                  ? new Date(customerSalesData.lastPurchaseDate).toLocaleDateString()
                                  : 'N/A'
                                }</h4>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card-box p-3 bg-light d-flex align-items-center gap-3">
                              <div className="card-icon">🚨</div>
                              <div>
                                <small>Dues Amount</small>
                                <h4 className="mb-0">₹ {customerStats[selectedCustomer._id]?.dueAmount}</h4>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Details Section: Profile + Orders */}
                        <div className="row g-4">
                          {/* Profile */}
                          <div className="col-md-4">
                            <div className="p-3 border rounded bg-white h-100">
                              <h5 className="mb-3">User Profile</h5>
                              <div className="d-flex align-items-center gap-2 mb-3">
                                {/* <div className="avatar bg-secondary rounded-circle" style={{ width: 48, height: 48 }}></div> */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  {/* <img
                    src="https://via.placeholder.com/32"
                    alt={customer.name?.charAt(0)}

                    className="rounded-circle"
                    width="32"
                    height="32"
                  /> */}
                                  {selectedCustomer.images && selectedCustomer.images.length > 0 ? (
                                    <div style={{width:'30px',height:'30px',objectFit: "cover"}}>
                                    <img
                                      src={selectedCustomer.images && selectedCustomer.images.length > 0 ? selectedCustomer.images[0] : ""}
                                      className="rounded"
                              style={{ width: "100%", height: "100%",  }}
                                    // onError={(e) => { e.target.src = "https://via.placeholder.com/32"; }} // Fallback on error
                                    />
                                    </div>
                                  ) : (
                                    <div className="avatar-placeholder rounded d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, backgroundColor: '#6c757d', color: 'white', fontWeight: 'bold' }}>
                                      {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : 'N/A'}
                                    </div>
                                  )}
                                  {/* {selectedCustomer.name} */}
                                </div>
                                <span className="fw-semibold">{selectedCustomer.name}</span>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted">Billing Address</small>
                                <p className="mb-2">{formatAddress(selectedCustomer.billing)}</p>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted">Phone No.</small>
                                <p className="mb-0">{selectedCustomer.phone}</p>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted">Shipping Address</small>
                                <p className="mb-2">{formatAddress(selectedCustomer.shipping)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Recent Orders */}
                          <div className="col-md-8">
                            <div className="p-3 border rounded bg-white">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Recent Orders</h5>
                                <span className="text-muted small">{customerSalesData.lastPurchaseDate
                                  ? new Date(customerSalesData.lastPurchaseDate).toLocaleDateString()
                                  : 'N/A'
                                }</span>
                              </div>
                              <div className="table-responsive">
                                <table className="table table-sm table-bordered align-middle mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Product</th>
                                      <th>Quantity</th>
                                      <th>Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {customerSalesData.recentOrderItems && customerSalesData.recentOrderItems.length > 0 ? (
                                      customerSalesData.recentOrderItems.map((order, index) => (
                                        <tr key={order._id || index}>
                                          <td>{order.products.map(p => p.productName).join(', ')}</td>
                                          <td>
                                            {/* List the names of products in the order */}
                                            {order.products.reduce((sum, p) => sum + (p.quantity || 0), 0)}
                                          </td>
                                          <td>
                                            {/* Now you can use grandTotal because 'order' is the full sale object */}
                                            ₹ {(order.grandTotal || 0).toLocaleString("en-IN")}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="3" className="text-center">No recent orders found.</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>


                    </div>{/* end card body */}
                  </div>


                </div> {/* modal-body end */}
              </div>
            </div>
          </div>


        )}
      </div>
    </div>
  );
}

export default AllCustomers;