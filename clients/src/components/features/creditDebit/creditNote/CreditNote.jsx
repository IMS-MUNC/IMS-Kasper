

import React, { useEffect, useRef, useState } from "react";
import { TbEdit, TbEye, TbRefresh, TbTrash } from "react-icons/tb";
import AddCreditNoteModals from '../../../../pages/Modal/debitNoteModals/AddDebitNoteModals'
import EditCreditNoteModals from '../../../../pages/Modal/debitNoteModals/EditDebitNoteModals'
import BASE_URL from '../../../../pages/config/config';
import axios from "axios";
import { MdNavigateNext } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PDF from "../../../../assets/img/icons/pdf.svg"
import { GrFormPrevious } from "react-icons/gr";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

function formatAddress(billing) {
  if (!billing) return '';
  let parts = [];
  if (billing.address1) parts.push(billing.address1);
  if (billing.address2) parts.push(billing.address2);
if (billing.city) parts.push(billing.city);
if (billing.state) parts.push(billing.state);
if (billing.country) parts.push(billing.country);
  if (billing.postalCode) parts.push(billing.postalCode);
  return parts.join(', ');
}
// import EXCEL from "../../../assets/img/icons/excel.svg"
const CreditNote = () => {
    const [creditNotes, setCreditNotes] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedNote, setSelectedNote] = React.useState(null);
    const [editNote, setEditNote] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [search, setSearch] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [limit, setLimit] = React.useState(2);
    const [pages, setPages] = useState(1);

  const [companyImages, setCompanyImages] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)


    const downloadPDF = (elementId) => {
        const input = document.getElementById(elementId);
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("credit-note.pdf");
        });
    };

    // Fetch all credit notes
    const fetchNotes = React.useCallback(() => {
        setLoading(true);
        const token = localStorage.getItem("token");

        fetch(`${BASE_URL}/api/credit-notes/all`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.data)) {
                    setCreditNotes(data.data);
                    setTotalPages(1);
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
    }, []);

    React.useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    // Delete handler (soft or hard)
    const handleDelete = async (id) => {
        const type = window.prompt(
            "Type 'soft' for soft delete (move to trash), or 'hard' for permanent delete:",
            "soft"
        );
        if (!type) return;
        if (type !== "soft" && type !== "hard") {
            alert("Invalid input. Type 'soft' or 'hard'.");
            return;
        }
        if (!window.confirm(`Are you sure you want to ${type === 'soft' ? 'soft delete (move to trash)' : 'permanently delete'} this credit note?`)) return;
        try {
            const token = localStorage.getItem("token");
            const url = `${BASE_URL}/api/credit-notes/${type === 'soft' ? 'soft' : 'hard'}/${id}`;
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCreditNotes((notes) => notes.filter((n) => n._id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    // Fetch by saleId (optional)
    const fetchCreditNotesBySale = React.useCallback((saleId) => {
        if (!saleId) return;
        const token = localStorage.getItem("token");

        fetch(`${BASE_URL}/api/credit-notes/sale/${saleId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.data)) {
                    setCreditNotes(data.data);
                } else {
                    setCreditNotes([]);
                }
            });
    }, []);

// invoice section
  const printRef = useRef(null);
    const [companySetting, setCompanySetting] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const token = localStorage.getItem("token");
//   const [summary, setSummary] = useState({
//     subTotal: 0,
//     discountSum: 0,
//     taxableSum: 0,
//     cgst: 0,
//     sgst: 0,
//     taxSum: 0,
//     shippingCost: 0,
//     labourCost: 0,
//     orderDiscount: 0,
//     roundOff: 0,
//     grandTotal: 0,
//   });
  const [formData, setFormData] = useState({
    companyName: "",
    companyemail: "",
    companyphone: "",
    companyfax: "",
    companywebsite: "",
    companyaddress: "",
    companycountry: "",
    companystate: "",
    companycity: "",
    companypostalcode: "",
    gstin: "",
    cin: "",
    companydescription: "",
  });


  const handleReactPrint = useReactToPrint({
    contentRef: printRef, // ✅ new API
    // documentTitle: sale ? `Invoice_${sale.invoiceId}` : "Invoice",
    copyStyles: true,
  });

      const fetchCompanyProfile = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/api/companyprofile/get`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          let profile = null;
          // Handle different possible response structures
          if (res.data && res.data.data) {
            profile = res.data.data;
          } else if (Array.isArray(res.data) && res.data.length > 0) {
            profile = res.data[0];
          } else if (res.data && typeof res.data === "object") {
            profile = res.data;
          }
          if (profile) {
            setFormData({
              companyName: profile.companyName || "",
              companyemail: profile.companyemail || "",
              companyphone: profile.companyphone || "",
              companyfax: profile.companyfax || "",
              companywebsite: profile.companywebsite || "",
              companyaddress: profile.companyaddress || "",
              companycountry: profile.companycountry || "",
              companystate: profile.companystate || "",
              companycity: profile.companycity || "",
              companypostalcode: profile.companypostalcode || "",
              gstin: profile.gstin || "",
              cin: profile.cin || "",
              companydescription: profile.companydescription || "",
            });
               setCompanyImages({
        companyLogo: profile.companyLogo || "",
        companyDarkLogo: profile.companyDarkLogo || "",
      });
            setCompanySetting(profile);
            setIsUpdating(true);
          } else {
            toast.error("No company profile found.");
          }
        } catch (error) {
          toast.error("Error fetching company profile.");
          console.error(error);
        }
      };
      useEffect(() => {
        fetchCompanyProfile();
      }, []);
// 🟢 Safe Row Calculation
  function getProductRowCalculation(item) {
    const saleQty = Number(item.quantity || item.quantity || 1);
    const price = Number(item.sellingPrice || 0);
    const discount = Number(item.discount || 0);
    const tax = Number(item.tax || 0);
    const subTotal = saleQty * price;
    // 🔧 Fixed discount logic
    let discountAmount = 0;
    if (item.discountType === "Percentage") {
      discountAmount = (subTotal * discount) / 100;
    } else if (
      item.discountType === "Rupees" ||
      item.discountType === "Fixed"
    ) {
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


const getSummaryFromProducts = (products = []) => {
  let subTotal = 0;
  let discountSum = 0;
  let taxableSum = 0;
  let cgst = 0;
  let sgst = 0;
  let grandTotal = 0;

  products.forEach(item => {
    // Calculate line total, discount, and tax
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.sellingPrice) || 0;
    const discount = Number(item.discount) || 0;
    const discountType = item.discountType;
    const taxRate = Number(item.tax) || 0;

    // Discount calculation
    let discountAmount = 0;
    if (discountType === "Percentage") {
      discountAmount = ((price * quantity) * discount) / 100;
    } else {
      discountAmount = discount * quantity;
    }

    // Subtotal before tax
    const subTotalRow = (price * quantity) - discountAmount;

    // Tax calculation
    const taxAmount = (subTotalRow * taxRate) / 100;
    const cgstAmount = taxAmount / 2;
    const sgstAmount = taxAmount / 2;

    // Taxable value (before tax)
    const taxableAmount = subTotalRow;

    // Grand total for this row
    const lineTotal = subTotalRow + taxAmount;

    // Aggregate
    subTotal += subTotalRow;
    discountSum += discountAmount;
    taxableSum += taxableAmount;
    cgst += cgstAmount;
    sgst += sgstAmount;
    grandTotal += lineTotal;
  });

  return {
    subTotal,
    discountSum,
    taxableSum,
    cgst,
    sgst,
    grandTotal,
  };
};

// ...inside your component, before rendering...
const summary = getSummaryFromProducts(selectedNote?.products || []);

  

    // useEffect(() => {
    //   if (!creditNotes || !creditNotes.products) return;
    //   let subTotal = 0;
    //   let discountSum = 0;
    //   let taxableSum = 0;
    //   let taxSum = 0;
    //   sale.products.forEach((item) => {
    //     const d = getProductRowCalculation(item);
    //     subTotal += d.subTotal;
    //     discountSum += d.discountAmount;
    //     taxableSum += d.taxableAmount;
    //     taxSum += d.taxAmount;
    //   });
  
    //   const cgst = taxSum / 2;
    //   const sgst = taxSum / 2;
    //   const grandTotal = (taxableSum || 0) + (taxSum || 0);
  
    //   setSummary({
    //     subTotal,
    //     discountSum,
    //     taxableSum,
    //     cgst,
    //     sgst,
    //     taxSum,
  
    //     grandTotal,
    //   });
    // }, [creditNotes]);
    
    return (
         <div className="page-wrapper">
              <div className="content">
        
                <div className="page-header">
                  <div className="add-item d-flex">
                    <div className="page-title">
                      <h4>Credit Notes</h4>
                      <h6>Manage Your Credit Notes</h6>
                    </div>
                  </div>
                  <ul className="table-top-head">
                    <li>
                      <a onClick={downloadPDF} data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src={PDF} alt="img" /></a>
                    </li>
                    {/* <li>
                      <a onClick={handleExportExcel} data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src={EXCEL} alt="img" /></a>
                    </li> */}
                    <li>
                      <a onClick={() => location.reload()} data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><TbRefresh className="ti ti-refresh" /></a>
                    </li>
        
                  </ul>
              
                </div>
                <div className="card">
        
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <div className="search-set">
                      <div className="search-input">
                        <input
                          type="text"
                          className="form-control"
                           placeholder="Search by Reference, ID, Customer..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                      </div>
                    </div>
                    <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
        
                      <div className="d-flex gap-3 align-items-center me-2">
                        <div>
                          <input type="date" className="form-control"   value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setPage(1);
                            }}/>
                        </div>
                                 <span>-</span>

                        <div>
                          <input type="date" className="form-control"    value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setPage(1);
                            }} />
                        </div>
        
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                   <table className="table datatable">
                        <thead>
                            <tr>
                                <th className="no-sort">
                                    <div className="form-check form-check-md">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="select-all"
                                        />
                                    </div>
                                </th>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Products</th>
                                <th>HSN</th>
                                <th>Qyt</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8">Loading...</td>
                                </tr>
                            ) : creditNotes && creditNotes.length > 0 ? (
                                creditNotes
                                    .filter(note => {
                                        // Search filter (reference, id, customer)
                                        const searchLower = search.toLowerCase();
                                        const refMatch = (note.referenceNumber || '').toLowerCase().includes(searchLower);
                                        const idMatch = (note.creditNoteId || note._id || '').toLowerCase().includes(searchLower);
                                        const customerMatch = (
                                            note.sale?.customer?.name?.toLowerCase().includes(searchLower) ||
                                            note.billFrom?.name?.toLowerCase().includes(searchLower) ||
                                            note.billTo?.name?.toLowerCase().includes(searchLower) ||
                                            note.billFrom?.email?.toLowerCase().includes(searchLower) ||
                                            note.billTo?.email?.toLowerCase().includes(searchLower)
                                        );
                                        // Date filter
                                        let dateOk = true;
                                        if (startDate) {
                                            const noteDate = note.creditNoteDate ? new Date(note.creditNoteDate) : null;
                                            if (!noteDate || noteDate < new Date(startDate)) dateOk = false;
                                        }
                                        if (endDate) {
                                            const noteDate = note.creditNoteDate ? new Date(note.creditNoteDate) : null;
                                            if (!noteDate || noteDate > new Date(endDate + 'T23:59:59')) dateOk = false;
                                        }
                                        return (
                                            (!search || refMatch || idMatch || customerMatch) && dateOk
                                        );
                                    })
                                    .map((note, idx) => (
                                        <tr key={note._id || idx}>
                                            <td>
                                                <div className="form-check form-check-md">
                                                    <input className="form-check-input" type="checkbox" />
                                                </div>
                                            </td>
                                            <td>
                                                <a
                                                    href="#view_notes"
                                                    className="link-default"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#view_notes"
                                                    onClick={() => setSelectedNote(note)}
                                                >
                                                    {note.creditNoteId || note._id}
                                                </a>
                                            </td>
                                            <td>
                                                {note.creditNoteDate
                                                    ? new Date(note.creditNoteDate).toLocaleDateString()
                                                    : note.date
                                                        ? new Date(note.date).toLocaleDateString()
                                                        : ""}
                                            </td>

                                            <td>
                                                <div className="d-flex align-items-center me-2">
                                                    {note.sale?.customer?.images?.[0] ? (
                                                        <img
                                                            src={
                                                                note.sale.customer.images[0]?.url ||
                                                                note.sale.customer.images[0]
                                                            }
                                                            alt={note.sale.customer?.name || "-"}
                                                            style={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "50%",
                                                                objectFit: "cover",
                                                                marginRight: 6,
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="me-2 d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "50%",
                                                                backgroundColor: "#007bff",
                                                                color: "#fff",
                                                                fontSize: "14px",
                                                                fontWeight: "bold",
                                                                textTransform: "uppercase",
                                                                opacity: 0.8,
                                                                marginRight: 6,
                                                            }}
                                                        >
                                                            {note.sale?.customer?.name?.charAt(0) ||
                                                                note.billFrom?.name?.charAt(0) ||
                                                                note.billTo?.name?.charAt(0) ||
                                                                note.billFrom?.email?.charAt(0) ||
                                                                note.billTo?.email?.charAt(0) ||
                                                                "U"}
                                                        </div>
                                                    )}

                                                    <span>
                                                        {note.sale?.customer?.name ||
                                                            note.billFrom?.name ||
                                                            note.billTo?.name ||
                                                            note.billFrom?.email ||
                                                            note.billTo?.email ||
                                                            "-"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>

                                                {note.products && note.products.length > 0 ? (
                                                    note.products.map((product, idx) => (
                                                        <div key={idx} className="d-flex align-items-center">
                                                            {product.productId?.images?.[0]?.url && (
                                                                <img src={product.productId.images[0].url} alt="Product" style={{ width: 30, height: 30, marginRight: 8 }} />
                                                            )}
                                                            <span>
                                                                {product.productId?.productName || product.productName || "N/A"}

                                                                {/* <span style={{ color: "#888", fontSize: "12px", marginLeft: 4 }}>
            (HSN: {product.hsnCode})
          </span> */}

                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>

                                            <td>
                                                {note.products && note.products.length > 0 ? (
                                                    note.products.map((product, idx) => (
                                                        <div key={idx} className="d-flex align-items-center">

                                                            {product.hsnCode}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                {note.products && note.products.length > 0 ? (
                                                    note.products.map((product, idx) => (
                                                        <div key={idx} className="d-flex align-items-center">

                                                            {product.returnQty}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>


                                            <td>{note.total || note.amount || note.grandTotal || "-"}</td>

                                            <td>{note.status || "-"}</td>
                                            <td className="action-table-data">
                                                <div className="edit-delete-action">
                                                    <a
                                                        className="me-2 p-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#view_notes"
                                                        onClick={() => setSelectedNote(note)}
                                                    >
                                                        <TbEye />
                                                    </a>
                                                    <a
                                                        className="me-2 p-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#edit_credit_note"
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
                                <tr>
                                    <td colSpan="8">No credit notes found.</td>
                                </tr>
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
                        value={limit}
                        onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
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
                        <span>Page {page} of {pages || 1}</span>
        
                        {" "}
                        <button
                          style={{
                            border: "none",
                            color: "grey",
                            backgroundColor: "white",
                          }}
                           onClick={() => setPage(page - 1)}
                                disabled={page === 1}>
                          <GrFormPrevious />
                        </button>{" "}
                        <button
                          style={{ border: "none", backgroundColor: "white" }}
                            onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}>
                          <MdNavigateNext />
                        </button>
                      </span>
                    </div>
        
                  </div>
                </div>
                {/* <SalesDashboard /> */}
              </div>
                   {/* Add Credit Note Modal */}
              <AddCreditNoteModals
                  onCreated={() => {
                      setEditNote(null);
                      fetchNotes();
                  }}
              />

              {/* Edit Credit Note Modal */}
              <div
                  className="modal fade"
                  id="edit_credit_note"
                  tabIndex="-1"
                  aria-labelledby="editCreditNoteLabel"
                  aria-hidden="true"
              >
                  <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                          <EditCreditNoteModals
                              noteData={editNote}
                              onEditSuccess={() => {
                                  setEditNote(null);
                                  fetchNotes();
                              }}
                          />
                      </div>
                  </div>
              </div>

                {/* View Credit Note Modal */}
<div
className="modal fade"
id="view_notes"
tabIndex="-1"
aria-labelledby="viewNotesLabel"
aria-hidden="true"
>
<div className="modal-dialog modal-xl">
<div className="modal-content">
    <div className="modal-header bg-light text-white">
        <h5 className="modal-title">Credit Note</h5>
        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>


    <div className="modal-body p-4" id="creditNoteInvoice">
        {selectedNote ? (
            <div className="card">
                <div
                    className="card-body d-flex flex-column justify-content-between"
                    ref={printRef}
                    style={{ minHeight: "100vh", padding: "30px" }}
                >
                    {/* Header - Logo */}
                    <div className="text-center mb-2">
                        <Link to="/home" className="logo logo-normal">
                            <img width={150}  src={isDarkMode ? companyImages?.companyDarkLogo : companyImages?.companyLogo} alt="Logo" />
                        </Link>
                    </div>

                    {/* ...inside your modal... */}
                    <div className="row mb-4 border invoice-header">
                        {/* Bill From (Your Company) */}
                        <div className="col-md-4 border-end pe-3 px-3 p-2">
                            <p className="text-dark mb-2 fw-bold fs-20">Bill From</p>
                            <h4 className="mb-1">{formData.companyName || selectedNote.billFrom?.name || "-"}</h4>
                            <p className="mb-1">{formData.companyaddress || selectedNote.billFrom?.address1 || "-"}</p>
                            <p className="mb-1">Email: {formData.companyemail || selectedNote.billFrom?.email || "-"}</p>
                            <p className="mb-1">Phone: {formData.companyphone || selectedNote.billFrom?.phone || "-"}</p>
                            <p>GSTIN: {formData.gstin || selectedNote.billFrom?.gstin || "-"}</p>

                        </div>
                        {/* Bill To (Customer) */}
                        <div className="col-md-5 border-end px-3 p-2">
                            <p className="text-dark mb-2 fw-bold fs-20">Bill To</p>
                            <h4 className="mb-1">
                                {selectedNote.sale?.customer?.name ||
                                    selectedNote.customer?.name ||
                                    selectedNote.billTo?.name ||
                                    "-"}
                            </h4>
                            <p className="mb-1">
                                {formatAddress(
                                    selectedNote.sale?.customer?.billing ||
                                    selectedNote.customer?.billing ||
                                    selectedNote.billTo?.billing ||
                                    selectedNote.billing ||
                                    {}
                                ) || "-"}

                            </p>
                            <p className="mb-1">
                                Email: {selectedNote.sale?.customer?.email ||
                                    selectedNote.customer?.email ||
                                    selectedNote.billTo?.email ||
                                    "-"}
                            </p>
                            <p className="mb-1">
                                Phone: {selectedNote.sale?.customer?.phone ||
                                    selectedNote.customer?.phone ||
                                    selectedNote.billTo?.phone ||
                                    "-"}
                            </p>
                            <p className="mb-1">
                                GSTIN: {selectedNote.customer?.gstin || "-"}
                            </p>
                        </div>
                        {/* GST Invoice Info */}
                        <div className="col-md-3 pe-3 px-3 p-2">
                            <p className="text-dark mb-2 fw-bold fs-20">GST Invoice</p>
                            <h4 className="mb-1">
                                Invoice No: <span className="text-primary">#{selectedNote.creditNoteId}</span>
                            </h4>
                            <p>Date: {selectedNote.creditNoteDate ? new Date(selectedNote.creditNoteDate).toLocaleDateString() : "-"}</p>
                            <p>Status: {selectedNote.status || "-"}</p>

                        </div>
                    </div>

                                        <div className="table-responsive mb-4 flex-grow-1">
                                            <table className="table table-bordered table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>#</th>
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
                                                    {Array.isArray(selectedNote.products) && selectedNote.products.length > 0 ? (
                                                        selectedNote.products.map((item, i) => {
                                                            const d = getProductRowCalculation(item);
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{i + 1}</td>
                                                                    <td>{item.productId?.productName || "-"}</td>
                                                                    <td>{item.hsnCode || item.productId?.hsn?.hsnCode || "-"}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>{item.unit}</td>
                                                                    <td>₹{item.sellingPrice?.toFixed(2)}</td>
                                                                    {/* <td>₹{item.discount || 0}</td> */}
                                                                    <td>
                                                                        {item.discount}{" "}
                                                                        {item.discountType === "Percentage" ? "%" : "₹"}
                                                                    </td>
                                                                    <td>{item.tax}%</td>
                                                                    <td>₹{d.subTotal}</td>

                                                                    {/* <td>₹ <strong>₹{selectedNote.grandTotal?.toFixed(2) || selectedNote.total?.toFixed(2) || "0.00"}</strong></td> */}
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="11" className="text-center text-muted">
                                                                No products selected.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
               
                     {/* Summary calculation */}     
                                        <div className="row mb-4">
                                            <div className="d-flex justify-content-between bg-light border p-2 invoice-summary">
                                                <div className="d-flex flex-column text-center px-2">
                                                    <small>Sub Total</small>
                                                    <strong>₹{summary.subTotal.toFixed(2)}</strong>
                                                </div>
                                                <div className="d-flex flex-column text-center px-2">
                                                    <small>Discount</small>
                                                    <strong>- ₹{summary.discountSum.toFixed(2)}</strong>
                                                </div>
                                                <div className="d-flex flex-column text-center px-2">
                                                    <small>Taxable Value</small>
                                                    <strong>₹{summary.taxableSum.toFixed(2)}</strong>
                                                </div>
                                                <div className="d-flex flex-column text-center px-2">
                                                    <small>CGST</small>
                                                    <strong>₹{summary.cgst.toFixed(2)}</strong>
                                                </div>
                                                <div className="d-flex flex-column text-center px-2">
                                                    <small>SGST</small>
                                                    <strong>₹{summary.sgst.toFixed(2)}</strong>
                                                </div>
                                                <div className="d-flex flex-column text-center px-2">
                                                    <small>Total Invoice Amount</small>
                                                    <strong>₹{summary.grandTotal.toFixed(2)}</strong>
                                                </div>
                                            </div>
                                        </div>

                    {/* Footer - Terms / Signatory / Biller */}
                    <div className="row border mt-2 mb-2 pt-3 invoice-footer">
                        <div className="col-md-4 border-end pe-3 text-center invoice-footer">
                            <h6 className="mb-1">Terms and Conditions</h6>
                            <p className="mb-0">
                                Please pay within 15 days from the date of invoice, overdue
                                interest @ 14% will be charged on delayed payments.
                            </p>
                        </div>
                        <div className="col-md-4 border-end px-3 text-center invoice-footer">
                            <h6 className="mb-1"
                                style={{
                                    // fontWeight: "600",
                                    fontSize: "12px",
                                    paddingBottom: "30PX",
                                }}
                            >
                                FROM KASPHER DISTRIBUTORS
                            </h6>
                            <p style={{ margin: 0, fontWeight: "600", fontSize: "12px" }}>
                                Authorised Signatory
                            </p>
                        </div>
                        <div className="col-md-4 ps-3 text-center invoice-footer">
                            <h6 className="mb-1" style={{ fontSize: "12px" }}
                            >Biller</h6>
                            <p style={{ margin: 0, fontWeight: "600", fontSize: "12px" }}>Afroz Zeelani</p>
                        </div>
                    </div>
                    <div className="col-md-12" style={{ marginTop: '30px', textAlign: 'center', width: '100%' }}>
                        {/* Notes at the bottom */}
                        <strong>NOTE:</strong> Please quote invoice number when remitting
                        funds.
                    </div>
                </div>
            </div>
           
        ) : (
            <div className="text-center">No Data Found</div>
        )}
    </div>

    {/* === Footer Buttons === */}
    <div className="modal-footer me-2 gap-3">
        <button
            className="btn btn-secondary"
            onClick={() => window.print()}
        >
            🖨️ Print
        </button>
        <button
            className="btn btn-success"
            onClick={() => downloadPDF("creditNoteInvoice")}
        >
            📄 Download PDF
        </button>
    </div>
</div>
</div>
</div>
</div>


  
    );
};

export default CreditNote;



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
