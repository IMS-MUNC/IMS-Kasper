import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../../pages/config/config';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [totals, setTotals] = useState({});
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
        setTotals(res.data.totals || {});
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
        {/* Totals Card */}
        <div className="row mb-3">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Purchase Qty</h6>
                <div className="fw-bold fs-5">{totals.totalPurchaseQty ?? '-'}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Purchase Return Qty</h6>
                <div className="fw-bold fs-5">{totals.totalPurchaseReturnQty ?? '-'}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Sale Qty</h6>
                <div className="fw-bold fs-5">{totals.totalSaleQty ?? '-'}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Sale Return</h6>
                <div className="fw-bold fs-5">{totals.totalSaleReturn ?? '-'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Purchase Amount</h6>
                <div className="fw-bold fs-5">₹{totals.totalPurchaseAmount?.toLocaleString() ?? '-'}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Sales Amount</h6>
                <div className="fw-bold fs-5">₹{totals.totalSalesAmount?.toLocaleString() ?? '-'}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Stock Value</h6>
                <div className="fw-bold fs-5">₹{totals.totalAvailableStockValue?.toLocaleString() ?? '-'}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="mb-1">Total Profit/Loss</h6>
                <div className="fw-bold fs-5" style={{ color: (totals.totalProfit ?? 0) >= 0 ? 'green' : 'red' }}>{totals.totalProfit ?? '-'}</div>
              </div>
            </div>
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
                      <th>HSN Code</th>
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
                          <td>
                            {item.image && (
                              <img src={item.image} alt={item.product} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4, marginRight: 8 }} />
                            )}
                            {item.product}
                          </td>
                          <td>{item.hsnCode || '-'}</td>
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

export default Stock;
