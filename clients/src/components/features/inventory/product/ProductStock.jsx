import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../../pages/config/config';

const ProductStock = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token"); 
                const res = await axios.get(`${BASE_URL}/api/products/search?name=${searchTerm}`,{
                       headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
                });
                setProducts(res.data);
            } catch (err) {
                setProducts([]);
            }
        };
        fetchProducts();
    }, [searchTerm]);

    return (
        <div className="container mt-4">
            <h2>Product Stock</h2>
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
                        <th>Available Stock</th>
                        <th>Unit</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map(product => (
                            <tr key={product._id}>
                                <td>{product.productName}</td>
                                <td>{product.hsnCode}</td>
                                <td>{product.availableStock}</td>
                                <td>{product.unit}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No products found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductStock;
