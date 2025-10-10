
import React from 'react'
import { TbCirclePlus, TbEdit, TbEye, TbTrash } from 'react-icons/tb'
import { FaFileExcel, FaFilePdf } from 'react-icons/fa'
import { GrFormPrevious } from 'react-icons/gr'
import { MdNavigateNext } from 'react-icons/md'
import AddDebitNoteModals from '../../../../pages/Modal/debitNoteModals/AddDebitNoteModals'
import EditDebitNoteModals from '../../../../pages/Modal/debitNoteModals/EditDebitNoteModals'
import BASE_URL from '../../../../pages/config/config';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import DeleteAlert from '../../../../utils/sweetAlert/DeleteAlert';

const DebitNote = () => {

    const [debitNotes, setDebitNotes] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedNote, setSelectedNote] = React.useState(null);
    const [editNote, setEditNote] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [search, setSearch] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [selectedRows, setSelectedRows] = React.useState([]); // For row selection

    // File input ref for import functionality
    const fileInputRef = React.useRef();

    // Date validation function
    const validateDates = (start, end) => {
        if (start && end) {
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);
            if (endDateObj < startDateObj) {
                toast.error('End date must be after start date');
            }
        }
        return true;
    };

    // Handle start date change with validation
    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        validateDates(newStartDate, endDate);
    };

    // Handle end date change with validation
    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
        validateDates(startDate, newEndDate);
    };

    const fetchNotes = React.useCallback(() => {
        setLoading(true);

        const token = localStorage.getItem("token"); // ✅ get token

        const params = new URLSearchParams({
            limit: 10,
            page,
            search: search.trim(),
        });
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        fetch(`${BASE_URL}/api/debit-notes/getDebit?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`, // ✅ token added
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.debitNotes)) {
                    setDebitNotes(data.debitNotes);
                    setTotalPages(data.totalPages || 1);
                } else if (Array.isArray(data.data)) {
                    setDebitNotes(data.data);
                    setTotalPages(data.totalPages || 1);
                } else {
                    setDebitNotes([]);
                    setTotalPages(1);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch debit notes:", err);
                setDebitNotes([]);
            })
            .finally(() => setLoading(false));
    }, [page, search, startDate, endDate, BASE_URL]);

    React.useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    // Debounced effect for date filtering
    React.useEffect(() => {
        // Only fetch if dates are valid
        if (startDate && endDate && !validateDates(startDate, endDate)) {
            return; // Don't fetch if there's a date validation error
        }
        
        const timeoutId = setTimeout(() => {
            if (startDate || endDate) {
                fetchNotes();
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [startDate, endDate, fetchNotes]);

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${BASE_URL}/api/debit-notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Debit note deleted successfully");
            fetchNotes();
        } catch (error) {
            console.error("Error deleting debit note:", error);
            toast.error("Failed to delete debit note");
        }
    };

    // Handle select all functionality
    const handleSelectAll = (e) => {
        const currentPageIds = debitNotes.map((note) => note._id);
        if (e.target.checked) {
            // Add all current page IDs to selected rows (avoid duplicates)
            setSelectedRows((prev) => [...new Set([...prev, ...currentPageIds])]);
        } else {
            // Remove all current page IDs from selected rows
            setSelectedRows((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        }
    };

    // Handle individual row selection
    const handleSelectRow = (noteId) => {
        setSelectedRows((prev) =>
            prev.includes(noteId)
                ? prev.filter((id) => id !== noteId)
                : [...prev, noteId]
        );
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) return;

        const result = await DeleteAlert({
            title: 'Are you sure?',
            text: `You won't be able to revert the deletion of ${selectedRows.length} debit note${selectedRows.length > 1 ? 's' : ''}!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete them!'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                await Promise.all(
                    selectedRows.map((id) =>
                        axios.delete(`${BASE_URL}/api/debit-notes/${id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })
                    )
                );
                setSelectedRows([]);
                toast.success(`${selectedRows.length} debit note${selectedRows.length > 1 ? 's' : ''} deleted successfully`);

                // Check if we need to go to previous page
                const remainingNotes = debitNotes.length - selectedRows.length;
                if (remainingNotes === 0 && page > 1) {
                    setPage(page - 1);
                } else {
                    fetchNotes();
                }
            } catch (error) {
                console.error('Error deleting debit notes:', error);
                toast.error('Failed to delete some debit notes');
            }
        }
    };

    // Export data to PDF (selected rows or all data)
    const handleExportPDF = async () => {
        try {
            let dataToExport = [];

            if (selectedRows.length > 0) {
                // Export selected rows
                dataToExport = debitNotes.filter((note) =>
                    selectedRows.includes(note._id)
                );
            } else {
                // Export all data by fetching from API without pagination
                const token = localStorage.getItem("token");
                const params = new URLSearchParams({
                    limit: 10000, // Large limit to get all data
                    search: search.trim(),
                });
                if (startDate) params.append("startDate", startDate);
                if (endDate) params.append("endDate", endDate);

                const res = await fetch(`${BASE_URL}/api/debit-notes/getDebit?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                dataToExport = data.debitNotes || data.data || [];
            }

            if (!dataToExport.length) {
                toast.error('No data to export');
                return;
            }

            const doc = new jsPDF();

            // Add title
            doc.setFontSize(20);
            doc.text('Debit Notes Report', 14, 22);

            // Add export info
            doc.setFontSize(12);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
            doc.text(`Total Records: ${dataToExport.length}`, 14, 40);

            // Prepare table data
            const tableData = dataToExport.map((note) => [
                note.debitNoteId || note._id?.slice(-6) || 'N/A',
                note.debitNoteDate ? new Date(note.debitNoteDate).toLocaleDateString() : '',
                note.billTo?.name || note.billTo?.firstName || note.billTo || '-',
                `$${(note.total || note.amount || 0).toFixed ? (note.total || note.amount || 0).toFixed(2) : (note.total || note.amount || 0)}`,
                note.status || '-'
            ]);

            // Add table
            autoTable(doc, {
                head: [['ID', 'Date', 'Vendor', 'Amount', 'Status']],
                body: tableData,
                startY: 50,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] },
                alternateRowStyles: { fillColor: [245, 245, 245] }
            });

            const filename = selectedRows.length > 0 ? "selected_debit_notes.pdf" : "all_debit_notes.pdf";
            doc.save(filename);

            toast.success(`PDF exported successfully (${dataToExport.length} records)`);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error('Failed to export PDF');
        }
    };

    // Export data to Excel (selected rows or all data)
    const handleExportExcel = async () => {
        try {
            let dataToExport = [];

            if (selectedRows.length > 0) {
                // Export selected rows
                dataToExport = debitNotes.filter((note) =>
                    selectedRows.includes(note._id)
                );
            } else {
                // Export all data by fetching from API without pagination
                const token = localStorage.getItem("token");
                const params = new URLSearchParams({
                    limit: 10000, // Large limit to get all data
                    search: search.trim(),
                });
                if (startDate) params.append("startDate", startDate);
                if (endDate) params.append("endDate", endDate);

                const res = await fetch(`${BASE_URL}/api/debit-notes/getDebit?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                dataToExport = data.debitNotes || data.data || [];
            }

            if (!dataToExport.length) {
                toast.error('No data to export');
                return;
            }

            const rows = dataToExport.map((note) => ({
                ID: note.debitNoteId || note._id?.slice(-6) || 'N/A',
                Date: note.debitNoteDate ? new Date(note.debitNoteDate).toLocaleDateString() : '',
                Vendor: note.billTo?.name || note.billTo?.firstName || note.billTo || '-',
                Amount: (note.total || note.amount || 0).toFixed ? (note.total || note.amount || 0).toFixed(2) : (note.total || note.amount || 0),
                Status: note.status || '-',
                CGST: note.cgst || '0',
                SGST: note.sgst || '0',
                Discount: note.discount || '0',
                'Created On': note.createdAt ? new Date(note.createdAt).toLocaleDateString() : '-'
            }));

            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Debit Notes");

            const filename = selectedRows.length > 0 ? "selected_debit_notes.xlsx" : "all_debit_notes.xlsx";
            XLSX.writeFile(wb, filename);

            toast.success(`Excel exported successfully (${rows.length} records)`);
        } catch (error) {
            console.error('Error exporting Excel:', error);
            toast.error('Failed to export Excel');
        }
    };

    // Import functionality
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportExcel = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const token = localStorage.getItem("token");
            const reader = new FileReader();

            reader.onload = async (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (!jsonData.length) {
                    toast.error('No data found in the Excel file');
                    return;
                }

                // Validate required columns
                const requiredColumns = ['ID', 'Date', 'Vendor', 'Amount', 'Status'];
                const firstRow = jsonData[0];
                const missingColumns = requiredColumns.filter(col => !(col in firstRow));

                if (missingColumns.length > 0) {
                    toast.error(`Missing required columns: ${missingColumns.join(', ')}`);
                    return;
                }

                const processedData = jsonData.map(row => ({
                    debitNoteId: row.ID,
                    debitNoteDate: row.Date,
                    billTo: row.Vendor,
                    total: row.Amount,
                    status: row.Status,
                    cgst: row.CGST || 0,
                    sgst: row.SGST || 0,
                    discount: row.Discount || 0,
                }));

                await axios.post(`${BASE_URL}/api/debit-notes/import`, {
                    debitNotes: processedData
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                toast.success("Debit notes imported successfully!");
                fetchNotes(); // Refresh the list
            };

            reader.readAsArrayBuffer(file);

        } catch (error) {
            console.error("Import error:", error);
            toast.error("Error importing debit notes. Please check the file format.");
        }

        // Reset file input
        e.target.value = '';
    };

    return (
        <div className="page-wrapper">
            {/* Start Content */}
            <div className="content content-two">

                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4 className="fw-bold">Debit Note</h4>
                            <h6>Manage your debit note</h6>
                        </div>
                    </div>

                    <div className="table-top-head me-2">
                        <li>
                            {selectedRows.length > 0 && (
                                <button className="btn btn-danger me-2" onClick={handleBulkDelete}>
                                    Delete ({selectedRows.length}) Selected
                                </button>
                            )}
                        </li>
                        <li onClick={handleExportPDF}><button type="button" className="icon-btn" title="Pdf"><FaFilePdf /></button></li>
                        <li><label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} hidden /><FaFileExcel style={{ color: "green" }} /></label></li>
                        <li onClick={handleExportExcel}><button type="button" className="icon-btn" title="Export Excel" ><FaFileExcel /></button></li>
                    </div>


                    {/* <div>
                        <button className="btn btn-primary" onClick={() => { setEditNote(null); }} data-bs-toggle="modal" data-bs-target="#add-return-debit-note">
                            <TbCirclePlus /> Add Debit Note
                        </button>
                    </div> */}

                </div>

                {/* Filter/Search */}
                <div className="mb-3 d-flex flex-wrap gap-2 justify-content-between align-items-center">
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <input
                            type="text"
                            className="form-control"
                            style={{ width: 250, display: 'inline-block' }}
                            placeholder="Search by vendor, ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <input
                            type="date"
                            className="form-control"
                            style={{ width: 150, display: 'inline-block' }}
                            placeholder="Start Date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <input
                            type="date"
                            className="form-control"
                            style={{ width: 150, display: 'inline-block' }}
                            placeholder="End Date"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table datatable text-center align-middle">
                                <thead className="thead-light text-center">
                                    <tr>
                                        <th><label className="checkboxs">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    debitNotes.length > 0 &&
                                                    debitNotes.every((note) => selectedRows.includes(note._id))
                                                }
                                                onChange={handleSelectAll}
                                                ref={(input) => {
                                                    if (input) {
                                                        const currentPageIds = debitNotes.map((note) => note._id);
                                                        const someSelected = currentPageIds.some((id) => selectedRows.includes(id));
                                                        const allSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedRows.includes(id));
                                                        input.indeterminate = someSelected && !allSelected;
                                                    }
                                                }}
                                            />
                                            <span className="checkmarks" />
                                        </label></th>
                                        <th className="">ID</th>
                                           <th>Supplier</th>
                                        <th>Products</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th className="">Status</th>
                                        <th className="" >Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7">Loading...</td></tr>
                                    ) : debitNotes && debitNotes.length > 0 ? (
                                        debitNotes.map((note, idx) => (
                                            <tr key={note._id || idx}>
                                                <td><label className="checkboxs"><input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(note._id)}
                                                    onChange={() => handleSelectRow(note._id)}
                                                /><span className="checkmarks" /></label></td>
                                                <td>
                                                    <a href="#view_notes" className="link-default" data-bs-toggle="modal" data-bs-target="#view_notes"

                                                    //  onClick={() => setSelectedNote(note)}
                                                    >
                                                        {note.debitNoteId || note._id}
                                                    </a>
                                                </td>
                                              <td>{note.billTo?.name || note.billTo?.firstName || note.billTo || '-'}</td>
   <td>

                                              {note.products && note.products.length > 0 ? (
                                                  note.products.map((product, idx) => (
                                                      <div key={idx} className="d-flex align-items-center">
                                                          {product.products?.images?.[0]?.url && (
                                                              <img src={product.products.images[0].url} alt="Product" style={{ width: 30, height: 30, marginRight: 8 }} />
                                                          )}
                                                          <span>
                                                              {product.products?.productName || product.productName || "N/A"}
                                                              {/* <span style={{ color: "#888", fontSize: "12px", marginLeft: 4 }}>
            (HSN: {product.hsnCode})
          </span> */}

                                                          </span>
                                                      </div>
                                                  ))
                                              ) : (
                                                  <span className="text-muted">-</span>
                                              )}
                                          </td>                                                <td>{note.debitNoteDate ? new Date(note.debitNoteDate).toLocaleDateString() : ''}</td>
                                                <td className="text-dark">{note.total || note.total || '-'}</td>
                                                <td>{note.status}</td>

                                                <td className="action-table-data">
                                                    <div className="edit-delete-action">
                                                        {/* <a
                                                            className="me-2 p-2" data-bs-toggle="modal"
                                                            data-bs-target="#view_notes"
                                                            onClick={() => setSelectedNote(note)}
                                                        >
                                                            <TbEye />
                                                        </a> */}

                                                        {/* <a
                                                            className="me-2 p-2"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#edit_debit_note"
                                                            onClick={() => setEditNote(note)}
                                                        >
                                                            <TbEdit />
                                                        </a> */}

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
                                        <tr><td colSpan="7">No debit notes found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination controls */}
                        <div
                            className="d-flex justify-content-end gap-3"
                            style={{ padding: "10px 20px" }}
                        >

                            <select
                                className="form-select w-auto"
                                value={page}
                                onChange={e => { setPage(Number(e.target.value)); }}
                            >
                                {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
                            </select>

                            <span
                                style={{
                                    backgroundColor: "white",
                                    boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
                                    padding: "7px",
                                    borderRadius: "5px",
                                    border: "1px solid #e4e0e0ff",
                                    color: "gray",
                                }}
                            >
                                <span>Page {page} of {totalPages || 1}</span>

                                {" "}
                                <button
                                    style={{
                                        border: "none",
                                        color: "grey",
                                        backgroundColor: "white",
                                    }}
                                    onClick={() => setPage(page - 1)} disabled={page === 1}>
                                    <GrFormPrevious />
                                </button>{" "}
                                <button
                                    style={{ border: "none", backgroundColor: "white" }}
                                    onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                                    <MdNavigateNext />
                                </button>
                            </span>
                        </div>

                    </div>
                </div>

                {/* Modals - Moved outside card structure for proper positioning */}
                <AddDebitNoteModals onAddSuccess={() => { setEditNote(null); fetchNotes(); }} />
                <EditDebitNoteModals noteData={editNote} onEditSuccess={() => { setEditNote(null); fetchNotes(); }} />

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
                                                            <th>Qty</th>
                                                            <th>Return Qty</th>
                                                            <th>Unit</th>
                                                            <th>Price</th>
                                                            <th>Discount</th>
                                                            <th>Tax</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedNote.products && selectedNote.products.length > 0 ? (
                                                            selectedNote.products.map((product, index) => (
                                                                <tr key={index}>
                                                                    <td>{product.productName || product.product?.productName || '-'}</td>
                                                                    <td>{product.quantity || '-'}</td>
                                                                    <td>{product.returnQuantity || '-'}</td>
                                                                    <td>{product.unit || '-'}</td>
                                                                    <td>{product.price || product.unitCost || '-'}</td>
                                                                    <td>{product.discount || '-'}</td>
                                                                    <td>{product.tax || '-'}</td>
                                                                    <td>{product.total || product.totalCost || '-'}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr><td colSpan="8">No products found</td></tr>)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : (<div>No data</div>)}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* End Content */}

        </div>
    )
}

export default DebitNote
