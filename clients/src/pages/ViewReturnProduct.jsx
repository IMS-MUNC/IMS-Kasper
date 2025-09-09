import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from './config/config';

const ViewReturnProduct = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalReturnStockValue, setTotalReturnStockValue] = useState(0);
const token = localStorage.getItem("token");
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/products/purchase-return-stock`,{
                      headers: {
          Authorization: `Bearer ${token}`,
        },
                });
                setProducts(res.data);
                // Calculate total return stock value
                const totalValue = res.data.reduce((acc, product) => {
                    const qty = Number(product.availableReturnStock) || 0;
                    const price = Number(product.purchasePrice) || 0;
                    return acc + qty * price;
                }, 0);
                setTotalReturnStockValue(totalValue);
            } catch (err) {
                setProducts([]);
                setTotalReturnStockValue(0);
            }
        };
        fetchProducts();
    }, []);

    // Optional: filter by search term
    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h2>Purchase Return Product Stock View</h2>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search Product"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>HSN Code</th>
                        <th>Available Return Quantity</th>
                        <th>Unit</th>
                        <th>Purchase Price</th>
                        <th>Return Stock Value</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <tr key={product._id}>
                                <td>{product.productName}</td>
                                <td>{product.hsnCode}</td>
                                <td>{product.availableReturnStock}</td>
                                <td>{product.unit}</td>
                                <td>{product.purchasePrice || 0}</td>
                                <td>{(Number(product.availableReturnStock) * Number(product.purchasePrice || 0)).toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No products found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="mt-3">
                <h5>Total Return Stock Value: ₹ {totalReturnStockValue.toFixed(2)}</h5>
            </div>
        </div>
    );
};

export default ViewReturnProduct;
