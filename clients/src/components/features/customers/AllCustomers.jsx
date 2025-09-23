import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaDownload, FaEdit, FaFilter, FaPlus, FaSearch, FaTrashAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { LuArrowUpDown } from "react-icons/lu";
import { FaExclamationTriangle } from "react-icons/fa";
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

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    category: "",
    stockLevel: "",
    warehouse: "",
    expiration: "",
  });


  useEffect(() => {
    fetchCustomers();
  }, []);

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
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
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

  const recentOrders = [
    { id: 1, product: "Wheel Chair", qty: 10, total: 50000 },
    { id: 2, product: "Office Chair", qty: 5, total: 25000 },
    { id: 3, product: "Office Chair", qty: 5, total: 25000 },
    { id: 4, product: "Office Chair", qty: 5, total: 25000 },
    { id: 5, product: "Office Chair", qty: 5, total: 25000 },
    { id: 6, product: "Office Chair", qty: 5, total: 25000 },
  ];

  const handleCheckboxChange = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };


  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = customers.map((c) => c._id);
      setSelectedCustomers(allIds);
    } else {
      setSelectedCustomers([]);
    }
  };


  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedCustomers.length} customers?`)) return;

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
      (!filters.expiration || c.expiration === filters.expiration)
    );
  });
  // Original filter logic
  /* const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  ); */

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const visible = filtered.slice(start, start + rowsPerPage);

  // New handler for filter changes
  const handleFilterChange = (e, filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: e.target.value }));
    setCurrentPage(1); // Reset to first page when filters change
  };



  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Customer List", 14, 20);

      const tableColumn = ["#", "Name", "Email", "Phone", "Country", "State"];
      const tableRows = customers.map((c, i) => [
        i + 1,
        c.name || "N/A",
        c.email || "N/A",
        c.phone || "N/A",
        c.billing?.country?.name || "N/A",
        c.billing?.state?.stateName || "N/A",
      ]);

      autoTable(doc, {
        startY: 30,
        head: [tableColumn],
        body: tableRows,
      });

      doc.save("customers.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  const [purchases, setPurchases] = useState([]);
  // const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchPurchases = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/purchases`, {
       
        headers: {
          Authorization: `Bearer ${token}`,
        },


      });
      console.log("Fetch data", JSON.stringify(res.data.purchases));

      setPurchases(res.data.purchases);
      // setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);







  return (
    <div className="page-wrapper  shadow rounded bg-white  p-4 mt-5 ">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">All Customer</h5>
        <div className="d-flex gap-2">
          {selectedCustomers.length > 0 && (
            <div className=" d-flex justify-content-between align-items-center">

              <button className="btn btn-danger" onClick={handleBulkDelete}>
                <FaTrashAlt className="me-1" /> Delete ({selectedCustomers.length}) Selected
              </button>
            </div>
          )}

          <button className="btn btn-outline-secondary" onClick={handleDownloadPDF}>
            <FaDownload className="me-1" /> Export
          </button>

          <button onClick={() => { setSelectedCustomer(null); setShowAddModal(true); }} className="add-btn">
            + Add New Customer
          </button>
          {/* <button className="btn btn-primary">Create</button> */}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            // type="text"
            className="form-control"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}

            placeholder="Search Here"
          />
        </div>

        <button
          className="btn btn-outline-secondary d-flex align-items-center"
          onClick={() => setShowFilters(!showFilters)}
          style={{ marginLeft: "240px" }}
        >
          <FaFilter className="me-1" /> Filter
        </button>

        {showFilters && (
          <>
            <select
              className="form-select border-dashed"
              style={{ maxWidth: "150px" }}
              value={filters.category}
              onChange={(e) => handleFilterChange(e, "category")}
            >
              <option value="">All Categories</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
            </select>
            {/* <select className="form-select border-dashed" style={{ maxWidth: "150px" }}>
              <option>Category</option>
              <option>Clothing</option>
              <option>Electronics</option>
            </select>
            <select className="form-select border-dashed" style={{ maxWidth: "150px" }}>
              <option>Stock Level</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select className="form-select border-dashed" style={{ maxWidth: "150px" }}>
              <option>Warehouse</option>
              <option>NY</option>
              <option>SF</option>
              <option>TX</option>
            </select>
            <select className="form-select border-dashed" style={{ maxWidth: "150px" }}>
              <option>Expiration</option>
              <option>Expiring Soon</option>
              <option>Expired</option>
              <option>Valid</option>
            </select> */}
          </>
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>
                <input type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedCustomers.length === customers.length && customers.length > 0} />
              </th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Contact No.</th>
              <th>Total Order</th>
              <th>Total Spent</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((customer, index) => (
              <tr key={index} style={{ cursor: "pointer" }}>
                <td>
                  <input type="checkbox"
                    checked={selectedCustomers.includes(customer._id)}
                    onChange={() => handleCheckboxChange(customer._id)} />
                </td>
                <td className="" onClick={() => handleCustomerClick(customer)}>
                  {/* <img
                    src="https://via.placeholder.com/32"
                    alt={customer.name?.charAt(0)}

                    className="rounded-circle"
                    width="32"
                    height="32"
                  /> */}
                  <img
                    src={customer.images && customer.images.length > 0 ? customer.images[0] : "https://via.placeholder.com/32"}
                    alt={customer.name?.charAt(0) || "N/A"}
                    className="rounded-circle"
                    width="32"
                    height="32"
                  // onError={(e) => { e.target.src = "https://via.placeholder.com/32"; }} // Fallback on error
                  />
                  {customer.name}
                </td>
                {/* <td>{customer.address}</td> */}
                <td>{formatAddress(customer.billing)}</td>
                <td>{customer.phone}</td>
                {/* <td>{customer.orders}</td> */}
                <td>hi{ }</td>

                <td>{customer.spent}</td>
                <td>
                  <div className="edit-delete-action d-flex gap-2">
                    <a
                      className="me-2 p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEditCustomer(customer)}
                      title="Edit"
                    >
                      <FaEdit />
                    </a>
                    <a
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeleteCustomer(customer._id)}
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex align-items-center gap-2">
          <span>Rows per page:</span>

          <select
            className="form-select form-select-sm"
            style={{ width: "80px" }}
            value={rowsPerPage} // Added to sync with state
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value)); // Update rowsPerPage state
              setCurrentPage(1); // Reset to first page
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
        {/* <span>1-10 of 369</span> */}
        <span>{start + 1}-{Math.min(start + rowsPerPage, filtered.length)} of {filtered.length}</span>


        <div className="d-flex gap-2">

          <button
            className="btn btn-light btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            &lt;&lt;
          </button>
          <button
            className="btn btn-light btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            &lt;
          </button>
          <button
            className="btn btn-light btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            &gt;
          </button>
          <button
            className="btn btn-light btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            &gt;&gt;
          </button>
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
                              <h4 className="mb-0">₹ 175,489</h4>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card-box p-3 bg-light d-flex align-items-center gap-3">
                            <div className="card-icon">📦</div>
                            <div>
                              <small>Order</small>
                              <h4 className="mb-0">6</h4>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card-box p-3 bg-light d-flex align-items-center gap-3">
                            <div className="card-icon">📅</div>
                            <div>
                              <small>Initial Purchase Date</small>
                              <h4 className="mb-0">2/09/2023</h4>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card-box p-3 bg-light d-flex align-items-center gap-3">
                            <div className="card-icon">🚨</div>
                            <div>
                              <small>Dues Amount</small>
                              <h4 className="mb-0">₹ 75,489</h4>
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
                              <img
                                src={selectedCustomer.images && selectedCustomer.images.length > 0 ? selectedCustomer.images[0] : "https://via.placeholder.com/32"}
                                alt={selectedCustomer.name?.charAt(0) || "N/A"}
                                className="avatar bg-secondary rounded-circle"
                                // width="48"
                                // height="48"
                                style={{ width: 48, height: 48 }}
                              // onError={(e) => { e.target.src = "https://via.placeholder.com/32"; }} // Fallback on error
                              />
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
                              <span className="text-muted small">12/09/2025</span>
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
                                  {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                      <td>
                                        <input type="checkbox" className="me-2" />
                                        <img
                                          src="https://img.icons8.com/ios/50/000000/office-chair.png"
                                          //  src={customer.images && customer.images.length > 0 ? customer.images[0] : "https://via.placeholder.com/32"}
                                          alt="product"
                                          width="24"
                                          className="me-2"
                                        />
                                        {order.product}
                                      </td>
                                      <td>{order.qty}</td>
                                      <td>₹ {order.total.toLocaleString("en-IN")}.00</td>
                                    </tr>
                                  ))}
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

  );
}

export default AllCustomers;