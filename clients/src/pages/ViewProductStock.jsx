import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from './config/config'; import { FaFileExcel, FaFilePdf } from 'react-icons/fa'
import { TbEdit, TbRefresh, TbTrash } from 'react-icons/tb'

const ViewProductStock = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalStockValue, setTotalStockValue] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
const token = localStorage.getItem("token");
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/products/stock?page=${page}&limit=${limit}`,{
                      headers: {
          Authorization: `Bearer ${token}`,
        },
                });
                setProducts(res.data.products);
                setTotal(res.data.total);
                // Calculate total stock value
                const totalValue = res.data.products.reduce((acc, product) => {
                    const qty = Number(product.availableStock) || 0;
                    const price = Number(product.purchasePrice) || 0;
                    return acc + qty * price;
                }, 0);
                setTotalStockValue(totalValue);
            } catch (err) {
                setProducts([]);
                setTotalStockValue(0);
            }
        };
        fetchProducts();
    }, [page, limit]);

    // Optional: filter by search term
    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Products Stock</h4>
                            <h6>Manage your stock</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><FaFilePdf className="fs-20" style={{ color: "red" }} /></a>
                        </li>
                        <li>
                            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><FaFileExcel className="fs-20" style={{ color: "green" }} /></a>
                        </li>
                        <li>
                            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><TbRefresh /></a>
                        </li>
                        <li>
                            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
                        </li>
                    </ul>
                    {/* <div className="page-btn">
                        <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-stock"><i className="ti ti-circle-plus me-1" />Add Stock</a>
                    </div> */}
                </div>
                {/* /product list */}
                <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                        <div className="search-set">
                            <div className="search-input">
                                <input
                                    type="text"
                                    className="form-control "
                                    placeholder="Search Product"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                            <div className="dropdown me-2">
                                <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                    Warehouse
                                </a>
                                <ul className="dropdown-menu  dropdown-menu-end p-3">
                                    <li>
                                        <a  className="dropdown-item rounded-1">Lavish Warehouse</a>
                                    </li>
                                    <li>
                                        <a  className="dropdown-item rounded-1">Quaint Warehouse </a>
                                    </li>
                                    <li>
                                        <a  className="dropdown-item rounded-1">Traditional Warehouse</a>
                                    </li>
                                    <li>
                                        <a  className="dropdown-item rounded-1">Cool Warehouse</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="dropdown me-2">
                                <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                    Store
                                </a>
                                <ul className="dropdown-menu  dropdown-menu-end p-3">
                                    <li>
                                        <a  className="dropdown-item rounded-1">Electro Mart</a>
                                    </li>
                                    <li>
                                        <a  className="dropdown-item rounded-1">Quantum Gadgets</a>
                                    </li>
                                    <li>
                                        <a  className="dropdown-item rounded-1">Prime Bazaar</a>
                                    </li>
                                    <li>
                                        <a  className="dropdown-item rounded-1">Gadget World</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="dropdown">
                                <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                    Product
                                </a>
                                <ul className="dropdown-menu  dropdown-menu-end p-3">
                                    <li>
                                        <a  className="dropdown-item rounded-1">Lenovo IdeaPad 3</a>
                                    </li>
                                    <li>
                                        <a  className="dropdown-item rounded-1">Beats Pro </a>
                                    </li>
                                    <li>
                                        <a  className="dropdown-item rounded-1">Nike Jordan</a>
                                    </li>
                                    <li>
                                        <a  className="dropdown-item rounded-1">Apple Series 5 Watch</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table datatable">
                                <thead className="thead-light">
                                    <tr>
                                        <th className="no-sort">
                                            <label className="checkboxs">
                                                <input type="checkbox" id="select-all" />
                                                <span className="checkmarks" />
                                            </label>
                                        </th>
                                        <th>Product</th>
                                        <th>HSN Code</th>
                                        <th>Supplier</th>
                                        <th>Warehouse</th>
                                        <th>Purchase Price</th>
                                        <th>Available Qty</th>
                                        <th>Sold Qty</th>
                                        <th>Stock Value</th>
                                        <th className="no-sort" />
                                    </tr>
                                </thead>
                                <tbody>

                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map(product => (
                                            <tr key={product._id}>

                                                <td>
                                                    <label className="checkboxs">
                                                        <input type="checkbox" />
                                                        <span className="checkmarks" />
                                                    </label>
                                                </td>

                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <a className="avatar avatar-md me-2">
                                                            {product.image && (
                                                                <img src={product.image} alt={product.productName} className="media-image" />
                                                            )}
                                                        </a>
                                                        <a>{product.productName || product.name || 'N/A'}</a>
                                                    </div>
                                                </td>

                                                <td>{product.hsnCode}</td>
                                                <td>{product.supplierName || '-'}</td>
                                                <td>{product.warehouseName || '-'}</td>
                                                <td>{product.purchasePrice || 0}</td>
                                                <td>{product.availableStock} {product.unit}</td>
                                                <td>{product.soldQty || 0}</td>
                                                <td className='text-success'>{(Number(product.availableStock) * Number(product.purchasePrice || 0)).toFixed(2)}</td>
                                                <td className="d-flex">
                                                    <div className="d-flex align-items-center edit-delete-action">
                                                        <a className="me-2 border rounded d-flex align-items-center p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-stock">
                                                            <TbEdit data-feather="edit" className="feather-edit" />
                                                        </a>
                                                        <a className="p-2 border rounded d-flex align-items-center"  data-bs-toggle="modal" data-bs-target="#delete">
                                                            <TbTrash data-feather="trash-2" className="feather-trash-2" />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">No products found.</td>
                                        </tr>
                                    )}


                                </tbody>
                            </table>
                        </div>
                        
                    </div>
                      {/* Pagination Controls */}
    <div className="d-flex justify-content-between align-items-center mb-0 p-2">
      <div>
        <span>Page {page} of {Math.ceil(total / limit)}</span>
      </div>
      <div>
        <span>Total Products: {total}</span>
      </div>
      <div>
        <span>Total Stock Value: ₹ {totalStockValue.toFixed(2)}</span>
      </div>
      <div>
        <button className="btn btn-sm btn-outline-primary me-2" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        
        <button className="btn btn-sm btn-outline-primary" disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(page + 1)}>Next</button>
      </div>
      
    </div>
                </div>
                {/* /product list */}
            </div>

        </div>

    )
}

export default ViewProductStock




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import BASE_URL from './config/config';

// const ViewProductStock = () => {
//     const [products, setProducts] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [totalStockValue, setTotalStockValue] = useState(0);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const res = await axios.get(`${BASE_URL}/api/products/stock`);
//                 setProducts(res.data);
//                 // Calculate total stock value
//                 const totalValue = res.data.reduce((acc, product) => {
//                     const qty = Number(product.availableStock) || 0;
//                     const price = Number(product.purchasePrice) || 0;
//                     return acc + qty * price;
//                 }, 0);
//                 setTotalStockValue(totalValue);
//             } catch (err) {
//                 setProducts([]);
//                 setTotalStockValue(0);
//             }
//         };
//         fetchProducts();
//     }, []);

//     // Optional: filter by search term
//     const filteredProducts = products.filter(product =>
//         product.productName.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="page-wrapper">
//             <h2>Product Stock View</h2>
//             <input
//                 type="text"
//                 className="form-control mb-3"
//                 placeholder="Search Product"
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//             />
//             <table className="table table-bordered">
//                 <thead>
//                     <tr>
//                         <th>Product Name</th>
//                         <th>HSN Code</th>
//                         <th>Warehouse</th>
//                         <th>Supplier</th>
//                         <th>Available Quantity</th>
//                         <th>Unit</th>
//                         <th>Purchase Price</th>
//                         <th>Stock Value</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredProducts.length > 0 ? (
//                         filteredProducts.map(product => (
//                             <tr key={product._id}>
//                                 <td>{product.productName}</td>
//                                 <td>{product.hsnCode}</td>
//                                 <td>{product.warehouseName || '-'}</td>
//                                 <td>{product.supplierName || '-'}</td>
//                                 <td>{product.availableStock}</td>
//                                 <td>{product.unit}</td>
//                                 <td>{product.purchasePrice || 0}</td>
//                                 <td>{(Number(product.availableStock) * Number(product.purchasePrice || 0)).toFixed(2)}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="8" className="text-center">No products found.</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//             <div className="mt-3">
//                 <h5>Total Stock Value: ₹ {totalStockValue.toFixed(2)}</h5>
//             </div>
//         </div>
//     );
// };

// export default ViewProductStock;
