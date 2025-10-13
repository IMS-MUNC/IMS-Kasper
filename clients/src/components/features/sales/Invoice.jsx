import React, { useCallback, useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../../pages/config/config";
import Logo from "../../../assets/img/logo/munclogotm.png";
import "../../../styles/PrintInvoice.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function formatShipping(shipping) {
  if (!shipping) return "";
  let parts = [];
  if (shipping.address1) parts.push(shipping.address1);
  if (shipping.address2) parts.push(shipping.address2);
  if (shipping.city?.cityName) parts.push(shipping.city.cityName);
  if (shipping.state?.stateName) parts.push(shipping.state.stateName);
  if (shipping.country?.name) parts.push(shipping.country.name);
  if (shipping.postalCode) parts.push(shipping.postalCode);
  return parts.join(", ");
}

const Invoice = () => {
  const printRef = useRef(null);
  const token = localStorage.getItem("token");
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [companySetting, setCompanySetting] = useState(null);
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
    documentTitle: sale ? `Invoice_${sale.invoiceId}` : "Invoice",
    copyStyles: true,
  });

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sale || !sale.products) return;
    let subTotal = 0;
    let discountSum = 0;
    let taxableSum = 0;
    let taxSum = 0;
    sale.products.forEach((item) => {
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
  }, [sale]);

  const handlePrintInvoice = useCallback(async () => {
    if (!sale || !sale.invoiceId) {
      alert("Invoice not loaded.");
      return;
    }
    try {
      const res = await axios.get(
        `${BASE_URL}/api/invoice/print/${invoiceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const printWindow = window.open("", "_blank");
      printWindow.document.write(
        "<pre>" + JSON.stringify(res.data.invoice, null, 2) + "</pre>"
      );
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch (err) {
      alert("Failed to print invoice.");
    }
  }, [sale, token]);

  // 🔧 Function: Download Invoice PDF
  //   const handleDownloadPDF = useCallback(async () => {
  //         if (!sale || !sale.invoiceId) {
  //             alert("Invoice not loaded.");
  //             return;
  //         }
  //         try {
  //             const res = await axios.get(
  //                 `${BASE_URL}/api/invoice/pdf/${sale.invoiceId}`,
  //                 {
  //                     headers: { Authorization: `Bearer ${token}` },
  //                     responseType: "blob",
  //                 }
  //             );

  //             const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  //             const link = document.createElement("a");
  //             link.href = url;
  //             link.setAttribute("download", `Invoice_${sale.invoiceId}.pdf`);
  //             document.body.appendChild(link);
  //             link.click();
  //             setTimeout(() => {
  //                 window.URL.revokeObjectURL(url);
  //                 link.remove();
  //             }, 100);
  //         } catch (err) {
  //             alert("Failed to download PDF.");
  //         }
  //     }, [sale, token]);

  // useEffect(() => {
  //     const fetchInvoice = async () => {
  //         try {
  //             const res = await axios.get(`${BASE_URL}/api/sales?invoiceId=${invoiceId}`);
  //             if (res.data.sales && res.data.sales.length > 0) {
  //                 const invoiceData = res.data.sales[0];
  //                 setSale(invoiceData);
  //                 // Fetch company info if company ObjectId exists
  //                 if (invoiceData.company) {
  //                     try {
  //                         const companyRes = await axios.get(`${BASE_URL}/api/companysetting/get/${invoiceData.company}`);
  //                         // Handle different possible response structures
  //                         let profile = null;
  //                         if (companyRes.data && companyRes.data.data) {
  //                             profile = companyRes.data.data;
  //                         } else if (Array.isArray(companyRes.data) && companyRes.data.length > 0) {
  //                             profile = companyRes.data[0];
  //                         } else if (companyRes.data && typeof companyRes.data === 'object') {
  //                             profile = companyRes.data;
  //                         }
  //                         if (profile) {
  //                             setCompanySetting(profile);
  //                         }
  //                     } catch (err) {
  //                         setCompanySetting(null);
  //                     }
  //                 }
  //             } else {
  //                 setError('Invoice not found');
  //             }
  //         } catch (err) {
  //             setError('Failed to fetch invoice');
  //         }
  //         setLoading(false);
  //     };
  //     fetchInvoice();
  // }, [invoiceId]);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/sales?invoiceId=${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.sales && res.data.sales.length > 0) {
          setSale(res.data.sales[0]);
        } else {
          setError("Invoice not found");
        }
      } catch (err) {
        setError("Failed to fetch invoice");
      }
      setLoading(false);
    };
    fetchInvoice();
  }, [invoiceId]);

  // Calculation fields from getSales response
  // const subTotal = sale?.subTotal || 0;
  // const cgstValue = sale?.cgstValue || 0;
  // const sgstValue = sale?.sgstValue || 0;
  // const shipping = sale?.shippingCost || 0;
  // const labour = sale?.labourCost || 0;
  // // Calculate summaryDiscount as percent of (subTotal + shipping + labour)
  // let summaryDiscount = 0;
  // if (sale?.orderDiscount) {
  //     const percent = parseFloat(sale.orderDiscount);
  //     summaryDiscount = ((subTotal + shipping + labour + cgstValue + sgstValue) * percent) / 100;
  // }
  // // Calculate totalAmount
  // const totalAmount = subTotal + cgstValue + sgstValue + shipping + labour - summaryDiscount;

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!sale) return <div>No invoice found.</div>;

  // Print Invoice API integration
  // const handlePrintInvoice = async () => {
  //     try {
  //         const res = await axios.get(`${BASE_URL}/api/invoice/print/${sale._id || sale.id}`, {
  //             headers: {
  //                 Authorization: `Bearer ${token}`,
  //             },
  //         });
  //         const printWindow = window.open('', '_blank');
  //         printWindow.document.write(res.data);
  //         printWindow.document.close();
  //         printWindow.focus();
  //         printWindow.print();
  //     } catch (err) {
  //         alert('Failed to print invoice.');
  //     }
  // };

  // Clone Invoice API integration
  const handleCloneInvoice = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/invoice/clone/${sale._id || sale.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Invoice cloned successfully!");
      // Optionally, redirect to new invoice
      // navigate(`/invoice/${res.data.invoice._id}`);
    } catch (err) {
      toast.error("Failed to clone invoice.");
    }
  };

  function getProductRowCalculation(item) {
    const saleQty = Number(item.saleQty || item.quantity || 1);
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

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 2, // better quality
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const imgWidth = 595; // A4 width in points
    const pageHeight = 842;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Invoice_${sale.invoiceId || "Download"}.pdf`);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Invoice Details</h4>
            </div>
          </div>
          <ul className="table-top-head">
          </ul>
          <div className="page-btn">
            <a className="btn btn-primary" onClick={() => navigate(-1)}>
              <i data-feather="arrow-left" className="me-2" />
              Back to Invoices
            </a>
          </div>
        </div>
        {/* Invoices */}
        <div className="card">
          <div
            className="card-body d-flex flex-column justify-content-between"
            ref={printRef}
            style={{ minHeight: "100vh", padding: "30px" }}
          >
            {/* Header - Logo */}
            <div className="text-center mb-2">
              <img src={Logo} width={200} alt="Logo" />
            </div>

            {/* From / To / Invoice */}
            <div className="row mb-4 border invoice-header">
              <div className="col-md-4 border-end pe-3">
                <p className="text-dark mb-2 fw-bold fs-20">From</p>
                <h4 className="mb-1">{formData.companyName || "-"}</h4>
                <p className="mb-1">{formData.companyaddress || "-"}</p>
                <p className="mb-1">Email: {formData.companyemail || "-"}</p>
                <p>Phone: {formData.companyphone || "-"}</p>
              </div>
              <div className="col-md-4 border-end pe-3">
                <p className="text-dark mb-2 fw-bold fs-20">To</p>
                <h4 className="mb-1">{sale.customer?.name || "-"}</h4>
                <p className="mb-1">{formatShipping(sale.customer?.billing)}</p>
                <p className="mb-1">Email: {sale.customer?.email || "-"}</p>
                <p>Phone: {sale.customer?.phone || "-"}</p>
              </div>
              <div className="col-md-4 pe-3">
                <p className="text-dark mb-2 fw-bold fs-20">GST Invoice</p>
                <h4 className="mb-1">
                  Invoice No:{" "}
                  <span className="text-primary">#{sale.invoiceId}</span>
                </h4>
                <p className="mb-1 fw-medium">
                  Invoice Date:{" "}
                  {sale.saleDate
                    ? new Date(sale.saleDate).toLocaleDateString()
                    : "-"}
                </p>
                <p className="fw-medium">
                  Due Date:{" "}
                  {sale.saleDate
                    ? new Date(sale.saleDate).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>

            {/* Products Table */}
            <div className="table-responsive mb-4 flex-grow-1">
              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th>Product/Service</th>
                    <th>HSN Code</th>
                    <th>Qty</th>
                    <th>Selling Price</th>
                    <th>Discount</th>
                    <th>Sub Total</th>
                    <th>Discount Amount</th>
                    <th>Tax (%)</th>
                    <th>Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.products?.map((item, idx) => {
                    const d = getProductRowCalculation(item);
                    return (
                      <tr key={idx}>
                        <td>{item.productId?.productName || "-"}</td>
                        <td>{item.hsnCode || "-"}</td>
                        <td>{item.saleQty}</td>
                        <td>₹{item.sellingPrice}</td>
                        <td>
                          {item.discount}{" "}
                          {item.discountType === "Percentage" ? "%" : "₹"}
                        </td>
                        <td>₹{item.subTotal}</td>
                        <td>₹{item.discountAmount}</td>
                        <td>{item.tax}%</td>
                        <td>₹{item.taxAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="row mb-4">
              <div className="d-flex justify-content-between bg-light border p-2 invoice-summary">
                {[
                  { label: "Sub Total", value: summary.subTotal },
                  {
                    label: "Discount",
                    value: summary.discountSum,
                    isNegative: true,
                  },
                  { label: "Taxable Value", value: summary.taxableSum },
                  { label: "CGST", value: summary.cgst },
                  { label: "SGST", value: summary.sgst },
                  { label: "Total Invoice Amount", value: summary.grandTotal },
                ].map((item, idx) => (
                  <div
                    className="d-flex flex-column text-center px-2"
                    key={idx}
                  >
                    <small>{item.label}</small>
                    <strong>
                      {item.isNegative ? "- " : ""}₹{" "}
                      {Number(item.value || 0).toFixed(2)}
                    </strong>
                  </div>
                ))}
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
            <div className="col-md-12" style={{marginTop:'30px', textAlign:'center', width:'100%'}}>
            {/* Notes at the bottom */}
              <strong>NOTE:</strong> Please quote invoice number when remitting
              funds.
          </div>
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center mb-4">
          {/* Print Invoice */}
          <button
            className="btn btn-primary d-flex justify-content-center align-items-center me-2"
            onClick={handleReactPrint}
          >
            <i className="ti ti-printer me-2" /> Print Invoice
          </button>

          {/* Download PDF */}
          <button
            className="btn btn-secondary d-flex justify-content-center align-items-center border"
            onClick={handleDownloadPDF}
          >
            <i className="ti ti-copy me-2" /> Download PDF
          </button>
        </div>
        {/* /Invoices */}
        {/* <div className="d-flex justify-content-center align-items-center mb-4">
                    <button className="btn btn-primary d-flex justify-content-center align-items-center me-2" onClick={async () => {
                        try {
                            const res = await axios.get(`${BASE_URL}/api/sales/print/${sale.invoiceId}`,{
                                 headers: {
                        Authorization: `Bearer ${token}`,
                    },
                            });
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write('<pre>' + JSON.stringify(res.data.invoice, null, 2) + '</pre>');
                            printWindow.document.close();
                            printWindow.focus();
                            printWindow.print();
                        } catch (err) {
                            alert('Failed to print invoice.');
                        }
                    }}><i className="ti ti-printer me-2" />Print Invoice</button>
                    <button className="btn btn-secondary d-flex justify-content-center align-items-center border" onClick={async () => {
                        try {
                            const res = await axios.get(`${BASE_URL}/api/invoice/pdf/${sale.invoiceId}`, { responseType: 'blob' },{
 headers: {
                        Authorization: `Bearer ${token}`,
                    },
                            });
                            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `Invoice_${sale.invoiceId}.pdf`);
                            document.body.appendChild(link);
                            link.click();
                            link.parentNode.removeChild(link);
                        } catch (err) {
                            alert('Failed to download PDF.');
                        }
                    }}><i className="ti ti-copy me-2" />Download PDF</button>
                </div> */}
      </div>
    </div>
  );
};

export default Invoice;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import BASE_URL from '../../../pages/config/config';

// const Invoice = () => {
//     const { invoiceId } = useParams();
//     const navigate = useNavigate();
//     const [sale, setSale] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchInvoice = async () => {
//             try {
//                 const res = await axios.get(`${BASE_URL}/api/sales?invoiceId=${invoiceId}`);
//                 if (res.data.sales && res.data.sales.length > 0) {
//                     setSale(res.data.sales[0]);
//                 } else {
//                     setError('Invoice not found');
//                 }
//             } catch (err) {
//                 setError('Failed to fetch invoice');
//             }
//             setLoading(false);
//         };
//         fetchInvoice();
//     }, [invoiceId]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//     if (!sale) return <div>No invoice found.</div>;

//     return (
//         <div className="container mt-4">
//             <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Back</button>
//             <h2>Invoice</h2>
//             <div className="card p-3 mb-3">
//                 <p><strong>Invoice ID:</strong> {sale.invoiceId}</p>
//                 <p><strong>Reference:</strong> {sale.referenceNumber}</p>
//                 <p><strong>Customer:</strong> {sale.customer?.name}</p>
//                 <p><strong>Date:</strong> {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : '-'}</p>
//                 <p><strong>Status:</strong> {sale.status}</p>
//                 <p><strong>Total Amount:</strong> {sale.totalAmount}</p>
//                 <p><strong>Paid Amount:</strong> {sale.paidAmount}</p>
//                 <p><strong>Due Amount:</strong> {sale.dueAmount}</p>
//                 <p><strong>Payment Status:</strong> {sale.paymentStatus}</p>
//                 <p><strong>Biller:</strong> {sale.billing?.name}</p>
//                 <p><strong>Description:</strong> {sale.description}</p>
//             </div>
//             <h4>Products</h4>
//             <table className="table">
//                 <thead>
//                     <tr>
//                         <th>Product Name</th>
//                         <th>Quantity</th>
//                         <th>Price</th>
//                         <th>Total</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {sale.products?.map((item, idx) => (
//                         <tr key={idx}>
//                             <td>{item.productId?.productName || '-'}</td>
//                             <td>{item.saleQty}</td>
//                             <td>{item.sellingPrice}</td>
//                             <td>{item.saleQty * item.sellingPrice}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Invoice;
