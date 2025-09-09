import React, { useEffect, useState } from 'react'
import BASE_URL from '../../../../pages/config/config';
import axios from 'axios';

const StockAdujestment = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
            const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/api/products`,{
           headers: {
        Authorization: `Bearer ${token}`,
      },
        });
        setProducts(res.data.products || res.data || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Calculate total price for all products (availableQty * availablePrice)
  const totalValue = products.reduce((sum, product) => {
    let qty = 0;
    if (typeof product.availableQty === 'number') {
      qty = product.availableQty;
    } else {
      const quantity = Number(product.quantity ?? 0);
      let newQuantitySum = 0;
      if (Array.isArray(product.newQuantity)) {
        newQuantitySum = product.newQuantity.reduce((acc, n) => {
          const num = Number(n);
          return acc + (isNaN(num) ? 0 : num);
        }, 0);
      } else if (typeof product.newQuantity === 'number') {
        newQuantitySum = Number(product.newQuantity);
      }
      qty = quantity + newQuantitySum;
    }
    const price = Number(product.availablePrice ?? product.purchasePrice ?? 0);
    return sum + (qty * price);
  }, 0);

  return (
    <div className="page-wrapper">
      <div className="content">
      <h4>Product Wise Available Quantity & Price</h4>
      <div className="mb-3">
        <strong>Total Stock Value: </strong>₹{totalValue.toFixed(2)}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table datatable">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Code</th>
                <th>Available Quantity</th>
                <th>Purchase Price</th>
                <th>Selling Price</th>
                <th>Available Value</th>
                <th>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map(product => {
                  let qty = 0;
                  if (typeof product.availableQty === 'number') {
                    qty = product.availableQty;
                  } else {
                    const quantity = Number(product.quantity ?? 0);
                    let newQuantitySum = 0;
                    if (Array.isArray(product.newQuantity)) {
                      newQuantitySum = product.newQuantity.reduce((acc, n) => {
                        const num = Number(n);
                        return acc + (isNaN(num) ? 0 : num);
                      }, 0);
                    } else if (typeof product.newQuantity === 'number') {
                      newQuantitySum = Number(product.newQuantity);
                    }
                    qty = quantity + newQuantitySum;
                  }
                  const purchasePrice = Number(product.purchasePrice ?? 0);
                  const sellingPrice = Number(product.sellingPrice ?? 0);
                  const totalPurchase = qty * purchasePrice;
                  const totalSelling = qty * sellingPrice;
                  const profitLoss = totalSelling - totalPurchase;
                  return (
                    <tr key={product._id}>
                      <td>{product.productName || product.name || 'N/A'}</td>
                      <td>{product.productCode || product.itemBarcode || 'N/A'}</td>
                      <td>{qty}</td>
                      <td>₹{purchasePrice.toFixed(2)}</td>
                      <td>₹{sellingPrice.toFixed(2)}</td>
                      <td>₹{totalPurchase.toFixed(2)}</td>
                      <td className={profitLoss >= 0 ? 'text-success' : 'text-danger'}>
                        ₹{profitLoss.toFixed(2)} {profitLoss > 0 ? '(Profit)' : profitLoss < 0 ? '(Loss)' : ''}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  )
}

export default StockAdujestment