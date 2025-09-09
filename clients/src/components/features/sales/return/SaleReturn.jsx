import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../../pages/config/config';

const SaleReturn = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const token = localStorage.getItem("token");

  // Fetch sale returns from backend
  useEffect(() => {
    const fetchReturns = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust the endpoint if your backend route is different!
        const res = await axios.get(`${BASE_URL}/api/sales/returns`,{
           headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        setReturns(res.data.returns || []);
      } catch (err) {
        setError('Failed to fetch sale returns');
      }
      setLoading(false);
    };
    fetchReturns();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Sales Return</h4>
              <h6>Manage your returns</h6>
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
            <a href="" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-sales-new"><i className="ti ti-circle-plus me-1" />Add Sales Return</a>
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
              {/* ...dropdowns unchanged... */}
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
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Payment Status</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10}>Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={10} className="text-danger">{error}</td>
                    </tr>
                  ) : returns.length === 0 ? (
                    <tr>
                      <td colSpan={10}>No sale returns found.</td>
                    </tr>
                  ) : (
                    returns.map((ret, idx) => (
                      <tr key={ret._id || idx}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <a href="" className="avatar avatar-md me-2">
                              <img
                                src={ret.products?.[0]?.productImage || "assets/img/products/pos-product-07.svg"}
                                alt="product"
                              />
                            </a>
                            <a href="">
                              {ret.products?.map(p => p.productName).join(', ') || 'N/A'}
                            </a>
                          </div>
                        </td>
                        <td>{ret.returnDate ? new Date(ret.returnDate).toLocaleDateString() : ''}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <a href="" className="avatar avatar-md me-2">
                              <img
                                src={ret.customer?.image || "assets/img/users/user-27.jpg"}
                                alt="customer"
                              />
                            </a>
                            <a href="">{ret.customer?.name || 'N/A'}</a>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${ret.status === 'Received' ? 'success' : 'warning'} shadow-none`}>
                            {ret.status || 'Received'}
                          </span>
                        </td>
                        <td>{ret.totalAmount ? `₹${ret.totalAmount}` : '₹0'}</td>
                        <td>{ret.paidAmount ? `₹${ret.paidAmount}` : '₹0'}</td>
                        <td>{ret.dueAmount ? `₹${ret.dueAmount}` : '₹0'}</td>
                        <td>
                          <span className={`badge badge-soft-${ret.paymentStatus === 'Paid' ? 'success' : 'danger'} badge-xs shadow-none`}>
                            <i className="ti ti-point-filled me2" />
                            {ret.paymentStatus || 'Unpaid'}
                          </span>
                        </td>
                        <td className="dflex">
                          <div className="edit-delete-action d-flex align-items-center">
                            <a className="me-2 p-2 d-flex align-items-center border rounded" href="#" data-bs-toggle="modal" data-bs-target="#edit-sales-new">
                              <i data-feather="edit" className="feather-edit" />
                            </a>
                            <a className="p-2 d-flex align-items-center border rounded" href="" data-bs-toggle="modal" data-bs-target="#delete">
                              <i data-feather="trash-2" className="feather-trash-2" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default SaleReturn;





// import React from 'react'

// const SaleReturn = () => {
//   return (
//     <div className="page-wrapper">
//   <div className="content">
//     <div className="page-header">
//       <div className="add-item d-flex">
//         <div className="page-title">
//           <h4>Sales Return</h4>
//           <h6>Manage your returns</h6>
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
//         <a href="" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-sales-new"><i className="ti ti-circle-plus me-1" />Add Sales Return</a>
//       </div>
//     </div>
//     <div className="card">
//       <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
//         <div className="search-set">
//           <div className="search-input">
//             <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
//           </div>
//         </div>
//         <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
//           <div className="dropdown me-2">
//             <a href="" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//               Customer
//             </a>
//             <ul className="dropdown-menu  dropdown-menu-end p-3">
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Carl Evans</a>
//               </li>
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Minerva Rameriz</a>
//               </li>
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Robert Lamon</a>
//               </li>
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Patricia Lewis</a>
//               </li>
//             </ul>
//           </div>
//           <div className="dropdown me-2">
//             <a href="" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//               Status
//             </a>
//             <ul className="dropdown-menu  dropdown-menu-end p-3">
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Completed</a>
//               </li>
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Pending</a>
//               </li>
//             </ul>
//           </div>
//           <div className="dropdown me-2">
//             <a href="" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//               Payment Status
//             </a>
//             <ul className="dropdown-menu  dropdown-menu-end p-3">
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Paid</a>
//               </li>
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Unpaid</a>
//               </li>
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Overdue</a>
//               </li>
//             </ul>
//           </div>
//           <div className="dropdown">
//             <a href="" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
//               Sort By : Last 7 Days
//             </a>
//             <ul className="dropdown-menu  dropdown-menu-end p-3">
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Recently Added</a>
//               </li>
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Ascending</a>
//               </li>
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Desending</a>
//               </li>
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Last Month</a>
//               </li>
//               <li>
//                 <a href="" className="dropdown-item rounded-1">Last 7 Days</a>
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
//                 <th>Product</th>
//                 <th>Date</th>
//                 <th>Customer</th>
//                 <th>Status</th>
//                 <th>Total</th>
//                 <th>Paid</th>
//                 <th>Due</th>
//                 <th>Payment Status</th>
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
//                   <div className="d-flex align-items-center">
//                     <a href="" className="avatar avatar-md me-2">
//                       <img src="assets/img/products/pos-product-07.svg" alt="product" />
//                     </a>
//                     <a href="">Lenovo IdeaPad 3</a>
//                   </div>
//                 </td>
//                 <td>19 Nov 2022</td>
//                 <td>
//                   <div className="d-flex align-items-center">
//                     <a href="" className="avatar avatar-md me-2">
//                       <img src="assets/img/users/user-27.jpg" alt="product" />
//                     </a>
//                     <a href="">Carl Evans</a>
//                   </div>
//                 </td>
//                 <td><span className="badge badge-success shadow-none">Received</span></td>
//                 <td>$1000</td>
//                 <td>$1000</td>
//                 <td>$0.00</td>
//                 <td><span className="badge badge-soft-success badge-xs shadow-none"><i className="ti ti-point-filled me2" />Paid</span></td>
//                 <td className="dflex">
//                   <div className="edit-delete-action d-flex align-items-center">
//                     <a className="me-2 p-2 d-flex align-items-center border rounded" href="#" data-bs-toggle="modal" data-bs-target="#edit-sales-new">
//                       <i data-feather="edit" className="feather-edit" />
//                     </a>
//                     <a className="p-2 d-flex align-items-center border rounded" href="" data-bs-toggle="modal" data-bs-target="#delete">
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

//   )
// }

// export default SaleReturn
