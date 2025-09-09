

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../pages/config/config";
import { useSettings } from "../../../../Context/purchase/PurchaseContext";
import "../../../../styles/product/product.css";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import AddPurchaseModal from "../../../../pages/Modal/PurchaseModals/AddPurchaseModal";
import EditPurchaseModal from "../../../../pages/Modal/PurchaseModals/EditPurchaseModal";
import { TbDots, TbEdit, TbTrash } from "react-icons/tb";
import DeleteAlert from "../../../../utils/sweetAlert/DeleteAlert";
import Swal from "sweetalert2";
import AddDebitNoteModals from "../../../../pages/Modal/debitNoteModals/AddDebitNoteModals";

const PurchaseOrder = () => {
 
 const token = localStorage.getItem("token");

  const [purchases, setPurchases] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { settings } = useSettings();

  const fetchPurchases = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/purchases`, {
        params: {
          ...filters,
          status: "Ordered",   // force only pending
          page,
          limit: 10,
        },
         headers: {
        Authorization: `Bearer ${token}`,
      },
        
      });
      setPurchases(res.data.purchases);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [filters, page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const convertCurrency = (value) => {
    if (!settings.conversionRates || !settings.baseCurrency) return value?.toFixed(2) || "0.00";
    const baseToSelectedRate = settings.conversionRates[settings.currencyCode] || 1;
    const baseToBaseRate = settings.conversionRates[settings.baseCurrency] || 1;
    const converted = (value / baseToBaseRate) * baseToSelectedRate;
    return converted.toFixed(2);
  };

  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const handleEditClick = (purchase) => {
    setSelectedPurchase(purchase);
    const editModal = new window.bootstrap.Modal(document.getElementById("edit-purchase"));
    editModal.show();
  };

  const handleDeletePurchase = async (id, referenceNumber) => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/purchases/${id}`,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      fetchPurchases(); // Refresh the table
      // toast.success("purchases Deleted successfully!");
      Swal.fire(
        "Deleted!",
        `purchases "${referenceNumber}" has been deleted.`,
        "success"
      );
    } catch (error) {
      console.error("Failed to delete purchase:", error);
      // alert("Error deleting purchase. Please try again.");
    }
  };


  const [selectedReturnData, setSelectedReturnData] = useState(null);

  const handleConvertToReturn = (purchase) => {
    setSelectedReturnData(purchase);
    const returnModal = new window.bootstrap.Modal(document.getElementById("add-return-debit-note"));
    returnModal.show();
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Purchase order</h4>
              <h6>Manage your Purchase order</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li><button type="button" className="icon-btn" title="Pdf"><FaFilePdf /></button></li>
            <li><label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls" hidden /><FaFileExcel style={{ color: "green" }} /></label></li>
            <li><button type="button" className="icon-btn" title="Export Excel"><FaFileExcel /></button></li>
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
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Supplier</th>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Purchased Amount</th>
                    <th>Purchased QTY</th>
                    <th>Payment Status</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {purchases.length === 0 ? (
                    <tr><td colSpan="12" className="text-center">No purchase orders found.</td></tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>

                        <td>{purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A"}</td>
                        <td>{purchase.referenceNumber}</td>
                        <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>

                        <td className=" ">
                          <div className="d-flex flex-column ">
                            {purchase.products.map((p, idx) => (
                              <div key={idx} className="d-flex align-items-center ">
                                {p.product?.images?.[0]?.url && (
                                  <img
                                    src={p.product.images[0].url}
                                    alt={p.product.productName}
                                    className="media-image me-2"
                                    style={{ height: "40px", width: "40px", objectFit: "cover", borderRadius: "8px" }}
                                  />
                                )}
                                <span>{p.product?.productName || "Unnamed Product"}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td><span className="badge bg-warning">{purchase.status}</span></td>
                        <td>
                          <ul className="list-unstyled mb-0">
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>
                                {settings.currencySymbol}{p.purchasePrice?.toFixed(2) || "0.00"}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <ul className="list-unstyled mb-0">
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>
                                {p.quantity || 0} {p.unit || ""}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>

                          <span className={`badge ${purchase.payment?.paymentStatus === 'Paid' ? 'bg-success' : 'bg-danger'}`}>
                            {purchase.payment?.paymentStatus || 'Unpaid'}
                          </span>
                        </td>
                        <td>   {settings.currencySymbol} {purchase.payment?.paidAmount || '0.00'}</td>
                        <td>   {settings.currencySymbol} {purchase.payment?.dueAmount || '0.00'}</td>
                        {/* <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-purchase" onClick={() => handleEditClick(purchase)}><TbEdit /></a>
                            <a className="p-2 text-danger" onClick={() => handleDeletePurchase(purchase._id, purchase.referenceNumber)} title="Delete Purchase">
                              <TbTrash />
                            </a>
                          </div>
                        </td> */}
                        <td class="action-item">
                          <a href="javascript:void(0);" data-bs-toggle="dropdown">
                            <TbDots />
                          </a>
                          <ul class="dropdown-menu">
                            <li>
                              <a class="dropdown-item d-flex align-items-center" onClick={() => handleEditClick(purchase)}><TbEdit className="me-2" />Edit</a>
                            </li>
                            <li>
                              <a href="javascript:void(0);" class="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal" onClick={() => handleDeletePurchase(purchase._id, purchase.referenceNumber)}> <TbTrash className="me-2" />Delete</a>
                            </li>
                            <li>
                              <a href="javascript:void(0);" class="dropdown-item d-flex align-items-center"><i class="isax isax-send-2 me-2"></i>Resend</a>
                            </li>
                            <li>
                              <a href="javascript:void(0);" class="dropdown-item d-flex align-items-center"><i class="isax isax-document-download me-2"></i>Download Invoices as PDF</a>
                            </li>
                            <li>
                              <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" onClick={() => handleConvertToReturn(purchase)}><i className="isax isax-convert me-2"></i>Convert to Purchase Return</a>
                            </li>
                            <li>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))
                  )}

                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center p-2 mb-0">
              <div className="">Page {page} of {totalPages}</div>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
              </div>
            </div>
          </div>
        </div>
        {/* /product list */}
        <EditPurchaseModal editData={selectedPurchase} onUpdate={fetchPurchases} />
        <AddDebitNoteModals purchaseData={selectedReturnData} onReturnCreated={fetchPurchases} />

      </div>

    </div>

  )
}

export default PurchaseOrder

