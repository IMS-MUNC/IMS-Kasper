import React, { useEffect, useState } from "react";
import axios from "axios";
import { TbEye, TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import DeleteAlert from "../../utils/sweetAlert/DeleteAlert";
import BASE_URL from "../config/config";
import { toast } from "react-toastify";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  // Fetch invoices from backend
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        customer,
        invoiceId,
        startDate,
        endDate,
      };
      // Remove empty params
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });
      const res = await axios.get(`${BASE_URL}/api/invoice/allinvoice`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && Array.isArray(res.data.invoices)) {
        setInvoices(res.data.invoices);
        setTotal(res.data.total || 0);
        //          console.log("Fetched invoices:", res.data.invoices.length);
        // console.log("Rendered rows:", invoices.flatMap(i => i.invoice?.products || []).length);
      } else {
        setInvoices([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      setInvoices([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line
  }, [page, limit, search, customer, invoiceId, startDate, endDate]);

  // Pagination controls
  const totalPages = Math.ceil(total / limit);

  // Calculation helpers (copied from AddSalesModal.jsx for consistency)
  const [summary, setSummary] = useState({
    subTotal: 0,
    discountSum: 0,
    taxableSum: 0,
    cgst: 0,
    sgst: 0,
    taxSum: 0,
    shippingCost: 0,
    labourCost: 0,
    orderDiscount: 0,
    roundOff: 0,
    grandTotal: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!invoices || !invoices.products) return;
    let subTotal = 0;
    let discountSum = 0;
    let taxableSum = 0;
    let taxSum = 0;
    invoices.products.forEach((item) => {
      const d = getProductRowCalculation(item);
      subTotal += d.subTotal;
      discountSum += d.discountAmount;
      taxableSum += d.taxableAmount;
      taxSum += d.taxAmount;
    });

    const cgst = taxSum / 2;
    const sgst = taxSum / 2;
    const grandTotal = (taxableSum || 0) + (taxSum || 0);

    setSummary({
      subTotal,
      discountSum,
      taxableSum,
      cgst,
      sgst,
      taxSum,

      grandTotal,
    });
  }, [invoices]);

  function getProductRowCalculation(row) {
    const saleQty = Number(row.saleQty || item.quantity || 1);
    const price = Number(row.sellingPrice || 0);
    const discount = Number(row.discount || 0);
    const tax = Number(row.tax || 0);
    const subTotal = saleQty * price;
    // 🔧 Fixed discount logic
    let discountAmount = 0;
    if (row.discountType === "Percentage") {
      discountAmount = (subTotal * discount) / 100;
    } else if (row.discountType === "Rupees" || row.discountType === "Fixed") {
      discountAmount = saleQty * discount; // ✅ per unit ₹ discount
    } else {
      discountAmount = 0;
    }
    // const discountAmount = discount;
    const taxableAmount = subTotal - discountAmount;
    const taxAmount = (taxableAmount * tax) / 100;
    const lineTotal = taxableAmount + taxAmount;
    const unitCost = saleQty > 0 ? lineTotal / saleQty : 0;

    return {
      subTotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      lineTotal,
      unitCost,
      tax,
      saleQty,
      price,
    };
  }

  const handleBulkDelete = async () => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/invoice/bulk-delete`,
        {
          ids: selectedInvoices,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Selected countries deleted");
      setSelectedInvoices([]);
      fetchInvoices();
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized. please login again");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete state");
      } else {
        toast.error("Bulk delete failed. Please try again");
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Invoices</h4>
              <h6>Manage your stock invoices.</h6>
            </div>
          </div>
          {/* ...existing code... */}
        </div>
       
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search by invoice, customer, notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                />
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                
                 {selectedInvoices.length > 0 && (
          <div className="" style={{marginRight:'10px'}}>
            <div className="btn btn-danger" onClick={handleBulkDelete}>
              Delete Selected({selectedInvoices.length})
            </div>
          </div>
        )}
              <input
                type="text"
                placeholder="Customer ID"
                y
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="form-control me-2"
                style={{ width: 120 }}
              />
              <input
                type="text"
                placeholder="Invoice ID"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="form-control me-2"
                style={{ width: 120 }}
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control me-2"
                style={{ width: 140 }}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control me-2"
                style={{ width: 140 }}
              />
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr style={{ textAlign: "center" }}>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input
                          type="checkbox"
                          id="select-all"
                          checked={
                            invoices.length > 0 &&
                            selectedInvoices.length ===
                              invoices
                                .map((i) => i.invoice?._id)
                                .filter(Boolean).length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInvoices(
                                invoices
                                  .map((row) => row.invoice?._id)
                                  .filter(Boolean) // remove any undefined/null
                              );
                            } else {
                              setSelectedInvoices([]);
                            }
                          }}
                        />

                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Invoice No</th>
                    <th>Sale No</th>
                    <th>Customer</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Amount Due</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9}>Loading...</td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan={9}>No invoices found.</td>
                    </tr>
                  ) : (
                    invoices.map((row, idx) => {
                      // row: { invoice, sale }
                      const inv = row.invoice || {};
                      const sale = row.sale || {};
                      // Render one row per product for each invoice
                      if (
                        Array.isArray(inv.products) &&
                        inv.products.length > 0
                      ) {
                        return inv.products.map((item, pidx) => {
                          const d = getProductRowCalculation(item);
                          return (
                            <tr key={`${inv._id || idx}-${pidx}`} style={{textAlign:'center'}}>
                              <td>
                                <label className="checkboxs">
                                  <input
                                    type="checkbox"
                                    checked={selectedInvoices.includes(inv._id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedInvoices((prev) => [
                                          ...prev,
                                          inv._id,
                                        ]);
                                      } else {
                                        setSelectedInvoices((prev) =>
                                          prev.filter((id) => id !== inv._id)
                                        );
                                      }
                                    }}
                                  />

                                  <span className="checkmarks" />
                                </label>
                              </td>
                              <td>
                                <a
                                  onClick={() =>
                                    navigate(`/invoice/${sale.invoiceId}`)
                                  }
                                >
                                  {inv.invoiceId || sale.invoiceId}
                                </a>
                              </td>
                              <td>{sale.referenceNumber || "-"}</td>
                              <td>
                                <div className="">
                                  <span>
                                    {inv.customer?.name ||
                                      sale.customer?.name ||
                                      inv.customer?._id ||
                                      sale.customer?._id ||
                                      "-"}
                                  </span>
                                </div>
                              </td>
                              <td>
                                {inv.dueDate
                                  ? new Date(inv.dueDate).toLocaleDateString()
                                  : sale.dueDate
                                  ? new Date(sale.dueDate).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td className="fw-semibold text-success">
                                ₹{d.lineTotal}
                              </td>
                              {/* <td>₹{d.subTotal}</td> */}
                              <td>
                                {Number(
                                  inv.paidAmount ?? sale.paidAmount ?? 0
                                ).toFixed(2)}
                              </td>
                              {/* <td>
                                {Number(
                                  inv.paidAmount ?? sale.paidAmount ?? 0
                                ).toFixed(2)}
                              </td> */}
                              <td>
                                {Number(
                                  inv.dueAmount ?? sale.dueAmount ?? 0
                                ).toFixed(2)}
                              </td>
                              <td>
                                <span
                                  className={`badge badge-soft-${
                                    (inv.paymentStatus ||
                                      sale.paymentStatus) === "Paid"
                                      ? "success"
                                      : "danger"
                                  } badge-xs shadow-none`}
                                >
                                  <i className="ti ti-point-filled me-1" />
                                  {inv.paymentStatus ||
                                    sale.paymentStatus ||
                                    "-"}
                                </span>
                              </td>

                              {/* <td>{item.productId?.productName || '-'}</td> */}
                              {/* <td>{item.hsnCode || '-'}</td> */}
                              {/* <td>{d.saleQty}</td> */}
                              {/* <td>₹{d.price}</td> */}
                              {/* <td><div style={{ display: "flex", alignItems: "center" }}><span>{item.discount}</span><span className="ms-1">{item.discountType === "Percentage" ? "%" : "₹"}</span></div></td> */}
                              {/* <td>₹{d.subTotal}</td>
                                                            <td>₹{d.discountAmount}</td>
                                                            <td>{d.tax}%</td>
                                                            <td>₹{d.taxAmount}</td>
                                                            <td>₹{d.unitCost}</td> */}
                              {/* <td className="fw-semibold text-success">₹{d.lineTotal}</td>
                                                            <td>{inv.paidAmount || sale.paidAmount || "-"}</td>
                                                            <td>{inv.dueAmount || sale.dueAmount || "-"}</td>
                                                            <td><span className={`badge badge-soft-${(inv.paymentStatus || sale.paymentStatus) === "Paid" ? "success" : "danger"} badge-xs shadow-none`}><i className="ti ti-point-filled me-1" />{inv.paymentStatus || sale.paymentStatus || "-"}</span></td> */}
                              <td className="">
                                <div className="edit-delete-action d-flex align-items-center justify-content-center">
                                  <a
                                    className="me-2 p-2 d-flex align-items-center justify-content-between border rounded"
                                    onClick={() =>
                                      navigate(`/invoice/${sale.invoiceId}`)
                                    }
                                  >
                                    <TbEye className="feather-eye" />
                                  </a>
                                  <a
                                    className="p-2 d-flex align-items-center justify-content-between border rounded"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete"
                                  >
                                    <TbTrash className="feather-trash-2" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      }
                      //  else {
                      //     return (
                      //         <tr key={inv._id || idx}>
                      //             <td><label className="checkboxs"><input type="checkbox" /><span className="checkmarks" /></label></td>
                      //             <td><a onClick={() => navigate(`/invoice/${sale.invoiceId}`)}>{inv.invoiceId || sale.invoiceId}</a></td>
                      //             <td><div className="d-flex align-items-center"><span>{(inv.customer?.name || sale.customer?.name || inv.customer?._id || sale.customer?._id || "-")}</span></div></td>
                      //             <td>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : (sale.dueDate ? new Date(sale.dueDate).toLocaleDateString() : "-")}</td>
                      //             <td colSpan={11}>No products</td>
                      //             <td>{inv.paidAmount || sale.paidAmount || "-"}</td>
                      //             <td>{inv.dueAmount || sale.dueAmount || "-"}</td>
                      //             <td><span className={`badge badge-soft-${(inv.paymentStatus || sale.paymentStatus) === "Paid" ? "success" : "danger"} badge-xs shadow-none`}><i className="ti ti-point-filled me-1" />{inv.paymentStatus || sale.paymentStatus || "-"}</span></td>
                      //             <td className="d-flex"><div className="edit-delete-action d-flex align-items-center justify-content-center"><a className="me-2 p-2 d-flex align-items-center justify-content-between border rounded" onClick={() => navigate(`/invoice/${sale.invoiceId}`)}><TbEye className="feather-eye" /></a><a className="p-2 d-flex align-items-center justify-content-between border rounded" data-bs-toggle="modal" data-bs-target="#delete"><TbTrash className="feather-trash-2" /></a></div></td>
                      //         </tr>
                      //     );
                      // }
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {/* <div className="d-flex justify-content-between align-items-center p-3">
                            <span>Page {page} of {totalPages}</span>
                            <div>
                                <button className="btn btn-sm btn-light me-2" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                                <button className="btn btn-sm btn-light" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
                            </div>
                        </div> */}
            <div
              className="d-flex justify-content-end gap-3"
              style={{ padding: "10px 20px" }}
            >
              <select
                value={limit} // previously itemsPerPage
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1); // reset to first page when items per page changes
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
                  border: "1px solid #e4e0e0",
                  color: "gray",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {invoices.length === 0
                  ? "0 of 0"
                  : `${(page - 1) * limit + 1}-${Math.min(
                      page * limit,
                      total
                    )} of ${total}`}

                <button
                  style={{
                    border: "none",
                    color: "grey",
                    backgroundColor: "white",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <GrFormPrevious />
                </button>

                <button
                  style={{
                    border: "none",
                    backgroundColor: "white",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                  }}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  <MdNavigateNext />
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
