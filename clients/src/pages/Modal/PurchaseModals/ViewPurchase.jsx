import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config/config";

const ViewPurchase = ({ purchaseId }) => {
    const [purchase, setPurchase] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allPurchases, setAllPurchases] = useState([]);
const token = localStorage.getItem("token");
    // console.log("ViewPurchase component rendered with purchaseId:", purchaseId);

    useEffect(() => {
        const fetchAllPurchases = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/purchases`,{
                     headers: {
          Authorization: `Bearer ${token}`,
        },
                });
                const all = res.data.purchases || [];
                setAllPurchases(all);
                const found = all.find(p => p._id === purchaseId);
                setPurchase(found || null);
                // Fetch purchase history for the same supplier
                if (found && found.supplier?._id) {
                    const histRes = await axios.get(`${BASE_URL}/api/purchases?supplier=${found.supplier._id}`,{
                         headers: {
          Authorization: `Bearer ${token}`,
        },
                    });
                    setHistory(histRes.data.purchases || []);
                }
            } catch (err) {
                setPurchase(null);
            } finally {
                setLoading(false);
            }
        };
        if (purchaseId) fetchAllPurchases();
    }, [purchaseId]);

    if (loading) return <div>Loading...</div>;
    if (!purchase) return <div>Purchase not found.</div>;

    // All purchases summary
    const totalAllAmount = allPurchases.reduce((sum, p) => sum + (p.grandTotal || 0), 0);
    const totalAllDueAmount = allPurchases.reduce((sum, p) => sum + (p.payment?.dueAmount || 0), 0);
    const totalAllProducts = allPurchases.reduce((sum, p) => sum + (Array.isArray(p.products) ? p.products.length : 0), 0);

    // Calculations for selected purchase
    const totalQty = purchase.products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalRefundQty = (purchase.returns || []).reduce((sum, r) => sum + r.returnedProducts.reduce((s, rp) => s + (rp.returnQty || 0), 0), 0);
    const totalTax = purchase.products.reduce((sum, p) => sum + (p.tax || 0), 0);
    const totalTaxAmount = purchase.products.reduce((sum, p) => sum + (p.taxAmount || 0), 0);
    const totalAmount = purchase.grandTotal || 0;
    const totalDueAmount = purchase.payment?.dueAmount || 0;
    const dueDate = purchase.payment?.dueDate ? new Date(purchase.payment.dueDate) : null;
    const isDueSoon = dueDate && ((dueDate - new Date()) / (1000 * 60 * 60 * 24) <= 7);

    return (
        <div className="container py-3">
            {/* All Purchases Summary */}
            <div className="alert alert-info mb-4">
                <strong>All Purchases Summary:</strong>
                <div>Total Amount: <b>₹{totalAllAmount}</b></div>
                <div>Total Due Amount: <b>₹{totalAllDueAmount}</b></div>
                <div>Total Products: <b>{totalAllProducts}</b></div>
            </div>
            <h4>Purchase Details</h4>
            <div className="row mb-2">
                <div className="col-md-6">
                    <strong>Supplier:</strong> {purchase.supplier?.firstName} {purchase.supplier?.lastName}
                </div>
                <div className="col-md-6">
                    <strong>Reference:</strong> {purchase.referenceNumber}
                </div>
                <div className="col-md-6">
                    <strong>Date:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}
                </div>
                <div className="col-md-6">
                    <strong>Status:</strong> {purchase.status}
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-md-4"><strong>Total Quantity:</strong> {totalQty}</div>
                <div className="col-md-4"><strong>Total Refund Quantity:</strong> {totalRefundQty}</div>
                <div className="col-md-4"><strong>Total Amount:</strong> ₹{totalAmount}</div>
            </div>
            <div className="row mb-2">
                <div className="col-md-4"><strong>Total Tax:</strong> {totalTax}</div>
                <div className="col-md-4"><strong>Total Tax Amount:</strong> ₹{totalTaxAmount}</div>
                <div className="col-md-4"><strong>Total Due Amount:</strong> ₹{totalDueAmount}</div>
            </div>
            <div className="row mb-2">
                <div className="col-md-6">
                    <strong>Due Date:</strong> <span style={{ color: isDueSoon ? 'red' : 'inherit' }}>{dueDate ? dueDate.toLocaleDateString() : 'N/A'}{isDueSoon ? ' (Due soon!)' : ''}</span>
                </div>
            </div>
            <hr />
            <h5>Purchase History (Supplier)</h5>
            <ul>
                {history.map(h => (
                    <li key={h._id}>
                        {h.referenceNumber} - {new Date(h.purchaseDate).toLocaleDateString()} - ₹{h.grandTotal}
                    </li>
                ))}
            </ul>
            <hr />
            <h5>Products</h5>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Purchase Price</th>
                        <th>Discount</th>
                        <th>Tax (%)</th>
                        <th>Tax Amount</th>
                        <th>Unit Cost</th>
                        <th>Total Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {purchase.products.map((p, idx) => (
                        <tr key={idx}>
                            <td>{p.product?.productName || ''}</td>
                            <td>{p.quantity}</td>
                            <td>{p.unit}</td>
                            <td>₹{p.purchasePrice}</td>
                            <td>₹{p.discount}</td>
                            <td>{p.tax}</td>
                            <td>₹{p.taxAmount}</td>
                            <td>₹{p.unitCost}</td>
                            <td>₹{p.totalCost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewPurchase;
