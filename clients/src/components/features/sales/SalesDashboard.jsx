import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { GrFormPrevious } from 'react-icons/gr';
import { MdNavigateNext } from 'react-icons/md';
import BASE_URL from '../../../pages/config/config';
import { TbDotsVertical, TbEye, TbEdit, TbCurrency, TbCirclePlus, TbDownload, TbTrash, TbPointFilled, TbRefresh } from "react-icons/tb";
import { useParams, useNavigate } from 'react-router-dom';
import UserImg from '../../../assets/img/no_user.png'
import PDF from "../../../assets/img/icons/pdf.svg"
import EXCEL from "../../../assets/img/icons/excel.svg"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { IoMdArrowDropdown } from 'react-icons/io';
import { toast } from "react-toastify";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returnedProducts, setReturnedProducts] = useState([]);
  const [returnedProductsLoading, setReturnedProductsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReturns, setTotalReturns] = useState(0);
  
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Pagination states
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const token = localStorage.getItem("token");

  // Helper functions for filter labels
  const getStatusLabel = () => {
    return filterStatus ? `Status: ${filterStatus}` : "Status";
  };

  const getPaymentStatusLabel = () => {
    return filterPaymentStatus ? `Payment: ${filterPaymentStatus}` : "Payment Status";
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  // Get payment status helper
  const getPaymentStatus = (creditNote) => {
    if (!creditNote.sale) return 'N/A';
    const sale = creditNote.sale;
    if (sale.paidAmount >= sale.grandTotal) return 'Paid';
    if (sale.paidAmount > 0) return 'Partial';
    return 'Unpaid';
  };

  // Date validation helper
  const validateDateRange = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        toast.error('End date cannot be earlier than start date. Please select a valid date range.');
        return false;
      }
    }
    return true;
  };

  // Handle fromDate change with validation
  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    
    if (validateDateRange(newFromDate, toDate)) {
      setFromDate(newFromDate);
      setCurrentPage(1);
    }
  };

  // Handle toDate change with validation
  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    
    if (validateDateRange(fromDate, newToDate)) {
      setToDate(newToDate);
      setCurrentPage(1);
    }
  };

  // Filter returned products based on search and filters
  const filteredReturnedProducts = returnedProducts.filter(creditNote => {
    const matchesSearch = search === '' || 
      creditNote.sale?.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      creditNote.sale?.referenceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      creditNote.creditNoteId?.toLowerCase().includes(search.toLowerCase()) ||
      creditNote.sale?.invoiceId?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === '' || 
      (filterStatus === 'Complete' && creditNote.status === 'Complete') ||
      (filterStatus === 'Pending' && creditNote.status === 'Pending');

    const currentPaymentStatus = getPaymentStatus(creditNote);
    const matchesPaymentStatus = filterPaymentStatus === '' ||
      filterPaymentStatus === currentPaymentStatus;

    const matchesDateRange = (!fromDate || new Date(creditNote.createdAt) >= new Date(fromDate)) &&
      (!toDate || new Date(creditNote.createdAt) <= new Date(toDate));

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateRange;
  });

  // Fetch all filtered data for export by making multiple API calls if necessary
  const fetchAllFilteredData = async () => {
    try {
      let allData = [];
      let currentPage = 1;
      let totalPages = 1;
      const pageSize = 100; // Use a reasonable page size

      do {
        // Build query parameters with current filters
        const params = new URLSearchParams({
          limit: pageSize,
          page: currentPage
        });

        // Add search parameter if exists
        if (search.trim()) {
          params.append('search', search.trim());
        }

        // Add date filters if they exist
        if (fromDate) {
          params.append('fromDate', fromDate);
        }
        if (toDate) {
          params.append('toDate', toDate);
        }

        // Add status filters if they exist
        if (filterStatus) {
          params.append('status', filterStatus);
        }
        if (filterPaymentStatus) {
          params.append('paymentStatus', filterPaymentStatus);
        }

        const res = await axios.get(`${BASE_URL}/api/credit-notes/all?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Debug logging for first page
        if (currentPage === 1) {
          console.log('fetchAllFilteredData - API URL:', `${BASE_URL}/api/credit-notes/all?${params.toString()}`);
          console.log('fetchAllFilteredData - First page response:', res.data);
          console.log('fetchAllFilteredData - Total available:', res.data.total);
          console.log('fetchAllFilteredData - Total pages:', res.data.totalPages);
        }

        // Add current page data to allData
        if (res.data.data && Array.isArray(res.data.data)) {
          allData = [...allData, ...res.data.data];
        }

        // Update pagination info
        totalPages = res.data.totalPages || 1;
        currentPage++;

        console.log(`Fetched page ${currentPage - 1}/${totalPages}, Records so far: ${allData.length}`);

      } while (currentPage <= totalPages);

      console.log('fetchAllFilteredData - Final data length:', allData.length);
      return allData;
    } catch (error) {
      console.error('Error fetching all filtered data:', error);
      toast.error('Failed to fetch data for export');
      return [];
    }
  };

  // PDF Export function
  const handleExportPDF = async () => {
    try {
      // Show loading state
      const loadingToast = toast.loading('Preparing PDF export...');
      
      // Fetch all filtered data
      const allFilteredData = await fetchAllFilteredData();
      
      if (allFilteredData.length === 0) {
        toast.dismiss(loadingToast);
        toast.error('No data to export');
        return;
      }

      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Sales Returns Report', 14, 22);
      
      // Add date range if filters are applied
      if (fromDate || toDate) {
        doc.setFontSize(12);
        doc.text(`Date Range: ${fromDate || 'Start'} to ${toDate || 'End'}`, 14, 32);
      }
      
      // Add total count
      doc.setFontSize(10);
      doc.text(`Total Records: ${allFilteredData.length}`, 14, fromDate || toDate ? 42 : 32);
      
      // Prepare table data
      const tableData = allFilteredData.map(creditNote => {
        return creditNote.products.map((product, idx) => [
          idx === 0 ? creditNote.sale?.customer?.name || '-' : '',
          product.productId?.productName || 'N/A',
          idx === 0 ? creditNote.sale?.referenceNumber || '-' : '',
          idx === 0 ? creditNote.sale?.invoiceId || 'Not Generated' : '',
          idx === 0 ? creditNote.creditNoteId : '',
          idx === 0 ? (creditNote.createdAt ? new Date(creditNote.createdAt).toLocaleDateString() : '-') : '',
          idx === 0 ? (creditNote.status || 'pending') : '',
          product.returnQty || 0,
          product.hsnCode || '-',
          formatCurrency(product.sellingPrice || 0),
          `${product.discount || 0}%`,
          idx === 0 ? formatCurrency(creditNote.sale?.grandTotal || 0) : '',
          idx === 0 ? formatCurrency(creditNote.sale?.paidAmount || 0) : '',
          idx === 0 ? formatCurrency(creditNote.sale?.dueAmount || 0) : '',
          idx === 0 ? (creditNote.sale?.paymentStatus || 'pending') : '',
          idx === 0 ? (creditNote.sale?.biller || '-') : ''
        ]);
      }).flat();

      // Add table
      autoTable(doc, {
        head: [['Customer', 'Products', 'Reference', 'Invoice Id', 'Return Id', 'Date', 'Status', 'Returned Qty', 'HSN', 'Selling Price', 'Discount', 'Invoice Total', 'Paid', 'Due', 'Payment Status', 'Biller']],
        body: tableData,
        startY: fromDate || toDate ? 50 : 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      doc.save("Sales_Returns_Report.pdf");
      
      toast.dismiss(loadingToast);
      toast.success(`PDF exported successfully with ${allFilteredData.length} records`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  // Excel Export function
  const handleExportExcel = async () => {
    try {
      // Show loading state
      const loadingToast = toast.loading('Preparing Excel export...');
      
      // Fetch all filtered data
      const allFilteredData = await fetchAllFilteredData();
      
      if (allFilteredData.length === 0) {
        toast.dismiss(loadingToast);
        toast.error('No data to export');
        return;
      }

      const excelData = allFilteredData.map(creditNote => {
        return creditNote.products.map((product, idx) => ({
          Customer: idx === 0 ? creditNote.sale?.customer?.name || '-' : '',
          Products: product.productId?.productName || 'N/A',
          Reference: idx === 0 ? creditNote.sale?.referenceNumber || '-' : '',
          'Invoice Id': idx === 0 ? creditNote.sale?.invoiceId || 'Not Generated' : '',
          'Return Id': idx === 0 ? creditNote.creditNoteId : '',
          Date: idx === 0 ? (creditNote.createdAt ? new Date(creditNote.createdAt).toLocaleDateString() : '-') : '',
          Status: idx === 0 ? (creditNote.status || 'pending') : '',
          'Returned Qty': product.returnQty || 0,
          HSN: product.hsnCode || '-',
          'Selling Price': product.sellingPrice || 0,
          'Discount (%)': product.discount || 0,
          'Invoice Total': idx === 0 ? creditNote.sale?.grandTotal || 0 : '',
          Paid: idx === 0 ? creditNote.sale?.paidAmount || 0 : '',
          Due: idx === 0 ? creditNote.sale?.dueAmount || 0 : '',
          'Payment Status': idx === 0 ? (creditNote.sale?.paymentStatus || 'pending') : '',
          Biller: idx === 0 ? (creditNote.sale?.biller || '-') : ''
        }));
      }).flat();

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Returns");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Sales_Returns_Report.xlsx");
      
      toast.dismiss(loadingToast);
      toast.success(`Excel exported successfully with ${allFilteredData.length} records`);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Failed to export Excel');
    }
  };

  const fetchReturnedProducts = async (page = 1) => {
    try {
      setReturnedProductsLoading(true);
      const res = await axios.get(`${BASE_URL}/api/credit-notes/all?page=${page}&limit=${itemsPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReturnedProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalReturns(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch returned products:', err);
    } finally {
      setReturnedProductsLoading(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/sales/dashboard/stats`,{
             headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        setStats(res.data);
      } catch (err) {
        setError('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    fetchReturnedProducts(currentPage);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return null;

  const data = {
    labels: ['Sales', 'Returns'],
    datasets: [
      {
        label: 'Sale Quantity',
        data: [stats.totalSaleQty || 0, 0],
        backgroundColor: '#1890ff',
        borderColor: '#1890ff',
        borderWidth: 1,
      },
      {
        label: 'Sale Amount',
        data: [stats.totalSaleAmount || 0, 0],
        backgroundColor: '#52c41a',
        borderColor: '#52c41a',
        borderWidth: 1,
      },
      {
        label: 'Return Quantity',
        data: [0, stats.totalReturnQty || 0],
        backgroundColor: '#ff4d4f',
        borderColor: '#ff4d4f',
        borderWidth: 1,
      },
      {
        label: 'Return Amount',
        data: [0, stats.totalReturnAmount || 0],
        backgroundColor: '#faad14',
        borderColor: '#faad14',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: { 
        display: true, 
        text: 'Sales & Returns Overview',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label.includes('Amount')) {
              return `${label}: ₹${value.toLocaleString()}`;
            } else {
              return `${label}: ${value.toLocaleString()}`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: function() {
            // Calculate clean step size for round numbers
            const maxValue = Math.max(
              stats.totalSaleQty || 0,
              stats.totalSaleAmount || 0,
              stats.totalReturnQty || 0,
              stats.totalReturnAmount || 0
            );
            
            if (maxValue === 0) return 1000;
            
            // Calculate the order of magnitude
            const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
            const normalizedMax = maxValue / magnitude;
            
            let stepSize;
            if (normalizedMax <= 1) stepSize = 0.2 * magnitude;
            else if (normalizedMax <= 2) stepSize = 0.5 * magnitude;
            else if (normalizedMax <= 5) stepSize = 1 * magnitude;
            else stepSize = 2 * magnitude;
            
            // Ensure minimum reasonable step sizes
            if (stepSize < 1000 && maxValue > 5000) stepSize = 1000;
            if (stepSize < 500 && maxValue > 2500) stepSize = 500;
            if (stepSize < 100 && maxValue > 500) stepSize = 100;
            if (stepSize < 10 && maxValue > 50) stepSize = 10;
            
            return stepSize;
          }(),
          maxTicksLimit: 10,
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <>
    <div className='page-wrapper'>
      <div className='content'>
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Returned Products</h4>
              <h6>Manage Your Returned Products</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <a onClick={handleExportPDF} data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src={PDF} alt="img" /></a>
            </li>
            <li>
              <a onClick={handleExportExcel} data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src={EXCEL} alt="img" /></a>
            </li>
            <li>
              <a onClick={() => location.reload()} data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><TbRefresh className="ti ti-refresh" /></a>
            </li>
           
          </ul>
        </div>

    <Container fluid style={{ padding: '0px' }}>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Sale Quantity</Card.Title>
              <h4>{stats.totalSaleQty}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Sale Amount</Card.Title>
              <h4>₹{stats.totalSaleAmount.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Return Quantity</Card.Title>
              <h4>{stats.totalReturnQty}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Return Amount</Card.Title>
                {returnedProducts.length > 0 && (
                  <h4>
                    {formatCurrency(
                      returnedProducts.reduce((total, creditNote) => {
                        return total + (creditNote.sale?.paidAmount || 0);
                      }, 0)
                    )}
                  </h4>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Returned Products Table */}
      <Row className="mt-4">
        <Col>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search Customer, Return Id..."
                  className="form-control"
                  value={search}
                  onChange={e => { setSearch(e.target.value);  }}
                />
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              
              <div className="d-flex gap-3 align-items-center me-2">
                <div>
                  <input type="date" className="form-control" value={fromDate} onChange={handleFromDateChange} />
                </div>
                <div>
                  <input type="date" className="form-control" value={toDate} onChange={handleToDateChange} />
                </div>

              </div>

              <div className="dropdown me-2">
                <a className=" btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  {getStatusLabel()} <IoMdArrowDropdown className='ms-1'/>
                </a>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterStatus('')}>All</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterStatus('Pending')}>Pending</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterStatus('Complete')}>Completed</a></li>
                </ul>
              </div>
              <div className="dropdown me-2">
                <a className=" btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  {getPaymentStatusLabel()} <IoMdArrowDropdown className='ms-1'/>

                </a>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterPaymentStatus('')}>All</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterPaymentStatus('Pending')}>Pending</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterPaymentStatus('Paid')}>Paid</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterPaymentStatus('Unpaid')}>Unpaid</a></li>
                  <li><a className="dropdown-item rounded-1" onClick={() => setFilterPaymentStatus('Partial')}>Partial</a></li>
                </ul>
              </div>
              
            </div>
          </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table datatable">
                  <thead className="thead-light">
                    <tr>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Reference</th>
                      <th>Invoice Id</th>
                      <th>Return Id</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Returned Qty</th>
                      <th>HSN</th>
                      <th>Selling Price</th>
                      <th>Discount</th>
                      <th>Invoice Total</th>
                      <th>Paid</th>
                      <th>Due</th>
                      <th>Payment Status</th>
                      <th>Biller</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnedProductsLoading ? (
                      <tr>
                        <td colSpan="16" className="text-center py-4">
                          <Spinner animation="border" size="sm" />
                          <span className="ms-2">Loading returned products...</span>
                        </td>
                      </tr>
                    ) : filteredReturnedProducts.length > 0 ? (
                      filteredReturnedProducts.map((creditNote) => (
                        <React.Fragment key={creditNote._id}>
                          {creditNote.products && creditNote.products.length > 0 ? (
                            creditNote.products.map((product, idx) => (
                              <tr key={`${creditNote._id}-${idx}`}>
                                {idx === 0 && (
                                  <>
                                    <td rowSpan={creditNote.products.length}>
                                      <div className="d-flex align-items-center me-2">
                                        {creditNote.sale?.customer?.images?.[0] ? (
                                          <img
                                            className="me-2"
                                            style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
                                            src={creditNote.sale.customer.images[0]?.url || creditNote.sale.customer.images[0]}
                                            alt={creditNote.sale.customer?.name || "User"}
                                          />
                                        ) : (
                                          <div className="me-2 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#007bff", color: "#fff", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", opacity: 0.8 }}>
                                            {creditNote.sale?.customer?.name?.charAt(0) || "U"}
                                          </div>
                                        )}
                                        <span>{creditNote.sale?.customer?.name || "-"}</span>
                                      </div>
                                    </td>
                                  </>
                                )}
                                <td>
                                  <div className="d-flex align-items-center">
                                    <a href="" className="avatar avatar-md me-2">
                                      {(() => {
                                        const imgSrc = product.productImage || 
                                                      product.products?.images?.[0]?.url || 
                                                      product.images?.[0]?.url ||
                                                      product.productId?.images?.[0]?.url ||
                                                      product.productId?.images?.[0];
                                        return imgSrc ? (
                                          <img src={imgSrc} alt={product.productId?.productName || 'N/A'} className="media-image" />
                                        ) : (
                                          <img src="/vite.svg" alt="No Img" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, opacity: 0.5 }} />
                                        );
                                      })()}
                                    </a>
                                    <div className="ms-2">
                                      <h6 className="fw-bold mb-1"><a>{product.productId?.productName || 'N/A'}</a></h6>
                                      {product.hsnCode && (
                                        <p className="fs-13">HSN: {product.hsnCode}</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                {idx === 0 && (
                                  <>
                                    <td rowSpan={creditNote.products.length}>{creditNote.sale?.referenceNumber || "-"}</td>
                                    <td rowSpan={creditNote.products.length}>{creditNote.sale?.invoiceId || "Not Generated"}</td>
                                    <td rowSpan={creditNote.products.length}>
                                      <span className="badge bg-info text-light">
                                        {creditNote.creditNoteId}
                                      </span>
                                    </td>
                                    <td rowSpan={creditNote.products.length}>
                                      {creditNote.createdAt ? new Date(creditNote.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td rowSpan={creditNote.products.length}>
                                      <span className={`badge table-badge fw-medium fs-10 ${creditNote.status === "Complete" ? "bg-success" : "bg-danger"}`}>
                                        {creditNote.status || "Returned"}
                                      </span>
                                    </td>
                                  </>
                                )}
                                <td>{product.returnQty || product.quantity || 0} {product.unit || ""}</td>
                                <td>{product.hsnCode || "-"}</td>
                                <td>{formatCurrency(product.sellingPrice)}</td>
                                <td>
                                  <span>{product.discount || 0}</span>
                                  <span className="ms-1">{product.discountType === "Percentage" ? "%" : "₹"}</span>
                                </td>
                                {idx === 0 && (
                                  <>
                                    <td rowSpan={creditNote.products.length}>{formatCurrency(creditNote.sale?.grandTotal)}</td>
                                    <td rowSpan={creditNote.products.length}>{formatCurrency(creditNote.sale?.paidAmount)}</td>
                                    <td rowSpan={creditNote.products.length}>{formatCurrency(creditNote.sale?.dueAmount)}</td>
                                    <td rowSpan={creditNote.products.length}>
                                      <span className={`badge table-badge fw-medium fs-10 ${getPaymentStatus(creditNote) === "Paid" ? "bg-success" : getPaymentStatus(creditNote) === "Partial" ? "bg-warning" : "bg-danger"}`}>
                                        {getPaymentStatus(creditNote)}
                                      </span>
                                    </td>
                                    <td rowSpan={creditNote.products.length}>{creditNote.createdBy?.name || "-"}</td>
                                  </>
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td>
                                <div className="d-flex align-items-center me-2">
                                  {creditNote.sale?.customer?.images?.[0] ? (
                                    <img
                                      className="me-2"
                                      style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
                                      src={creditNote.sale.customer.images[0]?.url || creditNote.sale.customer.images[0]}
                                      alt={creditNote.sale.customer?.name || "User"}
                                    />
                                  ) : (
                                    <div className="me-2 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#007bff", color: "#fff", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", opacity: 0.8 }}>
                                      {creditNote.sale?.customer?.name?.charAt(0) || "U"}
                                    </div>
                                  )}
                                  <span>{creditNote.sale?.customer?.name || "-"}</span>
                                </div>
                              </td>
                              <td className="text-muted">No products</td>
                              <td>{creditNote.sale?.referenceNumber || "-"}</td>
                              <td>{creditNote.sale?.invoiceId || "Not Generated"}</td>
                              <td>
                                <span className="badge bg-info text-light">
                                  {creditNote.creditNoteId}
                                </span>
                              </td>
                              <td>{creditNote.createdAt ? new Date(creditNote.createdAt).toLocaleDateString() : '-'}</td>
                              <td>
                                <span className={`badge table-badge fw-medium fs-10 ${creditNote.status === "Complete" ? "bg-success" : "bg-danger"}`}>
                                  {creditNote.status || "Returned"}
                                </span>
                              </td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>{formatCurrency(creditNote.sale?.grandTotal)}</td>
                              <td>{formatCurrency(creditNote.sale?.paidAmount)}</td>
                              <td>{formatCurrency(creditNote.sale?.dueAmount)}</td>
                              <td>
                                <span className={`badge table-badge fw-medium fs-10 ${getPaymentStatus(creditNote) === "Paid" ? "bg-success" : getPaymentStatus(creditNote) === "Partial" ? "bg-warning" : "bg-danger"}`}>
                                  {getPaymentStatus(creditNote)}
                                </span>
                              </td>
                              <td>{creditNote.createdBy?.name || "-"}</td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="16" className="text-center text-muted py-4">
                          {search || filterStatus || filterPaymentStatus || fromDate || toDate 
                            ? "No returned products match your search criteria." 
                            : "No returned products found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div
                className="d-flex justify-content-end gap-3"
                style={{ padding: "10px 20px" }}
              >
                <select
                  className="form-select w-auto"
                  value={itemsPerPage}
                  onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                >
                  {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
                </select>

                {totalPages > 1 && (
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
                    <span>Page {currentPage} of {totalPages || 1}</span>
                    {" "}
                    <button
                      style={{
                        border: "none",
                        color: "grey",
                        backgroundColor: "white",
                      }}
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1}
                    >
                      <GrFormPrevious />
                    </button>
                    {" "}
                    <button
                      style={{ border: "none", backgroundColor: "white" }}
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                    >
                      <MdNavigateNext />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Sales & Returns graph */}
      <Card className="shadow-sm">
        <Card.Body>
          <div style={{ height: '500px', width: '100%' }}>
            <Bar data={data} options={options} />
          </div>
        </Card.Body>
      </Card>

    </Container>
      </div>
    </div>
    </>
  );
};

export default SalesDashboard;
