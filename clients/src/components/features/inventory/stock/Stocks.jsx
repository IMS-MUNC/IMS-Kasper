import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../../pages/config/config';

const Stocks = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/api/stock/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStockData(res.data.summary || []);
      } catch (err) {
        setError('Failed to fetch stock summary');
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4 className="fw-bold">Stock Summary</h4>
            <h6>Inventory overview and profit/loss</h6>
          </div>
        </div>
        <div className="card">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : error ? (
              <div className="text-danger p-4">{error}</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Stock In</th>
                      <th>Stock Out</th>
                      <th>Purchase Return</th>
                      <th>Sale Return</th>
                      <th>Current Stock</th>
                      <th>Purchase Amount</th>
                      <th>Sales Amount</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.length === 0 ? (
                      <tr><td colSpan="9" className="text-center">No data</td></tr>
                    ) : (
                      stockData.map((item) => (
                        <tr key={item.productId}>
                          <td>{item.product}</td>
                          <td>{item.stockIn}</td>
                          <td>{item.stockOut}</td>
                          <td>{item.purchaseReturn}</td>
                          <td>{item.saleReturn}</td>
                          <td>{item.currentStock}</td>
                          <td>{item.purchaseAmount}</td>
                          <td>{item.salesAmount}</td>
                          <td style={{ color: item.profit >= 0 ? 'green' : 'red' }}>{item.profit}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stocks;
