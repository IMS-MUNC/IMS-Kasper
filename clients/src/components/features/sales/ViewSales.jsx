import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';
import { useParams, useNavigate } from 'react-router-dom';

const ViewSales = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchSale = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/sales/${id}`,{
                     headers: {
          Authorization: `Bearer ${token}`,
        },
                });
                setSale(res.data);
            } catch (err) {
                setError('Failed to fetch sale details');
            }
            setLoading(false);
        };
        fetchSale();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!sale) return <div>No sale found.</div>;

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Back</button>
            <h2>Sale Details</h2>
            <div className="card p-3 mb-3">
                <p><strong>Reference:</strong> {sale.referenceNumber}</p>
                <p><strong>Customer:</strong> {sale.customer?.name}</p>
                <p><strong>Date:</strong> {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : '-'}</p>
                <p><strong>Status:</strong> {sale.status}</p>
                <p><strong>Total Amount:</strong> {sale.totalAmount}</p>
                <p><strong>Paid Amount:</strong> {sale.paidAmount}</p>
                <p><strong>Due Amount:</strong> {sale.dueAmount}</p>
                <p><strong>Payment Status:</strong> {sale.paymentStatus}</p>
                <p><strong>Biller:</strong> {sale.billing?.name}</p>
                <p><strong>Description:</strong> {sale.description}</p>
                {/* Add more sale fields as needed */}
            </div>
            <h4>Products</h4>
            <table className="table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sale.products?.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.productId?.productName || '-'}</td>
                            <td>{item.saleQty}</td>
                            <td>{item.sellingPrice}</td>
                            <td>{item.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Add payment history, stock history, etc. if needed */}
        </div>
    );
};

export default ViewSales;
