import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../../../pages/config/config';
import axios from 'axios';
import { TbEdit, TbRefresh, TbTrash } from 'react-icons/tb';
import PDF from '../../../../assets/img/icons/pdf.svg'
import EXCEL from '../../../../assets/img/icons/excel.svg'

const LowStock = () => {
  const [activeTab, setActiveTab] = useState('low');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const shownToastsRef = React.useRef(new Set());
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);


    useEffect(() => {
       
        const fetchProducts = async () => {
            try {
                  const token = localStorage.getItem("token");

                const res = await axios.get(`${BASE_URL}/api/products`,{
                  headers: {
        Authorization: `Bearer ${token}`,
      },
                });
                // Calculate availableQty as in StockAdujestment, then filter for availableQty <= quantityAlert
                const allProducts = res.data.products || res.data || [];
        const lowStockProducts = allProducts
          .map(p => {
            let availableQty = 0;
            if (typeof p.availableQty === 'number') {
              availableQty = p.availableQty;
            } else {
              const quantity = Number(p.quantity ?? 0);
              let newQuantitySum = 0;
              if (Array.isArray(p.newQuantity)) {
                newQuantitySum = p.newQuantity.reduce((acc, n) => {
                  const num = Number(n);
                  return acc + (isNaN(num) ? 0 : num);
                }, 0);
              } else if (typeof p.newQuantity === 'number') {
                newQuantitySum = Number(p.newQuantity);
              }
              availableQty = quantity + newQuantitySum;
            }
            return { ...p, availableQty };
          })
          .filter(p => typeof p.quantityAlert === 'number' && p.availableQty <= p.quantityAlert && p.availableQty > 0);
        setProducts(lowStockProducts);
// Out of stock products
        const outStock = allProducts
          .map(p => {
            let availableQty = 0;
            if (typeof p.availableQty === 'number') {
              availableQty = p.availableQty;
            } else {
              const quantity = Number(p.quantity ?? 0);
              let newQuantitySum = 0;
              if (Array.isArray(p.newQuantity)) {
                newQuantitySum = p.newQuantity.reduce((acc, n) => {
                  const num = Number(n);
                  return acc + (isNaN(num) ? 0 : num);
                }, 0);
              } else if (typeof p.newQuantity === 'number') {
                newQuantitySum = Number(p.newQuantity);
              }
              availableQty = quantity + newQuantitySum;
            }
            return { ...p, availableQty };
          })
          .filter(p => p.availableQty === 0);
        setOutOfStockProducts(outStock);

                // Out of stock toast will be shown only when tab is opened

        // Show a single toast with all low stock product names
        const newProducts = lowStockProducts.filter(product => !shownToastsRef.current.has(product._id));
        if (newProducts.length > 0) {
          const names = newProducts.map(product => `${product.productName || product.name || 'N/A'} (Available: ${product.availableQty})`).join(', ');
          toast.warn(`Low Stock: ${names}`, {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          newProducts.forEach(product => shownToastsRef.current.add(product._id));
        }
            } catch (err) {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
<div className="page-wrapper">
  <div className="content">
    <div className="page-header">
      <div className="page-title me-auto">
        <h4 className="fw-bold">Low Stocks</h4>
        <h6>Manage your low stocks</h6>
      </div>
      <ul className="table-top-head low-stock-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" ><img src={PDF} alt="pdf" /></a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src={EXCEL} alt="excel" /></a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><TbRefresh className="ti ti-refresh" /></a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
        </li>
        <li>
          {/* <a href="#" className="btn btn-secondary w-auto shadow-none" data-bs-toggle="modal" data-bs-target="#send-email"><i data-feather="mail" className="feather-mail" />Send Email</a> */}
        </li>
      </ul>
    </div>
    <div className="mb-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <ul className="nav nav-pills low-stock-tab d-flex me-2 mb-0" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className={`nav-link${activeTab === 'low' ? ' active' : ''}`} id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected={activeTab === 'low'} onClick={() => setActiveTab('low')}>Low Stocks</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className={`nav-link${activeTab === 'out' ? ' active' : ''}`} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected={activeTab === 'out'} onClick={() => {
              setActiveTab('out');
              // Show out of stock toast when tab is opened
              const newOutStockProducts = outOfStockProducts.filter(product => !shownToastsRef.current.has('out_' + product._id));
              if (newOutStockProducts.length > 0) {
                const names = newOutStockProducts.map(product => `${product.productName || product.name || 'N/A'}`).join(', ');
                toast.warn(`Out of Stock: ${names}`, {
                  position: 'top-right',
                  autoClose: 4000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                newOutStockProducts.forEach(product => shownToastsRef.current.add('out_' + product._id));
              }
            }}>Out of Stocks</button>
          </li>
        </ul>
        <div className="notify d-flex bg-white p-1 px-2 border rounded">
          <div className="status-toggle text-secondary d-flex justify-content-between align-items-center">
            <input type="checkbox" id="user2" className="check" defaultChecked />
            <label htmlFor="user2" className="checktoggle me-2">checkbox</label>
            Notify
          </div>
        </div>
      </div>
      <div className="tab-content" id="pills-tabContent">
        {/* low stock */}
        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
          {/* /product list */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="search-set">
                <div className="search-input">
                  <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
                </div>
              </div>
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="dropdown me-2">
                  <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                    Warehouse
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
                <div className="dropdown me-2">
                  <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                    Store
                  </a>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <a  className="dropdown-item rounded-1">James Kirwin</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Francis Chang</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Antonio Engle</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Leo Kelly</a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown">
                  <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                    Category
                  </a>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <a  className="dropdown-item rounded-1">Computers</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Electronics</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Shoe</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Electronics</a>
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
                      <th>Warehouse</th>
                      <th>Supplier</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>SKU</th>
                      <th>Qty</th>
                      <th>Qty Alert</th>
                      <th className="no-sort" />
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                        products.map(product => (
                        <tr key={product._id}>
                            <td>
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                </label>
                            </td>
                            <td>{product.warehouseName || product.warehouse || 'N/A'}</td>
                            {/* <td>{product.store || 'N/A'}</td> */}
                            <td>{product.supplierName || 'N/A'}</td>
                             <td>
                                <div className="d-flex align-items-center">
                                    <a className="avatar avatar-md me-2">
                                        {product.images?.[0] && (
                                        <img src={product.images[0].url} alt={product.productName} className="media-image" />
                                        )}
                                    </a>
                                     <a>{product.productName || product.name || 'N/A'}</a>
                                 </div>
                            </td>
                            <td>{product.category?.categoryName || product.category || 'N/A'}</td>

                            <td>{product.sku}</td>
                            <td>{product.availableQty} {product.unit}</td>
                            <td>{product.quantityAlert} {product.unit}</td>
                            <td className="action-table-data">
                                <div className="edit-delete-action">
                                    <a className="me-2 p-2"  data-bs-toggle="modal" data-bs-target="#edit-stock">
                                        <TbEdit data-feather="edit" className="feather-edit" />
                                    </a>
                                    <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" >
                                        <TbTrash data-feather="trash-2" className="feather-trash-2" />
                                    </a>
                                </div>
                            </td>
                        </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="9" className="text-center text-muted">No low stock products.</td>
                        </tr>
                        )}
                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>

        {/* outofstock */}
        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
          {/* /product list */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="search-set">
                <div className="search-input">
                  <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
                </div>
              </div>
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="dropdown me-2">
                  <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                    Warehouse
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
                <div className="dropdown me-2">
                  <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                    Store
                  </a>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <a  className="dropdown-item rounded-1">James Kirwin</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Francis Chang</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Antonio Engle</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Leo Kelly</a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown me-2">
                  <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                    Category
                  </a>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <a  className="dropdown-item rounded-1">Computers</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Electronics</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Shoe</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Electronics</a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown">
                  <a  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                    Sort By : Last 7 Days
                  </a>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <a  className="dropdown-item rounded-1">Recently Added</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Ascending</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Desending</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Last Month</a>
                    </li>
                    <li>
                      <a  className="dropdown-item rounded-1">Last 7 Days</a>
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
                          <input type="checkbox" id="select-all-2" />
                          <span className="checkmarks" />
                        </label>
                      </th>
                      <th>Warehouse</th>
                      <th>Supplier</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>SKU</th>
                      <th>Qty</th>
                      <th>Qty Alert</th>
                      <th className="no-sort">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                     {outOfStockProducts.length > 0 ? (
                                outOfStockProducts.map(product => (
                        <tr key={product._id}>
                            <td>
                                <label className="checkboxs">
                                    <input type="checkbox" />
                                    <span className="checkmarks" />
                                </label>
                            </td>
                            <td>{product.warehouseName || product.warehouse || 'N/A'}</td>
                            <td>{product.supplierName || 'N/A'}</td>
                             <td>
                                <div className="d-flex align-items-center">
                                    <a className="avatar avatar-md me-2">
                                        {product.images?.[0] && (
                                        <img src={product.images[0].url} alt={product.productName} className="media-image" />
                                        )}
                                    </a>
                                     <a>{product.productName || product.name || 'N/A'}</a>
                                 </div>
                            </td>
                            <td>{product.category?.categoryName || product.category || 'N/A'}</td>

                            <td>{product.sku}</td>
                            <td>{product.availableQty} {product.unit}</td>
                            <td>{product.quantityAlert} {product.unit}</td>
                            <td className="action-table-data">
                                <div className="edit-delete-action">
                                    <a className="me-2 p-2"  data-bs-toggle="modal" data-bs-target="#edit-stock">
                                        <TbEdit data-feather="edit" className="feather-edit" />
                                    </a>
                                    <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" >
                                        <TbTrash data-feather="trash-2" className="feather-trash-2" />
                                    </a>
                                </div>
                            </td>
                        </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="9" className="text-center text-muted">No low stock products.</td>
                        </tr>
                        )}
                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
    </div>
  </div>

</div>

        // <div className="container mt-4">
        //     <ToastContainer />
        //     <h4>Low Stock Products (≤ 10 Qty)</h4>
        //     {loading ? (
        //         <div>Loading...</div>
        //     ) : (
        //         <div className="table-responsive">
        //             <table className="table table-bordered">
        //                 <thead>
        //                     <tr>
        //                         <th>Product Name</th>
        //                         <th>Product Code</th>
        //                         <th>Available Quantity</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {products.length > 0 ? (
        //                         products.map(product => (
        //                             <tr key={product._id}>
        //                                 <td>{product.productName || product.name || 'N/A'}</td>
        //                                 <td>{product.productCode || product.itemBarcode || 'N/A'}</td>
        //                                 <td>{product.availableQty}</td>
        //                             </tr>
        //                         ))
        //                     ) : (
        //                         <tr>
        //                             <td colSpan="3" className="text-center text-muted">No low stock products.</td>
        //                         </tr>
        //                     )}
        //                 </tbody>
        //             </table>
        //         </div>
        //     )}
        // </div>
    );
};

export default LowStock;
