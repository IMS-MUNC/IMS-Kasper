
import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbChevronUp, TbEdit, TbRefresh, TbTrash, TbEye, TbDots } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import AddPurchaseModal from "../../../../pages/Modal/PurchaseModals/AddPurchaseModal";
import { CiCirclePlus } from "react-icons/ci";
import EditPurchaseModal from "../../../../pages/Modal/PurchaseModals/EditPurchaseModal";
import axios from "axios";
import BASE_URL from "../../../../pages/config/config";
import { useSettings } from "../../../../Context/purchase/PurchaseContext";
import ViewPurchase from "../../../../pages/Modal/PurchaseModals/ViewPurchase";
// import { useSettings } from "../../../../Context/purchase/PurchaseContext";
// import "../../../../styles/purchase/product.css"
import "../../../../styles/product/product.css"
import AddDebitNoteModals from "../../../../pages/Modal/debitNoteModals/AddDebitNoteModals";
import * as XLSX from "xlsx";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import { toast } from "react-toastify";
import DeleteAlert from "../../../../utils/sweetAlert/DeleteAlert";


const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [viewPurchaseId, setViewPurchaseId] = useState(null);
  const [perPage, setPerPage] = useState(10);


    const [selectedReturnData, setSelectedReturnData] = useState(null);

// Export all table data to Excel
  // const handleExportExcel = () => {
  //   if (!purchases.length) return;
  //   const rows = [];
  //   purchases.forEach((purchase) => {
  //     purchase.products.forEach((p, idx) => {
  //       rows.push({
  //         Supplier: purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A",
  //         Reference: purchase.referenceNumber,
  //         Date: new Date(purchase.purchaseDate).toLocaleDateString(),
  //         Product: p.product?.productName || "",
  //         Quantity: p.quantity,
  //         Unit: p.unit,
  //         PurchasePrice: p.purchasePrice,
  //         Discount: p.discount,
  //         Tax: p.tax,
  //         TaxAmount: p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
  //         ShippingCost: purchase.shippingCost,
  //         ExtraExpense: purchase.orderTax,
  //         UnitCost: p.unitCost,
  //         TotalCost: p.totalCost,
  //         Status: purchase.status,
  //       });
  //     });
  //   });
  //   const ws = XLSX.utils.json_to_sheet(rows);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Purchases");
  //   XLSX.writeFile(wb, "purchases.xlsx");
  // };
  // Delete purchase
  const handleDeletePurchase = async (purchaseId, referenceNumber) => {
    const token = localStorage.getItem("token");
    if (!window.confirm(`Are you sure you want to delete purchase ${referenceNumber}?`)) return;
    try {
      await axios.delete(`${BASE_URL}/api/purchases/${purchaseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Check if we're deleting the last item on the current page
      const remainingItemsOnPage = purchases.length - 1;
      if (remainingItemsOnPage === 0 && page > 1) {
        // If this is the last item on a page that's not the first page, go to previous page
        setPage(page - 1);
      } else {
        // Otherwise, just refresh the current page
        fetchPurchases();
      }
      
      toast.success(`Purchase ${referenceNumber} deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete purchase');
    }
  };


  // Export data to PDF (selected rows or all data)
const handleExportPDF = async () => {
  try {
    let dataToExport = [];

    if (selectedRows.length > 0) {
      // Export selected rows
      dataToExport = purchases.filter((purchase) =>
        selectedRows.includes(purchase._id)
      );
    } else {
      // Export all data by fetching from API without pagination
      const res = await axios.get(`${BASE_URL}/api/purchases`, {
        params: {
          ...filters,
          limit: 10000, // Large limit to get all data
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dataToExport = res.data.purchases;
    }

    if (!dataToExport.length) {
      toast.error('No data to export');
      return;
    }

    const doc = new jsPDF("l", "pt", "a4");

    const columns = [
      "Supplier",
      "Reference",
      "Date",
      "Product",
      "Quantity",
      "Unit",
      "PurchasePrice",
      "Discount",
      "Tax",
      "TaxAmount",
      "ShippingCost",
      "ExtraExpense",
      "UnitCost",
      "TotalCost",
      "Status",
      "Created By",
      "Updated By"
    ];

    const rows = [];

    dataToExport.forEach((purchase) => {
      purchase.products.forEach((p) => {
        rows.push([
          purchase.supplier
            ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}`
            : "N/A",
          purchase.referenceNumber,
          new Date(purchase.purchaseDate).toLocaleDateString(),
          p.product?.productName || "",
          p.quantity,
          p.unit,
          p.purchasePrice,
          p.discount,
          p.tax,
          p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
          purchase.shippingCost,
          purchase.orderTax,
          p.unitCost.toFixed(2),
          p.totalCost.toFixed(2),
          purchase.status,
          purchase.createdBy ? `${purchase.createdBy.name} (${purchase.createdBy.email})` : "-",
          purchase.updatedBy ? `${purchase.updatedBy.name} (${purchase.updatedBy.email})` : "-"
        ]);
      });
    });

    doc.text("Purchases Report", 40, 30);

    // Use autoTable as a standalone function
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 50,
      styles: { fontSize: 7 },
      margin: { left: 20, right: 20 }
    });

    const filename = selectedRows.length > 0 ? "selected_purchases.pdf" : "all_purchases.pdf";
    doc.save(filename);
    
    toast.success(`PDF exported successfully (${rows.length} records)`);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    toast.error('Failed to export PDF');
  }
};

  
  // Export data to Excel (selected rows or all data)
  const handleExportExcel = async () => {
    try {
      let dataToExport = [];

      if (selectedRows.length > 0) {
        // Export selected rows
        dataToExport = purchases.filter((purchase) =>
          selectedRows.includes(purchase._id)
        );
      } else {
        // Export all data by fetching from API without pagination
        const res = await axios.get(`${BASE_URL}/api/purchases`, {
          params: {
            ...filters,
            limit: 10000, // Large limit to get all data
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dataToExport = res.data.purchases;
      }

      if (!dataToExport.length) {
        toast.error('No data to export');
        return;
      }

      const rows = [];
      dataToExport.forEach((purchase) => {
        purchase.products.forEach((p) => {
          rows.push({
            Supplier: purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A",
            Reference: purchase.referenceNumber,
            Date: new Date(purchase.purchaseDate).toLocaleDateString(),
            Product: p.product?.productName || "",
            Quantity: p.quantity,
            Unit: p.unit,
            PurchasePrice: p.purchasePrice,
            Discount: p.discount,
            Tax: p.tax,
            TaxAmount: p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
            ShippingCost: purchase.shippingCost,
            ExtraExpense: purchase.orderTax,
            UnitCost: p.unitCost.toFixed(2),
            TotalCost: p.totalCost.toFixed(2),
            Status: purchase.status,
            CreatedBy: purchase.createdBy ? `${purchase.createdBy.name} (${purchase.createdBy.email})` : "-",
            UpdatedBy: purchase.updatedBy ? `${purchase.updatedBy.name} (${purchase.updatedBy.email})` : "-"
          });
        });
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Purchases");
      
      const filename = selectedRows.length > 0 ? "selected_purchases.xlsx" : "all_purchases.xlsx";
      XLSX.writeFile(wb, filename);
      
      toast.success(`Excel exported successfully (${rows.length} records)`);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Failed to export Excel');
    }
  };

  // Import data from Excel
  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData.length) {
          toast.error('No data found in the Excel file');
          return;
        }

        // Validate required columns
        const requiredColumns = ['Supplier', 'Reference', 'Date', 'Product', 'Quantity', 'PurchasePrice'];
        const firstRow = jsonData[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));
        
        if (missingColumns.length > 0) {
          toast.error(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }

        // Process and validate data
        const processedData = jsonData.map((row, index) => {
          const errors = [];
          
          if (!row.Supplier) errors.push('Supplier is required');
          if (!row.Reference) errors.push('Reference is required');
          if (!row.Product) errors.push('Product is required');
          if (!row.Quantity || isNaN(row.Quantity)) errors.push('Valid quantity is required');
          if (!row.PurchasePrice || isNaN(row.PurchasePrice)) errors.push('Valid purchase price is required');
          
          if (errors.length > 0) {
            toast.error(`Row ${index + 2}: ${errors.join(', ')}`);
            return null;
          }

          return {
            supplier: row.Supplier,
            referenceNumber: row.Reference,
            purchaseDate: row.Date ? new Date(row.Date) : new Date(),
            product: row.Product,
            quantity: Number(row.Quantity),
            unit: row.Unit || 'pcs',
            purchasePrice: Number(row.PurchasePrice),
            discount: Number(row.Discount) || 0,
            tax: Number(row.Tax) || 0,
            shippingCost: Number(row.ShippingCost) || 0,
            extraExpense: Number(row.ExtraExpense) || 0,
            status: row.Status || 'Pending'
          };
        }).filter(Boolean);

        if (processedData.length === 0) {
          toast.error('No valid data to import');
          return;
        }

        // Show confirmation dialog
        const confirmImport = window.confirm(
          `Found ${processedData.length} valid records to import. Do you want to proceed?`
        );

        if (confirmImport) {
          // Here you would typically send the data to your API
          // For now, we'll just show a success message
          toast.success(`Successfully processed ${processedData.length} records. Note: Actual import to database needs to be implemented.`);
          console.log('Processed data:', processedData);
          
          // Refresh the purchases list
          fetchPurchases();
        }

      } catch (error) {
        console.error('Error importing Excel:', error);
        toast.error('Failed to import Excel file. Please check the file format.');
      }
    };

    reader.readAsArrayBuffer(file);
    
    // Reset the file input
    event.target.value = '';
  };

 const [selectedRows, setSelectedRows] = useState([]); // For row selection

  // Handle select all for current page
  const handleSelectAll = (e) => {
    // Since purchases array already contains only current page data from API
    const currentPageIds = purchases.map((purchase) => purchase._id);
    
    if (e.target.checked) {
      // Add current page IDs to selected rows
      setSelectedRows((prev) => [...new Set([...prev, ...currentPageIds])]);
    } else {
      // Remove current page IDs from selected rows
      setSelectedRows((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    }
  };

  // Handle single row select
  const handleSelectRow = (purchaseId) => {
    setSelectedRows((prev) =>
      prev.includes(purchaseId)
        ? prev.filter((id) => id !== purchaseId)
        : [...prev, purchaseId]
    );
  };

  // Bulk delete selected purchases
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmed = await DeleteAlert({
      title: "Are you sure?",
      text: `You won't be able to revert the deletion of ${selectedRows.length} purchase${selectedRows.length > 1 ? 's' : ''}!`,
      confirmButtonText: "Yes, delete them!"
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await Promise.all(
        selectedRows.map((id) =>
          axios.delete(`${BASE_URL}/api/purchases/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      // Remove deleted purchases from state and refresh data
      setSelectedRows([]);
      toast.success(`${selectedRows.length} purchase${selectedRows.length > 1 ? 's' : ''} deleted successfully`);
      
      // Check if we need to navigate to previous page
      const remainingPurchases = purchases.length - selectedRows.length;
      const currentPageStart = (page - 1) * 10;
      
      if (remainingPurchases <= currentPageStart && page > 1) {
        setPage(page - 1);
      } else {
        fetchPurchases();
      }
    } catch (err) {
      console.error("Bulk delete failed:", err);
      toast.error("Failed to delete selected purchases");
    }
  };

  
    const handleConvertToReturn = (purchase) => {
      setSelectedReturnData(purchase);
      const returnModal = new window.bootstrap.Modal(document.getElementById("add-return-debit-note"));
      returnModal.show();
    };

   

    

  // console.log("Purchase component rendered", purchases);

  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { settings } = useSettings();
  const navigate = useNavigate(); // 👈 inside the component
const token = localStorage.getItem("token");


  // const fetchPurchases = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/api/purchases`, {
  //       params: {
  //         ...filters,
  //         page,
  //         limit: 10,
  //       },
  //     });
  //     setPurchases(res.data.purchases);
  //     setTotalPages(res.data.totalPages);
  //   } catch (error) {
  //     console.error("Error fetching purchases:", error);
  //   }
  // };
  const fetchPurchases = async () => {
    try {

      const res = await axios.get(`${BASE_URL}/api/purchases`, {
        params: {
          ...filters,
          // status: "Received",  // force only received
          page,
          limit: perPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPurchases(res.data.purchases);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [filters, page, perPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Create updated filters object
    const updatedFilters = {
      ...filters,
      [name]: value,
    };
    
    // Validate date range if both dates are provided
    if (name === 'endDate' || name === 'startDate') {
      const startDate = name === 'startDate' ? value : filters.startDate;
      const endDate = name === 'endDate' ? value : filters.endDate;
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end < start) {
          toast.error('End date cannot be older than start date. Please input correct date format.');
          return; // Don't update the filter if validation fails
        }
      }
    }
    
    setFilters(updatedFilters);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  

  // const convertCurrency = (value) => {
  //   const rate = settings.conversionRates?.[settings.currencyCode] || 1;
  //   return (value * rate).toFixed(2);
  // };
  const convertCurrency = (value) => {
    if (!settings.conversionRates || !settings.baseCurrency) return value?.toFixed(2) || "0.00";

    const baseToSelectedRate = settings.conversionRates[settings.currencyCode] || 1;
    const baseToBaseRate = settings.conversionRates[settings.baseCurrency] || 1;

    const converted = (value / baseToBaseRate) * baseToSelectedRate;
    return converted.toFixed(2);
  };
  // New: handle edit button click — set selected purchase and open modal
  const handleEditClick = (purchase) => {
    setSelectedPurchase(purchase);
    // Open modal programmatically since React doesn’t auto open with state change
    const editModal = new window.bootstrap.Modal(document.getElementById("edit-purchase"));
    editModal.show();
  };
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const [activeSection, setActiveSection] = useState(
    sessionStorage.getItem("activeSection") || "personalInfo"
  );
  useEffect(() => {
    sessionStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  // Function to handle section toggling
  const onToggleSection = (section) => {
    setActiveSection(section);
  };



    // State to track expanded debit note for each purchase
  const [expandedDebitNote, setExpandedDebitNote] = useState({});

  // Toggle expand/collapse for a debit note row
  const handleToggleDebitNote = (purchaseId, debitNoteId) => {
    setExpandedDebitNote(prev => {
      // If already expanded, collapse
      if (prev[purchaseId] === debitNoteId) {
        return { ...prev, [purchaseId]: null };
      }
      // Expand this debit note
      return { ...prev, [purchaseId]: debitNoteId };
    });
  };

  //  const [expandedRow, setExpandedRow] = useState(null);
  //   // const navigate = useNavigate();
  
  //   const toggleExpand = (saleId) => {
  //     setExpandedRow(expandedRow === saleId ? null : saleId);
  //   };
  

  

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Purchase</h4>
              <h6>Manage your purchases</h6>
            </div>
          </div>
          {/* <div className="table-top-head d-flex align-items-center gap-2 flex-wrap">
            <button
              className={`btn btn-outline-primary ${filters.status === "" ? "active" : ""}`}
              onClick={() => {
                setFilters((prev) => ({ ...prev, status: "" }));
                setPage(1);
              }}
            >
              All
            </button>

            <button
              className={`btn btn-outline-warning ${filters.status === "Pending" ? "active" : ""}`}
              onClick={() => {
                setFilters((prev) => ({ ...prev, status: "Pending" }));
                setPage(1);
              }}
            >
              Pending
            </button>

            <button
              className={`btn btn-outline-success ${filters.status === "Received" ? "active" : ""}`}
              onClick={() => {
                setFilters((prev) => ({ ...prev, status: "Received" }));
                setPage(1);
              }}
            >
              Received
            </button>

            <button
              className={`btn btn-outline-info ${filters.status === "Ordered" ? "active" : ""}`}
              onClick={() => {
                setFilters((prev) => ({ ...prev, status: "Ordered" }));
                setPage(1);
              }}
            >
              Purchase Orders
            </button>

            <button
              className="btn btn-dark"
              onClick={() => navigate("/stock-history")}
            >
              Stock History
            </button>
          </div> */}

          <div className="table-top-head me-2">
            <li>
              {selectedRows.length > 0 && (
                <button className="btn btn-danger me-2" onClick={handleBulkDelete}>
                  Delete ({selectedRows.length}) Selected
                </button>
              )}
            </li>
            <li onClick={handleExportPDF}><button type="button" className="icon-btn" title="Pdf"><FaFilePdf /></button></li>
            <li><label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} hidden /><FaFileExcel style={{ color: "green" }} /></label></li>
            <li onClick={handleExportExcel}><button type="button" className="icon-btn" title="Export Excel" ><FaFileExcel /></button></li>
          </div>


          <div className="d-flex gap-2">
            <a className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-purchase"><CiCirclePlus className="me-1" />Add Purchase</a>
            {/* <a className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#view-notes"><i data-feather="download" className="me-2" />Import Purchase</a> */}
          </div>
        </div>

        <div className="card">
          <div className="card-header  justify-content-between flex-wrap gap-3">
            <div className="row ">
              <div className="col-md-3">
                <input type="text" name="search" className="form-control" placeholder="Search by product, supplier, or reference" value={filters.search} onChange={handleInputChange} />
              </div>
              <div className="col-md-3">
                <input type="date" name="startDate" className="form-control" value={filters.startDate} onChange={handleInputChange} />
              </div>
              <div className="col-md-3">
                <input type="date" name="endDate" className="form-control" value={filters.endDate} onChange={handleInputChange} />
              </div>
              <div className="col-md-3">
                <select name="status" className="form-select" value={filters.status} onChange={handleInputChange}>
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Received">Received</option>
                  <option value="Ordered">Ordered</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable text-center align-middle">
                <thead className="thead-light text-center">
                  <tr>
                    <th><label className="checkboxs">
                      {/* <input type="checkbox" /> */}
                      <input
                        type="checkbox"
                        checked={
                          purchases.length > 0 &&
                          purchases.every((purchase) => selectedRows.includes(purchase._id))
                        }
                        onChange={handleSelectAll}
                        ref={(input) => {
                          if (input) {
                            // Since purchases array already contains only current page data from API
                            const currentPageIds = purchases.map((purchase) => purchase._id);
                            const someSelected = currentPageIds.some((id) => selectedRows.includes(id));
                            const allSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedRows.includes(id));
                            input.indeterminate = someSelected && !allSelected;
                          }
                        }}
                      />
                      <span className="checkmarks" /></label></th>
                    <th>Supplier</th>
                    <th>Reference</th>
                    <th>Debit Note</th>
                    <th>Date</th>
                    <th>Products</th>
                    <th>Qyt</th>
                    <th>Purchase Price</th>
                    <th>Discount</th>
                    <th>Tax(%)</th>
                    <th>Tax Amount</th>
                    <th>Shipping Charge</th>
                    <th>Extra Expense</th>
                    <th>Unit cost</th>
                    <th>Total cost</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Updated By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length === 0 ? (
                    <tr><td colSpan="16" className="text-center">No purchases found.</td></tr>
                  ) : (
                    purchases.map((purchase) => (
                       <React.Fragment key={purchase._id}>
                      <tr key={purchase._id}>
                        <td><label className="checkboxs"><input
                          type="checkbox"
                          checked={selectedRows.includes(purchase._id)}
                          onChange={() => handleSelectRow(purchase._id)}
                        /><span className="checkmarks" /></label></td>
                        <td className="text-capitalize">{purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A"}</td>
                        <td>{purchase.referenceNumber}</td>
                        <td>
  {Array.isArray(purchase.debitNotes) && purchase.debitNotes.length > 0 ? (
    <>
      <span
        key={purchase.debitNotes[0]._id}
        className="badge bg-info text-light me-1"
        style={{ cursor: "pointer" }}
  onClick={() => handleToggleDebitNote(purchase._id, purchase.debitNotes[0]._id)}
      >
        {purchase.debitNotes[0].debitNoteId}
      </span>

      {purchase.debitNotes.length > 1 && (
        <span
          className="badge bg-secondary text-light"
          style={{ cursor: "pointer" }}
          title={purchase.debitNotes.slice(1).map(n => n.debitNoteId).join(", ")} 
          onClick={() => handleToggleDebitNote(purchase._id, purchase.debitNotes[0]._id)}
        >
          +{purchase.debitNotes.length - 1} more
        </span>
      )}
    </>
  ) : (
    "N/A"
  )}
</td>
                        <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                        <td>
                          <ul>{purchase.products.map((p, idx) => (
                            <li key={idx}>{p.product?.productName}
                              {/* - {p.quantity} × {settings.currencySymbol}{convertCurrency(p.purchasePrice)} */}
                            </li>
                          ))}</ul>
                        </td>
                        <td>
                          <ul>
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>
                                {p.quantity} {p.unit}
                              </li>
                            ))}
                          </ul>
                        </td>

                        <td>
                          <ul>
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>{p.purchasePrice}</li>
                            ))}
                          </ul>
                        </td>

                        <td>
                          <ul>
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>{p.discount}<span className="ms-1">{p.discountType === "Percentage" ? "%" : "₹"}</span></li>
                            ))}
                          </ul>
                        </td>

                        <td>
                          <ul>
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>{p.tax} %</li>
                            ))}
                          </ul>
                        </td>

                        <td>
                          <ul>
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>{p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0)}</li>
                            ))}
                          </ul>
                        </td>

                        <td>{purchase.shippingCost}</td>
                        <td>{purchase.orderTax}</td>

                        <td>
                          <ul>
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>{p.unitCost}</li>
                            ))}
                          </ul>
                        </td>

                        <td>
                          <ul>
                            {purchase.products.map((p, idx) => (
                              <li key={idx}>{p.totalCost}</li>
                            ))}
                          </ul>
                        </td>

                        {/* <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{p.quantity} {p.unit}</li>))}</ul></td>
                        <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.purchasePrice)}</li>))}</ul></td>
                        <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.discount)}</li>))}</ul></td>
                        <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{p.tax} %</li>))}</ul></td>
                        <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0))}</li>))}</ul></td>
                        <td>{settings.currencySymbol}{convertCurrency(purchase.shippingCost)}</td>
                        <td>{settings.currencySymbol}{convertCurrency(purchase.orderTax)}</td>
                        <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.unitCost)}</li>))}</ul></td>
                        <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.totalCost)}</li>))}</ul></td> */}
                        <td>
                          {/* <span className={`badge ${purchase.status === "Pending" ? "bg-warning" : "bg-success"}`}>{purchase.status}</span> */}
                          <span
                            className={`badge ${purchase.status === "Pending"
                                ? "bg-warning text-dark" // Yellow badge with dark text
                                : purchase.status === "Received"
                                  ? "bg-success" // Green badge
                                  : purchase.status === "Ordered"
                                    ? "bg-primary" // Blue badge
                                    : "bg-secondary" // Fallback if none match
                              }`}
                          >
                            {purchase.status}
                          </span>
                        </td>
                        <td>{purchase.createdBy ? `${purchase.createdBy.name}` : '--'}</td>
                        <td>{purchase.updatedBy ? `${purchase.updatedBy.name} ` : '--'}</td>
                        <td class="action-item">
                          <a href="" data-bs-toggle="dropdown">
                            <TbDots />
                          </a>
                          <ul class="dropdown-menu">
                            <li>
                              <a class="dropdown-item d-flex align-items-center" onClick={() => handleEditClick(purchase)}><TbEdit className="me-2" />Edit</a>
                            </li>
                            <li>
                              <a className="dropdown-item d-flex align-items-center" onClick={() => handleDeletePurchase(purchase._id, purchase.referenceNumber)}><TbTrash className="me-2" />Delete</a>
                            </li>
                            {/* <li>
                              <a  class="dropdown-item d-flex align-items-center" onClick={() => setViewPurchaseId(purchase._id)}><TbEye class="isax isax-send-2 me-2"/>View </a>
                            </li> */}
                            <li>
                              {/* <a href="" class="dropdown-item d-flex align-items-center"><i class="isax isax-document-download me-2"></i>Download Invoices as PDF</a> */}
                            </li>
                            <li>
                              <a className="dropdown-item d-flex align-items-center" onClick={() => handleConvertToReturn(purchase)}><i className="isax isax-convert me-2"></i>Convert to Purchase Return</a>
                            </li>
                            <li>
                            </li>
                          </ul>
                        </td>


                     {/* {(purchase.debitNotes && purchase.debitNotes.length > 0 && (
                        <tr key={purchase._id + '-debitnotes'}>
                          <td colSpan={18} style={{ background: '#f9f9f9', padding: 0 }}>
                            <div style={{ padding: '8px 0' }}>
                              <b>Debit Notes:</b>
                              {purchase.debitNotes.map((dn) => (
                                <span key={dn._id} style={{ marginLeft: 12, marginRight: 12 }}>
                                  <a
                                    href="#"
                                    style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={e => {
                                      e.preventDefault();
                                      handleToggleDebitNote(purchase._id, dn._id);
                                    }}
                                  >
                                    {dn.debitNoteId || dn._id}
                                  </a>
                                  {expandedDebitNote[purchase._id] === dn._id && (
                                    <div style={{ marginTop: 8, border: '1px solid #ddd', borderRadius: 4, background: '#fff', padding: 12 }}>
                                      <div><b>Date:</b> {dn.debitNoteDate ? new Date(dn.debitNoteDate).toLocaleDateString() : ''}</div>
                                      <div><b>Status:</b> {dn.status}</div>
                                      <div><b>Total:</b> {settings.currencySymbol}{convertCurrency(dn.total)}</div>
                                      <div><b>Products:</b>
                                        <ul style={{ marginBottom: 0 }}>
                                          {dn.products && dn.products.map((prod, idx) => (
                                            <li key={prod._id || idx}>
                                              {prod.product?.productName || ''} | Qty: {prod.returnQty} | Price: {settings.currencySymbol}{convertCurrency(prod.purchasePrice)}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div><b>Note:</b> {dn.extraInfo?.notes || '-'}</div>
                                    </div>
                                  )}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                          )
                    )}  */}
 {/* {purchase.debitNotes && purchase.debitNotes.length > 0 && (
  <tr key={purchase._id + '-debitnotes'}>
    <td colSpan={18} style={{ background: '#f9f9f9', padding: 0 }}>
      <div style={{ padding: '8px 0' }}>
        <b>Debit Notes:</b>
        <table className="table table-bordered mt-2 mb-0">
          <thead>
            <tr>
              <th>Debit Note ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Products</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {purchase.debitNotes.map((dn) => (
              <tr key={dn._id}>
                <td>
                  <a
                    href="#"
                    style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleDebitNote(purchase._id, dn._id);
                    }}
                  >
                    {dn.debitNoteId || dn._id}
                  </a>
                </td>
                <td>{dn.debitNoteDate ? new Date(dn.debitNoteDate).toLocaleDateString() : ''}</td>
                <td>{dn.status}</td>
                <td>
                  {settings.currencySymbol}
                  {dn.total}
                </td>
                <td>
                  {expandedDebitNote[purchase._id] === dn._id && dn.products && (
                    <ul className="mb-0">
                      {dn.products.map((prod, idx) => (
                        <li key={prod._id || idx}>
                          {prod.product?.productName || ''} | Qty: {prod.returnQty} | Price: {settings.currencySymbol}
                          {prod.purchasePrice}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td>{dn.extraInfo?.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </td>
  </tr>
)}  */}

                                 {/* {expandedDebitNote[purchase._id] === dn._id && dn.products && */}
         
                      </tr>
                       {Array.isArray(purchase.debitNotes) && purchase.debitNotes.length > 0 && expandedDebitNote[purchase._id] && (
            <tr>
              <td colSpan="16" style={{ background: "#f9f9f9" }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  Debit Notes (Returns)
                </div>
                <table className="table table-sm table-bordered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Debit Note ID</th>
                      <th>Date</th>
                       <th>Product</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Purchase Price</th>
                      <th>Discount</th>
                      <th>Discount Type</th>
                      <th>Discount Amount</th>
                      <th>Tax (%)</th>
                      <th>Tax Amount</th>
                      <th>Unit Cost</th>
                      <th>Total Cost</th>
                      <th>SubTotal</th>
                    </tr>
                  </thead>
                 
                       <tbody>
                        {purchase.debitNotes.map((note) =>
                          note.products?.length > 0 ? (
                            note.products.map((prod, idx) => (
                              <tr key={`${note._id}-${idx}`}>
                                <td>{note.debitNoteId}</td>
                                <td>
                                  {note.createdAt
                                    ? new Date(note.createdAt).toLocaleDateString()
                                    : "-"}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {prod.product?.images?.[0]?.url ? (
                                      <img
                                        src={prod.product.images[0].url}
                                        alt={prod.product?.productName || "Product"}
                                        style={{
                                          width: 28,
                                          height: 28,
                                          objectFit: "cover",
                                          borderRadius: 4,
                                          marginRight: 6,
                                        }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          width: 28,
                                          height: 28,
                                          background: "#e9ecef",
                                          borderRadius: 4,
                                          marginRight: 6,
                                        }}
                                      />
                                    )}
                                    <span>{prod.product?.productName || "-"}</span>
                                  </div>
                                </td>
                                <td>{prod.returnQty || prod.quantity || "-"}</td>
                                <td>{prod.Unit || "-"}</td>
                                <td>{prod.purchasePrice || "-"}</td>
                                <td>{prod.discount || "-"}</td>
                                <td>{prod.discountType || "-"}</td>
                                <td>{prod.discountAmount || "-"}</td>
                                <td>{prod.tax || "-"}</td>
                                <td>{prod.taxAmount || "-"}</td>
                                <td>{prod.lineTotal ? `₹${prod.lineTotal}` : "-"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr key={`${note._id}-empty`}>
                              <td>{note.creditNoteId}</td>
                              <td>
                                {note.createdAt
                                  ? new Date(note.createdAt).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td colSpan="4">No returned products</td>
                            </tr>
                          )
                        )}
                      </tbody> 
                    </table>
                  </td>
                </tr>
              )}
              </React.Fragment>

                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div
              className="d-flex justify-content-end gap-3"
              style={{ padding: "10px 20px" }}
            >

              <select
                className="form-select w-auto"
                value={perPage}
                onChange={e => { setPerPage(Number(e.target.value));
                  setPage(1);
                 }}
              >
                {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
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
                <span>Page {page} of {totalPages || 1}</span>

                {" "}
                <button
                  style={{
                    border: "none",
                    color: "grey",
                    backgroundColor: "white",
                  }}
                  onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                  <GrFormPrevious />
                </button>{" "}
                <button
                  style={{ border: "none", backgroundColor: "white" }}
                  onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                  <MdNavigateNext />
                </button>
              </span>
            </div>

            {/* <div className="d-flex justify-content-between align-items-center p-2 mb-0">
              <div>Page {page} of {totalPages}</div>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
              </div>
            </div> */}
          </div>
        </div>

        {/* <AddPurchaseModal /> */}
  <AddPurchaseModal onSuccess={fetchPurchases} />
        {/* <EditPurchaseModal /> */}
        <EditPurchaseModal editData={selectedPurchase} onUpdate={fetchPurchases} />
        <AddDebitNoteModals purchaseData={selectedReturnData} onReturnCreated={fetchPurchases} />

        <div className="modal fade" id="view-purchase" tabIndex="-1" aria-labelledby="viewPurchaseLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="viewPurchaseLabel">View Purchase Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {viewPurchaseId && (
                  <ViewPurchase purchase={purchases.find(p => p._id === viewPurchaseId)} purchaseId={viewPurchaseId} />
                )}
              </div>

             {/* <AddDebitNoteModals purchaseData={selectedReturnData} onReturnCreated={fetchPurchases} /> */}
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Purchase;



// import React, { useEffect, useState } from "react";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { TbChevronUp, TbEdit, TbRefresh, TbTrash } from "react-icons/tb";
// import { Link } from "react-router-dom";
// import AddPurchaseModal from "../../../../pages/Modal/PurchaseModals/AddPurchaseModal";
// import { CiCirclePlus } from "react-icons/ci";
// import EditPurchaseModal from "../../../../pages/Modal/PurchaseModals/EditPurchaseModal";
// import axios from "axios";
// import BASE_URL from "../../../../pages/config/config";
// import { useSettings } from "../../../../Context/purchase/PurchaseContext";

// const Purchase = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [filters, setFilters] = useState({
//     search: "",
//     startDate: "",
//     endDate: "",
//     status: "",
//   });
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const { settings } = useSettings();

//   const fetchPurchases = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/purchases`, {
//         params: {
//           ...filters,
//           page,
//           limit: 10,
//         },
//       });
//       setPurchases(res.data.purchases);
//       setTotalPages(res.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching purchases:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPurchases();
//   }, [filters, page]);

//   useEffect(() => {
//     fetchPurchases();
//   }, [filters, page]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setPage(1); // reset to page 1 on filter change
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };


//   const convertCurrency = (value) => {
//     const rate = settings.conversionRates?.[settings.currencyCode] || 1;
//     return (value * rate).toFixed(2);
//   };
//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">Purchase</h4>
//               <h6>Manage your purchases</h6>
//             </div>
//           </div>
//           <div className="table-top-head me-2">
//             <li>
//               <button type="button" className="icon-btn" title="Pdf">
//                 <FaFilePdf />
//               </button>
//             </li>
//             <li>
//               <label className="icon-btn m-0" title="Import Excel">
//                 <input type="file" accept=".xlsx, .xls" hidden />
//                 <FaFileExcel style={{ color: "green" }} />
//               </label>
//             </li>
//             <li>
//               <button type="button" className="icon-btn" title="Export Excel">
//                 <FaFileExcel />
//               </button>
//             </li>
//           </div>

//           <div className="d-flex gap-2">
//             <a
//               className="btn btn-primary"
//               data-bs-toggle="modal"
//               data-bs-target="#add-purchase"
//             >
//               <CiCirclePlus className="me-1" />
//               Add Purchase
//             </a>
//             <a
//               className="btn btn-secondary"
//               data-bs-toggle="modal"
//               data-bs-target="#view-notes"
//             >
//               <i data-feather="download" className="me-2" />
//               Import Purchase
//             </a>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header  justify-content-between flex-wrap gap-3">
//             <div className="row ">
//               <div className="col-md-3">
//                 <input
//                   type="text"
//                   name="search"
//                   className="form-control"
//                   placeholder="Search by product, supplier, or reference"
//                   value={filters.search}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   type="date"
//                   name="startDate"
//                   className="form-control"
//                   value={filters.startDate}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   type="date"
//                   name="endDate"
//                   className="form-control"
//                   value={filters.endDate}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <select
//                   name="status"
//                   className="form-select"
//                   value={filters.status}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">All Status</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Received">Received</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable text-center align-middle">

//                 <thead className="thead-light text-center">
//                   <tr>
//                     <th>
//                       <label className="checkboxs">
//                         <input type="checkbox" />
//                         <span className="checkmarks" />
//                       </label>
//                     </th>
//                     <th>Supplier</th>
//                     <th>Reference</th>
//                     <th>Date</th>
//                     <th>Products</th>
//                     <th>Qyt</th>
//                     <th>Purchase Price</th>
//                     <th>Discount</th>
//                     <th>Tax(%)</th>
//                     <th>Tax Amount</th>
//                     <th>Shipping Charge</th>
//                     <th>Extra Expense</th>
//                     <th>Unit cost</th>
//                     <th>Total cost</th>
//                     <th>Status</th>
//                     <th>Created By</th>
//                     <th>Updated By</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchases.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" className="text-center">
//                         No purchases found.
//                       </td>
//                     </tr>
//                   ) : (
//                     purchases.map((purchase) => (
//                       <tr key={purchase._id}>
//                         <td>
//                           <label className="checkboxs">
//                             <input type="checkbox" />
//                             <span className="checkmarks" />
//                           </label>
//                         </td>
//                         <td>
//                           {purchase.supplier
//                             ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}`
//                             : "N/A"}
//                         </td>
//                         <td>{purchase.referenceNumber}</td>
//                         <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>

//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {p.product?.productName} - {p.quantity} × {settings.currencySymbol}{convertCurrency(p.purchasePrice)}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {p.quantity}  {p.unit}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {p.purchasePrice}₹
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {p.discount} ₹
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {p.tax} %
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {/* {p.taxAmount} ₹ */}
//                                 ₹{p.taxAmount || ((p.afterDiscount * p.tax) / 100 || "0.00")}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>{purchase.shippingCost}</td>
//                         <td>{purchase.orderTax}</td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>₹{p.unitCost?.toFixed(2) || '0.00'}</li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>₹{p.totalCost?.toFixed(2) || '0.00'}</li>
//                             ))}
//                           </ul>
//                         </td>



//                         <td>
//                           <span className={`badge ${purchase.status === "Pending" ? "bg-warning" : "bg-success"}`}>
//                             {purchase.status}
//                           </span>
//                         </td>



//                         <td>{purchase.createdBy ? `${purchase.createdBy.name} (${purchase.createdBy.email})` : '-'}</td>
//                         <td>{purchase.updatedBy ? `${purchase.updatedBy.name} (${purchase.updatedBy.email})` : '-'}</td>
//                         <td className="action-table-data">
//                           <div className="edit-delete-action">
//                             <a
//                               className="me-2 p-2"
//                               data-bs-toggle="modal"
//                               data-bs-target="#edit-purchase"
//                             >
//                               <TbEdit />
//                             </a>

//                             <a
//                               className="p-2"

//                             >
//                               <TbTrash />
//                             </a>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>

//               </table>
//             </div>
//             {/* Pagination */}
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div>Page {page} of {totalPages}</div>
//               <div className="btn-group">
//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={() => handlePageChange(page - 1)}
//                   disabled={page === 1}
//                 >
//                   Prev
//                 </button>
//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={() => handlePageChange(page + 1)}
//                   disabled={page === totalPages}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>

//         </div>
//         <AddPurchaseModal />
//         <EditPurchaseModal />
//       </div>
//     </div>
//   );
// };

// export default Purchase;



// mid code
// import React, { useEffect, useState } from "react";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { TbChevronUp, TbEdit, TbRefresh, TbTrash, TbEye, TbDots } from "react-icons/tb";
// import { Link, useNavigate } from "react-router-dom";
// import AddPurchaseModal from "../../../../pages/Modal/PurchaseModals/AddPurchaseModal";
// import { CiCirclePlus } from "react-icons/ci";
// import EditPurchaseModal from "../../../../pages/Modal/PurchaseModals/EditPurchaseModal";
// import axios from "axios";
// import BASE_URL from "../../../../pages/config/config";
// import { useSettings } from "../../../../Context/purchase/PurchaseContext";
// import ViewPurchase from "../../../../pages/Modal/PurchaseModals/ViewPurchase";
// // import { useSettings } from "../../../../Context/purchase/PurchaseContext";
// // import "../../../../styles/purchase/product.css"
// import "../../../../styles/product/product.css"
// import AddDebitNoteModals from "../../../../pages/Modal/debitNoteModals/AddDebitNoteModals";
// import * as XLSX from "xlsx";
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';


// const Purchase = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [viewPurchaseId, setViewPurchaseId] = useState(null);

//     const [selectedReturnData, setSelectedReturnData] = useState(null);

// // Export all table data to Excel
//   // const handleExportExcel = () => {
//   //   if (!purchases.length) return;
//   //   const rows = [];
//   //   purchases.forEach((purchase) => {
//   //     purchase.products.forEach((p, idx) => {
//   //       rows.push({
//   //         Supplier: purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A",
//   //         Reference: purchase.referenceNumber,
//   //         Date: new Date(purchase.purchaseDate).toLocaleDateString(),
//   //         Product: p.product?.productName || "",
//   //         Quantity: p.quantity,
//   //         Unit: p.unit,
//   //         PurchasePrice: p.purchasePrice,
//   //         Discount: p.discount,
//   //         Tax: p.tax,
//   //         TaxAmount: p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
//   //         ShippingCost: purchase.shippingCost,
//   //         ExtraExpense: purchase.orderTax,
//   //         UnitCost: p.unitCost,
//   //         TotalCost: p.totalCost,
//   //         Status: purchase.status,
//   //       });
//   //     });
//   //   });
//   //   const ws = XLSX.utils.json_to_sheet(rows);
//   //   const wb = XLSX.utils.book_new();
//   //   XLSX.utils.book_append_sheet(wb, ws, "Purchases");
//   //   XLSX.writeFile(wb, "purchases.xlsx");
//   // };
//   // Delete purchase
//   const handleDeletePurchase = async (purchaseId, referenceNumber) => {
    
//     if (!window.confirm(`Are you sure you want to delete purchase ${referenceNumber}?`)) return;
//     try {
//       await axios.delete(`${BASE_URL}/api/purchases/${purchaseId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPurchases((prev) => prev.filter((p) => p._id !== purchaseId));
//       // Optionally show a toast or alert
//       // alert('Purchase deleted successfully');
//     } catch (error) {
//       alert('Failed to delete purchase');
//     }
//   };


//   // final Export all table data to PDF
// const handleExportPDF = () => {
//   if (!selectedRows.length) return;

//   const selectedPurchases = purchases.filter((purchase) =>
//     selectedRows.includes(purchase._id)
//   );

//   const doc = new jsPDF("l", "pt", "a4");

//   const columns = [
//     "Supplier",
//     "Reference",
//     "Date",
//     "Product",
//     "Quantity",
//     "Unit",
//     "PurchasePrice",
//     "Discount",
//     "Tax",
//     "TaxAmount",
//     "ShippingCost",
//     "ExtraExpense",
//     "UnitCost",
//     "TotalCost",
//     "Status",
//     "Created By",
//     "Updated By"
//   ];

//   const rows = [];

//   selectedPurchases.forEach((purchase) => {
//     purchase.products.forEach((p) => {
//       rows.push([
//         purchase.supplier
//           ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}`
//           : "N/A",
//         purchase.referenceNumber,
//         new Date(purchase.purchaseDate).toLocaleDateString(),
//         p.product?.productName || "",
//         p.quantity,
//         p.unit,
//         p.purchasePrice,
//         p.discount,
//         p.tax,
//         p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
//         purchase.shippingCost,
//         purchase.orderTax,
//         p.unitCost.toFixed(2),
//         p.totalCost.toFixed(2),
//         purchase.status,
//         purchase.createdBy ? `${purchase.createdBy.name} (${purchase.createdBy.email})` : "-",
//         purchase.updatedBy ? `${purchase.updatedBy.name} (${purchase.updatedBy.email})` : "-"
//       ]);
//     });
//   });

//   if (!rows.length) return;

//   doc.text("Purchases", 40, 30);

//   // Use autoTable as a standalone function (NOT doc.autoTable)
//   autoTable(doc, {
//     head: [columns],
//     body: rows,
//     startY: 40,
//     styles: { fontSize: 7 },
//     margin: { left: 20, right: 20 }
//   });

//   doc.save("selected_purchases.pdf");
// };

  
//   // final Export only selected rows to Excel
//   const handleExportExcel = () => {
//     if (!selectedRows.length) return;
//     const selectedPurchases = purchases.filter((purchase) =>
//       selectedRows.includes(purchase._id)
//     );
//     const rows = [];
//     selectedPurchases.forEach((purchase) => {
//       purchase.products.forEach((p) => {
//         rows.push({
//           Supplier: purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A",
//           Reference: purchase.referenceNumber,
//           Date: new Date(purchase.purchaseDate).toLocaleDateString(),
//           Product: p.product?.productName || "",
//           Quantity: p.quantity,
//           Unit: p.unit,
//           PurchasePrice: p.purchasePrice,
//           Discount: p.discount,
//           Tax: p.tax,
//           TaxAmount: p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
//           ShippingCost: purchase.shippingCost,
//           ExtraExpense: purchase.orderTax,
//           UnitCost: p.unitCost.toFixed(2),
//           TotalCost: p.totalCost.toFixed(2),
//           Status: purchase.status,
//           CreatedBy: purchase.createdBy ? `${purchase.createdBy.name} (${purchase.createdBy.email})` : "-",
//           UpdatedBy: purchase.updatedBy ? `${purchase.updatedBy.name} (${purchase.updatedBy.email})` : "-"
//         });
//       });
//     });
//     if (!rows.length) return;
//     const ws = XLSX.utils.json_to_sheet(rows);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Purchases");
//     XLSX.writeFile(wb, "selected_purchases.xlsx");
//   };

  

//  const [selectedRows, setSelectedRows] = useState([]); // For row selection

//   // Handle select all
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       // Select all visible purchase IDs
//       setSelectedRows(purchases.map((purchase) => purchase._id));
//     } else {
//       setSelectedRows([]);
//     }
//   };

//   // Handle single row select
//   const handleSelectRow = (purchaseId) => {
//     setSelectedRows((prev) =>
//       prev.includes(purchaseId)
//         ? prev.filter((id) => id !== purchaseId)
//         : [...prev, purchaseId]
//     );
//   };

  
//     const handleConvertToReturn = (purchase) => {
//       setSelectedReturnData(purchase);
//       const returnModal = new window.bootstrap.Modal(document.getElementById("add-return-debit-note"));
//       returnModal.show();
//     };

   

    

//   // console.log("Purchase component rendered", purchases);

//   const [filters, setFilters] = useState({
//     search: "",
//     startDate: "",
//     endDate: "",
//     status: "",
//   });
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const { settings } = useSettings();
//   const navigate = useNavigate(); // 👈 inside the component
// const token = localStorage.getItem("token");


//   // const fetchPurchases = async () => {
//   //   try {
//   //     const res = await axios.get(`${BASE_URL}/api/purchases`, {
//   //       params: {
//   //         ...filters,
//   //         page,
//   //         limit: 10,
//   //       },
//   //     });
//   //     setPurchases(res.data.purchases);
//   //     setTotalPages(res.data.totalPages);
//   //   } catch (error) {
//   //     console.error("Error fetching purchases:", error);
//   //   }
//   // };
//   const fetchPurchases = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/purchases`, {
//         params: {
//           ...filters,
//           // status: "Received",  // force only received
//           page,
//           limit: 10,
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPurchases(res.data.purchases);
//       setTotalPages(res.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching purchases:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPurchases();
//   }, [filters, page]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   // const convertCurrency = (value) => {
//   //   const rate = settings.conversionRates?.[settings.currencyCode] || 1;
//   //   return (value * rate).toFixed(2);
//   // };
//   const convertCurrency = (value) => {
//     if (!settings.conversionRates || !settings.baseCurrency) return value?.toFixed(2) || "0.00";

//     const baseToSelectedRate = settings.conversionRates[settings.currencyCode] || 1;
//     const baseToBaseRate = settings.conversionRates[settings.baseCurrency] || 1;

//     const converted = (value / baseToBaseRate) * baseToSelectedRate;
//     return converted.toFixed(2);
//   };
//   // New: handle edit button click — set selected purchase and open modal
//   const handleEditClick = (purchase) => {
//     setSelectedPurchase(purchase);
//     // Open modal programmatically since React doesn’t auto open with state change
//     const editModal = new window.bootstrap.Modal(document.getElementById("edit-purchase"));
//     editModal.show();
//   };
//   const [selectedPurchase, setSelectedPurchase] = useState(null);

//   const [activeSection, setActiveSection] = useState(
//     sessionStorage.getItem("activeSection") || "personalInfo"
//   );
//   useEffect(() => {
//     sessionStorage.setItem("activeSection", activeSection);
//   }, [activeSection]);

//   // Function to handle section toggling
//   const onToggleSection = (section) => {
//     setActiveSection(section);
//   };




  

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">Purchase</h4>
//               <h6>Manage your purchases</h6>
//             </div>
//           </div>
//           {/* <div className="table-top-head d-flex align-items-center gap-2 flex-wrap">
//             <button
//               className={`btn btn-outline-primary ${filters.status === "" ? "active" : ""}`}
//               onClick={() => {
//                 setFilters((prev) => ({ ...prev, status: "" }));
//                 setPage(1);
//               }}
//             >
//               All
//             </button>

//             <button
//               className={`btn btn-outline-warning ${filters.status === "Pending" ? "active" : ""}`}
//               onClick={() => {
//                 setFilters((prev) => ({ ...prev, status: "Pending" }));
//                 setPage(1);
//               }}
//             >
//               Pending
//             </button>

//             <button
//               className={`btn btn-outline-success ${filters.status === "Received" ? "active" : ""}`}
//               onClick={() => {
//                 setFilters((prev) => ({ ...prev, status: "Received" }));
//                 setPage(1);
//               }}
//             >
//               Received
//             </button>

//             <button
//               className={`btn btn-outline-info ${filters.status === "Ordered" ? "active" : ""}`}
//               onClick={() => {
//                 setFilters((prev) => ({ ...prev, status: "Ordered" }));
//                 setPage(1);
//               }}
//             >
//               Purchase Orders
//             </button>

//             <button
//               className="btn btn-dark"
//               onClick={() => navigate("/stock-history")}
//             >
//               Stock History
//             </button>
//           </div> */}

//           <div className="table-top-head me-2">
//             <li onClick={handleExportPDF}><button type="button" className="icon-btn" title="Pdf"><FaFilePdf /></button></li>
//             <li><label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls" hidden /><FaFileExcel style={{ color: "green" }} /></label></li>
//             <li onClick={handleExportExcel}><button type="button" className="icon-btn" title="Export Excel" ><FaFileExcel /></button></li>
//           </div>


//           <div className="d-flex gap-2">
//             <a className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-purchase"><CiCirclePlus className="me-1" />Add Purchase</a>
//             {/* <a className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#view-notes"><i data-feather="download" className="me-2" />Import Purchase</a> */}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header  justify-content-between flex-wrap gap-3">
//             <div className="row ">
//               <div className="col-md-3">
//                 <input type="text" name="search" className="form-control" placeholder="Search by product, supplier, or reference" value={filters.search} onChange={handleInputChange} />
//               </div>
//               <div className="col-md-3">
//                 <input type="date" name="startDate" className="form-control" value={filters.startDate} onChange={handleInputChange} />
//               </div>
//               <div className="col-md-3">
//                 <input type="date" name="endDate" className="form-control" value={filters.endDate} onChange={handleInputChange} />
//               </div>
//               <div className="col-md-3">
//                 <select name="status" className="form-select" value={filters.status} onChange={handleInputChange}>
//                   <option value="">All Status</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Received">Received</option>
//                   <option value="Ordered">Ordered</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable text-center align-middle">
//                 <thead className="thead-light text-center">
//                   <tr>
//                     <th><label className="checkboxs">
//                       {/* <input type="checkbox" /> */}
//                       <input
//                         type="checkbox"
//                         checked={purchases.length > 0 && selectedRows.length === purchases.length}
//                         onChange={handleSelectAll}
//                         indeterminate={selectedRows.length > 0 && selectedRows.length < purchases.length ? "indeterminate" : undefined}
//                       />
//                       <span className="checkmarks" /></label></th>
//                     <th>Supplier</th>
//                     <th>Reference</th>
//                     <th>Date</th>
//                     <th>Products</th>
//                     <th>Qyt</th>
//                     <th>Purchase Price</th>
//                     <th>Discount</th>
//                     <th>Tax(%)</th>
//                     <th>Tax Amount</th>
//                     <th>Shipping Charge</th>
//                     <th>Extra Expense</th>
//                     <th>Unit cost</th>
//                     <th>Total cost</th>
//                     <th>Status</th>
//                      <th>Created By</th>
//                     <th>Updated By</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchases.length === 0 ? (
//                     <tr><td colSpan="16" className="text-center">No purchases found.</td></tr>
//                   ) : (
//                     purchases.map((purchase) => (
//                       <tr key={purchase._id}>
//                         <td><label className="checkboxs"><input type="checkbox" /><span className="checkmarks" /></label></td>
//                         <td>{purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A"}</td>
//                         <td>{purchase.referenceNumber}</td>
//                         <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
//                         <td>
//                           <ul>{purchase.products.map((p, idx) => (
//                             <li key={idx}>{p.product?.productName} 
//                             {/* - {p.quantity} × {settings.currencySymbol}{convertCurrency(p.purchasePrice)} */}
//                             </li>
//                           ))}</ul>
//                         </td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{p.quantity} {p.unit}</li>))}</ul></td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.purchasePrice)}</li>))}</ul></td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.discount)}</li>))}</ul></td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{p.tax} %</li>))}</ul></td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0))}</li>))}</ul></td>
//                         <td>{settings.currencySymbol}{convertCurrency(purchase.shippingCost)}</td>
//                         <td>{settings.currencySymbol}{convertCurrency(purchase.orderTax)}</td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.unitCost)}</li>))}</ul></td>
//                         <td><ul>{purchase.products.map((p, idx) => (<li key={idx}>{settings.currencySymbol}{convertCurrency(p.totalCost)}</li>))}</ul></td>
//                         <td>
//                           {/* <span className={`badge ${purchase.status === "Pending" ? "bg-warning" : "bg-success"}`}>{purchase.status}</span> */}
//                            <span
//     className={`badge ${
//       purchase.status === "Pending"
//         ? "bg-warning text-dark" // Yellow badge with dark text
//         : purchase.status === "Received"
//         ? "bg-success" // Green badge
//         : purchase.status === "Ordered"
//         ? "bg-primary" // Blue badge
//         : "bg-secondary" // Fallback if none match
//     }`}
//   >
//     {purchase.status}
//   </span>
//                           </td>
//                          <td>{purchase.createdBy ? `${purchase.createdBy.name}` : '--'}</td>
//                        <td>{purchase.updatedBy ? `${purchase.updatedBy.name} ` : '--'}</td>
//                           <td class="action-item">
//                           <a href="" data-bs-toggle="dropdown">
//                             <TbDots/>
//                           </a>
//                           <ul class="dropdown-menu">
//                             <li>
//                               <a class="dropdown-item d-flex align-items-center" onClick={() => handleEditClick(purchase)}><TbEdit className="me-2" />Edit</a>
//                             </li>
//                             <li>
//                               <a className="dropdown-item d-flex align-items-center" onClick={() => handleDeletePurchase(purchase._id, purchase.referenceNumber)}><TbTrash className="me-2" />Delete</a>
//                             </li>
//                             <li>
//                               <a  class="dropdown-item d-flex align-items-center" onClick={() => setViewPurchaseId(purchase._id)}><TbEye class="isax isax-send-2 me-2"/>View </a>
//                             </li>
//                             <li>
//                               {/* <a href="" class="dropdown-item d-flex align-items-center"><i class="isax isax-document-download me-2"></i>Download Invoices as PDF</a> */}
//                             </li>
//                             <li>
//                               <a className="dropdown-item d-flex align-items-center" onClick={() => handleConvertToReturn(purchase)}><i className="isax isax-convert me-2"></i>Convert to Purchase Return</a>
//                             </li>
//                             <li>
//                             </li>
//                           </ul>
//                         </td>
//                         {/* <td className="action-table-data">

//                           <div className="edit-delete-action">
//                             <a className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-purchase" onClick={() => handleEditClick(purchase)}><TbEdit /></a>
//                             <a className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#view-purchase" onClick={() => setViewPurchaseId(purchase._id)}><TbEye /></a>
//                             <a className="p-2"><TbTrash /></a>
//                           </div>
//                         </td> */}
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="d-flex justify-content-between align-items-center p-2 mb-0">
//               <div>Page {page} of {totalPages}</div>
//               <div className="btn-group">
//                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</button>
//                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* <AddPurchaseModal /> */}
//   <AddPurchaseModal onSuccess={fetchPurchases} />
//         {/* <EditPurchaseModal /> */}
//         <EditPurchaseModal editData={selectedPurchase} onUpdate={fetchPurchases} />
//         <AddDebitNoteModals purchaseData={selectedReturnData} onReturnCreated={fetchPurchases} />

//         <div className="modal fade" id="view-purchase" tabIndex="-1" aria-labelledby="viewPurchaseLabel" aria-hidden="true">
//           <div className="modal-dialog modal-xl modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title" id="viewPurchaseLabel">View Purchase Details</h5>
//                 <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//               </div>
//               <div className="modal-body">
//                 {viewPurchaseId && (
//                   <ViewPurchase purchase={purchases.find(p => p._id === viewPurchaseId)} purchaseId={viewPurchaseId} />
//                 )}
//               </div>

//              {/* <AddDebitNoteModals purchaseData={selectedReturnData} onReturnCreated={fetchPurchases} /> */}
              
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Purchase;


// old code
// import React, { useEffect, useState } from "react";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { TbChevronUp, TbEdit, TbRefresh, TbTrash } from "react-icons/tb";
// import { Link } from "react-router-dom";
// import AddPurchaseModal from "../../../../pages/Modal/PurchaseModals/AddPurchaseModal";
// import { CiCirclePlus } from "react-icons/ci";
// import EditPurchaseModal from "../../../../pages/Modal/PurchaseModals/EditPurchaseModal";
// import axios from "axios";
// import BASE_URL from "../../../../pages/config/config";
// import { useSettings } from "../../../../Context/purchase/PurchaseContext";

// const Purchase = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [filters, setFilters] = useState({
//     search: "",
//     startDate: "",
//     endDate: "",
//     status: "",
//   });
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const { settings } = useSettings();

//   const fetchPurchases = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/purchases`, {
//         params: {
//           ...filters,
//           page,
//           limit: 10,
//         },
//       });
//       setPurchases(res.data.purchases);
//       setTotalPages(res.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching purchases:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPurchases();
//   }, [filters, page]);

//   useEffect(() => {
//     fetchPurchases();
//   }, [filters, page]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setPage(1); // reset to page 1 on filter change
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };


//   const convertCurrency = (value) => {
//     const rate = settings.conversionRates?.[settings.currencyCode] || 1;
//     return (value * rate).toFixed(2);
//   };
//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">Purchase</h4>
//               <h6>Manage your purchases</h6>
//             </div>
//           </div>
//           <div className="table-top-head me-2">
//             <li>
//               <button type="button" className="icon-btn" title="Pdf">
//                 <FaFilePdf />
//               </button>
//             </li>
//             <li>
//               <label className="icon-btn m-0" title="Import Excel">
//                 <input type="file" accept=".xlsx, .xls" hidden />
//                 <FaFileExcel style={{ color: "green" }} />
//               </label>
//             </li>
//             <li>
//               <button type="button" className="icon-btn" title="Export Excel">
//                 <FaFileExcel />
//               </button>
//             </li>
//           </div>

//           <div className="d-flex gap-2">
//             <a
//               className="btn btn-primary"
//               data-bs-toggle="modal"
//               data-bs-target="#add-purchase"
//             >
//               <CiCirclePlus className="me-1" />
//               Add Purchase
//             </a>
//             <a
//               className="btn btn-secondary"
//               data-bs-toggle="modal"
//               data-bs-target="#view-notes"
//             >
//               <i data-feather="download" className="me-2" />
//               Import Purchase
//             </a>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header  justify-content-between flex-wrap gap-3">
//             <div className="row ">
//               <div className="col-md-3">
//                 <input
//                   type="text"
//                   name="search"
//                   className="form-control"
//                   placeholder="Search by product, supplier, or reference"
//                   value={filters.search}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   type="date"
//                   name="startDate"
//                   className="form-control"
//                   value={filters.startDate}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <input
//                   type="date"
//                   name="endDate"
//                   className="form-control"
//                   value={filters.endDate}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <select
//                   name="status"
//                   className="form-select"
//                   value={filters.status}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">All Status</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Received">Received</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable text-center align-middle">

//                 <thead className="thead-light text-center">
//                   <tr>
//                     <th>
//                       <label className="checkboxs">
//                         <input type="checkbox" />
//                         <span className="checkmarks" />
//                       </label>
//                     </th>
//                     <th>Supplier</th>
//                     <th>Reference</th>
//                     <th>Date</th>
//                     <th>Products</th>
//                     <th>Qyt</th>
//                     <th>Purchase Price</th>
//                     <th>Discount</th>
//                     <th>Tax(%)</th>
//                     <th>Tax Amount</th>
//                     <th>Shipping Charge</th>
//                     <th>Extra Expense</th>
//                     <th>Unit cost</th>
//                     <th>Total cost</th>
//                     <th>Status</th>
//                     <th>Created By</th>
//                     <th>Updated By</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchases.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" className="text-center">
//                         No purchases found.
//                       </td>
//                     </tr>
//                   ) : (
//                     purchases.map((purchase) => (
//                       <tr key={purchase._id}>
//                         <td>
//                           <label className="checkboxs">
//                             <input type="checkbox" />
//                             <span className="checkmarks" />
//                           </label>
//                         </td>
//                         <td>
//                           {purchase.supplier
//                             ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}`
//                             : "N/A"}
//                         </td>
//                         <td>{purchase.referenceNumber}</td>
//                         <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>

//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {p.product?.productName} - {p.quantity} × {settings.currencySymbol}{convertCurrency(p.purchasePrice)}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {p.quantity}  {p.unit}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {p.purchasePrice}₹
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {p.discount} ₹
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {p.tax} %
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>
//                                 {/* {p.taxAmount} ₹ */}
//                                 ₹{p.taxAmount || ((p.afterDiscount * p.tax) / 100 || "0.00")}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>{purchase.shippingCost}</td>
//                         <td>{purchase.orderTax}</td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>₹{p.unitCost?.toFixed(2) || '0.00'}</li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td>
//                           <ul>
//                             {purchase.products.map((p, idx) => (
//                               <li key={idx}>₹{p.totalCost?.toFixed(2) || '0.00'}</li>
//                             ))}
//                           </ul>
//                         </td>



//                         <td>
//                           <span className={`badge ${purchase.status === "Pending" ? "bg-warning" : "bg-success"}`}>
//                             {purchase.status}
//                           </span>
//                         </td>



//                         <td>{purchase.createdBy ? `${purchase.createdBy.name} (${purchase.createdBy.email})` : '-'}</td>
//                         <td>{purchase.updatedBy ? `${purchase.updatedBy.name} (${purchase.updatedBy.email})` : '-'}</td>
//                         <td className="action-table-data">
//                           <div className="edit-delete-action">
//                             <a
//                               className="me-2 p-2"
//                               data-bs-toggle="modal"
//                               data-bs-target="#edit-purchase"
//                             >
//                               <TbEdit />
//                             </a>

//                             <a
//                               className="p-2"

//                             >
//                               <TbTrash />
//                             </a>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>

//               </table>
//             </div>
//             {/* Pagination */}
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div>Page {page} of {totalPages}</div>
//               <div className="btn-group">
//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={() => handlePageChange(page - 1)}
//                   disabled={page === 1}
//                 >
//                   Prev
//                 </button>
//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={() => handlePageChange(page + 1)}
//                   disabled={page === totalPages}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>

//         </div>
//         <AddPurchaseModal />
//         <EditPurchaseModal />
//       </div>
//     </div>
//   );
// };

// export default Purchase;



// import React, { useEffect, useState } from "react";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { TbChevronUp, TbEdit, TbRefresh, TbTrash, TbEye, TbDots } from "react-icons/tb";
// import { Link, useNavigate } from "react-router-dom";
// import AddPurchaseModal from "../../../../pages/Modal/PurchaseModals/AddPurchaseModal";
// import { CiCirclePlus } from "react-icons/ci";
// import EditPurchaseModal from "../../../../pages/Modal/PurchaseModals/EditPurchaseModal";
// import axios from "axios";
// import BASE_URL from "../../../../pages/config/config";
// import { useSettings } from "../../../../Context/purchase/PurchaseContext";
// import ViewPurchase from "../../../../pages/Modal/PurchaseModals/ViewPurchase";
// // import { useSettings } from "../../../../Context/purchase/PurchaseContext";
// // import "../../../../styles/purchase/product.css"
// import "../../../../styles/product/product.css"
// import AddDebitNoteModals from "../../../../pages/Modal/debitNoteModals/AddDebitNoteModals";
// import * as XLSX from "xlsx";
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { GrFormPrevious } from "react-icons/gr";
// import { MdNavigateNext } from "react-icons/md";
// import { toast } from "react-toastify";
// import DeleteAlert from "../../../../utils/sweetAlert/DeleteAlert";


// const Purchase = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [viewPurchaseId, setViewPurchaseId] = useState(null);

//     const [selectedReturnData, setSelectedReturnData] = useState(null);


//     const isFullyReturned = (purchase) => {
//         if (!Array.isArray(purchase.products) || purchase.products.length === 0) return false;
//         return purchase.products.every(prod => {
//           let totalReturnedQty = 0;
//           if (Array.isArray(purchase.debitNotes)) {
//             purchase.debitNotes.forEach(note => {
//               if (Array.isArray(note.products)) {
//                 note.products.forEach(retProd => {
//                   const prodId = prod.product?._id || prod.product?._id || prod._id;
//                   const retProdId = retProd.product?._id || retProd.productId || retProd._id;
//                   if (prodId && retProdId && prodId === retProdId) {
//                     totalReturnedQty += Number(retProd.returnQty || 0);
//                   }
//                 });
//               }
//             });
//           }
//           return Number(prod.quantity || 0) <= totalReturnedQty;
//         });
//       };
    
//          const handleConvertToReturn = (purchase) => {
//           if (isFullyReturned(purchase)) return;
//           setSelectedReturnData(purchase);
//           const returnModal = new window.bootstrap.Modal(document.getElementById("add-return-debit-note"));
//           returnModal.show();
//         };

// // Export all table data to Excel
//   // const handleExportExcel = () => {
//   //   if (!purchases.length) return;
//   //   const rows = [];
//   //   purchases.forEach((purchase) => {
//   //     purchase.products.forEach((p, idx) => {
//   //       rows.push({
//   //         Supplier: purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A",
//   //         Reference: purchase.referenceNumber,
//   //         Date: new Date(purchase.purchaseDate).toLocaleDateString(),
//   //         Product: p.product?.productName || "",
//   //         Quantity: p.quantity,
//   //         Unit: p.unit,
//   //         PurchasePrice: p.purchasePrice,
//   //         Discount: p.discount,
//   //         Tax: p.tax,
//   //         TaxAmount: p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
//   //         ShippingCost: purchase.shippingCost,
//   //         ExtraExpense: purchase.orderTax,
//   //         UnitCost: p.unitCost,
//   //         TotalCost: p.totalCost,
//   //         Status: purchase.status,
//   //       });
//   //     });
//   //   });
//   //   const ws = XLSX.utils.json_to_sheet(rows);
//   //   const wb = XLSX.utils.book_new();
//   //   XLSX.utils.book_append_sheet(wb, ws, "Purchases");
//   //   XLSX.writeFile(wb, "purchases.xlsx");
//   // };
//   // Delete purchase
//   const handleDeletePurchase = async (purchaseId, referenceNumber) => {
//     const token = localStorage.getItem("token");
//     if (!window.confirm(`Are you sure you want to delete purchase ${referenceNumber}?`)) return;
//     try {
//       await axios.delete(`${BASE_URL}/api/purchases/${purchaseId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       // Check if we're deleting the last item on the current page
//       const remainingItemsOnPage = purchases.length - 1;
//       if (remainingItemsOnPage === 0 && page > 1) {
//         // If this is the last item on a page that's not the first page, go to previous page
//         setPage(page - 1);
//       } else {
//         // Otherwise, just refresh the current page
//         fetchPurchases();
//       }
      
//       toast.success(`Purchase ${referenceNumber} deleted successfully`);
//     } catch (error) {
//       toast.error('Failed to delete purchase');
//     }
//   };


//   // Export data to PDF (selected rows or all data)
// const handleExportPDF = async () => {
//   try {
//     let dataToExport = [];

//     if (selectedRows.length > 0) {
//       // Export selected rows
//       dataToExport = purchases.filter((purchase) =>
//         selectedRows.includes(purchase._id)
//       );
//     } else {
//       // Export all data by fetching from API without pagination
//       const res = await axios.get(`${BASE_URL}/api/purchases`, {
//         params: {
//           ...filters,
//           limit: 10000, // Large limit to get all data
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       dataToExport = res.data.purchases;
//     }

//     if (!dataToExport.length) {
//       toast.error('No data to export');
//       return;
//     }

//     const doc = new jsPDF("l", "pt", "a4");

//     const columns = [
//       "Supplier",
//       "Reference",
//       "Date",
//       "Product",
//       "Quantity",
//       "Unit",
//       "PurchasePrice",
//       "Discount",
//       "Tax",
//       "TaxAmount",
//       "ShippingCost",
//       "ExtraExpense",
//       "UnitCost",
//       "TotalCost",
//       "Status",
//       "Created By",
//       "Updated By"
//     ];

//     const rows = [];

//     dataToExport.forEach((purchase) => {
//       purchase.products.forEach((p) => {
//         rows.push([
//           purchase.supplier
//             ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}`
//             : "N/A",
//           purchase.referenceNumber,
//           new Date(purchase.purchaseDate).toLocaleDateString(),
//           p.product?.productName || "",
//           p.quantity,
//           p.unit,
//           p.purchasePrice,
//           p.discount,
//           p.tax,
//           p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
//           purchase.shippingCost,
//           purchase.orderTax,
//           p.unitCost.toFixed(2),
//           p.totalCost.toFixed(2),
//           purchase.status,
//           purchase.createdBy ? `${purchase.createdBy.name} (${purchase.createdBy.email})` : "-",
//           purchase.updatedBy ? `${purchase.updatedBy.name} (${purchase.updatedBy.email})` : "-"
//         ]);
//       });
//     });

//     doc.text("Purchases Report", 40, 30);

//     // Use autoTable as a standalone function
//     autoTable(doc, {
//       head: [columns],
//       body: rows,
//       startY: 50,
//       styles: { fontSize: 7 },
//       margin: { left: 20, right: 20 }
//     });

//     const filename = selectedRows.length > 0 ? "selected_purchases.pdf" : "all_purchases.pdf";
//     doc.save(filename);
    
//     toast.success(`PDF exported successfully (${rows.length} records)`);
//   } catch (error) {
//     console.error('Error exporting PDF:', error);
//     toast.error('Failed to export PDF');
//   }
// };

  
//   // Export data to Excel (selected rows or all data)
//   const handleExportExcel = async () => {
//     try {
//       let dataToExport = [];

//       if (selectedRows.length > 0) {
//         // Export selected rows
//         dataToExport = purchases.filter((purchase) =>
//           selectedRows.includes(purchase._id)
//         );
//       } else {
//         // Export all data by fetching from API without pagination
//         const res = await axios.get(`${BASE_URL}/api/purchases`, {
//           params: {
//             ...filters,
//             limit: 10000, // Large limit to get all data
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         dataToExport = res.data.purchases;
//       }

//       if (!dataToExport.length) {
//         toast.error('No data to export');
//         return;
//       }

//       const rows = [];
//       dataToExport.forEach((purchase) => {
//         purchase.products.forEach((p) => {
//           rows.push({
//             Supplier: purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A",
//             Reference: purchase.referenceNumber,
//             Date: new Date(purchase.purchaseDate).toLocaleDateString(),
//             Product: p.product?.productName || "",
//             Quantity: p.quantity,
//             Unit: p.unit,
//             PurchasePrice: p.purchasePrice,
//             Discount: p.discount,
//             Tax: p.tax,
//             TaxAmount: p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
//             ShippingCost: purchase.shippingCost,
//             ExtraExpense: purchase.orderTax,
//             UnitCost: p.unitCost.toFixed(2),
//             TotalCost: p.totalCost.toFixed(2),
//             Status: purchase.status,
//             CreatedBy: purchase.createdBy ? `${purchase.createdBy.name} (${purchase.createdBy.email})` : "-",
//             UpdatedBy: purchase.updatedBy ? `${purchase.updatedBy.name} (${purchase.updatedBy.email})` : "-"
//           });
//         });
//       });

//       const ws = XLSX.utils.json_to_sheet(rows);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Purchases");
      
//       const filename = selectedRows.length > 0 ? "selected_purchases.xlsx" : "all_purchases.xlsx";
//       XLSX.writeFile(wb, filename);
      
//       toast.success(`Excel exported successfully (${rows.length} records)`);
//     } catch (error) {
//       console.error('Error exporting Excel:', error);
//       toast.error('Failed to export Excel');
//     }
//   };

//   // Import data from Excel
//   const handleImportExcel = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//         if (!jsonData.length) {
//           toast.error('No data found in the Excel file');
//           return;
//         }

//         // Validate required columns
//         const requiredColumns = ['Supplier', 'Reference', 'Date', 'Product', 'Quantity', 'PurchasePrice'];
//         const firstRow = jsonData[0];
//         const missingColumns = requiredColumns.filter(col => !(col in firstRow));
        
//         if (missingColumns.length > 0) {
//           toast.error(`Missing required columns: ${missingColumns.join(', ')}`);
//           return;
//         }

//         // Process and validate data
//         const processedData = jsonData.map((row, index) => {
//           const errors = [];
          
//           if (!row.Supplier) errors.push('Supplier is required');
//           if (!row.Reference) errors.push('Reference is required');
//           if (!row.Product) errors.push('Product is required');
//           if (!row.Quantity || isNaN(row.Quantity)) errors.push('Valid quantity is required');
//           if (!row.PurchasePrice || isNaN(row.PurchasePrice)) errors.push('Valid purchase price is required');
          
//           if (errors.length > 0) {
//             toast.error(`Row ${index + 2}: ${errors.join(', ')}`);
//             return null;
//           }

//           return {
//             supplier: row.Supplier,
//             referenceNumber: row.Reference,
//             purchaseDate: row.Date ? new Date(row.Date) : new Date(),
//             product: row.Product,
//             quantity: Number(row.Quantity),
//             unit: row.Unit || 'pcs',
//             purchasePrice: Number(row.PurchasePrice),
//             discount: Number(row.Discount) || 0,
//             tax: Number(row.Tax) || 0,
//             shippingCost: Number(row.ShippingCost) || 0,
//             extraExpense: Number(row.ExtraExpense) || 0,
//             status: row.Status || 'Pending'
//           };
//         }).filter(Boolean);

//         if (processedData.length === 0) {
//           toast.error('No valid data to import');
//           return;
//         }

//         // Show confirmation dialog
//         const confirmImport = window.confirm(
//           `Found ${processedData.length} valid records to import. Do you want to proceed?`
//         );

//         if (confirmImport) {
//           // Here you would typically send the data to your API
//           // For now, we'll just show a success message
//           toast.success(`Successfully processed ${processedData.length} records. Note: Actual import to database needs to be implemented.`);
//           console.log('Processed data:', processedData);
          
//           // Refresh the purchases list
//           fetchPurchases();
//         }

//       } catch (error) {
//         console.error('Error importing Excel:', error);
//         toast.error('Failed to import Excel file. Please check the file format.');
//       }
//     };

//     reader.readAsArrayBuffer(file);
    
//     // Reset the file input
//     event.target.value = '';
//   };

//  const [selectedRows, setSelectedRows] = useState([]); // For row selection

//   // Handle select all for current page
//   const handleSelectAll = (e) => {
//     // Since purchases array already contains only current page data from API
//     const currentPageIds = purchases.map((purchase) => purchase._id);
    
//     if (e.target.checked) {
//       // Add current page IDs to selected rows
//       setSelectedRows((prev) => [...new Set([...prev, ...currentPageIds])]);
//     } else {
//       // Remove current page IDs from selected rows
//       setSelectedRows((prev) => prev.filter((id) => !currentPageIds.includes(id)));
//     }
//   };

//   // Handle single row select
//   const handleSelectRow = (purchaseId) => {
//     setSelectedRows((prev) =>
//       prev.includes(purchaseId)
//         ? prev.filter((id) => id !== purchaseId)
//         : [...prev, purchaseId]
//     );
//   };

//   // Bulk delete selected purchases
//   const handleBulkDelete = async () => {
//     if (selectedRows.length === 0) return;

//     const confirmed = await DeleteAlert({
//       title: "Are you sure?",
//       text: `You won't be able to revert the deletion of ${selectedRows.length} purchase${selectedRows.length > 1 ? 's' : ''}!`,
//       confirmButtonText: "Yes, delete them!"
//     });
//     if (!confirmed) return;

//     try {
//       const token = localStorage.getItem("token");

//       await Promise.all(
//         selectedRows.map((id) =>
//           axios.delete(`${BASE_URL}/api/purchases/${id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           })
//         )
//       );

//       // Remove deleted purchases from state and refresh data
//       setSelectedRows([]);
//       toast.success(`${selectedRows.length} purchase${selectedRows.length > 1 ? 's' : ''} deleted successfully`);
      
//       // Check if we need to navigate to previous page
//       const remainingPurchases = purchases.length - selectedRows.length;
//       const currentPageStart = (page - 1) * 10;
      
//       if (remainingPurchases <= currentPageStart && page > 1) {
//         setPage(page - 1);
//       } else {
//         fetchPurchases();
//       }
//     } catch (err) {
//       console.error("Bulk delete failed:", err);
//       toast.error("Failed to delete selected purchases");
//     }
//   };

  
//     // const handleConvertToReturn = (purchase) => {
//     //   setSelectedReturnData(purchase);
//     //   const returnModal = new window.bootstrap.Modal(document.getElementById("add-return-debit-note"));
//     //   returnModal.show();
//     // };

   

    

//   // console.log("Purchase component rendered", purchases);

//   const [filters, setFilters] = useState({
//     search: "",
//     startDate: "",
//     endDate: "",
//     status: "",
//   });
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const { settings } = useSettings();
//   const navigate = useNavigate(); // 👈 inside the component
// const token = localStorage.getItem("token");


//   // const fetchPurchases = async () => {
//   //   try {
//   //     const res = await axios.get(`${BASE_URL}/api/purchases`, {
//   //       params: {
//   //         ...filters,
//   //         page,
//   //         limit: 10,
//   //       },
//   //     });
//   //     setPurchases(res.data.purchases);
//   //     setTotalPages(res.data.totalPages);
//   //   } catch (error) {
//   //     console.error("Error fetching purchases:", error);
//   //   }
//   // };
//   const fetchPurchases = async () => {
//     try {

//       const res = await axios.get(`${BASE_URL}/api/purchases`, {
//         params: {
//           ...filters,
//           // status: "Received",  // force only received
//           page,
//           limit: 10,
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPurchases(res.data.purchases);
//       setTotalPages(res.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching purchases:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPurchases();
//   }, [filters, page]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Create updated filters object
//     const updatedFilters = {
//       ...filters,
//       [name]: value,
//     };
    
//     // Validate date range if both dates are provided
//     if (name === 'endDate' || name === 'startDate') {
//       const startDate = name === 'startDate' ? value : filters.startDate;
//       const endDate = name === 'endDate' ? value : filters.endDate;
      
//       if (startDate && endDate) {
//         const start = new Date(startDate);
//         const end = new Date(endDate);
        
//         if (end < start) {
//           toast.error('End date cannot be older than start date. Please input correct date format.');
//           return; // Don't update the filter if validation fails
//         }
//       }
//     }
    
//     setFilters(updatedFilters);
//     setPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   // const convertCurrency = (value) => {
//   //   const rate = settings.conversionRates?.[settings.currencyCode] || 1;
//   //   return (value * rate).toFixed(2);
//   // };
//   const convertCurrency = (value) => {
//     if (!settings.conversionRates || !settings.baseCurrency) return value?.toFixed(2) || "0.00";

//     const baseToSelectedRate = settings.conversionRates[settings.currencyCode] || 1;
//     const baseToBaseRate = settings.conversionRates[settings.baseCurrency] || 1;

//     const converted = (value / baseToBaseRate) * baseToSelectedRate;
//     return converted.toFixed(2);
//   };
//   // New: handle edit button click — set selected purchase and open modal
//   const handleEditClick = (purchase) => {
//     setSelectedPurchase(purchase);
//     // Open modal programmatically since React doesn’t auto open with state change
//     const editModal = new window.bootstrap.Modal(document.getElementById("edit-purchase"));
//     editModal.show();
//   };
//   const [selectedPurchase, setSelectedPurchase] = useState(null);

//   const [activeSection, setActiveSection] = useState(
//     sessionStorage.getItem("activeSection") || "personalInfo"
//   );
//   useEffect(() => {
//     sessionStorage.setItem("activeSection", activeSection);
//   }, [activeSection]);

//   // Function to handle section toggling
//   const onToggleSection = (section) => {
//     setActiveSection(section);
//   };



//     // State to track expanded debit note for each purchase
//   const [expandedDebitNote, setExpandedDebitNote] = useState({});

//   // Toggle expand/collapse for a debit note row
//   const handleToggleDebitNote = (purchaseId, debitNoteId) => {
//     setExpandedDebitNote(prev => {
//       // If already expanded, collapse
//       if (prev[purchaseId] === debitNoteId) {
//         return { ...prev, [purchaseId]: null };
//       }
//       // Expand this debit note
//       return { ...prev, [purchaseId]: debitNoteId };
//     });
//   };

//   //  const [expandedRow, setExpandedRow] = useState(null);
//   //   // const navigate = useNavigate();
  
//   //   const toggleExpand = (saleId) => {
//   //     setExpandedRow(expandedRow === saleId ? null : saleId);
//   //   };
  

  

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">Purchase</h4>
//               <h6>Manage your purchases</h6>
//             </div>
//           </div>
//           {/* <div className="table-top-head d-flex align-items-center gap-2 flex-wrap">
//             <button
//               className={`btn btn-outline-primary ${filters.status === "" ? "active" : ""}`}
//               onClick={() => {
//                 setFilters((prev) => ({ ...prev, status: "" }));
//                 setPage(1);
//               }}
//             >
//               All
//             </button>

//             <button
//               className={`btn btn-outline-warning ${filters.status === "Pending" ? "active" : ""}`}
//               onClick={() => {
//                 setFilters((prev) => ({ ...prev, status: "Pending" }));
//                 setPage(1);
//               }}
//             >
//               Pending
//             </button>

//             <button
//               className={`btn btn-outline-success ${filters.status === "Received" ? "active" : ""}`}
//               onClick={() => {
//                 setFilters((prev) => ({ ...prev, status: "Received" }));
//                 setPage(1);
//               }}
//             >
//               Received
//             </button>

//             <button
//               className={`btn btn-outline-info ${filters.status === "Ordered" ? "active" : ""}`}
//               onClick={() => {
//                 setFilters((prev) => ({ ...prev, status: "Ordered" }));
//                 setPage(1);
//               }}
//             >
//               Purchase Orders
//             </button>

//             <button
//               className="btn btn-dark"
//               onClick={() => navigate("/stock-history")}
//             >
//               Stock History
//             </button>
//           </div> */}

//           <div className="table-top-head me-2">
//             <li>
//               {selectedRows.length > 0 && (
//                 <button className="btn btn-danger me-2" onClick={handleBulkDelete}>
//                   Delete ({selectedRows.length}) Selected
//                 </button>
//               )}
//             </li>
//             <li onClick={handleExportPDF}><button type="button" className="icon-btn" title="Pdf"><FaFilePdf /></button></li>
//             <li><label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} hidden /><FaFileExcel style={{ color: "green" }} /></label></li>
//             <li onClick={handleExportExcel}><button type="button" className="icon-btn" title="Export Excel" ><FaFileExcel /></button></li>
//           </div>


//           <div className="d-flex gap-2">
//             <a className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-purchase"><CiCirclePlus className="me-1" />Add Purchase</a>
//             {/* <a className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#view-notes"><i data-feather="download" className="me-2" />Import Purchase</a> */}
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header  justify-content-between flex-wrap gap-3">
//             <div className="row ">
//               <div className="col-md-3">
//                 <input type="text" name="search" className="form-control" placeholder="Search by product, supplier, or reference" value={filters.search} onChange={handleInputChange} />
//               </div>
//               <div className="col-md-3">
//                 <input type="date" name="startDate" className="form-control" value={filters.startDate} onChange={handleInputChange} />
//               </div>
//               <div className="col-md-3">
//                 <input type="date" name="endDate" className="form-control" value={filters.endDate} onChange={handleInputChange} />
//               </div>
//               <div className="col-md-3">
//                 <select name="status" className="form-select" value={filters.status} onChange={handleInputChange}>
//                   <option value="">All Status</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Received">Received</option>
//                   <option value="Ordered">Ordered</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable text-center align-middle">
//                 <thead className="thead-light text-center">
//                   <tr>
//                     <th><label className="checkboxs">
//                       {/* <input type="checkbox" /> */}
//                       <input
//                         type="checkbox"
//                         checked={
//                           purchases.length > 0 &&
//                           purchases.every((purchase) => selectedRows.includes(purchase._id))
//                         }
//                         onChange={handleSelectAll}
//                         ref={(input) => {
//                           if (input) {
//                             // Since purchases array already contains only current page data from API
//                             const currentPageIds = purchases.map((purchase) => purchase._id);
//                             const someSelected = currentPageIds.some((id) => selectedRows.includes(id));
//                             const allSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedRows.includes(id));
//                             input.indeterminate = someSelected && !allSelected;
//                           }
//                         }}
//                       />
//                       <span className="checkmarks" /></label></th>
//                     <th>Supplier</th>
//                     <th>Reference</th>
//                     <th>Debit Note</th>
//                     <th>Date</th>
//                     <th>Products</th>
//                     <th>Qyt</th>
//                     <th>Purchase Price</th>
//                     <th>Discount</th>
//                     <th>Tax(%)</th>
//                     <th>Tax Amount</th>
//                     <th>Shipping Charge</th>
//                     <th>Extra Expense</th>
//                     <th>Unit cost</th>
//                     <th>Total cost</th>
//                     <th>Status</th>
//                     <th>Created By</th>
//                     <th>Updated By</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchases.length === 0 ? (
//                     <tr><td colSpan="16" className="text-center">No purchases found.</td></tr>
//                   ) : (
//                     purchases.map((purchase) => (
//                       <React.Fragment key={purchase._id}>
//                         <tr key={purchase._id}>
//                           <td><label className="checkboxs"><input
//                             type="checkbox"
//                             checked={selectedRows.includes(purchase._id)}
//                             onChange={() => handleSelectRow(purchase._id)}
//                           /><span className="checkmarks" /></label></td>
//                           <td className="text-capitalize">{purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A"}</td>
//                           <td>{purchase.referenceNumber}</td>
//                           <td>
//                             {Array.isArray(purchase.debitNotes) && purchase.debitNotes.length > 0 ? (
//                               <>
//                                 <span
//                                   key={purchase.debitNotes[0]._id}
//                                   className="badge bg-info text-light me-1"
//                                   style={{ cursor: "pointer" }}
//                                   onClick={() => handleToggleDebitNote(purchase._id, purchase.debitNotes[0]._id)}
//                                 >
//                                   {purchase.debitNotes[0].debitNoteId}
//                                 </span>

//                                 {purchase.debitNotes.length > 1 && (
//                                   <span
//                                     className="badge bg-secondary text-light"
//                                     style={{ cursor: "pointer" }}
//                                     title={purchase.debitNotes.slice(1).map(n => n.debitNoteId).join(", ")}
//                                     onClick={() => handleToggleDebitNote(purchase._id, purchase.debitNotes[0]._id)}
//                                   >
//                                     +{purchase.debitNotes.length - 1} more
//                                   </span>
//                                 )}
//                               </>
//                             ) : (
//                               "N/A"
//                             )}
//                           </td>
//                           <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
//                           <td>
//                             <ul>{purchase.products.map((p, idx) => (
//                               <li key={idx}>{p.product?.productName}
//                                 {/* - {p.quantity} × {settings.currencySymbol}{convertCurrency(p.purchasePrice)} */}
//                               </li>
//                             ))}</ul>
//                           </td>
//                           <td>
//                             <ul>
//                               {purchase.products.map((p, idx) => (
//                                 <li key={idx}>
//                                   {p.quantity} {p.unit}
//                                 </li>
//                               ))}
//                             </ul>
//                           </td>

//                           <td>
//                             <ul>
//                               {purchase.products.map((p, idx) => (
//                                 <li key={idx}>{p.purchasePrice}</li>
//                               ))}
//                             </ul>
//                           </td>

//                           <td>
//                             <ul>
//                               {purchase.products.map((p, idx) => (
//                                 <li key={idx}>{p.discount}<span className="ms-1">{p.discountType === "Percentage" ? "%" : "₹"}</span></li>
//                               ))}
//                             </ul>
//                           </td>

//                           <td>
//                             <ul>
//                               {purchase.products.map((p, idx) => (
//                                 <li key={idx}>{p.tax} %</li>
//                               ))}
//                             </ul>
//                           </td>

//                           <td>
//                             <ul>
//                               {purchase.products.map((p, idx) => (
//                                 <li key={idx}>{p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0)}</li>
//                               ))}
//                             </ul>
//                           </td>

//                           <td>{purchase.shippingCost}</td>
//                           <td>{purchase.orderTax}</td>

//                           <td>
//                             <ul>
//                               {purchase.products.map((p, idx) => (
//                                 <li key={idx}>{p.unitCost}</li>
//                               ))}
//                             </ul>
//                           </td>

//                           <td>
//                             <ul>
//                               {purchase.products.map((p, idx) => (
//                                 <li key={idx}>{p.totalCost}</li>
//                               ))}
//                             </ul>
//                           </td>


//                           <td>
//                             {/* <span className={`badge ${purchase.status === "Pending" ? "bg-warning" : "bg-success"}`}>{purchase.status}</span> */}
//                             <span
//                               className={`badge ${purchase.status === "Pending"
//                                 ? "bg-warning text-dark" // Yellow badge with dark text
//                                 : purchase.status === "Received"
//                                   ? "bg-success" // Green badge
//                                   : purchase.status === "Ordered"
//                                     ? "bg-primary" // Blue badge
//                                     : "bg-secondary" // Fallback if none match
//                                 }`}
//                             >
//                               {purchase.status}
//                             </span>
//                           </td>
//                           <td>{purchase.createdBy ? `${purchase.createdBy.name}` : '--'}</td>
//                           <td>{purchase.updatedBy ? `${purchase.updatedBy.name} ` : '--'}</td>
//                           <td class="action-item">
//                             <a href="" data-bs-toggle="dropdown">
//                               <TbDots />
//                             </a>
//                             <ul class="dropdown-menu">
//                               <li>
//                                 <a class="dropdown-item d-flex align-items-center" onClick={() => handleEditClick(purchase)}><TbEdit className="me-2" />Edit</a>
//                               </li>
//                               <li>
//                                 <a className="dropdown-item d-flex align-items-center" onClick={() => handleDeletePurchase(purchase._id, purchase.referenceNumber)}><TbTrash className="me-2" />Delete</a>
//                               </li>
//                               {/* <li>
//                               <a  class="dropdown-item d-flex align-items-center" onClick={() => setViewPurchaseId(purchase._id)}><TbEye class="isax isax-send-2 me-2"/>View </a>
//                             </li> */}
//                               <li>
//                                 {/* <a href="" class="dropdown-item d-flex align-items-center"><i class="isax isax-document-download me-2"></i>Download Invoices as PDF</a> */}
//                               </li>
//                               <li>
//                                 <a
//                                   className="dropdown-item d-flex align-items-center"
//    onClick={() => !isFullyReturned(purchase) && handleConvertToReturn(purchase)}
//                                 style={isFullyReturned(purchase) ? { pointerEvents: 'none', opacity: 0.5 } : {}}
//                                 >
//                                   <i className="isax isax-convert me-2"></i>Convert to Purchase Return
//                                 </a>
//                               </li>
//                               <li>
//                               </li>
//                             </ul>
//                           </td>


//                           {/* {(purchase.debitNotes && purchase.debitNotes.length > 0 && (
//                         <tr key={purchase._id + '-debitnotes'}>
//                           <td colSpan={18} style={{ background: '#f9f9f9', padding: 0 }}>
//                             <div style={{ padding: '8px 0' }}>
//                               <b>Debit Notes:</b>
//                               {purchase.debitNotes.map((dn) => (
//                                 <span key={dn._id} style={{ marginLeft: 12, marginRight: 12 }}>
//                                   <a
//                                     href="#"
//                                     style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
//                                     onClick={e => {
//                                       e.preventDefault();
//                                       handleToggleDebitNote(purchase._id, dn._id);
//                                     }}
//                                   >
//                                     {dn.debitNoteId || dn._id}
//                                   </a>
//                                   {expandedDebitNote[purchase._id] === dn._id && (
//                                     <div style={{ marginTop: 8, border: '1px solid #ddd', borderRadius: 4, background: '#fff', padding: 12 }}>
//                                       <div><b>Date:</b> {dn.debitNoteDate ? new Date(dn.debitNoteDate).toLocaleDateString() : ''}</div>
//                                       <div><b>Status:</b> {dn.status}</div>
//                                       <div><b>Total:</b> {settings.currencySymbol}{convertCurrency(dn.total)}</div>
//                                       <div><b>Products:</b>
//                                         <ul style={{ marginBottom: 0 }}>
//                                           {dn.products && dn.products.map((prod, idx) => (
//                                             <li key={prod._id || idx}>
//                                               {prod.product?.productName || ''} | Qty: {prod.returnQty} | Price: {settings.currencySymbol}{convertCurrency(prod.purchasePrice)}
//                                             </li>
//                                           ))}
//                                         </ul>
//                                       </div>
//                                       <div><b>Note:</b> {dn.extraInfo?.notes || '-'}</div>
//                                     </div>
//                                   )}
//                                 </span>
//                               ))}
//                             </div>
//                           </td>
//                         </tr>
//                           )
//                     )}  */}
//                           {/* {purchase.debitNotes && purchase.debitNotes.length > 0 && (
//   <tr key={purchase._id + '-debitnotes'}>
//     <td colSpan={18} style={{ background: '#f9f9f9', padding: 0 }}>
//       <div style={{ padding: '8px 0' }}>
//         <b>Debit Notes:</b>
//         <table className="table table-bordered mt-2 mb-0">
//           <thead>
//             <tr>
//               <th>Debit Note ID</th>
//               <th>Date</th>
//               <th>Status</th>
//               <th>Total</th>
//               <th>Products</th>
//               <th>Note</th>
//             </tr>
//           </thead>
//           <tbody>
//             {purchase.debitNotes.map((dn) => (
//               <tr key={dn._id}>
//                 <td>
//                   <a
//                     href="#"
//                     style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleToggleDebitNote(purchase._id, dn._id);
//                     }}
//                   >
//                     {dn.debitNoteId || dn._id}
//                   </a>
//                 </td>
//                 <td>{dn.debitNoteDate ? new Date(dn.debitNoteDate).toLocaleDateString() : ''}</td>
//                 <td>{dn.status}</td>
//                 <td>
//                   {settings.currencySymbol}
//                   {dn.total}
//                 </td>
//                 <td>
//                   {expandedDebitNote[purchase._id] === dn._id && dn.products && (
//                     <ul className="mb-0">
//                       {dn.products.map((prod, idx) => (
//                         <li key={prod._id || idx}>
//                           {prod.product?.productName || ''} | Qty: {prod.returnQty} | Price: {settings.currencySymbol}
//                           {prod.purchasePrice}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </td>
//                 <td>{dn.extraInfo?.notes || '-'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </td>
//   </tr>
// )}  */}

//                           {/* {expandedDebitNote[purchase._id] === dn._id && dn.products && */}

//                         </tr>
//                         {Array.isArray(purchase.debitNotes) && purchase.debitNotes.length > 0 && expandedDebitNote[purchase._id] && (
//                           <tr>
//                             <td colSpan="16" style={{ background: "#f9f9f9" }}>
//                               <div style={{ fontWeight: 600, marginBottom: 6 }}>
//                                 Debit Notes (Returns)
//                               </div>
//                               <table className="table table-sm table-bordered mb-0">
//                                 <thead className="table-light">
//                                   <tr>
//                                     <th>Debit Note ID</th>
//                                     <th>Date</th>
//                                     <th>Product</th>
//                                     <th>Qty</th>
//                                     <th>Unit</th>
//                                     <th>Purchase Price</th>
//                                     <th>Discount</th>
//                                     <th>Discount Type</th>
//                                     <th>Discount Amount</th>
//                                     <th>Tax (%)</th>
//                                     <th>Tax Amount</th>
//                                     <th>Unit Cost</th>
//                                     <th>Total Cost</th>
//                                     <th>SubTotal</th>
//                                   </tr>
//                                 </thead>

//                                 <tbody>
//                                   {purchase.debitNotes.map((note) =>
//                                     note.products?.length > 0 ? (
//                                       note.products.map((prod, idx) => (
//                                         <tr key={`${note._id}-${idx}`}>
//                                           <td>{note.debitNoteId}</td>
//                                           <td>
//                                             {note.createdAt
//                                               ? new Date(note.createdAt).toLocaleDateString()
//                                               : "-"}
//                                           </td>
//                                           <td>
//                                             <div className="d-flex align-items-center">
//                                               {prod.product?.images?.[0]?.url ? (
//                                                 <img
//                                                   src={prod.product.images[0].url}
//                                                   alt={prod.product?.productName || "Product"}
//                                                   style={{
//                                                     width: 28,
//                                                     height: 28,
//                                                     objectFit: "cover",
//                                                     borderRadius: 4,
//                                                     marginRight: 6,
//                                                   }}
//                                                 />
//                                               ) : (
//                                                 <div
//                                                   style={{
//                                                     width: 28,
//                                                     height: 28,
//                                                     background: "#e9ecef",
//                                                     borderRadius: 4,
//                                                     marginRight: 6,
//                                                   }}
//                                                 />
//                                               )}
//                                               <span>{prod.product?.productName || "-"}</span>
//                                             </div>
//                                           </td>
//                                           <td>{prod.returnQty || prod.quantity || "-"}</td>
//                                           <td>{prod.Unit || "-"}</td>
//                                           <td>{prod.purchasePrice || "-"}</td>
//                                           <td>{prod.discount || "-"}</td>
//                                           <td>{prod.discountType || "-"}</td>
//                                           <td>{prod.discountAmount || "-"}</td>
//                                           <td>{prod.tax || "-"}</td>
//                                           <td>{prod.taxAmount || "-"}</td>
//                                           <td>{prod.lineTotal ? `₹${prod.lineTotal}` : "-"}</td>
//                                         </tr>
//                                       ))
//                                     ) : (
//                                       <tr key={`${note._id}-empty`}>
//                                         <td>{note.creditNoteId}</td>
//                                         <td>
//                                           {note.createdAt
//                                             ? new Date(note.createdAt).toLocaleDateString()
//                                             : "-"}
//                                         </td>
//                                         <td colSpan="4">No returned products</td>
//                                       </tr>
//                                     )
//                                   )}
//                                 </tbody>
//                               </table>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>

//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination controls */}
//             <div
//               className="d-flex justify-content-end gap-3"
//               style={{ padding: "10px 20px" }}
//             >

//               <select
//                 className="form-select w-auto"
//                 value={page}
//                 onChange={e => { totalPages(Number(e.target.value)); }}
//               >
//                 {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
//               </select>

//               <span
//                 style={{
//                   backgroundColor: "white",
//                   boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
//                   padding: "7px",
//                   borderRadius: "5px",
//                   border: "1px solid #e4e0e0ff",
//                   color: "gray",
//                 }}
//               >
//                 <span>Page {page} of {totalPages || 1}</span>

//                 {" "}
//                 <button
//                   style={{
//                     border: "none",
//                     color: "grey",
//                     backgroundColor: "white",
//                   }}
//                   onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
//                   <GrFormPrevious />
//                 </button>{" "}
//                 <button
//                   style={{ border: "none", backgroundColor: "white" }}
//                   onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
//                   <MdNavigateNext />
//                 </button>
//               </span>
//             </div>

//             {/* <div className="d-flex justify-content-between align-items-center p-2 mb-0">
//               <div>Page {page} of {totalPages}</div>
//               <div className="btn-group">
//                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</button>
//                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
//               </div>
//             </div> */}
//           </div>
//         </div>

//         {/* <AddPurchaseModal /> */}
//   <AddPurchaseModal onSuccess={fetchPurchases} />
//         {/* <EditPurchaseModal /> */}
//         <EditPurchaseModal editData={selectedPurchase} onUpdate={fetchPurchases} />
//         <AddDebitNoteModals purchaseData={selectedReturnData} onReturnCreated={fetchPurchases} />

//         <div className="modal fade" id="view-purchase" tabIndex="-1" aria-labelledby="viewPurchaseLabel" aria-hidden="true">
//           <div className="modal-dialog modal-xl modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title" id="viewPurchaseLabel">View Purchase Details</h5>
//                 <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//               </div>
//               <div className="modal-body">
//                 {viewPurchaseId && (
//                   <ViewPurchase purchase={purchases.find(p => p._id === viewPurchaseId)} purchaseId={viewPurchaseId} />
//                 )}
//               </div>

//              {/* <AddDebitNoteModals purchaseData={selectedReturnData} onReturnCreated={fetchPurchases} /> */}
              
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Purchase;

