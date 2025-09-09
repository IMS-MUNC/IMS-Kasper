
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TbEye, TbTrash } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

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
                   headers: {
        Authorization: `Bearer ${token}`,
      },
            };
            // Remove empty params
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });
            const res = await axios.get('/api/invoice/allinvoice', { params ,  headers: {
        Authorization: `Bearer ${token}`,
      },});
            // console.log('API response:', res.data); // Debug API response
            if (res.data && Array.isArray(res.data.invoices)) {
                // If backend returns merged {invoice, sale} objects, flatten to invoice+sale for table
                setInvoices(res.data.invoices);
                setTotal(res.data.total || 0);
            } else {
                setInvoices([]);
                setTotal(0);
            }
        } catch (err) {
            console.error('Failed to fetch invoices:', err);
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
                                    onChange={e => setSearch(e.target.value)}
                                    className="form-control"
                                />
                                <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
                            </div>
                        </div>
                        <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                            <input
                                type="text"
                                placeholder="Customer ID"
                                value={customer}
                                onChange={e => setCustomer(e.target.value)}
                                className="form-control me-2"
                                style={{ width: 120 }}
                            />
                            <input
                                type="text"
                                placeholder="Invoice ID"
                                value={invoiceId}
                                onChange={e => setInvoiceId(e.target.value)}
                                className="form-control me-2"
                                style={{ width: 120 }}
                            />
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="form-control me-2"
                                style={{ width: 140 }}
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="form-control me-2"
                                style={{ width: 140 }}
                            />
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
                                        <th>Invoice No</th>
                                        <th>Customer</th>
                                        <th>Due Date</th>
                                        <th>Amount</th>
                                        <th>Paid</th>
                                        <th>Amount Due</th>
                                        <th>Status</th>
                                        <th className="no-sort" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={9}>Loading...</td></tr>
                                    ) : invoices.length === 0 ? (
                                        <tr><td colSpan={9}>No invoices found.</td></tr>
                                    ) : (
                                        invoices.map((row, idx) => {
                                            // row: { invoice, sale }
                                            const inv = row.invoice || {};
                                            const sale = row.sale || {};
                                            return (
                                                <tr key={inv._id || idx}>
                                                    <td>
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </td>
                                                    <td><a  onClick={() => navigate(`/invoice/${sale.invoiceId}`)} >{inv.invoiceId || sale.invoiceId}</a></td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <span>{(inv.customer?.name || sale.customer?.name || inv.customer?._id || sale.customer?._id || "-")}</span>
                                                        </div>
                                                    </td>
                                                    <td>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : (sale.dueDate ? new Date(sale.dueDate).toLocaleDateString() : "-")}</td>
                                                    <td>{inv.totalAmount || sale.totalAmount || "-"}</td>
                                                    <td>{inv.paidAmount || sale.paidAmount || "-"}</td>
                                                    <td>{inv.dueAmount || sale.dueAmount || "-"}</td>
                                                    <td><span className={`badge badge-soft-${(inv.paymentStatus || sale.paymentStatus) === "Paid" ? "success" : "danger"} badge-xs shadow-none`}><i className="ti ti-point-filled me-1" />{inv.paymentStatus || sale.paymentStatus || "-"}</span></td>
                                                    <td className="d-flex">
                                                        <div className="edit-delete-action d-flex align-items-center justify-content-center">
                                                            <a className="me-2 p-2 d-flex align-items-center justify-content-between border rounded" onClick={() => navigate(`/invoice/${sale.invoiceId}`)}>
                                                                <TbEye className="feather-eye" />
                                                            </a>
                                                            <a className="p-2 d-flex align-items-center justify-content-between border rounded" data-bs-toggle="modal" data-bs-target="#delete">
                                                                <TbTrash className="feather-trash-2" />
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="d-flex justify-content-between align-items-center p-3">
                            <span>Page {page} of {totalPages}</span>
                            <div>
                                <button className="btn btn-sm btn-light me-2" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                                <button className="btn btn-sm btn-light" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
