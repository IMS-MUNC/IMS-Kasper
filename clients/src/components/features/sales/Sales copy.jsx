
// import React from 'react'
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { TbDotsVertical, TbEye, TbEdit, TbCurrency, TbCirclePlus, TbDownload, TbTrash } from "react-icons/tb";
// const Sales = () => {
//   // Edit button handler
//   const handleEdit = (sale) => {
//     setEditSale(sale);
//     setShowModal(true);
//   };


//   const [sales, setSales] = useState([]);
//   const [editSale, setEditSale] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [pages, setPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   console.log("salesss", sales);

//   // Fetch sales from backend
//   const fetchSales = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${BASE_URL}/api/sales`, {
//         params: { search, page, limit }
//       });
//       setSales(res.data.sales);
//       setTotal(res.data.total);
//       setPages(res.data.pages);
//     } catch (err) {
//       setSales([]);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchSales();
//     // eslint-disable-next-line
//   }, [search, page, limit]);

//   // Delete button handler
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this sale?')) {
//       try {
//         await axios.delete(`${BASE_URL}/api/sales/${id}`);
//         fetchSales();
//       } catch (err) {
//         alert('Failed to delete sale');
//       }
//     }
//   };

//   // Pagination controls
//   const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));
//   const handleNext = () => setPage(prev => Math.min(prev + 1, pages));

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4>Sales</h4>
//               <h6>Manage Your Sales</h6>
//             </div>
//           </div>
//           <ul className="table-top-head">
//             <li>
//               <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
//             </li>
//             <li>
//               <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
//             </li>
//             <li>
//               <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i className="ti ti-refresh" /></a>
//             </li>
//             <li>
//               <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
//             </li>
//           </ul>
//           <div className="page-btn">
//             <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-sales-new"><i className="ti ti-circle-plus me-1" />Add Sales</a>
//           </div>
//         </div>
//         {/* /product list */}
//         <div className="card">
//           <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
//             <div className="search-set">
//               <div className="search-input">
//                 <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
//               </div>
//             </div>
//             <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
//               <div className="dropdown me-2">
//                 <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//                   Customer
//                 </a>
//                 <ul className="dropdown-menu  dropdown-menu-end p-3">
//                   <li>
//                     <a className="dropdown-item rounded-1">Carl Evans</a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item rounded-1">Minerva Rameriz</a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item rounded-1">Robert Lamon</a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item rounded-1">Patricia Lewis</a>
//                   </li>
//                 </ul>
//               </div>
//               <div className="dropdown me-2">
//                 <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//                   Staus
//                 </a>
//                 <ul className="dropdown-menu  dropdown-menu-end p-3">
//                   <li>
//                     <a className="dropdown-item rounded-1">Completed</a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item rounded-1">Pending</a>
//                   </li>
//                 </ul>
//               </div>
//               <div className="dropdown me-2">
//                 <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//                   Payment Status
//                 </a>
//                 <ul className="dropdown-menu  dropdown-menu-end p-3">
//                   <li>
//                     <a className="dropdown-item rounded-1">Paid</a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item rounded-1">Unpaid</a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item rounded-1">Overdue</a>
//                   </li>
//                 </ul>
//               </div>
//               <div className="dropdown">
//                 <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//                   Sort By : Last 7 Days
//                 </a>
//                 <ul className="dropdown-menu  dropdown-menu-end p-3">
//                   <li>
//                     <a className="dropdown-item rounded-1">Recently Added</a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item rounded-1">Ascending</a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item rounded-1">Desending</a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item rounded-1">Last Month</a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item rounded-1">Last 7 Days</a>
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
//                         <input type="checkbox" id="select-all" />
//                         <span className="checkmarks" />
//                       </label>
//                     </th>
//                     <th>Customer</th>
//                     <th>Reference</th>
//                     <th>Date</th>
//                     <th>Status</th>
//                     <th>Grand Total</th>
//                     <th>Paid</th>
//                     <th>Due</th>
//                     <th>Payment Status</th>
//                     <th>Biller</th>
//                     <th />
//                   </tr>
//                 </thead>
//                 <tbody className="sales-list">


//                   {sales.length > 0 ? (
//                     sales.map((sale) => (

//                       <tr key={sale._id}>
//                         <td>
//                           <label className="checkboxs">
//                             <input type="checkbox" />
//                             <span className="checkmarks" />
//                           </label>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <a className="avatar avatar-md me-2">
//                               <img src="assets/img/users/user-27.jpg" alt="product" />
//                             </a>
//                             <a >{sale.customer?.name || '-'}</a>
//                           </div>
//                         </td>
//                         <td>SL001</td>
//                         <td>24 Dec 2024</td>
//                         <td><span className="badge badge-success">Completed</span></td>
//                         <td>$1000</td>
//                         <td>$1000</td>
//                         <td>$0.00</td>
//                         <td><span className="badge badge-soft-success shadow-none badge-xs"><i className="ti ti-point-filled me-1" />Paid</span></td>
//                         <td>Admin</td>
//                         <td className="text-center">
//                           <a className="action-set" data-bs-toggle="dropdown" aria-expanded="true">
//                             <TbDotsVertical />
//                           </a>
//                           <ul className="dropdown-menu">
//                             <li>
//                               <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#sales-details-new"><TbEye className="info-img" />Sale Detail</a>
//                             </li>
//                             <li>
//                               <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#edit-sales-new"><TbEdit className="info-img" />Edit Sale</a>
//                             </li>
//                             <li>
//                               <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#showpayment"><TbCurrency className="info-img" />Show Payments</a>
//                             </li>
//                             <li>
//                               <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#createpayment"><TbCirclePlus className="info-img" />Create Payment</a>
//                             </li>
//                             <li>
//                               <a className="dropdown-item"><TbDownload className="info-img" />Download pdf</a>
//                             </li>
//                             <li>
//                               <a className="dropdown-item mb-0" data-bs-toggle="modal" data-bs-target="#delete"><TbTrash className="info-img" />Delete Sale</a>
//                             </li>
//                           </ul>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center text-muted">
//                         No Units found.
//                       </td>
//                     </tr>
//                   )}

//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         {/* /product list */}
//       </div>

//     </div>

//   )
// }

// export default Sales











import React from 'react'
import AddSalesModal from '../../../pages/Modal/SalesModal/AddSalesModal'
import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';
import { useEffect } from 'react';
import EditSalesModal from '../../../pages/Modal/SalesModal/EditSalesModal';
import { TbDotsVertical, TbEye, TbEdit, TbCurrency, TbCirclePlus, TbDownload, TbTrash } from "react-icons/tb";

const Sales = () => {
  // Edit button handler
  const handleEdit = (sale) => {
    setEditSale(sale);
    setShowModal(true);
  };

  // Delete button handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await axios.delete(`${BASE_URL}/api/sales/${id}`);
        fetchSales();
      } catch (err) {
        alert('Failed to delete sale');
      }
    }
  };
  const [sales, setSales] = useState([]);
  const [editSale, setEditSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  console.log("salessss", sales);

  // Fetch sales from backend
  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/sales`, {
        params: { search, page, limit }
      });
      setSales(res.data.sales);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      setSales([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line
  }, [search, page, limit]);

  // Pagination controls
  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setPage(prev => Math.min(prev + 1, pages));

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Sales</h4>
              <h6>Manage Your Sales</h6>
            </div>
          </div>
          <div className="page-btn">
            <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-sales-new"><i className="ti ti-circle-plus me-1" />Add Sales</a>
          </div>
        </div> */}

        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Sales</h4>
              <h6>Manage Your Sales</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i className="ti ti-refresh" /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
            </li>
          </ul>
          <div className="page-btn">
            <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-sales-new"><i className="ti ti-circle-plus me-1" />Add Sales</a>
          </div>
        </div>


        {/* <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
                <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Customer
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a className="dropdown-item rounded-1">Carl Evans</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1">Minerva Rameriz</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1">Robert Lamon</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1">Patricia Lewis</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown me-2">
                <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Staus
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a className="dropdown-item rounded-1">Completed</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1">Pending</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown me-2">
                <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Payment Status
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a className="dropdown-item rounded-1">Paid</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1">Unpaid</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1">Overdue</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Sort By : Last 7 Days
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a className="dropdown-item rounded-1">Recently Added</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1">Ascending</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1">Desending</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1">Last Month</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1">Last 7 Days</a>
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
                    <th>Customer</th>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Grand Total</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Payment Status</th>
                    <th>Biller</th>
                    <th />
                  </tr>
                </thead>
                <tbody className="sales-list">


                  {sales.length > 0 ? (
                    sales.map((sale) => (

                      <tr key={sale._id}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <a className="avatar avatar-md me-2">
                              <img src="assets/img/users/user-27.jpg" alt="product" />
                            </a>
                            <a >{sale.customer?.name || '-'}</a>
                          </div>
                        </td>
                        <td>SL001</td>
                        <td>24 Dec 2024</td>
                        <td><span className="badge badge-success">Completed</span></td>
                        <td>$1000</td>
                        <td>$1000</td>
                        <td>$0.00</td>
                        <td><span className="badge badge-soft-success shadow-none badge-xs"><i className="ti ti-point-filled me-1" />Paid</span></td>
                        <td>Admin</td>
                        <td className="text-center">
                          <a className="action-set" data-bs-toggle="dropdown" aria-expanded="true">
                            <TbDotsVertical />
                          </a>
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#sales-details-new"><TbEye className="info-img" />Sale Detail</a>
                            </li>
                            <li>
                              <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#edit-sales-new"><TbEdit className="info-img" />Edit Sale</a>
                            </li>
                            <li>
                              <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#showpayment"><TbCurrency className="info-img" />Show Payments</a>
                            </li>
                            <li>
                              <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#createpayment"><TbCirclePlus className="info-img" />Create Payment</a>
                            </li>
                            <li>
                              <a className="dropdown-item"><TbDownload className="info-img" />Download pdf</a>
                            </li>
                            <li>
                              <a className="dropdown-item mb-0" data-bs-toggle="modal" data-bs-target="#delete"><TbTrash className="info-img" />Delete Sale</a>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No Units found.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </div>
        </div> */}
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            {/* ...existing code... */}
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>Action</th>
                    <th>Customer</th>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Grand Total</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Payment Status</th>
                    <th>Biller</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Labour Cost</th>
                    {/* <th>Order Tax</th> */}
                    <th>Order Discount</th>
                    <th>Round Off</th>
                    <th>Round Off Value</th>
                    <th>Shipping Cost</th>
                    <th>Notes</th>
                    <th>Description</th>
                    <th>Images</th>
                    <th>Product Name(s)</th>
                    <th>Selling Price(s)</th>
                    <th>Sale Qty(s)</th>
                    {/* <th>due date</th>
                    <th>dueAMOUNT</th> */}
                  </tr>
                </thead>
                <tbody className="sales-list">
                  {loading ? (
                    <tr><td colSpan="24" className="text-center">Loading...</td></tr>
                  ) : sales.length > 0 ? (


                    sales.map(sale => (
                      <tr key={sale._id}>
                        <td>
                          <button className="btn btn-sm btn-link" title="Edit" onClick={() => handleEdit(sale)}>
                            <i className="ti ti-edit" />
                          </button>
                          <button className="btn btn-sm btn-link text-danger" title="Delete" onClick={() => handleDelete(sale._id)}>
                            <i className="ti ti-trash" />
                          </button>
                        </td>

                        <td>{sale.customer?.name || '-'}</td>
                        <td>{sale.referenceNumber}</td>
                        <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : '-'}</td>
                        <td>{sale.status}</td>
                        <td>{sale.totalAmount || '-'}</td>
                        <td>{sale.paidAmount || '-'}</td>
                        <td>{sale.dueAmount || '-'}</td>
                        <td>{sale.paymentStatus}</td>
                        <td>{sale.billing?.name || '-'}</td>
                        <td>{sale.cgst || '-'}</td>
                        <td>{sale.sgst || '-'}</td>
                        <td>{sale.labourCost || '-'}</td>
                        <td>{sale.orderDiscount || '-'}</td>
                        <td>{sale.roundOff ? 'Yes' : 'No'}</td>
                        <td>{sale.roundOffValue || '-'}</td>
                        <td>{sale.shippingCost || '-'}</td>
                        <td>{sale.notes || '-'}</td>
                        <td>{sale.description || '-'}</td>
                        <td>{Array.isArray(sale.images) && sale.images.length > 0 ? sale.images.map((img, idx) => <span key={idx}>{img}<br /></span>) : '-'}</td>
                        <td>{Array.isArray(sale.products) && sale.products.length > 0 ? sale.products.map((p, idx) => <span key={idx}>{p.productId?.productName || p.productName || p.productId || '-'}<br /></span>) : '-'}</td>
                        <td>{Array.isArray(sale.products) && sale.products.length > 0 ? sale.products.map((p, idx) => <span key={idx}>{p.sellingPrice || '-'}<br /></span>) : '-'}</td>
                        <td>{Array.isArray(sale.products) && sale.products.length > 0 ? sale.products.map((p, idx) => <span key={idx}>{p.saleQty || p.quantity || '-'}<br /></span>) : '-'}</td>
                        {/* <td>{sale.dueDate || 'AZ'}</td>
                        <td>{sale.dueAmount || 'AZ'}</td> */}
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="24" className="text-center">No sales found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination controls */}
            <div className="d-flex justify-content-between align-items-center p-3">
              <button className="btn btn-sm btn-outline-primary" onClick={handlePrev} disabled={page === 1}>Prev</button>
              <span>Page {page} of {pages}</span>
              <button className="btn btn-sm btn-outline-primary" onClick={handleNext} disabled={page === pages}>Next</button>
              <span>Total: {total}</span>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      {showModal && editSale && (
        <EditSalesModal
          editData={editSale}
          onSuccess={() => { setShowModal(false); setEditSale(null); fetchSales(); }}
          onClose={() => { setShowModal(false); setEditSale(null); }}
        />
      )}
      {/* Default modal for add sales */}
      <AddSalesModal onSuccess={fetchSales} />
    </div>

  )
}

export default Sales
