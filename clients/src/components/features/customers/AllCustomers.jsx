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


  // Submit handler
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     // Prepare payload for API
  //     const payload = {
  //       name: form.name,
  //       email: form.email,
  //       phone: form.phone,
  //       currency: form.currency,
  //       website: form.website,
  //       notes: form.notes,
  //       billing: {
  //         ...form.billing,
  //         country: form.billing.country?.value || '',
  //         state: form.billing.state?.value || '',
  //         city: form.billing.city?.value || '',
  //       },
  //       shipping: {
  //         ...form.shipping,
  //         country: form.shipping.country?.value || '',
  //         state: form.shipping.state?.value || '',
  //         city: form.shipping.city?.value || '',
  //       },
  //       bank: form.bank,
  //       status: form.status,
  //     };
  //     // If image is selected, use FormData
  //     if (selectedImage) {
  //       const formData = new FormData();
  //       Object.entries(payload).forEach(([key, value]) => {
  //         if (typeof value === 'object' && value !== null) {
  //           formData.append(key, JSON.stringify(value));
  //         } else {
  //           formData.append(key, value);
  //         }
  //       });
  //       formData.append('image', selectedImage);
  //       await axios.post(`${BASE_URL}/api/customers`, formData, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       });
  //     } else {
  //       await axios.post(`${BASE_URL}/api/customers`, payload);
  //     }
  //     toast.success('Customer created successfully!');
  //     setFormSubmitted(true);
  //     setForm({
  //       name: '', email: '', phone: '', currency: '', website: '', notes: '',
  //       billing: { name: '', address1: '', address2: '', country: null, state: null, city: null, postalCode: '', pincode: '' },
  //       shipping: { name: '', address1: '', address2: '', country: '', state: '', city: '', pincode: '' },
  //       bank: { bankName: '', branch: '', accountHolder: '', accountNumber: '', ifsc: '' },
  //       status: true,
  //     });
  //     setSelectedImage(null);
  //     if (onSuccess) onSuccess();
  //   } catch (err) {
  //     toast.error('Failed to create customer');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div className="page-wrapper p-4 shadow rounded bg-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">All Customers</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary">
            <FaDownload className="me-1" /> Export
          </button>

          <button onClick={() => { setSelectedCustomer(null); setShowAddModal(true); }} className="add-btn">
            + Add New Customer
          </button>
          <button className="btn btn-primary">Create</button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search Here"
          />
        </div>

        <button
          className="btn btn-outline-secondary d-flex align-items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="me-1" /> Filter
        </button>

        {showFilters && (
          <>
            <select className="form-select border-dashed" style={{ maxWidth: "150px" }}>
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
            </select>
          </>
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>
                <input type="checkbox" />
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
            {customers.map((customer, index) => (
              <tr key={index} style={{ cursor: "pointer" }}>
                <td>
                  <input type="checkbox" />
                </td>
                <td className="" onClick={() => handleCustomerClick(customer)}>
                  <img
                    src="https://via.placeholder.com/32"
                    alt={customer.name?.charAt(0)}

                    className="rounded-circle"
                    width="32"
                    height="32"
                  />
                  {customer.name}
                </td>
                {/* <td>{customer.address}</td> */}
                <td>{formatAddress(customer.billing)}</td>
                <td>{customer.phone}</td>
                <td>{customer.orders}</td>
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
          <select className="form-select form-select-sm" style={{ width: "80px" }}>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <span>1-10 of 369</span>
        <div>
          <button className="btn btn-light btn-sm me-2">&lt;</button>
          <button className="btn btn-light btn-sm">&gt;</button>
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
                              <div className="avatar bg-secondary rounded-circle" style={{ width: 48, height: 48 }}></div>
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
                            {/* <table className="table table-sm table-bordered">
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
        </table> */}
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

        //         <div className="modal-overlay">
        //           <div className="modal-popup">
        //             <div className="modal-header">
        //               <span>All Customers</span> <IoIosArrowForward />{" "}
        //               <strong>{selectedCustomer.name}</strong>
        //             </div>

        //             <div className="dashboard-container">
        //               <div className="top-cards">
        //                 <div className="card-box">
        //                   <div className="card-icon"><TbMoneybag /></div>
        //                   <div>
        //                     <small>Total Spent</small>
        //                     <h4>₹ 175,489</h4>
        //                   </div>
        //                 </div>
        //                 <div className="card-box">
        //                   <div className="card-icon">📦</div>
        //                   <div>
        //                     <small>Order</small>
        //                     <h4>6</h4>
        //                   </div>
        //                 </div>
        //                 <div className="card-box">
        //                   <div className="card-icon">📅</div>
        //                   <div>
        //                     <small>Initial Purchase Date</small>
        //                     <h4>2/09/2023</h4>
        //                   </div>
        //                 </div>
        //                 <div className="card-box">
        //                   <div className="card-icon">🚨</div>
        //                   <div>
        //                     <small>Dues Amount</small>
        //                     <h4>₹ 75,489</h4>
        //                   </div>
        //                 </div>
        //               </div>

        //               {/* <div className="details-section row mt-4"> */}
        //               <div className="row mt-4">
        //   {/* User Profile - Left Column */}
        //   <div className="col-md-4">
        //     <div className="profile-box p-3 border rounded bg-light h-100">
        //       <h5 className="mb-3">User Profile</h5>
        //       <div className="d-flex align-items-center gap-2 mb-3">
        //         <div className="avatar bg-secondary rounded-circle" style={{ width: 48, height: 48 }}></div>
        //         <span className="fw-semibold">{selectedCustomer.name}</span>
        //       </div>
        //       <div className="mb-3">
        //         <small className="text-muted">Address</small>
        //         <p className="mb-2">{formatAddress(selectedCustomer.billing)}</p>
        //       </div>
        //       <div>
        //         <small className="text-muted">Phone No.</small>
        //         <p className="mb-0">{selectedCustomer.phone}</p>
        //       </div>
        //     </div>
        //   </div>

        //   {/* Recent Orders - Right Column */}
        //   <div className="col-md-8">
        //     <div className="orders-box p-3 border rounded bg-light">
        //       <div className="d-flex justify-content-between align-items-center mb-3">
        //         <h5 className="mb-0">Recent Orders</h5>
        //         <span className="text-muted small">12/09/2025</span>
        //       </div>
        //       <table className="table table-sm table-bordered">
        //         <thead className="table-light">
        //           <tr>
        //             <th>Product</th>
        //             <th>Quantity</th>
        //             <th>Total</th>
        //           </tr>
        //         </thead>
        //         <tbody>
        //           {recentOrders.map((order) => (
        //             <tr key={order.id}>
        //               <td>
        //                 <input type="checkbox" className="me-2" />
        //                 <img
        //                   src="https://img.icons8.com/ios/50/000000/office-chair.png"
        //                   alt="product"
        //                   width="24"
        //                   className="me-2"
        //                 />
        //                 {order.product}
        //               </td>
        //               <td>{order.qty}</td>
        //               <td>₹ {order.total.toLocaleString("en-IN")}.00</td>
        //             </tr>
        //           ))}
        //         </tbody>
        //       </table>
        //     </div>
        //   </div>
        // </div>


        //               {/* <div className="details-section">
        //                 <div className="profile-box">
        //                   <h5>User Profile</h5>
        //                   <div className="profile-row">
        //                     <div className="avatar"></div>
        //                     <span>{selectedCustomer.name}</span>
        //                   </div>
        //                   <div className="info-row">
        //                     <div>
        //                       <small>Address</small>
        //                       <p>{formatAddress(selectedCustomer.billing)}</p>
        //                     </div>
        //                     <div>
        //                       <small>Address</small>
        //                       <p>{formatShipping(selectedCustomer.shipping)}</p>
        //                     </div>
        //                     <div>
        //                       <small>Phone No.</small>
        //                       <p>{selectedCustomer.phone}</p>
        //                     </div>
        //                   </div>
        //                 </div>

        //                 <div className="orders-box">
        //                   <div className="orders-header">
        //                     <h5>Recent Orders</h5>
        //                     <span>12/09/2025</span>
        //                   </div>
        //                   <table className="orders-table">
        //                     <thead>
        //                       <tr>
        //                         <th>Product</th>
        //                         <th>Quantity</th>
        //                         <th>Total</th>
        //                       </tr>
        //                     </thead>
        //                     <tbody>
        //                       {recentOrders.map((order) => (
        //                         <tr key={order.id}>
        //                           <td>
        //                             <input type="checkbox" />{" "}
        //                             <img
        //                               src="https://img.icons8.com/ios/50/000000/office-chair.png"
        //                               alt="product"
        //                               width="24"
        //                               style={{ marginRight: 8 }}
        //                             />
        //                             {order.product}
        //                           </td>
        //                           <td>{order.qty}</td>
        //                           <td>₹ {order.total.toLocaleString("en-IN")}.00</td>
        //                         </tr>
        //                       ))}
        //                     </tbody>
        //                   </table>
        //                 </div>
        //               </div> */}
        //             </div>

        //             <div className="modal-footer">
        //               <button onClick={() => setShowModal(false)}>Close</button>
        //             </div>
        //           </div>
        //         </div>
      )}
    </div>

  );
}

export default AllCustomers;


// import React from "react";
// import { FaPlus, FaSearch, FaFilter, FaTrashAlt, FaEdit, FaDownload } from "react-icons/fa";
// import { FiMoreVertical } from "react-icons/fi";

// const customers = [
//   {
//     name: "Rohan Kumar",
//     address: "001 - Main Street, Springfield, USA",
//     contact: "98765 43210",
//     orders: 23,
//     spent: "₹ 1470.00",
//   },
//   {
//     name: "Anaya",
//     address: "Graphic Tee - 123 Fashion Ave, New York, NY",
//     contact: "98765 43210",
//     orders: 11,
//     spent: "₹ 14,98,70.00",
//   },
//   {
//     name: "Arjun Sharma",
//     address: "Classic Tee - 456 Style Blvd, Los Angeles, CA",
//     contact: "87654 32109",
//     orders: 57,
//     spent: "₹ 1,89,470.00",
//   },
//   {
//     name: "Rajesh",
//     address: "V-Neck Tee - 789 Trendy Rd, Miami, FL",
//     contact: "76543 21098",
//     orders: 66,
//     spent: "₹ 9,470.00",
//   },
//   {
//     name: "Ajay Srivastava",
//     address: "Crew Neck Tee - 321 Chic St, Seattle, WA",
//     contact: "65432 10987",
//     orders: 36,
//     spent: "₹ 1,44,560.00",
//   },
//   {
//     name: "Priya",
//     address: "Long Sleeve Tee - 654 Casual Ln, Austin, TX",
//     contact: "54321 09876",
//     orders: 64,
//     spent: "₹ 3670.00",
//   },
//   {
//     name: "Jiya",
//     address: "Pocket Tee - 987 Comfort Way, Denver, CO",
//     contact: "43210 98765",
//     orders: 1,
//     spent: "₹ 70.00",
//   },
//   {
//     name: "Vikram Singh",
//     address: "Striped Tee - 135 Pattern Pl, Boston, MA",
//     contact: "32109 87654",
//     orders: 7,
//     spent: "₹ 1110.00",
//   },
//   {
//     name: "Anjali",
//     address: "Graphic Print Tee - 246 Art St, San Francisco, CA",
//     contact: "21098 76543",
//     orders: 567,
//     spent: "₹ 86,72,460.00",
//   },
//   {
//     name: "Karan Kumar",
//     address: "Eco-Friendly Tee - 369 Green Way, Portland, OR",
//     contact: "10987 65432",
//     orders: 71,
//     spent: "₹ 14,95,70.00",
//   },
// ];

// const CustomerTable = () => {
//   const [showFilters, setShowFilters] = React.useState(false);

//   return (
//     <div className="p-4 shadow rounded bg-white">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5 className="fw-bold">All Customers</h5>
//         <div className="d-flex gap-2">
//           <button className="btn btn-outline-secondary">
//             <FaDownload className="me-1" /> Export
//           </button>
//           <button className="btn btn-outline-secondary">
//             + Add New Customer
//           </button>
//           <button className="btn btn-primary">Create</button>
//         </div>
//       </div>

//       <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
//         <div className="input-group" style={{ maxWidth: "300px" }}>
//           <span className="input-group-text">
//             <FaSearch />
//           </span>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search Here"
//           />
//         </div>

//         <button
//           className="btn btn-outline-secondary d-flex align-items-center"
//           onClick={() => setShowFilters(!showFilters)}
//         >
//           <FaFilter className="me-1" /> Filter
//         </button>

//         {showFilters && (
//           <>
//             <select className="form-select border-dashed" style={{ maxWidth: "150px" }}>
//               <option>Category</option>
//               <option>Clothing</option>
//               <option>Electronics</option>
//             </select>
//             <select className="form-select border-dashed" style={{ maxWidth: "150px" }}>
//               <option>Stock Level</option>
//               <option>Low</option>
//               <option>Medium</option>
//               <option>High</option>
//             </select>
//             <select className="form-select border-dashed" style={{ maxWidth: "150px" }}>
//               <option>Warehouse</option>
//               <option>NY</option>
//               <option>SF</option>
//               <option>TX</option>
//             </select>
//             <select className="form-select border-dashed" style={{ maxWidth: "150px" }}>
//               <option>Expiration</option>
//               <option>Expiring Soon</option>
//               <option>Expired</option>
//               <option>Valid</option>
//             </select>
//           </>
//         )}
//       </div>

//       <div className="table-responsive">
//         <table className="table table-hover">
//           <thead className="table-light">
//             <tr>
//               <th>
//                 <input type="checkbox" />
//               </th>
//               <th>Customer Name</th>
//               <th>Address</th>
//               <th>Contact No.</th>
//               <th>Total Order</th>
//               <th>Total Spent</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer, index) => (
//               <tr key={index}>
//                 <td>
//                   <input type="checkbox" />
//                 </td>
//                 <td className="d-flex align-items-center gap-2">
//                   <img
//                     src="https://via.placeholder.com/32"
//                     alt="avatar"
//                     className="rounded-circle"
//                     width="32"
//                     height="32"
//                   />
//                   {customer.name}
//                 </td>
//                 <td>{customer.address}</td>
//                 <td>{customer.contact}</td>
//                 <td>{customer.orders.toString().padStart(2, '0')}</td>
//                 <td>{customer.spent}</td>
//                 <td className="d-flex gap-2">
//                   <button className="btn btn-sm btn-outline-primary">
//                     <FaEdit />
//                   </button>
//                   <button className="btn btn-sm btn-outline-danger">
//                     <FaTrashAlt />
//                   </button>
//                   <button className="btn btn-sm btn-outline-secondary">
//                     <FiMoreVertical />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="d-flex justify-content-between align-items-center mt-3">
//         <div className="d-flex align-items-center gap-2">
//           <span>Rows per page:</span>
//           <select className="form-select form-select-sm" style={{ width: "80px" }}>
//             <option>10</option>
//             <option>25</option>
//             <option>50</option>
//           </select>
//         </div>
//         <span>1-10 of 369</span>
//         <div>
//           <button className="btn btn-light btn-sm me-2">&lt;</button>
//           <button className="btn btn-light btn-sm">&gt;</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerTable;





// Optional CSS:
// .border-dashed { border: 1px dashed #ccc !important; }


// import React from "react";
// import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
// import { FiMoreVertical } from "react-icons/fi";

// const customers = [
//   {
//     name: "Rohan Kumar",
//     address: "001 - Main Street, Springfield, USA",
//     contact: "98765 43210",
//     orders: 23,
//     spent: "₹ 1470.00",
//   },
//   {
//     name: "Anaya",
//     address: "Graphic Tee - 123 Fashion Ave, New York, NY",
//     contact: "98765 43210",
//     orders: 11,
//     spent: "₹ 14,98,70.00",
//   },
//   {
//     name: "Arjun Sharma",
//     address: "Classic Tee - 456 Style Blvd, Los Angeles, CA",
//     contact: "87654 32109",
//     orders: 57,
//     spent: "₹ 1,89,470.00",
//   },
//   {
//     name: "Rajesh",
//     address: "V-Neck Tee - 789 Trendy Rd, Miami, FL",
//     contact: "76543 21098",
//     orders: 66,
//     spent: "₹ 9,470.00",
//   },
//   {
//     name: "Ajay Srivastava",
//     address: "Crew Neck Tee - 321 Chic St, Seattle, WA",
//     contact: "65432 10987",
//     orders: 36,
//     spent: "₹ 1,44,560.00",
//   },
//   {
//     name: "Priya",
//     address: "Long Sleeve Tee - 654 Casual Ln, Austin, TX",
//     contact: "54321 09876",
//     orders: 64,
//     spent: "₹ 3670.00",
//   },
//   {
//     name: "Jiya",
//     address: "Pocket Tee - 987 Comfort Way, Denver, CO",
//     contact: "43210 98765",
//     orders: 1,
//     spent: "₹ 70.00",
//   },
//   {
//     name: "Vikram Singh",
//     address: "Striped Tee - 135 Pattern Pl, Boston, MA",
//     contact: "32109 87654",
//     orders: 7,
//     spent: "₹ 1110.00",
//   },
//   {
//     name: "Anjali",
//     address: "Graphic Print Tee - 246 Art St, San Francisco, CA",
//     contact: "21098 76543",
//     orders: 567,
//     spent: "₹ 86,72,460.00",
//   },
//   {
//     name: "Karan Kumar",
//     address: "Eco-Friendly Tee - 369 Green Way, Portland, OR",
//     contact: "10987 65432",
//     orders: 71,
//     spent: "₹ 14,95,70.00",
//   },
// ];

// const CustomerTable = () => {
//   return (
//     <div className="p-4 shadow rounded bg-white">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5 className="fw-bold">All Customers</h5>
//         <div className="d-flex gap-2">
//           <button className="btn btn-outline-secondary">
//             <FaSearch />
//           </button>
//           <button className="btn btn-outline-secondary">
//             <FaFilter />
//           </button>
//           <button className="btn btn-primary">
//             + Add New Customer
//           </button>
//           <button className="btn btn-success">Create</button>
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table className="table table-hover">
//           <thead className="table-light">
//             <tr>
//               <th>
//                 <input type="checkbox" />
//               </th>
//               <th>Customer Name</th>
//               <th>Address</th>
//               <th>Contact No.</th>
//               <th>Total Order</th>
//               <th>Total Spent</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer, index) => (
//               <tr key={index}>
//                 <td>
//                   <input type="checkbox" />
//                 </td>
//                 <td className="d-flex align-items-center gap-2">
//                   <img
//                     src="https://via.placeholder.com/32"
//                     alt="avatar"
//                     className="rounded-circle"
//                     width="32"
//                     height="32"
//                   />
//                   {customer.name}
//                 </td>
//                 <td>{customer.address}</td>
//                 <td>{customer.contact}</td>
//                 <td>{customer.orders.toString().padStart(2, '0')}</td>
//                 <td>{customer.spent}</td>
//                 <td>
//                   <FiMoreVertical />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="d-flex justify-content-between align-items-center mt-3">
//         <span>10 per page</span>
//         <span>1-25 of 369</span>
//         <div>
//           <button className="btn btn-light btn-sm me-2">&lt;</button>
//           <button className="btn btn-light btn-sm">&gt;</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerTable;
