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
  const role = localStorage.getItem("role"); // e.g., 'admin', 'manager'

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/sales/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSale(res.data);
      } catch (err) {
        setError('Failed to fetch sale details');
      }
      setLoading(false);
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-content');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

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

        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h2 className="mb-0">Sale Details</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary" onClick={handlePrint}>🧾 Print</button>
            <button className="btn btn-outline-info" onClick={handleDownloadPDF}>⬇️ Download PDF</button>

            {["admin", "manager"].includes(role) && (
              <button className="btn btn-outline-warning" onClick={() => navigate(`/sales/edit/${id}`)}>✏️ Edit</button>
            )}

            {role === "admin" && (
              <button className="btn btn-outline-danger" onClick={() => setShowDeleteConfirm(true)}>🗑️ Delete</button>
            )}
          </div>
        </div>

        {/* Sale Info Section */}
        <div className="card shadow-sm mb-4" id="invoice-content">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <p><strong>Reference:</strong> {sale.referenceNumber}</p>
                <p><strong>Date:</strong> {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : '-'}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`badge bg-${getStatusColor(sale.status)}`}>
                    {sale.status}
                  </span>
                </p>
              </div>
              <div className="col-md-4">
                <p><strong>Customer:</strong> {sale.customer?.name || '-'}</p>
                <p><strong>Biller:</strong> {sale.billing?.name || '-'}</p>
                <p><strong>Description:</strong> {sale.description || '-'}</p>
              </div>
              <div className="col-md-4">
                <p><strong>Total Amount:</strong> ₹{sale.totalAmount}</p>
                <p><strong>Paid Amount:</strong> ₹{sale.paidAmount}</p>
                <p><strong>Due Amount:</strong> ₹{sale.dueAmount}</p>
                <p>
                  <strong>Payment Status:</strong>{' '}
                  <span className={`badge bg-${getPaymentColor(sale.paymentStatus)}`}>
                    {sale.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
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
                    <th>Quantity</th>
                    <th>Selling Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.products?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productId?.productName || '-'}</td>
                      <td>{item.saleQty}</td>
                      <td>₹{item.sellingPrice}</td>
                      <td>₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button className="btn-close" onClick={() => setShowDeleteConfirm(false)} />
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this sale?
                </div>
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
