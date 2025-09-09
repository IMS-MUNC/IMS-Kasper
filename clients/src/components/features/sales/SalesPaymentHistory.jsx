import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';

const SalesPaymentHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
const token = localStorage.getItem("token");

    useEffect(() => {
        setLoading(true);
        axios.get(`${BASE_URL}/api/sales/paymenthistory`,{
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
                <h4>Sale Payment History</h4>
                <div className="card">
                    <div className="card-body">
                        {loading ? <div>Loading...</div> : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Type</th>
                                        <th>Paid Amount</th>
                                        <th>Due Amount</th>
                                        <th>Payment Method</th>
                                        <th>Status</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.length > 0 ? history.map((h, idx) => (
                                        <tr key={idx}>
                                            <td>{h.transactionDate ? new Date(h.transactionDate).toLocaleDateString() : '-'}</td>
                                            <td>{h.customer?.name || h.customer || '-'}</td>
                                            <td>{h.paymentType}</td>
                                            <td>{h.paidAmount || '-'}</td>
                                            <td>{h.dueAmount || '-'}</td>
                                            <td>{h.paymentMethod || '-'}</td>
                                            <td>{h.status || h.paymentStatus || '-'}</td>
                                            <td>{h.notes || '-'}</td>
                                        </tr>
                                    )) : <tr><td colSpan="8">No history found.</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesPaymentHistory;
