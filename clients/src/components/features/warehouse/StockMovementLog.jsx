import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import BASE_URL from "../../../pages/config/config";
import { TbEdit, TbRefresh, TbTrash, TbEye } from "react-icons/tb";
import PDF from '../../../assets/img/icons/pdf.svg'
import EXCEL from '../../../assets/img/icons/excel.svg'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import { toast } from 'react-toastify';
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";

function StockMovementLog() {
  const [activeTab, setActiveTab] = useState("All");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  
  // Filter state for stock movement type
  const [movementFilter, setMovementFilter] = useState("All"); // "All", "Stock In", "Stock Out"
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // === BULK DELETE STATE ===
  const [selectedPurchases, setSelectedPurchases] = useState([]);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/purchases?limit=100000000`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPurchases(res.data.purchases);
      return res.data.purchases;

    } catch (error) {
      console.error("Error fetching purchases:", error);
      return [];
    }
  };

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/sales?limit=100000000`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSales(res.data.sales);
      return res.data.sales;

    } catch (error) {
      console.error("Error fetching sales:", error);
      return [];
    }
  };

  const fetchCombinedData = async () => {
    try {
      const [purchasesData, salesData] = await Promise.all([
        fetchPurchases(),
        fetchSales()
      ]);

      // Transform purchases data to include movement type
      const transformedPurchases = purchasesData.map(purchase => ({
        ...purchase,
        movementType: 'Stock In',
        type: 'purchase',
        transactionDate: purchase.purchaseDate || purchase.createdAt,
        referenceNumber: purchase.referenceNumber,
        customerSupplier: purchase.supplier 
          ? `${purchase.supplier.firstName || ''} ${purchase.supplier.lastName || ''} | ${purchase.supplier.email || ''}`.trim()
          : "N/A",
        productName: purchase.products && purchase.products.length > 0 
          ? (purchase.products.length === 1 
              ? (purchase.products[0]?.product?.productName || "N/A")
              : `${purchase.products[0]?.product?.productName || "Product"} (+${purchase.products.length - 1} more)`)
          : "N/A",
        quantity: purchase.products?.[0]?.quantity || "0"
      }));

      // Transform sales data to include movement type
      const transformedSales = salesData.map(sale => ({
        ...sale,
        movementType: 'Stock Out',
        type: 'sale',
        transactionDate: sale.saleDate || sale.createdAt,
        referenceNumber: sale.referenceNumber,
        customerSupplier: sale.customer 
          ? `${sale.customer.name || ''} | ${sale.customer.phone || ''}`.trim()
          : "N/A",
        productName: sale.products && sale.products.length > 0 
          ? (sale.products.length === 1 
              ? (sale.products[0]?.productId?.productName || sale.products[0]?.productName || "N/A")
              : `${sale.products[0]?.productId?.productName || sale.products[0]?.productName || "Product"} (+${sale.products.length - 1} more)`)
          : "N/A",
        quantity: sale.products?.[0]?.saleQty || sale.products?.[0]?.quantity || "0"
      }));

      // Combine and sort by date (newest first)
      const combined = [...transformedPurchases, ...transformedSales].sort(
        (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
      );

      setCombinedData(combined);

    } catch (error) {
      console.error("Error fetching combined data:", error);
    }
  };

  useEffect(() => {
    fetchCombinedData();
  }, []);

  //fetch warehoouses
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${BASE_URL}/api/warehouse`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWarehouses(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedWarehouse, movementFilter]);

const filteredData = combinedData.filter((item) => {
  // Check movement type filter
  let movementMatch = true;
  if (movementFilter === "Stock In") movementMatch = item.movementType === "Stock In";
  if (movementFilter === "Stock Out") movementMatch = item.movementType === "Stock Out";

  // Check status filter (for activeTab)
  let statusMatch = true;
  if (activeTab !== "All") {
    if (activeTab === "Stock In") {
      // For Stock In tab, only show purchases (movementType === "Stock In")
      statusMatch = item.movementType === "Stock In";
    } else if (activeTab === "Stock Out") {
      // For Stock Out tab, only show sales (movementType === "Stock Out")
      statusMatch = item.movementType === "Stock Out";
    }
  }

  // Check warehouse filter
  let warehouseMatch = true;
  if (selectedWarehouse) {
    // Create warehouse mapping for ObjectId to name lookup
    const warehouseMap = warehouses.reduce((map, warehouse) => {
      map[warehouse._id] = warehouse.warehouseName;
      return map;
    }, {});

    if (item.type === "purchase") {
      warehouseMatch = item.products?.some((p) => {
        // Handle populated warehouse data
        if (p.product?.warehouse?.warehouseName) {
          return p.product.warehouse.warehouseName === selectedWarehouse;
        }
        // Handle non-populated warehouse data (ObjectId only)
        if (p.product?.warehouse && typeof p.product.warehouse === 'string') {
          const warehouseName = warehouseMap[p.product.warehouse];
          return warehouseName === selectedWarehouse;
        }
        return false;
      });
    } else if (item.type === "sale") {
      warehouseMatch = item.products?.some((p) => {
        // Handle populated warehouse data
        if (p.productId?.warehouse?.warehouseName) {
          return p.productId.warehouse.warehouseName === selectedWarehouse;
        }
        // Handle non-populated warehouse data (ObjectId only)
        if (p.productId?.warehouse && typeof p.productId.warehouse === 'string') {
          const warehouseName = warehouseMap[p.productId.warehouse];
          return warehouseName === selectedWarehouse;
        }
        return false;
      });
    }
  }

  // All filters must match
  return movementMatch && statusMatch && warehouseMatch;
});

// Pagination logic
const totalItems = filteredData.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentPageData = filteredData.slice(startIndex, endIndex);

// Pagination handlers
const handlePageChange = (page) => {
  setCurrentPage(page);
};

const handleItemsPerPageChange = (newItemsPerPage) => {
  setItemsPerPage(newItemsPerPage);
  setCurrentPage(1); // Reset to first page when changing items per page
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

// === BULK DELETE HANDLERS ===
const handleCheckboxChange = (id) => {
  setSelectedPurchases((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );
};

const handleSelectAll = (e) => {
  if (e.target.checked) {
    const allIds = currentPageData.map((item) => item._id); // current page data
    setSelectedPurchases(allIds);
  } else {
    setSelectedPurchases([]);
  }
};

// bulk delete functionality
const handleBulkDelete = async () => {
  if (selectedPurchases.length === 0) return;
  
  const confirmed = await DeleteAlert({
    title: 'Delete Selected Records',
    text: `Are you sure you want to delete ${selectedPurchases.length} selected records?`,
  });
  
  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");
    
    // Group selected items by type
    const selectedItems = currentPageData.filter(item => selectedPurchases.includes(item._id));
    const purchaseIds = selectedItems.filter(item => item.type === 'purchase').map(item => item._id);
    const salesIds = selectedItems.filter(item => item.type === 'sale').map(item => item._id);
    
    // Delete purchases and sales separately
    const deletePromises = [
      ...purchaseIds.map(id => 
        axios.delete(`${BASE_URL}/api/purchases/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ),
      ...salesIds.map(id => 
        axios.delete(`${BASE_URL}/api/sales/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      )
    ];
    
    await Promise.all(deletePromises);
    toast.success("Selected records deleted successfully!");
    setSelectedPurchases([]);
    fetchCombinedData(); // Reload data
  } catch (err) {
    console.error("Bulk delete error:", err);
    toast.error("Failed to delete selected records");
  }
};

// individual delete functionality
const handleIndividualDelete = async (item) => {
  const itemType = item.type === 'purchase' ? 'purchase' : 'sale';
  const itemName = item.referenceNumber || item._id;
  
  const confirmed = await DeleteAlert({
    title: `Delete ${itemType}`,
    text: `Are you sure you want to delete the ${itemType} "${itemName}"?`,
  });
  
  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");
    const endpoint = item.type === 'purchase' ? 'purchases' : 'sales';
    
    await axios.delete(`${BASE_URL}/api/${endpoint}/${item._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success(`${itemType} deleted successfully!`);
    // Remove from selected items if it was selected
    setSelectedPurchases((prev) => prev.filter((id) => id !== item._id));
    fetchCombinedData(); // Reload data
  } catch (err) {
    console.error("Delete error:", err);
    toast.error(`Failed to delete ${itemType}`);
  }
};

useEffect(() => {
  setSelectedPurchases((prev) => {
    const filtered = prev.filter((id) =>
      currentPageData.some((d) => d._id === id)
    );

    // ✅ Only update if filtered array is different
    if (filtered.length !== prev.length) {
      return filtered;
    }
    return prev;
  });
}, [currentPageData]);

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleCellClick = (stock) => {
    setSelectedStock(stock);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedStock(null);
  };


  const quantity = selectedStock?.products?.[0]?.product?.quantity
    ? parseInt(selectedStock.products[0].product.quantity)
    : 0;

  const unitPrice = 5000;
  const subtotal = quantity * unitPrice;
  const cgst = 9;
  const sgst = 9;
  const shippingCharges = 300;
  const totalPrice =
    subtotal +
    (subtotal * cgst) / 100 +
    (subtotal * sgst) / 100 +
    shippingCharges;

  // Function to download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Determine which data to export
    const dataToExport = selectedPurchases.length > 0 
      ? filteredData.filter(item => selectedPurchases.includes(item._id))
      : filteredData;
    
    const title = selectedPurchases.length > 0 
      ? `Stock Movement Log (${selectedPurchases.length} Selected Items)`
      : "Stock Movement Log";
    
    doc.text(title, 14, 20);

    const tableColumn = [
      "Product",
      "Time",
      "QTY",
      "Movement Type",
      "Source/Destination",
      "Reference/Note",
    ];
    const tableRows = dataToExport.map((item) => [
      item.productName || "N/A",
      formatDateTime(item.transactionDate),
      item.quantity || "0",
      item.movementType,
      item.customerSupplier || "N/A",
      item.referenceNumber || "N/A",
    ]);

    // Use autoTable directly
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [100, 100, 100] },
      styles: { fontSize: 10 },
    });

    const fileName = selectedPurchases.length > 0 
      ? `Stock_Movement_Log_Selected_${selectedPurchases.length}_Items.pdf`
      : "Stock_Movement_Log.pdf";
    
    doc.save(fileName);
  };

  // Function to download Excel
  const downloadExcel = () => {
    // Determine which data to export
    const dataToExport = selectedPurchases.length > 0 
      ? filteredData.filter(item => selectedPurchases.includes(item._id))
      : filteredData;
    
    const worksheetData = dataToExport.map((item) => ({
      Product: item.productName || "N/A",
      Time: formatDateTime(item.transactionDate),
      Quantity: item.quantity || 0,
      "Movement Type": item.movementType,
      "Source/Destination": item.customerSupplier || "N/A",
      "Reference/Note": item.referenceNumber || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    
    const sheetName = selectedPurchases.length > 0 
      ? `Selected Items (${selectedPurchases.length})`
      : "Stock Movement Log";
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    const fileName = selectedPurchases.length > 0 
      ? `Stock_Movement_Log_Selected_${selectedPurchases.length}_Items.xlsx`
      : "Stock_Movement_Log.xlsx";
    
    XLSX.writeFile(workbook, fileName);
  };



  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title me-auto">
            <h4 className="fw-bold">Stock Movement Log</h4>
            <h6>Manage your stocks Movements</h6>
          </div>
          
          {/* Delete Selected Button */}
          {selectedPurchases.length > 0 && (
            <div className="me-3" style={{marginTop: "-10px"}}>
              <button 
                className="btn btn-danger" 
                onClick={handleBulkDelete}
                title={`Delete ${selectedPurchases.length} selected items`}
              >
                <TbTrash className="me-1" />
                Delete ({selectedPurchases.length}) Selected
              </button>
            </div>
          )}
          
          <ul className="table-top-head low-stock-top-head">
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" onClick={downloadPDF} ><img src={PDF} alt="pdf" /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel" onClick={downloadExcel} ><img src={EXCEL} alt="excel" /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" onClick={() => location.reload()}><TbRefresh className="ti ti-refresh" /></a>
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



          <div className="tab-content" id="pills-tabContent">
            {/* low stock */}
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              {/* /product list */}
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-0">
                    <ul className="nav nav-pills d-flex me-2 mb-0" id="pills-tab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link${activeTab === 'All' ? ' active' : ''}`}
                          id="pills-all-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-all"
                          type="button"
                          role="tab"
                          aria-controls="pills-all"
                          aria-selected={activeTab === 'All'}
                          onClick={() => setActiveTab('All')}
                        >
                          All
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link${activeTab === 'Stock In' ? ' active' : ''}`}
                          id="pills-stockin-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-stockin"
                          type="button"
                          role="tab"
                          aria-controls="pills-stockin"
                          aria-selected={activeTab === 'Stock In'}
                          onClick={() => setActiveTab('Stock In')}
                        >
                          Stock In
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link${activeTab === 'Stock Out' ? ' active' : ''}`}
                          id="pills-stockout-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-stockout"
                          type="button"
                          role="tab"
                          aria-controls="pills-stockout"
                          aria-selected={activeTab === 'Stock Out'}
                          onClick={() => setActiveTab('Stock Out')}
                        >
                          Stock Out
                        </button>
                      </li>
                      {/* <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link${activeTab === 'Transfer' ? ' active' : ''}`}
                          id="pills-transfer-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-transfer"
                          type="button"
                          role="tab"
                          aria-controls="pills-transfer"
                          aria-selected={activeTab === 'Transfer'}
                          onClick={() => setActiveTab('Transfer')}
                        >
                          Transfer
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link${activeTab === 'Processing' ? ' active' : ''}`}
                          id="pills-processing-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-processing"
                          type="button"
                          role="tab"
                          aria-controls="pills-processing"
                          aria-selected={activeTab === 'Processing'}
                          onClick={() => setActiveTab('Processing')}
                        >
                          Processing
                        </button>
                      </li> */}
                    </ul>

                    {/* <div className="notify d-flex bg-white p-1 px-2 border rounded">
              <div className="status-toggle text-secondary d-flex justify-content-between align-items-center">
                <input type="checkbox" id="user2" className="check" defaultChecked />
                <label htmlFor="user2" className="checktoggle me-2">checkbox</label>
                Notify
              </div>
            </div> */}
                  </div>
                  <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                    <div className="dropdown me-2">
                      <a className="btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                        Sort by : {selectedWarehouse || "All Warehouse"}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end p-3" style={{height:'215px',overflowY:'auto'}}>
                        <li>
                          <a 
                            className="dropdown-item rounded-1" 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedWarehouse(null);
                            }}
                          >
                            All Warehouse
                          </a>
                        </li>
                        {warehouses.map((wh) => (
                        <li key={wh._id}>
                          <a 
                            className="dropdown-item rounded-1" 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedWarehouse(wh.warehouseName);
                            }}
                          >
                            {wh.warehouseName}
                          </a>
                        </li>
                        ))}
                      </ul>
                    </div>
                    {/* <div className="dropdown me-2">
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
                    </div> */}
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
                                checked={currentPageData.length > 0 && selectedPurchases.length === currentPageData.length}
                                onChange={handleSelectAll}
                              />
                              <span className="checkmarks" />
                            </label>
                          </th>
                          <th>Product</th>
                          <th>Time</th>
                          <th>QTY</th>
                          <th>Movement Type</th>
                          <th>Source/Destination</th>
                          <th>Reference/Note</th>
                          <th style={{textAlign:"center"}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map(item => (
                            <tr key={item._id} >
                              <td onClick={(e) => e.stopPropagation()}>
                                <label className="checkboxs">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedPurchases.includes(item._id)}
                                    onChange={() => handleCheckboxChange(item._id)}
                                  />
                                  <span className="checkmarks" />
                                </label>
                              </td>
                              <td>{item.productName || "N/A"}</td>
                              <td>{formatDateTime(item.transactionDate)}</td>
                              <td>{item.quantity || "0"}</td>
                              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                                {(() => {
                                  const type = item.movementType.trim().toLowerCase();
                                  let backgroundColor = "#D3D3D3";
                                  let textColor = "#000";

                                  if (type === "stock in" || type === "received") {
                                    backgroundColor = "#DFFFE0";
                                    textColor = "#2BAE66";
                                  } else if (type === "stock out" || type === "sold") {
                                    backgroundColor = "#FCE4E6";
                                    textColor = "#D64550";
                                  } else if (type === "transfer") {
                                    backgroundColor = "#D4E4FF";
                                    textColor = "#2F80ED";
                                  } else if (type === "processing" || type === "ordered") {
                                    backgroundColor = "#FFF3CD";
                                    textColor = "#856404";
                                  }
                                  return (
                                    <span
                                      style={{
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                        color: textColor,
                                        backgroundColor,
                                      }}
                                    >
                                      {item.movementType}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td>{item.customerSupplier || "N/A"}</td>
                              <td>{item.referenceNumber || "N/A"}</td>
                              <td className="action-table-data">
                                <div className="edit-delete-action" style={{gap:"8px"}}>
                                  <a 
                                    className="p-2" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCellClick(item);
                                    }}
                                    style={{cursor: 'pointer'}}
                                  >
                                    <TbEye data-feather="eye" className="feather-eye" />
                                  </a>
                                  <a
                                    className="p-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleIndividualDelete(item);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <TbTrash />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center text-muted">No stock movement data found.</td>
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
                      {totalItems === 0
                        ? "0 of 0"
                        : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems}`}
                      <button
                        style={{
                          border: "none",
                          color: "grey",
                          backgroundColor: "white",
                        }}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <GrFormPrevious />
                      </button>
                      <button
                        style={{ border: "none", backgroundColor: "white" }}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
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
      {isPopupOpen && selectedStock && (
        <div
          // style={{
          //   position: "fixed",
          //   top: 10,
          //   left: 0,
          //   width: "100%",
          //   height: "100%",
          //   background: "rgba(0,0,0,0.5)",
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   // marginBottom: "20px"
          //   // padding: "120px",
          // }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,

            width: "100%",
            height: "100vh", // Commented out: Reverted to original
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // padding: "90px",
            zIndex: 1000, // Commented out: Reverted to original
            padding: "200px", // Commented out: Reverted to original
          }}
        >
          <div
            // style={{
            //   backgroundColor: "#fff",
            //   padding: "24px",
            //   gap: "24px",
            //   borderRadius: "8px",
            //   maxWidth: "800px",
            //   // maxHeight: "700px",
            //   width: "95%",
            // }}
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              gap: "24px",
              borderRadius: "8px",
              maxWidth: "800px",
              width: "95%",
              maxHeight: "95vh",
              overflowY: "auto", // Commented out: Reverted to original
              position: "relative",
              // Commented out: Reverted to original
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <span
                style={{
                  border: "1px solid #676767",
                  backgroundColor:
                    selectedStock.status === "Ordered" ? "#ED2F42" : "#2fed45",
                  padding: "8px",
                  borderRadius: "4px",
                  color: "#fff",
                }}
              >
                {selectedStock.status}
              </span>
              <select
                style={{
                  border: "1px solid #e6e6e6",
                  backgroundColor: "#ffffff",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                {" "}
                {selectedStock.status === "Ordered" ? (
                  <option value="">In Transit</option>
                ) : (
                  <option value="">Reached</option>
                )}
              </select>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              <span>
                Reference No :{" "}
                <strong>{selectedStock.referenceNumber || "N/A"}</strong>
              </span>
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
            <div
              style={{
                marginTop: "10px",
                border: "1px solid #e6e6e6",
                borderRadius: "16px",
                padding: "16px",
                backgroundColor: "#fff",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "40px",
                }}
              >
                <div>
                  <span>Customer</span>
                  <br />
                  <span>
                    {/* <span>{selectedStock.supplier?.supplierName || "N/A"}</span> */}
                    <span>{selectedStock.supplier.firstName + " " + selectedStock.supplier.lastName || "N/A"}</span>
                  </span>
                </div>
                <div>
                  <span>From Warehouse</span>
                  <br />
                  {/* {console.log("NOLE ", selectedStock.products[0]?.product)
                  } */}
                  <span>

                    {selectedStock.products[0]?.product?.warehouse
                      ?.warehouseName || "N/A"}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: "30px" }}>
                <span style={{ fontSize: "16px", color: "#262626", fontWeight: "bold" }}>
                  Products
                </span>
                <div
                  style={{
                    border: "1px solid #e6e6e6",
                    borderRadius: "8px",
                    marginTop: "10px",
                    overflowX: "auto",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f5f5f5",
                          color: "#444",
                          textAlign: "left",
                          fontWeight: "400"
                        }}
                      >
                        
                        <th style={{ padding: "10px" }}>Product</th>
                        <th style={{ padding: "10px" }}>SKU</th>
                        <th style={{ padding: "10px" }}>Quantity</th>
                        <th style={{ padding: "10px" }}>Unit Price</th>
                        <th style={{ padding: "10px" }}>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                        
                        <td style={{ padding: "10px" }}>
                          {selectedStock.products[0]?.product?.productName}
                        </td>
                        <td style={{ padding: "10px" }}>
                          SKU{selectedStock.products[0]?.product?.sku || "N/A"}
                        </td>

                        <td style={{ padding: "10px" }}>{quantity}</td>
                        <td style={{ padding: "10px" }}>₹{unitPrice}</td>
                        <td style={{ padding: "10px" }}>
                          ₹{(quantity * unitPrice).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subtotal Section */}
              <div style={{ paddingTop: "10px", marginBottom: "20px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                  }}
                >
                  <tbody>
                    <tr style={{}}>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        Subtotal
                      </td>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        ₹{subtotal.toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{}}>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        CGST ({cgst}%)
                      </td>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        ₹{((subtotal * cgst) / 100).toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        SGST ({sgst}%)
                      </td>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        ₹{((subtotal * sgst) / 100).toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        Shipping Charges
                      </td>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        ₹{shippingCharges.toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{ borderTop: "1px solid #e6e6e6" }}>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        Total Price
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{totalPrice.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Other Info */}
              <div
                style={{
                  border: "1px solid #e6e6e6",
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  gap: "16px",
                  marginTop: "10px",
                  padding: "16px",
                }}
              >
                <span style={{ fontSize: "16px", color: "#262626" }}>
                  Other Info
                </span>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <span>Payments Method</span>
                    <br />
                    <input
                      type="text"
                      placeholder="Net Banking"
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "10px 16px",
                        color: "#000000",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div>
                    <span>Courier Partner</span>
                    <br />
                    <input
                      type="text"
                      placeholder="Shiprocket"
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "10px 16px",
                        color: "#000000",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div>
                    <span>Arrival Time</span>
                    <br />
                    <input
                      type="text"
                      placeholder="2:45 PM"
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "10px 16px",
                        color: "#000000",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closePopup}
              style={{
                marginTop: "15px",
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                float: "right",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    // <div className="page-wrapper"  >
    //   <div className="content">
    //       <div >
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //         border: "1px solid #e6e6e6",
    //         padding: "16px 24px",
    //         borderTopLeftRadius: "8px",
    //         borderTopRightRadius: "8px",
    //         backgroundColor: "#fff",
    //       }}
    //     >
    //       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    //         <span
    //           style={{
    //             fontFamily: "roboto",
    //             fontWeight: "500",
    //             fontSize: "18px",
    //             color: "#676767",
    //           }}
    //         >
    //           Warehouses
    //         </span>
    //         <span>
    //           <IoIosArrowForward
    //             style={{
    //               fontFamily: "roboto",
    //               fontWeight: "500",
    //               fontSize: "18px",
    //               color: "#676767",
    //             }}
    //           />
    //         </span>
    //         <span
    //           style={{
    //             fontFamily: "roboto",
    //             fontWeight: "500",
    //             fontSize: "18px",
    //             color: "#262626",
    //           }}
    //         >
    //           Stock Movement Log
    //         </span>
    //       </div>
    //       <div
    //         style={{
    //           border: "1px solid #e6e6e6",
    //           borderRadius: "4px",
    //           padding: "8px",
    //           gap: "8px",
    //           backgroundColor: "#fff",
    //         }}
    //       >
    //         <select name="" id="" style={{ border: "none", outline: "none" }}>
    //           <option
    //             value=""
    //             style={{
    //               border: "none",
    //               outline: "none",
    //               color: "#676767",
    //               fontFamily: "roboto",
    //               fontWeight: "400",
    //               fontSize: "16px",
    //             }}
    //           >
    //             Select Warehouse
    //           </option>
    //         </select>
    //       </div>
    //     </div>

    //     {/* <div
    //       style={{
    //         display: "flex",
    //         backgroundColor: "#fff",
    //         padding: "8px 24px",
    //         borderBottom: "1px solid #e6e6e6",
    //         borderLeft: "1px solid #e6e6e6",
    //         borderRight: "1px solid #e6e6e6",
    //         gap: "18px",
    //       }}
    //     >
    //       <div
    //         style={{
    //           gap: "18px",
    //           justifyContent: "space-between",
    //           display: "flex",
    //           fontFamily: "Roboto",
    //           fontWeight: "400",
    //           fontSize: "16px",
    //           color: "#262626",
    //           alignItems: "center",
    //         }}
    //       >
    //         {["All", "Stock In", "Stock Out", "Transfer", "Processing"].map(
    //           (tab) => (
    //             <span
    //               key={tab}
    //               onClick={() => setActiveTab(tab)}
    //               style={{
    //                 borderRadius: "4px",
    //                 padding: "8px",
    //                 backgroundColor: activeTab === tab ? "#d1d1d1" : "#f1f1f1",
    //                 cursor: "pointer",
    //               }}
    //             >
    //               {tab}
    //             </span>
    //           )
    //         )}
    //       </div>
    //     </div> */}
    //     {/* <div
    //       style={{
    //         backgroundColor: "#ffffff",
    //         borderBottom: "1px solid #e6e6e6",
    //         borderBottomLeftRadius: "8px",
    //         borderBottomRightRadius: "8px",
    //         maxWidth: "100%",
    //         overflowX: "auto",
    //       }}
    //     >
    //       <table
    //         style={{
    //           width: "100%",
    //           borderCollapse: "collapse",
    //           fontFamily: "Arial",
    //           fontSize: "14px",
    //         }}
    //       >
    //         <thead>
    //           <tr
    //             style={{
    //               backgroundColor: "#f5f5f5",
    //               color: "#444",
    //               textAlign: "left",
    //             }}
    //           >
    //             <th style={{ padding: "10px" }}>
    //               <input type="checkbox" />
    //             </th>
    //             <th style={{ padding: "10px" }}>Product</th>
    //             <th style={{ padding: "10px" }}>Time</th>
    //             <th style={{ padding: "10px" }}>QTY</th>
    //             <th style={{ padding: "10px" }}>Movement Type</th>
    //             <th style={{ padding: "10px" }}>Source/Destination</th>
    //             <th style={{ padding: "10px" }}>Reference/Note</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {filteredPurchases.map((purchase) => (
    //             <tr
    //               key={purchase._id}
    //               style={{
    //                 borderBottom: "1px solid #d3d3d3",
    //                 transition: "background-color 0.2s",
    //               }}
    //               onClick={() => handleCellClick(purchase)}
    //             >
    //               <td 
    //                 style={{ padding: "10px" }}
    //               >
    //                 <input type="checkbox" />
    //               </td>
    //               <td
    //                 style={{ padding: "10px" }}
    //               >
    //                 {purchase.products[0]?.product?.productName}
    //               </td>
    //               <td
    //                 style={{ padding: "10px" }}
    //               >
    //                 {formatDateTime(purchase.createdAt)}
    //               </td>
    //               <td
    //                 style={{ padding: "10px" }}
    //                 onClick={() => handleCellClick(purchase)}
    //               >
    //                 {purchase.products[0]?.product?.quantity}
    //               </td>
    //               <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
    //                 {(() => {
    //                   const type = purchase.status.trim().toLowerCase(); 
    //                   let backgroundColor = "#D3D3D3";
    //                   let textColor = "#000";

    //                   if (type === "received") {
    //                     backgroundColor = "#DFFFE0";
    //                     textColor = "#2BAE66";
    //                   } else if (type === "ordered") {
    //                     backgroundColor = "#FCE4E6";
    //                     textColor = "#D64550";
    //                   } else if (type === "transfer") {
    //                     backgroundColor = "#D4E4FF";
    //                     textColor = "#2F80ED";
    //                   } else if (type === "processing") {
    //                     backgroundColor = "#FFF3CD";
    //                     textColor = "#856404";
    //                   }
    //                   return (
    //                     <span
    //                       style={{
    //                         padding: "4px 12px",
    //                         borderRadius: "20px",
    //                         fontSize: "13px",
    //                         fontWeight: "500",
    //                         color: textColor,
    //                         backgroundColor,
    //                       }}
    //                     >
    //                       {purchase.status}
    //                     </span>
    //                   );
    //                 })()}
    //               </td>
    //               <td
    //                 style={{ padding: "10px" }}
    //               >
    //                 {purchase.products[0]?.product?.warehouse?.warehouseName}
    //               </td>
    //               <td
    //                 style={{ padding: "10px" }}
    //               >
    //                 {purchase.referenceNumber || "N/A"}
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div> */}

    //     {isPopupOpen && selectedStock && (
    //       <div
    //         style={{
    //           position: "fixed",
    //           top: 70,
    //           left: 0,
    //           width: "100%",
    //           height: "90%",
    //           background: "rgba(0,0,0,0.5)",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           padding: "90px",
    //         }}
    //       >
    //         <div
    //           style={{
    //             backgroundColor: "#fff",
    //             padding: "24px",
    //             gap: "24px",
    //             borderRadius: "8px",
    //             maxWidth: "800px",
    //             width: "95%",
    //           }}
    //         >
    //           <div
    //             style={{
    //               display: "flex",
    //               gap: "16px",
    //               alignItems: "center",
    //               marginBottom: "15px",
    //             }}
    //           >
    //             <span
    //               style={{
    //                 border: "1px solid #676767",
    //                 backgroundColor:
    //                   selectedStock.status === "Ordered" ? "#ED2F42" : "#2fed45",
    //                 padding: "8px",
    //                 borderRadius: "4px",
    //                 color: "#fff",
    //               }}
    //             >
    //               {selectedStock.status}
    //             </span>
    //             <select
    //               style={{
    //                 border: "1px solid #e6e6e6",
    //                 backgroundColor: "#ffffff",
    //                 padding: "8px",
    //                 borderRadius: "4px",
    //               }}
    //             >
    //               {" "}
    //               {selectedStock.status === "Ordered" ? (
    //                 <option value="">In Transit</option>
    //               ) : (
    //                 <option value="">Reached</option>
    //               )}
    //             </select>
    //           </div>
    //           <div
    //             style={{
    //               display: "flex",
    //               justifyContent: "space-between",
    //               fontSize: "14px",
    //               marginBottom: "10px",
    //             }}
    //           >
    //             <span>
    //               Reference No :{" "}
    //               <strong>{selectedStock.referenceNumber || "N/A"}</strong>
    //             </span>
    //             <span>Date: {new Date().toLocaleDateString()}</span>
    //           </div>
    //           <div
    //             style={{
    //               marginTop: "10px",
    //               border: "1px solid #e6e6e6",
    //               borderRadius: "16px",
    //               padding: "16px",
    //               backgroundColor: "#fff",
    //               marginBottom: "20px",
    //             }}
    //           >
    //             <div
    //               style={{
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 marginBottom: "40px",
    //               }}
    //             >
    //               <div>
    //                 <span>Customer</span>
    //                 <br />
    //                 <span>
    //                   <span>{selectedStock.supplier?.supplierName || "N/A"}</span>
    //                 </span>
    //               </div>
    //               <div>
    //                 <span>From Warehouse</span>
    //                 <br />
    //                 <span>
    //                   {selectedStock.products[0]?.product?.warehouse
    //                     ?.warehouseName || "N/A"}
    //                 </span>
    //               </div>
    //             </div>
    //             <div style={{ marginBottom: "30px" }}>
    //               <span style={{ fontSize: "16px", color: "#262626", fontWeight:"bold" }}>
    //                 Products
    //               </span>
    //               <div
    //                 style={{
    //                   border: "1px solid #e6e6e6",
    //                   borderRadius: "8px",
    //                   marginTop: "10px",
    //                   overflowX: "auto",
    //                 }}
    //               >
    //                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
    //                   <thead>
    //                     <tr
    //                       style={{
    //                         backgroundColor: "#f5f5f5",
    //                         color: "#444",
    //                         textAlign: "left",
    //                         fontWeight:"400"
    //                       }}
    //                     >
    //                       <th style={{ padding: "10px" }}>
    //                         <input type="checkbox" />
    //                       </th>
    //                       <th style={{ padding: "10px" }}>Product</th>
    //                       <th style={{ padding: "10px" }}>SKU</th>
    //                       <th style={{ padding: "10px" }}>Quantity</th>
    //                       <th style={{ padding: "10px" }}>Unit Price</th>
    //                       <th style={{ padding: "10px" }}>Total Price</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
    //                       <td style={{ padding: "10px" }}>
    //                         <input type="checkbox" />
    //                       </td>
    //                       <td style={{ padding: "10px" }}>
    //                         {selectedStock.products[0]?.product?.productName}
    //                       </td>
    //                       <td style={{ padding: "10px" }}>
    //                         SKU{selectedStock.products[0]?.product?.sku || "N/A"}
    //                       </td>

    //                       <td style={{ padding: "10px" }}>{quantity}</td>
    //                       <td style={{ padding: "10px" }}>₹{unitPrice}</td>
    //                       <td style={{ padding: "10px" }}>
    //                         ₹{(quantity * unitPrice).toLocaleString()}
    //                       </td>
    //                     </tr>
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>

    //             {/* Subtotal Section */}
    //             <div style={{ paddingTop: "10px", marginBottom: "20px" }}>
    //               <table
    //                 style={{
    //                   width: "100%",
    //                   borderCollapse: "collapse",
    //                   fontSize: "14px",
    //                 }}
    //               >
    //                 <tbody>
    //                   <tr style={{}}>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       Subtotal
    //                     </td>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       ₹{subtotal.toLocaleString()}
    //                     </td>
    //                   </tr>
    //                   <tr style={{}}>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       CGST ({cgst}%)
    //                     </td>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       ₹{((subtotal * cgst) / 100).toLocaleString()}
    //                     </td>
    //                   </tr>
    //                   <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       SGST ({sgst}%)
    //                     </td>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       ₹{((subtotal * sgst) / 100).toLocaleString()}
    //                     </td>
    //                   </tr>
    //                   <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       Shipping Charges
    //                     </td>
    //                     <td style={{ padding: "10px", textAlign: "right" }}>
    //                       ₹{shippingCharges.toLocaleString()}
    //                     </td>
    //                   </tr>
    //                   <tr style={{ borderTop: "1px solid #e6e6e6" }}>
    //                     <td
    //                       style={{
    //                         padding: "10px",
    //                         textAlign: "right",
    //                         fontWeight: "bold",
    //                       }}
    //                     >
    //                       Total Price
    //                     </td>
    //                     <td
    //                       style={{
    //                         padding: "10px",
    //                         textAlign: "right",
    //                         fontWeight: "bold",
    //                       }}
    //                     >
    //                       ₹{totalPrice.toLocaleString()}
    //                     </td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             </div>

    //             {/* Other Info */}
    //             <div
    //               style={{
    //                 border: "1px solid #e6e6e6",
    //                 backgroundColor: "#ffffff",
    //                 borderRadius: "16px",
    //                 gap: "16px",
    //                 marginTop: "10px",
    //                 padding: "16px",
    //               }}
    //             >
    //               <span style={{ fontSize: "16px", color: "#262626" }}>
    //                 Other Info
    //               </span>
    //               <div
    //                 style={{ display: "flex", justifyContent: "space-between" }}
    //               >
    //                 <div>
    //                   <span>Payments Method</span>
    //                   <br />
    //                   <input
    //                     type="text"
    //                     placeholder="Net Banking"
    //                     style={{
    //                       border: "1px solid #c2c2c2",
    //                       padding: "10px 16px",
    //                       color: "#000000",
    //                       borderRadius: "8px",
    //                     }}
    //                   />
    //                 </div>
    //                 <div>
    //                   <span>Courier Partner</span>
    //                   <br />
    //                   <input
    //                     type="text"
    //                     placeholder="Shiprocket"
    //                     style={{
    //                       border: "1px solid #c2c2c2",
    //                       padding: "10px 16px",
    //                       color: "#000000",
    //                       borderRadius: "8px",
    //                     }}
    //                   />
    //                 </div>
    //                 <div>
    //                   <span>Arrival Time</span>
    //                   <br />
    //                   <input
    //                     type="text"
    //                     placeholder="2:45 PM"
    //                     style={{
    //                       border: "1px solid #c2c2c2",
    //                       padding: "10px 16px",
    //                       color: "#000000",
    //                       borderRadius: "8px",
    //                     }}
    //                   />
    //                 </div>
    //               </div>
    //             </div>
    //           </div>

    //           {/* Close Button */}
    //           <button
    //             onClick={closePopup}
    //             style={{
    //               marginTop: "15px",
    //               padding: "8px 16px",
    //               backgroundColor: "#dc3545",
    //               color: "#fff",
    //               border: "none",
    //               borderRadius: "4px",
    //               cursor: "pointer",
    //               float: "right",
    //             }}
    //           >
    //             Close
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    //   </div>
    // </div>
  );
}

export default StockMovementLog;
