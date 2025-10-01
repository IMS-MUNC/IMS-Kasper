
import React from 'react'
import { TbCirclePlus, TbEdit, TbEye, TbTrash } from 'react-icons/tb'
import AddDebitNoteModals from '../../../../pages/Modal/debitNoteModals/AddDebitNoteModals'
import EditDebitNoteModals from '../../../../pages/Modal/debitNoteModals/EditDebitNoteModals'
import BASE_URL from '../../../../pages/config/config';
import axios from 'axios';

const CreditNote = () => {
    const [creditNotes, setCreditNotes] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedNote, setSelectedNote] = React.useState(null);
    const [editNote, setEditNote] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [search, setSearch] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');

    // Fetch all credit notes using getAllCreditNotes API
    // const fetchNotes = React.useCallback(() => {
    //     setLoading(true);
    //     fetch(`${BASE_URL}/api/credit-notes/all`)
    //         .then(res => res.json())
    //         .then(data => {
    //             if (Array.isArray(data.data)) {
    //                 setCreditNotes(data.data);
    //                 setTotalPages(1); // No pagination in this API
    //             } else {
    //                 setCreditNotes([]);
    //                 setTotalPages(1);
    //             }
    //         })
    //         .finally(() => setLoading(false));
    // }, []);
    const fetchNotes = React.useCallback(() => {
  setLoading(true);

  const token = localStorage.getItem("token"); // ✅ token fetch

  fetch(`${BASE_URL}/api/credit-notes/all`, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ token added
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.data)) {
        setCreditNotes(data.data);
        setTotalPages(1); // No pagination in this API
      } else {
        setCreditNotes([]);
        setTotalPages(1);
      }
    })
    .catch((err) => {
      console.error("Failed to fetch credit notes:", err);
      setCreditNotes([]);
      setTotalPages(1);
    })
    .finally(() => setLoading(false));
}, [BASE_URL]);


    React.useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    // Delete handler
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this debit note?')) return;
        try {
            await axios.delete(`${BASE_URL}/api/debit-notes/${id}`,{
                 headers: {
                Authorization: `Bearer ${token}`,
            },

            });
            setDebitNotes(notes => notes.filter(n => n._id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    };


    

    // Fetch all credit notes for a sale (if saleId provided)
    const fetchCreditNotesBySale = React.useCallback((saleId) => {
        if (!saleId) return;
                const token = localStorage.getItem("token");

        fetch(`${BASE_URL}/api/credit-notes/sale/${saleId}`,{
             headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    setCreditNotes(data.data);
                } else {
                    setCreditNotes([]);
                }
            });
    }, [BASE_URL]);

    // Example: fetch by saleId (replace 'SALE_ID_HERE' with actual saleId)
    // React.useEffect(() => {
    //     fetchCreditNotesBySale('SALE_ID_HERE');
    // }, [fetchCreditNotesBySale]);

    return (
        <div className="page-wrapper">
            {/* Start Content */}
            <div className="content content-two">
                {/* Filter/Search */}
                <div className="mb-3 d-flex flex-wrap gap-2 justify-content-between align-items-center">
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <input
                            type="text"
                            className="form-control"
                            style={{ width: 250, display: 'inline-block' }}
                            placeholder="Search by Reference, ID, Vendor..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                        <input
                            type="date"
                            className="form-control"
                            style={{ width: 160, display: 'inline-block' }}
                            value={startDate}
                            onChange={e => { setStartDate(e.target.value); setPage(1); }}
                            placeholder="Start Date"
                        />
                        <span>-</span>
                        <input
                            type="date"
                            className="form-control"
                            style={{ width: 160, display: 'inline-block' }}
                            value={endDate}
                            onChange={e => { setEndDate(e.target.value); setPage(1); }}
                            placeholder="End Date"
                        />
                    </div>
                    {/* <div>
                        <button className="btn btn-primary" onClick={() => { setEditNote(null); }} data-bs-toggle="modal" data-bs-target="#add-return-credit-note" >
                            <TbCirclePlus /> Add Credit Note
                        </button>
                    </div> */}
                </div>
                <div className="table-responsive">
                    <table className="table table-nowrap datatable">
                        <thead>
                            <tr>
                                <th className="no-sort">
                                    <div className="form-check form-check-md">
                                        <input className="form-check-input" type="checkbox" id="select-all" />
                                    </div>
                                </th>
                                <th className="no-sort">ID---</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Products</th>

                                <th>Amount</th>
                                <th>Status</th>
                                <th className="no-sort" />
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8">Loading...</td></tr>
                            ) : creditNotes && creditNotes.length > 0 ? (
                                
                                creditNotes.map((note, idx) => (
                                    
                                    <tr key={note._id || idx}>
                                        <td>
                                            <div className="form-check form-check-md">
                                                <input className="form-check-input" type="checkbox" />
                                            </div>
                                        </td>
                                        <td>
                                            <a href="#view_notes" className="link-default" data-bs-toggle="modal"
                                                data-bs-target="#view_notes" onClick={() => setSelectedNote(note)}>{note.creditNoteId || note._id}</a>
                                        </td>
                                        <td>{note.date ? new Date(note.date).toLocaleDateString() : (note.creditNoteDate ? new Date(note.creditNoteDate).toLocaleDateString() : '')}</td>
                                        <td>
                                            {/* Show customer image if available from sale.customer, billFrom, or billTo */}
                                            {note.sale && note.sale.customer && Array.isArray(note.sale.customer.images) && note.sale.customer.images.length > 0 ? (
                                                <img src={note.sale.customer.images[0]?.url || note.sale.customer.images[0]} alt={note.sale.customer.name || '-'} style={{width:32, height:32, borderRadius:'50%', objectFit:'cover', marginRight:6}} />
                                            ) : note.billFrom && Array.isArray(note.billFrom.images) && note.billFrom.images.length > 0 ? (
                                                <img src={note.billFrom.images[0]?.url || note.billFrom.images[0]} alt={note.billFrom.name || '-'} style={{width:32, height:32, borderRadius:'50%', objectFit:'cover', marginRight:6}} />
                                            ) : note.billTo && Array.isArray(note.billTo.images) && note.billTo.images.length > 0 ? (
                                                <img src={note.billTo.images[0]?.url || note.billTo.images[0]} alt={note.billTo.name || '-'} style={{width:32, height:32, borderRadius:'50%', objectFit:'cover', marginRight:6}} />
                                            ) : null}
                                            {/* Show customer name from sale.customer, billFrom, or billTo, fallback to email or '-' */}
                                            {note.sale && note.sale.customer && note.sale.customer.name
                                                ? note.sale.customer.name
                                                : note.billFrom && note.billFrom.name
                                                ? note.billFrom.name
                                                : note.billTo && note.billTo.name
                                                ? note.billTo.name
                                                : note.billFrom && note.billFrom.firstName
                                                ? note.billFrom.firstName
                                                : note.billTo && note.billTo.firstName
                                                ? note.billTo.firstName
                                                : note.billFrom && note.billFrom.email
                                                ? note.billFrom.email
                                                : note.billTo && note.billTo.email
                                                ? note.billTo.email
                                                : '-'}
                                        </td>
                                        <td>
                                            {Array.isArray(note.items) && note.items.length > 0 ? (
                                                <ul style={{margin:0, padding:0, listStyle:'none'}}>
                                                    {note.items.map((item, i) => (
                                                        <li key={i}>
                                                            {item.productId?.productName || item.productService || '-'}
                                                            {item.productId?.hsn && (
                                                                <span style={{color:'#888', fontSize:'12px'}}> (HSN: {item.productId?.hsn?.hsnCode || item.hsnCode || '-'})</span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : '-'}
                                        </td>
                                        <td>{note.total || note.amount || note.grandTotal || '-'}</td>
                                        <td>{note.status || '-'}</td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a
                                                    className="me-2 p-2" data-bs-toggle="modal"
                                                    data-bs-target="#view_notes"
                                                    onClick={() => setSelectedNote(note)}
                                                >
                                                    <TbEye />
                                                </a>
                                                <a
                                                    className="me-2 p-2"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#edit_debit_note"
                                                    onClick={() => setEditNote(note)}
                                                >
                                                    <TbEdit />
                                                </a>
                                                <a
                                                    className="p-2"
                                                    onClick={() => handleDelete(note._id)}
                                                >
                                                    <TbTrash />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8">No credit notes found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <nav aria-label="Debit Note pagination" className="mt-3">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>&laquo; Prev</button>
                        </li>
                        {/* Always show first page */}
                        <li className={`page-item${page === 1 ? ' active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(1)}>1</button>
                        </li>
                        {/* Show 2nd page if totalPages > 1 */}
                        {totalPages > 1 && (
                            <li className={`page-item${page === 2 ? ' active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(2)}>2</button>
                            </li>
                        )}
                        {/* Show 3rd page if totalPages > 2 */}
                        {totalPages > 2 && (
                            <li className={`page-item${page === 3 ? ' active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(3)}>3</button>
                            </li>
                        )}
                        {/* Ellipsis if more than 4 pages and not on 1-3 */}
                        {totalPages > 4 && page > 3 && (
                            <li className="page-item disabled"><span className="page-link">...</span></li>
                        )}
                        {/* Show current page if > 3 and not last 2 */}
                        {totalPages > 4 && page > 3 && page < totalPages - 1 && (
                            <li className="page-item active">
                                <button className="page-link" onClick={() => setPage(page)}>{page}</button>
                            </li>
                        )}
                        {/* Ellipsis before last page if needed */}
                        {totalPages > 4 && page < totalPages - 2 && (
                            <li className="page-item disabled"><span className="page-link">...</span></li>
                        )}
                        {/* Show last page if more than 3 */}
                        {totalPages > 3 && (
                            <li className={`page-item${page === totalPages ? ' active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(totalPages)}>{totalPages}</button>
                            </li>
                        )}
                        <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next &raquo;</button>
                        </li>
                    </ul>
                </nav>

                {/* Add/Edit Modal: Pass editNote as prop for editing */}
                <AddDebitNoteModals purchaseData={editNote} onReturnCreated={() => { setEditNote(null); fetchNotes(); }} />

                {/* Edit Modal trigger (hidden, for modal compatibility) */}
                <div className="modal fade" id="edit_debit_note" tabIndex="-1" aria-labelledby="editDebitNoteLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <EditDebitNoteModals noteData={editNote} onEditSuccess={() => { setEditNote(null); fetchNotes(); }} />
                        </div>
                    </div>
                </div>

                {/* Modal to show all data for selected debit note */}
                <div className="modal fade" id="view_notes" tabIndex="-1" aria-labelledby="viewNotesLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="viewNotesLabel">Debit Note Details</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {selectedNote ? (
                                    <div>
                                        <div className="row mb-2">
                                            <div className="col-md-6"><b>ID:</b> {selectedNote.debitNoteId || selectedNote._id}</div>
                                            <div className="col-md-6"><b>Date:</b> {selectedNote.debitNoteDate ? new Date(selectedNote.debitNoteDate).toLocaleString() : '-'}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-6"><b>Status:</b> {selectedNote.status}</div>
                                            <div className="col-md-6"><b>Amount:</b> {selectedNote.amount || selectedNote.total || '-'}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-6"><b>Bill From:</b> {
                                                selectedNote.billFrom?.name
                                                || [selectedNote.billFrom?.firstName, selectedNote.billFrom?.lastName].filter(Boolean).join(' ')
                                                || selectedNote.billFrom?.email
                                                || '-'
                                            }</div>
                                            <div className="col-md-6"><b>Bill To:</b> {selectedNote.billTo?.name || selectedNote.billTo?.firstName || selectedNote.billTo || '-'}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-6"><b>CGST:</b> {selectedNote.cgst}</div>
                                            <div className="col-md-6"><b>SGST:</b> {selectedNote.sgst}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-6"><b>Discount:</b> {selectedNote.discount}</div>
                                            <div className="col-md-6"><b>Round Off:</b> {selectedNote.roundOff ? 'Yes' : 'No'}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-12"><b>Extra Info:</b> {selectedNote.extraInfo ? JSON.stringify(selectedNote.extraInfo) : '-'}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-12"><b>Signature:</b> {selectedNote.signatureName || selectedNote.signature || '-'}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-12"><b>Products:</b>
                                                <table className="table table-bordered table-sm mt-2">
                                                    <thead>
                                                        <tr>
                                                            <th>Product</th>
                                                            <th>HSN</th>
                                                            <th>Qty</th>
                                                            <th>Unit</th>
                                                            <th>Rate</th>
                                                            <th>Discount</th>
                                                            <th>Tax</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(selectedNote?.items) && selectedNote.items.length > 0 ? selectedNote.items.map((item, i) => (
                                                            <tr key={i}>
                                                                <td>{item.productId?.productName || item.productService || '-'}</td>
                                                                <td>{item.productId?.hsn?.hsnCode || item.hsnCode || '-'}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>{item.unit}</td>
                                                                <td>{item.rate}</td>
                                                                <td>{item.discount}</td>
                                                                <td>{item.tax}</td>
                                                                <td>{item.amount}</td>
                                                            </tr>
                                                        )) : <tr><td colSpan="8">No products</td></tr>}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : <div>No data</div>}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* End Content */}

        </div>
    )
}

export default CreditNote




// import React, { useState } from 'react';
// import axios from 'axios';
// // import BASE_URL from '../../../pages/config/config'; // Uncomment and adjust if you use a config

// const CreditNote = () => {
//     const [form, setForm] = useState({ saleId: '', amount: '', reason: '', returnDate: '' });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [returns, setReturns] = useState([]);

//     const handleChange = e => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const fetchReturns = async (saleId) => {
//         if (!saleId) return;
//         try {
//             // const url = `${BASE_URL}/api/sales/${saleId}`;
//             const url = `/api/sales/${saleId}`;
//             const res = await axios.get(url);
//             setReturns(res.data?.creditReturns || []);
//         } catch (err) {
//             setReturns([]);
//         }
//     };

//     const handleSubmit = async e => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         setSuccess(null);
//         try {
//             // const url = `${BASE_URL}/api/sales/creditreturn`;
//             const url = `/api/sales/creditreturn`;
//             const res = await axios.post(url, form);
//             setSuccess(res.data.message || 'Credit note created');
//             fetchReturns(form.saleId); // Refresh returns after submit
//         } catch (err) {
//             setError(err.response?.data?.message || 'Error creating credit note');
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="container mt-4">
//             <h2>Credit Note</h2>
//             <form onSubmit={handleSubmit} className="card p-3 mb-3">
//                 <div className="mb-2">
//                     <label>Sale ID</label>
//                     <input type="text" name="saleId" value={form.saleId} onChange={e => { handleChange(e); fetchReturns(e.target.value); }} className="form-control" required />
//                 </div>
//                 <div className="mb-2">
//                     <label>Amount</label>
//                     <input type="number" name="amount" value={form.amount} onChange={handleChange} className="form-control" required />
//                 </div>
//                 <div className="mb-2">
//                     <label>Reason</label>
//                     <input type="text" name="reason" value={form.reason} onChange={handleChange} className="form-control" />
//                 </div>
//                 <div className="mb-2">
//                     <label>Return Date</label>
//                     <input type="date" name="returnDate" value={form.returnDate} onChange={handleChange} className="form-control" />
//                 </div>
//                 <button type="submit" className="btn btn-primary" disabled={loading}>Create Credit Note</button>
//             </form>
//             {error && <div className="alert alert-danger">{error}</div>}
//             {success && <div className="alert alert-success">{success}</div>}
//             {returns.length > 0 && (
//                 <div className="card p-3 mt-3">
//                     <h5>Credit Note Returns</h5>
//                     <table className="table table-bordered">
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>Amount</th>
//                                 <th>Reason</th>
//                                 <th>Return Date</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {returns.map((r, i) => (
//                                 <tr key={i}>
//                                     <td>{i + 1}</td>
//                                     <td>{r.amount}</td>
//                                     <td>{r.reason}</td>
//                                     <td>{r.returnDate ? new Date(r.returnDate).toLocaleDateString() : ''}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default CreditNote
