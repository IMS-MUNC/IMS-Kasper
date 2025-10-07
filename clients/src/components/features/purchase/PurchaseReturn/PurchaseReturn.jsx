import axios from 'axios';
import React, { useEffect, useState } from 'react'
import BASE_URL from '../../../../pages/config/config';

const PurchaseReturn = () => {
   
 <a
                                className="dropdown-item d-flex align-items-center"
                                onClick={() => !isFullyReturned(purchase) && handleConvertToReturn(purchase)}
                                style={isFullyReturned(purchase) ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                              >
                                <i className="isax isax-convert me-2"></i>Convert to Purchase Return
                              </a>

  // ============== Fetch Debit Notes ==============

  const [debitNotes, setDebitNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);


const token = localStorage.getItem("token");

  const fetchDebitNotes = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        startDate,
        endDate,
      };
      const res = await axios.get(`${BASE_URL}/api/debit-notes/getDebit`, { params ,
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setDebitNotes(res.data.debitNotes || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch debit notes:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDebitNotes();
  }, [page, search, startDate, endDate]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset page
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Purchase Returns</h4>
              <h6>Manage your purchase return</h6>
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
            <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-sales-new">
              <i className="ti ti-circle-plus me-1" />Add Purchase Return
            </a>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Status
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Paid</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Unpaid</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Sort By : Last 7 Days
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Recently Added</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Ascending</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Desending</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Last Month</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1">Last 7 Days</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="table datatable">
                  <thead className="thead-light">
                    <tr>
                      <th>
                        <label className="checkboxs">
                          <input type="checkbox" id="select-all" />
                          <span className="checkmarks" />
                        </label>
                      </th>
                      <th>Product Image</th>
                      <th>Date</th>
                      <th>Supplier Name</th>
                      <th>Reference</th>
                      <th>Status</th>
                      <th>Total Refunds</th>
                      <th>Return Qyt</th>
                      <th>Due</th>
                      <th>Payment Status</th>
                      <th className="no-sort" />
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(debitNotes) && debitNotes.length > 0 ? (
                      debitNotes.map((note) => (
                        <tr>
                          <td>
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </td>
                          <td>
                            {/* <a className="avatar avatar-md me-2">
                              {note.product?.images?.[0]?.url && (
                                <img
                                  src={note.purchase.images[0].url}

                                  alt="Purchase"
                                  className="media-image me-2"
                                  style={{ height: "40px", width: "40px", objectFit: "cover", borderRadius: "8px" }}
                                />

                              )}
                            </a> */}

                            <div className="d-flex flex-column gap-1">
                              {Array.isArray(note.products) && note.products.length > 0 ? (
                                note.products.map((p, idx) => {
                                  let imgSrc = '';
                                  if (Array.isArray(p.product?.images) && p.product.images[0]?.url) {
                                    imgSrc = p.product.images[0].url;
                                  } else {
                                    imgSrc = "/assets/img/products/stock-img-01.png";
                                  }
                                  return (
                                    <div key={idx} className="d-flex align-items-center mb-1">
                                      <img
                                        src={imgSrc}
                                        alt={p.product?.productName || 'Product'}
                                        className="media-image me-2"
                                        style={{ height: "32px", width: "32px", objectFit: "cover", borderRadius: "6px" }}
                                      />
                                      <span className="fw-semibold me-2">{p.product?.productName || 'Product'}</span>
                                      <span className="badge bg-light text-dark">Qty: {p.returnQty ?? p.quantity ?? 0}</span>
                                    </div>
                                  );
                                })
                              ) : (
                                <span>No products</span>
                              )}
                            </div>
                          </td>
                          <td>{note.debitNoteDate}</td>
                          <td>
                            {/* Prefer billFrom.name if populated, else purchase.supplier.name, else fallback */}
                            {[note.billFrom?.firstName, note.billFrom?.lastName].filter(Boolean).join(' ') || 'NA'}
                          </td>
                          <td>{note.referenceNumber}</td>
                          <td><span className="badges status-badge fs-10 p-1 px-2 rounded-1"><td>{note.status}</td></span></td>
                          <td>{note.total}</td>
                          <td>{note.product?.returnQty}</td>
                          <td>$0.00</td>
                          <td><span className="p-1 pe-2 rounded-1 text-success bg-success-transparent fs-10"><i className="ti ti-point-filled me-1 fs-11" />Paid</span></td>
                          <td className="action-table-data">
                            <div className="edit-delete-action">
                              <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-sales-new">
                                <i data-feather="edit" className="feather-edit" />
                              </a>
                              <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                                <i data-feather="trash-2" className="feather-trash-2" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12">No debit notes found.</td>
                      </tr>
                    )}


                  </tbody>
                </table>
              )}
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-sm btn-secondary"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                className="btn btn-sm btn-secondary"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>

    </div>

  )
}

export default PurchaseReturn
