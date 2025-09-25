import React from 'react'
import { useRef } from 'react';
import AddSalesModal from '../../../pages/Modal/SalesModal/AddSalesModal'
import AddCreditNoteModal from '../../../pages/Modal/creditNoteModals/AddCreditNoteModal'
import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';
import { useEffect } from 'react';
import EditSalesModal from '../../../pages/Modal/SalesModal/EditSalesModal';
import { TbDotsVertical, TbEye, TbEdit, TbCurrency, TbCirclePlus, TbDownload, TbTrash, TbPointFilled } from "react-icons/tb";
import { useParams, useNavigate } from 'react-router-dom';
import UserImg from '../../../assets/img/no_user.png'

const Sales = () => {
  const token = localStorage.getItem("token");

  // Invoice ID generator (simulate for frontend)
  const invoiceCounter = useRef(1);
  const generateInvoiceId = () => {
    const id = `INV${invoiceCounter.current.toString().padStart(3, '0')}`;
    invoiceCounter.current += 1;
    return id;
  };

  // Handler for Convert to Invoice
  const handleConvertToInvoice = async (sale) => {
    if (sale.invoiceId) {
      navigate(`/invoice/${sale.invoiceId}`);
    } else {
      try {
        // Call backend to generate invoiceId for this sale
        const res = await axios.put(`${BASE_URL}/api/sales/${sale._id}`, { generateInvoice: true },{
          headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        // Use companySettingId from sale or context (assume sale.company contains ObjectId)
        const companySettingId = sale.company || null;
        if (res.data.sale && res.data.sale.invoiceId) {
          // Create invoice in Invoice model only after invoiceId is generated
          const invoicePayload = {
            sale: res.data.sale._id,
            customer: res.data.sale.customer,
            products: res.data.sale.products,
            billing: res.data.sale.billing,
            shipping: res.data.sale.shipping,
            invoiceId: res.data.sale.invoiceId,
            saleDate: res.data.sale.saleDate,
            dueDate: res.data.sale.dueDate,
            totalAmount: res.data.sale.totalAmount,
            paidAmount: res.data.sale.paidAmount,
            dueAmount: res.data.sale.dueAmount,
            paymentType: res.data.sale.paymentType,
            paymentStatus: res.data.sale.paymentStatus,
            paymentMethod: res.data.sale.paymentMethod,
            transactionId: res.data.sale.transactionId,
            transactionDate: res.data.sale.transactionDate,
            onlineMod: res.data.sale.onlineMod,
            cgst: res.data.sale.cgst,
            sgst: res.data.sale.sgst,
            orderTax: res.data.sale.orderTax,
            grandTotal: res.data.sale.grandTotal,
            orderDiscount: res.data.sale.orderDiscount,
            roundOff: res.data.sale.roundOff,
            roundOffValue: res.data.sale.roundOffValue,
            shippingCost: res.data.sale.shippingCost,
            notes: res.data.sale.notes,
            description: res.data.sale.description,
            images: res.data.sale.images,

            company: companySettingId,
          };
          await axios.post(`${BASE_URL}/api/invoice`, invoicePayload,{
            headers: {
          Authorization: `Bearer ${token}`,
        },
          });
          navigate(`/invoice/${res.data.sale.invoiceId}`);
        } else {
          toast.error('Failed to generate invoice.');
        }
      } catch (err) {
        toast.error('Error generating invoice.');
      }
    }
  };
  // Edit button handler
  const handleEdit = (sale) => {
    setEditSale(sale);
    setShowModal(true);
  };
             const handleCredit = (sale) => {
              setAddCreditSale(sale);
              setCreditShow(true);
            };
  // Handler for Convert to sales return (credit note)
  // const handleCreditNote = async (saleId) => {
  //   try {
  //     // Fetch latest sale details by _id for credit note
  //     const res = await axios.get(`${BASE_URL}/api/sales/${saleId}`);
  //     setAddCreditSale(res.data.sale);
  //     setCreditShow(true);
  //   } catch (err) {
  //     alert('Failed to fetch sale details');
  //   }
  // };

  // Delete button handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await axios.delete(`${BASE_URL}/api/sales/${id}`,{
          headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        fetchSales();
        toast.success('Sale deleted successfully');
      } catch (err) {
        toast.error('Failed to delete sale');
      }
    }
  };
  const [sales, setSales] = useState([]);
  const [editSale, setEditSale] = useState(null);
  const [addCreditSale, setAddCreditSale] = useState(null);
  const [showSaleDetail, setShowSaleDetail] = useState(false);
  const [saleDetailData, setSaleDetailData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creditShowl, setCreditShow] = useState(false);
  const [salesModal, setSalesModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // console.log("salessss", sales);

  // Fetch sales from backend
  const fetchSales = async () => {
    setLoading(true);
    try {
      // Calculate date range for 'Recently Added'
      let startDate = '';
      let endDate = '';
      if (sortBy === 'Recently Added') {
        const now = new Date();
        endDate = now.toISOString().slice(0, 10);
        const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
        startDate = fiveDaysAgo.toISOString().slice(0, 10);
      }
      const res = await axios.get(`${BASE_URL}/api/sales`, {
        params: {
          search,
          page,
          limit,
          status: filterStatus,
          paymentStatus: filterPaymentStatus,
          startDate,
          endDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  }, [search, page, limit, filterStatus, filterPaymentStatus, sortBy]);

  // Pagination controls
  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setPage(prev => Math.min(prev + 1, pages));


    
  const [selectedCreditData, setSelectedCreditData] = useState(null);

  const handleSaleToReturn = async (sale) => {
    try {
      // Fetch latest sale details by _id for credit note
      const res = await axios.get(`${BASE_URL}/api/sales/${sale._id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCreditData(res.data.sale);
    } catch (err) {
      alert('Failed to fetch sale details');
    }
    // Modal will open via React conditional rendering below
  };

  return (
    <div className="page-wrapper">
      <div className="content">

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
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search sales code or customer..."
                  className="form-control"
                // value={search}
                // onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              {/* <div className="dropdown me-2">
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
              </div> */}
              <div className="dropdown me-2">
                <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Status
                </a>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterStatus('Complete')}>Completed</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterStatus('Pending')}>Pending</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterStatus('')}>All</a></li>
                </ul>
              </div>
              <div className="dropdown me-2">
                <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Payment Status
                </a>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterPaymentStatus('Paid')}>Paid</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterPaymentStatus('Unpaid')}>Unpaid</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterPaymentStatus('Partial')}>Partial</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterPaymentStatus('Pending')}>Pending</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterPaymentStatus('')}>All</a></li>
                </ul>
              </div>
              <div className="dropdown">
                <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Sort By : {sortBy || 'Last 7 Days'}
                </a>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li><a className="dropdown-item rounded-1" onClick={() => setSortBy('Recently Added')}>Recently Added</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setSortBy('Ascending')}>Ascending</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setSortBy('Desending')}>Desending</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setSortBy('Last Month')}>Last Month</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setSortBy('Last 7 Days')}>Last 7 Days</a></li>
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
                      <th>Products</th>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Sold Qyt</th>
                    <th>Selling Price</th>
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
                          <div className="d-flex align-items-center me-2">
                            <img className ="me-2" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, opacity: 0.5 }} 
        src={sale.customer?.image || UserImg} // ✅ fallback dummy image
        alt={sale.customer?.name || "User"}
        onError={(e) => {
          e.target.src = "assets/img/dummy-user.png"; // ✅ if broken image, show dummy
        }}
      />
                            <span>{sale.customer?.name || '-'}</span>
                          </div>
                        </td>
                        {/* Products column */}
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {sale.products && sale.products.length > 0 ? (
                              sale.products.map((product, idx) => {
                                // Try to get image from product.productImage, then product.products.images[0].url, else fallback
                                let imgSrc = '';
                                if (product.productImage) {
                                  imgSrc = product.productImage;
                                } else if (product.products?.images?.[0]?.url) {
                                  imgSrc = product.products.images[0].url;
                                } else if (product.images?.[0]?.url) {
                                  imgSrc = product.images[0].url;
                                }
                                return (
                                  <div key={idx} className="d-flex align-items-center">
                                    <a href="" className="avatar avatar-md me-2">
                                      {imgSrc ? (
                                        <img src={imgSrc} alt={product.productName || product.name || 'N/A'} className="media-image"  />
                                      ) : (
                                        <img src="/vite.svg" alt="No Img" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, opacity: 0.5 }} />
                                      )}
                                    </a>
                                    <div className="ms-2">
                                      <h6 className="fw-bold mb-1"><a >{product.productName || product.name || 'N/A'}</a></h6>
                                      {product.hsnCode ? (
                                        <p className="fs-13" >
                                        HSN: {product.hsnCode}
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <span className="text-muted">-</span>
                            )}

                           
                          </div>
                        </td>
                        <td>{sale.referenceNumber}</td>
                        <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : '-'}</td>
                        <td> <span
                          className={`badge table-badge fw-medium fs-10 ${sale.status === "Complete"
                            ? "bg-success"
                            : "bg-danger"
                            }`}
                        >
                          {sale.status}
                        </span></td>
                        <td>
                          <div className="d-flex flex-column">
                            {sale.products && sale.products.length > 0 ? (
                              sale.products.map((p, idx) => (
                                <div key={idx}>{p.saleQty || p.quantity || 0}</div>
                              ))
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            {sale.products && sale.products.length > 0 ? (
                              sale.products.map((p, idx) => (
                                <div key={idx}>₹{p.sellingPrice || 0}</div>
                              ))
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </div>
                        </td>
                        <td>{sale.grandTotal || '-'}</td>
                        <td>{sale.paidAmount || '-'}</td>
                        <td>{sale.dueAmount || '-'}</td>
                        <td>
                          <span
                            className={`badge shadow-none badge-xs
                            ${sale.paymentStatus === "Paid" ? "badge-soft-success" : ""}
                            ${sale.paymentStatus === "Unpaid" ? "badge-soft-danger" : ""}
                            ${sale.paymentStatus === "Pending" ? "badge-soft-warning" : ""}
                            ${sale.paymentStatus === "Partial" ? "badge-soft-primary" : ""}
                          `}
                          >
                            <TbPointFilled className="me-1" />
                            {sale.paymentStatus}
                          </span>
                        </td>

                        <td>{sale.billing?.name || '-'}</td>
                        <td className="text-center">
                          <a className="action-set" data-bs-toggle="dropdown" aria-expanded="true">
                            <TbDotsVertical />
                          </a>
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#sales-details-new" onClick={() => navigate(`/sales/view/${sale._id}`)}><TbEye className="info-img" />Sale Detail</a>
                            </li>
                            <li>
                              <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#edit-sales-new" onClick={() => handleEdit(sale)}><TbEdit className="info-img" />Edit Sale</a>
                              <li>
                                <a className="dropdown-item" onClick={() => handleConvertToInvoice(sale)}><TbDownload className="info-img" />Convert to Invoice</a>
                              </li>
                              {sale.invoiceId && (
                                <li>
                                  <a className="dropdown-item" onClick={() => navigate(`/invoice/${sale.invoiceId}`)}><TbDownload className="info-img" />View Invoice</a>
                                </li>
                              )}
                            </li>
                            <li>
                              <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#showpayment"><TbCurrency className="info-img" />Show Payments</a>
                            </li>
                            <li>
                              {/* <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#createpayment" onClick={() => handleSaleToReturn(sale)}><TbCirclePlus className="info-img" />Convert to sales return</a> */}
                              <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#createpayment" onClick={() => handleCredit(sale)}><TbCirclePlus className="info-img" />Convert to sales return</a>
                            </li>
                            <li>
                              <a className="dropdown-item"><TbDownload className="info-img" />Download pdf</a>
                            </li>
                            <li>
                              <a className="dropdown-item mb-0" data-bs-toggle="modal" data-bs-target="#delete" onClick={() => handleDelete(sale._id)}><TbTrash className="info-img" />Delete Sale</a>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No Sales found.
                      </td>
                    </tr>
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
      {/* {selectedCreditData && (
        <AddCreditNoteModal
          salesData={selectedCreditData}
          onReturnCreated={() => {
            setSelectedCreditData(null);
            fetchSales();
          }}
          onClose={() => setSelectedCreditData(null)}
        />
      )} */}

      {creditShowl && addCreditSale && (
        <AddCreditNoteModal
          creditData={addCreditSale}
          onAddCredit={() => { setCreditShow(false); setAddCreditSale(null); fetchSales(); }}
          onClose={() => { setCreditShow(false); setAddCreditSale(null); }}
        />
      )}
    </div>

  )
}

export default Sales




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











