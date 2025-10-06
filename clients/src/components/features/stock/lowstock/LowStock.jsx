import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../../../pages/config/config';
import axios from 'axios';
import { TbEdit, TbRefresh, TbTrash } from 'react-icons/tb';
import { GrFormPrevious } from 'react-icons/gr';
import { MdNavigateNext } from 'react-icons/md';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import PDF from '../../../../assets/img/icons/pdf.svg'
import EXCEL from '../../../../assets/img/icons/excel.svg'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const LowStock = () => {
  
  // Check authentication status
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [activeTab, setActiveTab] = useState('low');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const shownToastsRef = useRef(new Set());
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('lowStockNotificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Filter states
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredOutOfStockProducts, setFilteredOutOfStockProducts] = useState([]);

  // Pagination and selection states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get export data based on active tab
  const getExportData = () => {
    const currentProducts = activeTab === 'low' ? filteredProducts : filteredOutOfStockProducts;
    return currentProducts.map(product => ({
      sku: product.sku || 'N/A',
      productName: product.productName || product.name || 'N/A',
      category: product.category?.categoryName || 'N/A',
      brand: product.brand?.brandName || 'N/A',
      availableQty: product.availableQty || 0,
      quantityAlert: product.quantityAlert || 0,
      supplier: product.supplierName || 'N/A',
      warehouse: product.warehouseName || 'N/A'
    }));
  };

  // Persist notifications toggle state to localStorage
  useEffect(() => {
    localStorage.setItem('lowStockNotificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    fetchCategories();
    fetchWarehouses();

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        
        // Calculate availableQty as in StockAdujestment, then filter for availableQty <= quantityAlert
        const allProducts = res.data.products || res.data || [];
        const lowStockProducts = allProducts
          .map(p => {
            // Always calculate availableQty since it doesn't exist as a field in DB
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
            
            const availableQty = quantity + newQuantitySum;
            
            return { ...p, availableQty };
          })
          .filter(p => {
            // Ensure products with base quantity 0 are never in low stock
            const baseQuantity = Number(p.quantity ?? 0);
            const shouldInclude = typeof p.quantityAlert === 'number' && 
                   p.availableQty < p.quantityAlert && 
                   p.availableQty > 0 && 
                   baseQuantity > 0;

            
            return shouldInclude;
          });
        
        setProducts(lowStockProducts);
        setFilteredProducts(lowStockProducts); // Initialize filtered products
        
        // Out of stock products
        const outStock = allProducts
          .map(p => {
            // Always calculate availableQty since it doesn't exist as a field in DB
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
            
            const availableQty = quantity + newQuantitySum;
            return { ...p, availableQty };
          })
          .filter(p => {
            // Products are out of stock if availableQty <= 0 OR base quantity is 0
            const baseQuantity = Number(p.quantity ?? 0);
            return p.availableQty <= 0 || baseQuantity === 0;
          });
        setOutOfStockProducts(outStock);
        setFilteredOutOfStockProducts(outStock); // Initialize filtered out of stock products

        // Out of stock toast will be shown only when tab is opened

        // Show a single toast with all low stock product names
        const newProducts = lowStockProducts.filter(product => !shownToastsRef.current.has(product._id));
        if (newProducts.length > 0 && notificationsEnabled) {
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
        console.error('Error fetching products:', err);
        console.error('Error details:', err.response?.data || err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters when products or filter selections change
  useEffect(() => {
    applyFilters();
  }, [products, outOfStockProducts, selectedWarehouse, selectedCategory]);

  // Helper functions for pagination and selection
  const getCurrentProducts = () => {
    return activeTab === 'low' ? filteredProducts : filteredOutOfStockProducts;
  };

  const getCurrentPageProducts = () => {
    const currentProducts = getCurrentProducts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return currentProducts.slice(startIndex, endIndex);
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = () => {
    const currentPageProducts = getCurrentPageProducts();
    const currentPageProductIds = currentPageProducts.map(product => product._id);

    if (selectAll) {
      // Deselect all current page products
      setSelectedProducts(prev => prev.filter(id => !currentPageProductIds.includes(id)));
    } else {
      // Select all current page products
      setSelectedProducts(prev => {
        const newSelected = [...prev];
        currentPageProductIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
      try {
        const token = localStorage.getItem("token");

        // Delete all selected products
        await Promise.all(
          selectedProducts.map(productId =>
            axios.delete(`${BASE_URL}/api/products/pro/${productId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );

        // Update both product lists
        setProducts(prev => prev.filter(p => !selectedProducts.includes(p._id)));
        setOutOfStockProducts(prev => prev.filter(p => !selectedProducts.includes(p._id)));

        // Clear selections
        setSelectedProducts([]);
        setSelectAll(false);

        toast.success(`${selectedProducts.length} products deleted successfully!`);
      } catch (err) {
        console.error("Failed to delete products:", err);
        toast.error("Failed to delete some products. Please try again.");
      }
    }
  };

  // Sync selectAll state with current page selections
  useEffect(() => {
    const currentPageProducts = getCurrentPageProducts();
    const currentPageProductIds = currentPageProducts.map(product => product._id);
    const allCurrentPageSelected = currentPageProductIds.length > 0 &&
      currentPageProductIds.every(id => selectedProducts.includes(id));
    setSelectAll(allCurrentPageSelected);
  }, [selectedProducts, currentPage, activeTab, filteredProducts, filteredOutOfStockProducts]);

  // Reset pagination when switching tabs or applying filters
  useEffect(() => {
    setCurrentPage(1);
    setSelectedProducts([]);
    setSelectAll(false);
  }, [activeTab, selectedWarehouse, selectedCategory]);

  //product delete---------------------------------------------------------------------------------------------------------------------------------------------

  const handleDelete = async (product) => {
    if (
      window.confirm(`Are you sure you want to delete ${product.productName}?`)
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/api/products/pro/${product._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p._id !== product._id)
        );

        alert("Product deleted successfully!");
      } catch (err) {
        console.error("Failed to delete product:", err.response?.data || err);
        alert(
          `Failed to delete product: ${err.response?.data?.message || err.message
          }`
        );
      }
    }
  };


  //download pdf-------------------------------------------------------------------------------------------------------------------------------------------

  const handlePdf = () => {
    const stockData = getExportData();
    const doc = new jsPDF();
    const title = activeTab === 'low' ? 'Low Stock Products' : 'Out of Stock Products';
    doc.text(title, 14, 15);
    const tableColumns = ["SKU", "Product Name", "Category", "Brand", "Available Qty", "Alert Level", "Supplier", "Warehouse"];

    const tableRows = stockData.map((e) => [
      e.sku,
      e.productName,
      e.category,
      e.brand,
      e.availableQty,
      e.quantityAlert,
      e.supplier,
      e.warehouse,
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [155, 155, 155],
        textColor: "white",
      },
      theme: "striped",
    });

    const filename = activeTab === 'low' ? 'low-stock-products.pdf' : 'out-of-stock-products.pdf';
    doc.save(filename);
  };

  //download excel---------------------------------------------------------------------------------------------------------------------------------------------------------

  const handleExcel = () => {
    const stockData = getExportData();
    const tableColumns = ["SKU", "Product Name", "Category", "Brand", "Available Qty", "Alert Level", "Supplier", "Warehouse"];

    const tableRows = stockData.map((e) => [
      e.sku,
      e.productName,
      e.category,
      e.brand,
      e.availableQty,
      e.quantityAlert,
      e.supplier,
      e.warehouse,
    ]);

    const data = [tableColumns, ...tableRows];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    const sheetName = activeTab === 'low' ? 'LowStockProducts' : 'OutOfStockProducts';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const filename = activeTab === 'low' ? 'low-stock-products.xlsx' : 'out-of-stock-products.xlsx';
    XLSX.writeFile(workbook, filename);
  };


  //category fetch-----------------------------------------------------------------------------------------------------------------------------------------------------------------

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/category/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCategories(data.categories || data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  //warehouse fetch-----------------------------------------------------------------------------------------------------------------------------------------------------------------

  const [warehouses, setWarehouses] = useState([]);

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/warehouse`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const warehouseData = data.data || data.warehouses || data || [];
      setWarehouses(warehouseData);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      setWarehouses([]);
    }
  };

  // Filter products based on selected warehouse and category
  const applyFilters = () => {
    let filtered = products;
    let filteredOutStock = outOfStockProducts;

    if (selectedWarehouse) {
      filtered = filtered.filter(product =>
        (product.warehouseName || product.warehouse || '').toLowerCase().includes(selectedWarehouse.toLowerCase())
      );
      filteredOutStock = filteredOutStock.filter(product =>
        (product.warehouseName || product.warehouse || '').toLowerCase().includes(selectedWarehouse.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        (product.category?.categoryName || product.categoryName || product.category || '').toLowerCase().includes(selectedCategory.toLowerCase())
      );
      filteredOutStock = filteredOutStock.filter(product =>
        (product.category?.categoryName || product.categoryName || product.category || '').toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setFilteredOutOfStockProducts(filteredOutStock);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedWarehouse('');
    setSelectedCategory('');
    setFilteredProducts(products);
    setFilteredOutOfStockProducts(outOfStockProducts);
  };

  // Handle reset function for buttons
  const handleReset = () => {
    resetFilters();
  };

  // Handle warehouse filter
  const handleWarehouseFilter = (warehouseName) => {
    setSelectedWarehouse(warehouseName);
  };

  // Handle category filter
  const handleCategoryFilter = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // Export to PDF function
  const exportToPDF = (data, title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    const tableColumns = ["SKU", "Product Name", "Category", "Brand", "Available Qty", "Alert Level", "Supplier", "Warehouse"];

    const tableRows = data.map((e) => [
      e.sku || 'N/A',
      e.productName || e.name || 'N/A',
      e.category?.categoryName || e.category || 'N/A',
      e.brand?.brandName || 'N/A',
      e.availableQty || 0,
      e.quantityAlert || 0,
      e.supplierName || 'N/A',
      e.warehouseName || e.warehouse || 'N/A',
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [155, 155, 155],
        textColor: "white",
      },
      theme: "striped",
    });

    const filename = title.toLowerCase().replace(/\s+/g, '-') + '.pdf';
    doc.save(filename);
  };

  // Export to Excel function
  const exportToExcel = (data, title) => {
    const tableColumns = ["SKU", "Product Name", "Category", "Brand", "Available Qty", "Alert Level", "Supplier", "Warehouse"];

    const tableRows = data.map((e) => [
      e.sku || 'N/A',
      e.productName || e.name || 'N/A',
      e.category?.categoryName || e.category || 'N/A',
      e.brand?.brandName || 'N/A',
      e.availableQty || 0,
      e.quantityAlert || 0,
      e.supplierName || 'N/A',
      e.warehouseName || e.warehouse || 'N/A',
    ]);

    const dataForExcel = [tableColumns, ...tableRows];

    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    const sheetName = title.replace(/\s+/g, '');
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const filename = title.toLowerCase().replace(/\s+/g, '-') + '.xlsx';
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title me-auto">
            <h4 className="fw-bold">Low Stocks</h4>
            <h6>Manage your low stocks</h6>
          </div>
          <ul className="table-top-head low-stock-top-head">
            {selectedProducts.length > 0 && (
              <li>
                <button
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Delete Selected"
                  onClick={handleBulkDelete}
                  className="fs-15"
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '5px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #dc3545',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    marginRight: '10px'
                  }}
                >
                  <TbTrash className="me-1" /> Delete ({selectedProducts.length})
                </button>
              </li>
            )}
            <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
              <label className="" title="">Export : </label>
              <button onClick={handlePdf} title="Download PDF" style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}><FaFilePdf className="fs-20" style={{ color: "red" }} /></button>
              <button onClick={handleExcel} title="Download Excel" style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}><FaFileExcel className="fs-20" style={{ color: "orange" }} /></button>
            </li>
            {/* <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel" onClick={handleExcel}><img src={EXCEL} alt="excel" /></a>
            </li> */}
            <li>
              <button data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" onClick={() => location.reload()} className="fs-20" style={{ backgroundColor: 'white', color: '', padding: '5px 5px', display: 'flex', alignItems: 'center', border: '1px solid #e8eaebff', cursor: 'pointer', borderRadius: '4px' }}><TbRefresh className="ti ti-refresh" /></button>
            </li>
            {/* <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
        </li> */}
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
                  if (newOutStockProducts.length > 0 && notificationsEnabled) {
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
                <input
                  type="checkbox"
                  id="user2"
                  className="check"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
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
                      <a className="btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                        Sort by : {selectedWarehouse || 'All Warehouse'}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <li>
                          <a className="dropdown-item rounded-1" onClick={() => setSelectedWarehouse('')}>All Warehouses</a>
                        </li>
                        {Array.isArray(warehouses) && warehouses.map(warehouse => (
                          <li key={warehouse._id}>
                            <a className="dropdown-item rounded-1" onClick={() => setSelectedWarehouse(warehouse.warehouseName || warehouse.name)}>
                              {warehouse.warehouseName || warehouse.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="dropdown me-2">
                      <a className="btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                        Sort by : {selectedCategory || 'All Category'}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <li>
                          <a className="dropdown-item rounded-1" onClick={() => setSelectedCategory('')}>All Categories</a>
                        </li>
                        {Array.isArray(categories) && categories.map(category => (
                          <li key={category._id}>
                            <a className="dropdown-item rounded-1" onClick={() => setSelectedCategory(category.categoryName || category.name)}>
                              {category.categoryName || category.name}
                            </a>
                          </li>
                        ))}
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
                              <input
                                type="checkbox"
                                id="select-all"
                                checked={selectAll}
                                onChange={handleSelectAll}
                              />
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
                          <th style={{textAlign: 'center'}}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentPageProducts().length > 0 ? (
                          getCurrentPageProducts().map(product => (
                            <tr key={product._id}>
                              <td>
                                <label className="checkboxs">
                                  <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(product._id)}
                                    onChange={() => handleProductSelect(product._id)}
                                  />
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
                                  <a className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-stock" onClick={() => navigate(`/product/edit/${product._id}`,{ state: { from: location.pathname } })}>
                                    <TbEdit data-feather="edit" className="feather-edit" />
                                  </a>
                                  <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" onClick={() => handleDelete(product)}>
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
                  {/* pagination */}
                  <div
                    className="d-flex justify-content-end gap-3"
                    style={{ padding: "10px 20px" }}
                  >
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="form-select w-auto"
                    >
                      <option value={10}>10 Per Page</option>
                      <option value={25}>25 Per Page</option>
                      <option value={50}>50 Per Page</option>
                      <option value={100}>100 Per Page</option>
                    </select>
                    <span
                      style={{
                        backgroundColor: "white",
                        boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
                        padding: "7px",
                        borderRadius: "5px",
                        border: "1px solid #e4e0e0ff",
                        color: "gray",
                      }}
                    >
                      {filteredProducts.length === 0
                        ? "0 of 0"
                        : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                          currentPage * itemsPerPage,
                          filteredProducts.length
                        )} of ${filteredProducts.length}`}
                      <button
                        style={{
                          border: "none",
                          color: "grey",
                          backgroundColor: "white",
                        }}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <GrFormPrevious />
                      </button>{" "}
                      <button
                        style={{ border: "none", backgroundColor: "white" }}
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage)))
                        }
                        disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                      >
                        <MdNavigateNext />
                      </button>
                    </span>
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
                      <a className="btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                        Sort by : {selectedWarehouse || 'All Warehouse'}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {warehouses.map(warehouse => (
                          <li key={warehouse._id}>
                            <a className="dropdown-item rounded-1" onClick={() => handleWarehouseFilter(warehouse.warehouseName)}>
                              {warehouse.warehouseName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="dropdown me-2">
                      <a className="btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                        Sort by : {selectedCategory || 'All Category'}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {categories.map(category => (
                          <li key={category._id}>
                            <a className="dropdown-item rounded-1" onClick={() => handleCategoryFilter(category.categoryName)}>
                              {category.categoryName}
                            </a>
                          </li>
                        ))}
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
                              <input
                                type="checkbox"
                                id="select-all2"
                                checked={selectAll}
                                onChange={handleSelectAll}
                              />
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
                          <th style={{textAlign: 'center'}}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentPageProducts().length > 0 ? (
                          getCurrentPageProducts().map(product => (
                            <tr key={product._id}>
                              <td>
                                <label className="checkboxs">
                                  <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(product._id)}
                                    onChange={() => handleProductSelect(product._id)}
                                  />
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
                                  <a className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-stock" onClick={() => navigate(`/product/edit/${product._id}`,{ state: { from: location.pathname } })}>
                                    <TbEdit data-feather="edit" className="feather-edit" />
                                  </a>
                                  <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" onClick={() => handleDelete(product)}>
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
                  {/* pagination */}
                  <div
                    className="d-flex justify-content-end gap-3"
                    style={{ padding: "10px 20px" }}
                  >
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="form-select w-auto"
                    >
                      <option value={10}>10 Per Page</option>
                      <option value={25}>25 Per Page</option>
                      <option value={50}>50 Per Page</option>
                      <option value={100}>100 Per Page</option>
                    </select>
                    <span
                      style={{
                        backgroundColor: "white",
                        boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
                        padding: "7px",
                        borderRadius: "5px",
                        border: "1px solid #e4e0e0ff",
                        color: "gray",
                      }}
                    >
                      {filteredOutOfStockProducts.length === 0
                        ? "0 of 0"
                        : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                          currentPage * itemsPerPage,
                          filteredOutOfStockProducts.length
                        )} of ${filteredOutOfStockProducts.length}`}
                      <button
                        style={{
                          border: "none",
                          color: "grey",
                          backgroundColor: "white",
                        }}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <GrFormPrevious />
                      </button>{" "}
                      <button
                        style={{ border: "none", backgroundColor: "white" }}
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredOutOfStockProducts.length / itemsPerPage)))
                        }
                        disabled={currentPage === Math.ceil(filteredOutOfStockProducts.length / itemsPerPage)}
                      >
                        <MdNavigateNext />
                      </button>
                    </span>
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
