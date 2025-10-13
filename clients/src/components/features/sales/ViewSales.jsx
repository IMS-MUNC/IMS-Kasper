// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import BASE_URL from '../../../pages/config/config';

// const ViewSales = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [sale, setSale] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role"); // e.g., 'admin', 'manager'
//   console.log("User SALE:", sale);

//   useEffect(() => {
//     const fetchSale = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/sales/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSale(res.data);
//       } catch (err) {
//         setError('Failed to fetch sale details');
//       }
//       setLoading(false);
//     };
//     fetchSale();
//   }, [id]);

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'completed': return 'success';
//       case 'pending': return 'warning';
//       case 'cancelled': return 'danger';
//       default: return 'secondary';
//     }
//   };

//   const getPaymentColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'paid': return 'success';
//       case 'partial': return 'warning';
//       case 'unpaid': return 'danger';
//       default: return 'secondary';
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleDownloadPDF = async () => {
//     const element = document.getElementById('invoice-content');
//     const canvas = await html2canvas(element);
//     const imgData = canvas.toDataURL('image/png');

//     const pdf = new jsPDF();
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`invoice-${sale.referenceNumber || id}.pdf`);
//   };

//   const confirmDelete = async () => {
//     try {
//       await axios.delete(`${BASE_URL}/api/sales/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Sale deleted successfully");
//       navigate("/sales");
//     } catch (err) {
//       alert("Failed to delete sale");
//     } finally {
//       setShowDeleteConfirm(false);
//     }
//   };

//   if (loading) return <div className="text-center mt-5">Loading...</div>;
//   if (error) return <div className="text-danger text-center mt-5">{error}</div>;
//   if (!sale) return <div className="text-center mt-5">No sale found.</div>;

//   return (
//     <div className="page-wrapper">
//       <div className="content">

//         {/* Page Header */}
//         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//           <h2 className="mb-0">Sale Details</h2>
//           <div className="d-flex gap-2">
//             <button className="btn btn-outline-primary" onClick={handlePrint}>🧾 Print</button>
//             <button className="btn btn-outline-info" onClick={handleDownloadPDF}>⬇️ Download PDF</button>

//             {["admin", "manager"].includes(role) && (
//               <button className="btn btn-outline-warning" onClick={() => navigate(`/sales/edit/${id}`)}>✏️ Edit</button>
//             )}

//             {role === "admin" && (
//               <button className="btn btn-outline-danger" onClick={() => setShowDeleteConfirm(true)}>🗑️ Delete</button>
//             )}
//           </div>
//         </div>

//         {/* Sale Info Section */}
//         <div className="card shadow-sm mb-4" id="invoice-content">
//           <div className="card-body">
//             <div className="row g-3">
//               <div className="col-md-4">
//                 <p><strong>Reference:</strong> {sale.referenceNumber}</p>
//                 <p><strong>Date:</strong> {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : '-'}</p>
//                 <p>
//                   <strong>Status:</strong>{' '}
//                   <span className={`badge bg-${getStatusColor(sale.status)}`}>
//                     {sale.status}
//                   </span>
//                 </p>
//               </div>
//               <div className="col-md-4">
//                 <p><strong>Customer:</strong> {sale.customer?.name || '-'}</p>
//                 <p><strong>Biller:</strong> {sale.billing?.name || '-'}</p>
//                 <p><strong>Description:</strong> {sale.description || '-'}</p>
//               </div>
//               <div className="col-md-4">
//                 <p><strong>Total Amount:</strong> ₹{sale.totalAmount}</p>
//                 <p><strong>Paid Amount:</strong> ₹{sale.paidAmount}</p>
//                 <p><strong>Due Amount:</strong> ₹{sale.dueAmount}</p>
//                 <p>
//                   <strong>Payment Status:</strong>{' '}
//                   <span className={`badge bg-${getPaymentColor(sale.paymentStatus)}`}>
//                     {sale.paymentStatus}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Products Table */}
//         <div className="card shadow-sm mb-4">
//           <div className="card-header bg-light">
//             <h5 className="mb-0">Products in Sale</h5>
//           </div>
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table table-striped mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Product Name</th>
//                     <th>Quantity</th>
//                     <th>Selling Price</th>
//                     <th>Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sale.products?.map((item, idx) => (
//                     <tr key={idx}>
//                       <td>{item.productId?.productName || '-'}</td>
//                       <td>{item.saleQty}</td>
//                       <td>₹{item.sellingPrice}</td>
//                       <td>₹{item.total}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Back Button */}
//         <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>

//         {/* Delete Confirmation Modal */}
//         {showDeleteConfirm && (
//           <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Confirm Delete</h5>
//                   <button className="btn-close" onClick={() => setShowDeleteConfirm(false)} />
//                 </div>
//                 <div className="modal-body">
//                   Are you sure you want to delete this sale?
//                 </div>
//                 <div className="modal-footer">
//                   <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
//                   <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default ViewSales;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import BASE_URL from '../../../pages/config/config';

const ViewSales = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/sales/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSale(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch sale details');
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getPaymentColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'unpaid': return 'danger';
      default: return 'secondary';
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-content');
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${sale.referenceNumber || id}.pdf`);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/sales/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Sale deleted successfully");
      navigate("/sales");
    } catch (err) {
      alert("Failed to delete sale");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;
  if (!sale) return <div className="text-center mt-5">No sale found.</div>;

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h2 className="mb-0">Sale Details</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-info" onClick={handleDownloadPDF}>⬇️ Download PDF</button>
            {["admin", "manager"].includes(role) && (
              <button className="btn btn-outline-warning" onClick={() => navigate(`/sales/edit/${id}`)}>✏️ Edit</button>
            )}
            {role === "admin" && (
              <button className="btn btn-outline-danger" onClick={() => setShowDeleteConfirm(true)}>🗑️ Delete</button>
            )}
          </div>
        </div>

        {/* Sale Info */}
        <div className="card shadow-sm mb-4" id="invoice-content">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <p><strong>Reference:</strong> {sale.referenceNumber}</p>
                <p><strong>Date:</strong> {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : '-'}</p>
                <p><strong>Status:</strong> <span className={`badge bg-${getStatusColor(sale.status)}`}>{sale.status}</span></p>
                <p><strong>Payment Type:</strong> {sale.paymentType}</p>
                <p><strong>Payment Method:</strong> {sale.paymentMethod}</p>
                <p><strong>Payment Status:</strong> <span className={`badge bg-${getPaymentColor(sale.paymentStatus)}`}>{sale.paymentStatus}</span></p>
              </div>

              <div className="col-md-4">
                <p><strong>Customer:</strong> {sale.customer?.name || '-'}</p>
                <p><strong>Biller:</strong> {sale.billing?.name || '-'}</p>
                <p><strong>Description:</strong> {sale.description || '-'}</p>
                <p><strong>Transaction ID:</strong> {sale.transactionId || '-'}</p>
                <p><strong>Transaction Date:</strong> {sale.transactionDate ? new Date(sale.transactionDate).toLocaleDateString() : '-'}</p>
              </div>

              <div className="col-md-4">
                <p><strong>Total Amount:</strong> ₹{sale.totalAmount}</p>
                <p><strong>Paid Amount:</strong> ₹{sale.paidAmount}</p>
                <p><strong>Due Amount:</strong> ₹{sale.dueAmount}</p>
                <p><strong>Order Tax:</strong> ₹{sale.orderTax}</p>
                <p><strong>Order Discount:</strong> ₹{sale.orderDiscount}</p>
              </div>
            </div>

            {/* Billing & Shipping Info */}
            <hr />
            <div className="row">
              <div className="col-md-6">
                <h5>Billing Address</h5>
                <p>{sale.billing?.address1 || '-'}, {sale.billing?.city || ''}</p>
                <p>{sale.billing?.state || ''}, {sale.billing?.country || ''}</p>
                <p>{sale.billing?.postalCode || ''}</p>
              </div>
              <div className="col-md-6">
                <h5>Shipping Address</h5>
                <p>{sale.shipping?.address1 || '-'}, {sale.shipping?.city || ''}</p>
                <p>{sale.shipping?.state || ''}, {sale.shipping?.country || ''}</p>
                <p>{sale.shipping?.postalCode || ''}</p>
              </div>
            </div>

            {/* Extra Costs */}
            <hr />
            <div className="row">
              <div className="col-md-4"><p><strong>CGST:</strong> ₹{sale.cgstValue}</p></div>
              <div className="col-md-4"><p><strong>SGST:</strong> ₹{sale.sgstValue}</p></div>
              <div className="col-md-4"><p><strong>Shipping Cost:</strong> ₹{sale.shippingCost}</p></div>
              <div className="col-md-4"><p><strong>Labour Cost:</strong> ₹{sale.labourCost}</p></div>
              <div className="col-md-4"><p><strong>Round Off:</strong> {sale.roundOff ? `Yes (₹${sale.roundOffValue})` : 'No'}</p></div>
              <div className="col-md-4"><p><strong>Grand Total:</strong> ₹{sale.grandTotal}</p></div>
            </div>

            {/* Credit Returns */}
            {sale.creditReturns?.length > 0 && (
              <>
                <hr />
                <h5>Credit Returns</h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Amount</th>
                        <th>Reason</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sale.creditReturns.map((cr, idx) => (
                        <tr key={idx}>
                          <td>₹{cr.amount}</td>
                          <td>{cr.reason || '-'}</td>
                          <td>{cr.returnDate ? new Date(cr.returnDate).toLocaleDateString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Linked Credit Notes */}
            {sale.creditNotes?.length > 0 && (
              <>
                <hr />
                <h5>Linked Credit Notes</h5>
                <ul>
                  {sale.creditNotes.map((note, idx) => (
                    <li key={idx}>{note?._id || note}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Notes and Creator Info */}
            <hr />
            <p><strong>Notes:</strong> {sale.notes || '—'}</p>
            <p><strong>Created By:</strong> {sale.createdBy?.name || '-'} ({sale.createdBy?.email || '-'})</p>
            <p><strong>Updated By:</strong> {sale.updatedBy?.name || '-'} ({sale.updatedBy?.email || '-'})</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Products in Sale</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product Name</th>
                    <th>HSN</th>
                    <th>Unit</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Tax</th>
                    <th>Subtotal</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.products?.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.productId?.productName || '-'}</td>
                      <td>{p.hsnCode || '-'}</td>
                      <td>{p.unit || '-'}</td>
                      <td>{p.saleQty || '-'}</td>
                      <td>₹{p.sellingPrice || 0}</td>
                      <td>{p.discount || 0} {p.discountType}</td>
                      <td>₹{p.taxAmount || 0}</td>
                      <td>₹{p.subTotal || 0}</td>
                      <td>₹{p.lineTotal || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>

        {/* Delete Modal */}
        {showDeleteConfirm && (
          <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button className="btn-close" onClick={() => setShowDeleteConfirm(false)} />
                </div>
                <div className="modal-body">Are you sure you want to delete this sale?</div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ViewSales;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../../pages/config/config';
// import { useParams, useNavigate } from 'react-router-dom';

// const ViewSales = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [sale, setSale] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
// const token = localStorage.getItem("token");

//     useEffect(() => {
//         const fetchSale = async () => {
//             try {
//                 const res = await axios.get(`${BASE_URL}/api/sales/${id}`,{
//                      headers: {
//           Authorization: `Bearer ${token}`,
//         },
//                 });
//                 setSale(res.data);
//             } catch (err) {
//                 setError('Failed to fetch sale details');
//             }
//             setLoading(false);
//         };
//         fetchSale();
//     }, [id]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//     if (!sale) return <div>No sale found.</div>;

//     return (
// <div className="page-wrapper">
// <div className="content">
//             <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Back</button>
//             <h2>Sale Details</h2>
//             <div className="card p-3 mb-3">
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
//                 {/* Add more sale fields as needed */}
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
//                             <td>{item.total}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             {/* Add payment history, stock history, etc. if needed */}
//         </div>
// </div>        
        
//     );
// };

// export default ViewSales;
