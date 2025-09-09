import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';

const SaleHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    // console.log("Sale history data:", history);   
const token = localStorage.getItem("token");

    useEffect(() => {
        setLoading(true);
        axios.get(`${BASE_URL}/api/sales/stockhistory`,{
            headers: {
          Authorization: `Bearer ${token}`,
        },
        })
            .then(res => setHistory(res.data))
            .catch(() => setHistory([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page-wrapper">
            <div className="content">
                <h4>Sale Stock History</h4>
                <div className="card">
                    <div className="card-body">
                        {loading ? <div>Loading...</div> : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Product</th>
                                        <th>Type</th>
                                        <th>Quantity</th>
                                        <th>Reference</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.length > 0 ? history.map((h, idx) => (
                                        <tr key={idx}>
                                            <td>{h.date ? new Date(h.date).toLocaleDateString() : '-'}</td>
                                            <td>{h.product?.productName || h.product?.name || h.product || '-'}</td>
                                            <td>{h.type}</td>
                                            <td>{h.quantity || h.soldQuantity || '-'}</td>
                                            <td>{h.referenceNumber || '-'}</td>
                                            <td>{h.notes || h.note || '-'}</td>
                                        </tr>
                                    )) : <tr><td colSpan="6">No history found.</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaleHistory;
