import React, { useEffect, useState } from 'react'
import BASE_URL from '../../../../pages/config/config';
import axios from 'axios';
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";



const StockAdujestment = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // items page
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedStocks, setSelectedStocks] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/api/products`, {
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

  // const exportToExcel = () => {
  //   const selected = filterStocks;
  //   if (selected.length === 0) {
  //     toast.warn("No stocks available to export.");
  //     return;
  //   }

  //   const ws = XLSX.utils.json_to_sheet(selected);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Stocks");
  //   XLSX.writeFile(wb, "stocks.xlsx");
  // };

  
//   const exportToExcel = () => {
//   const selected = filterStocks;

//   if (selected.length === 0) {
//     toast.warn("No stocks available to export.");
//     return;
//   }

//   const data = selected.map((p) => {
//     let qty = 0;

//     if (typeof p.availableQty === 'number') {
//       qty = p.availableQty;
//     } else {
//       const quantity = Number(p.quantity ?? 0);
//       let newQuantitySum = 0;
//       if (Array.isArray(p.newQuantity)) {
//         newQuantitySum = p.newQuantity.reduce((acc, n) => acc + (Number(n) || 0), 0);
//       } else if (typeof p.newQuantity === 'number') {
//         newQuantitySum = Number(p.newQuantity);
//       }
//       qty = quantity + newQuantitySum;
//     }

//     const purchasePrice = Number(p.purchasePrice ?? 0);
//     const sellingPrice = Number(p.sellingPrice ?? 0);
//     const availableValue = qty * purchasePrice;
//     const profitLoss = (qty * sellingPrice) - availableValue;

//     return {
//       "Product Name": p.productName || 'N/A',
//       "Product Code": p.productCode || 'N/A',
//       "Available Quantity": qty,
//       "Purchase Price (₹)": purchasePrice.toFixed(2),
//       "Selling Price (₹)": sellingPrice.toFixed(2),
//       "Available Value (₹)": availableValue.toFixed(2),
//       "Profit / Loss (₹)": profitLoss.toFixed(2),
//     };
//   });

//   const ws = XLSX.utils.json_to_sheet(data);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Stocks");
//   XLSX.writeFile(wb, "stocks.xlsx");
// };


const exportToExcel = () => {
  const selected = filterStocks;

  if (selected.length === 0) {
    toast.warn("No stocks available to export.");
    return;
  }

  const data = selected.map((p) => {
    let qty = 0;

    if (typeof p.availableQty === 'number') {
      qty = p.availableQty;
    } else {
      const quantity = Number(p.quantity ?? 0);
      let newQuantitySum = 0;
      if (Array.isArray(p.newQuantity)) {
        newQuantitySum = p.newQuantity.reduce((acc, n) => acc + (Number(n) || 0), 0);
      } else if (typeof p.newQuantity === 'number') {
        newQuantitySum = Number(p.newQuantity);
      }
      qty = quantity + newQuantitySum;
    }

    const purchasePrice = Number(p.purchasePrice ?? 0);
    const sellingPrice = Number(p.sellingPrice ?? 0);
    const availableValue = qty * purchasePrice;
    const profitLoss = (qty * sellingPrice) - availableValue;

    return {
      "Product Name": p.productName || 'N/A',
      "Product Code": p.productCode || 'N/A',
      "Available Quantity": qty,
      "Purchase Price ": `Rs. ${purchasePrice.toFixed(2)}`,
      "Selling Price (Rs.)":  `Rs. ${sellingPrice.toFixed(2)}`,
      "Available Value (Rs.)": `Rs. ${availableValue.toFixed(2)}`,
      "Profit / Loss": `${profitLoss.toFixed(2)} ${profitLoss > 0 ? '(Profit)' : profitLoss < 0 ? '(Loss)' : ''}`,
       // For styling later
    };
  });

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Optional: Add styling to Profit/Loss column
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let row = 1; row <= range.e.r; row++) {
    const cellAddress = `H${row + 1}`;  // H column = 8th column (Profit / Loss)
    const colorCellAddress = `I${row + 1}`;
    const color = ws[colorCellAddress]?.v || 'black';

    if (!ws[cellAddress]) continue;

    ws[cellAddress].s = {
      font: {
        color: { rgb: color === 'green' ? '008000' : color === 'red' ? 'FF0000' : '000000' },
      },
    };
  }

  // Remove helper column before export
  delete ws['I1']; // Header
  for (let row = 2; row <= data.length + 1; row++) {
    delete ws[`I${row}`];
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stocks");

  // Enable styles
  XLSX.writeFile(wb, "stocks.xlsx", { cellStyles: true });
};

    const filterStocks = products.filter((p) => {
    const matchesSearch = p.productName?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesSearch;
  })

  

const exportToPDF = () => {
  const selected = filterStocks;

  if (selected.length === 0) {
    toast.warn("No stocks available to export.");
    return;
  }

  const doc = new jsPDF();
  doc.text("Stocks List", 14, 10);
  autoTable(doc, {
    startY: 20,
    head: [
      ["Product Name", "Product Code", "Available Quantity", "Purchase Price", "Selling Price", "Available Value", "Profit/Loss"]
    ],
    body: selected.map((p) => {
      let qty = 0;
      if (typeof p.availableQty === 'number') {
        qty = p.availableQty;
      } else {
        const quantity = Number(p.quantity ?? 0);
        let newQuantitySum = 0;
        if (Array.isArray(p.newQuantity)) {
          newQuantitySum = p.newQuantity.reduce((acc, n) => acc + (Number(n) || 0), 0);
        } else if (typeof p.newQuantity === 'number') {
          newQuantitySum = Number(p.newQuantity);
        }
        qty = quantity + newQuantitySum;
      }

      const purchasePrice = Number(p.purchasePrice ?? 0);
      const sellingPrice = Number(p.sellingPrice ?? 0);
      const availableValue = qty * purchasePrice;
      const profitLoss = (qty * sellingPrice) - availableValue;

      return [
        p.productName || 'N/A',
        p.productCode || 'N/A',
        qty,
        `Rs. ${purchasePrice.toFixed(2)}`,
        `Rs. ${sellingPrice.toFixed(2)}`,
        `Rs. ${availableValue.toFixed(2)}`,
        // `₹${profitLoss.toFixed(2)} ${profitLoss > 0 ? '(Profit)' : profitLoss < 0 ? '(Loss)' : '' || profitLoss >= 0 ? 'text-success' : 'text-danger'}
        // `
         {
        content: `Rs. ${profitLoss.toFixed(2)} ${profitLoss > 0 ? '(Profit)' : profitLoss < 0 ? '(Loss)' : ''}`,
        styles: {
          textColor: profitLoss > 0 ? [0, 128, 0] : profitLoss < 0 ? [255, 0, 0] : [0, 0, 0]  // Green / Red / Black
        }}
      ];
    }),
  });

  doc.save("stocks.pdf");
};


 

  const totalPages = Math.ceil(filterStocks.length / itemsPerPage);
  const paginatedStocks = filterStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className='fw-bold'>Product Wise Available Quantity & Price</h4>
              <h6>Total Stock Value:₹{totalValue.toFixed(2)}</h6>
            </div>
          </div>
          <div
                      className="table-top-head me-2"
                      style={{ display: "flex", alignItems: "center", gap: "10px" }}
                    >
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "5px" }}
                        className="icon-btn"
                      >
                        <label className="" title="">
                          Export :{" "}
                        </label>
                        <button
                         onClick={exportToPDF}
                          title="Download PDF"
                          style={{
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            border: "none",
                          }}
                        >
                          <FaFilePdf className="fs-20" style={{ color: "red" }} />
                        </button>
                        <button
                          onClick={exportToExcel}
                          title="Download Excel"
                          style={{
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            border: "none",
                          }}
                        >
                          <FaFileExcel className="fs-20" style={{ color: "orange" }} />
                        </button>
                      </div>
          
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "5px" }}
                        className="icon-btn"
                      >
                        <label className="" title="">
                          Import :{" "}
                        </label>
                        <label className="" title="Import Excel">
                          <button
                            type="button"
                            // onClick={handleImportClick}
                            style={{
                              backgroundColor: "white",
                              display: "flex",
                              alignItems: "center",
                              border: "none",
                            }}
                          >
                            <FaFileExcel style={{ color: "green" }} />
                          </button>
                          <input
                            type="file"
                            accept=".xlsx, .xls"
                            // ref={fileInputRef}
                            style={{ display: "none" }}
                            // onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      {/* <li>
                                  <button
                                    type="button"
                                    className="icon-btn"
                                    title="Export Excel"
                                    onClick={handleExcel}
                                  >
                                    <FaFileExcel />
                                  </button>
                                </li> */}
                    </div>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="search-set">
                <div className="search-input">
                  <input
                    type="text"
                    placeholder="Search Stocks..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="btn-searchset">
                    <i className="ti ti-search fs-14 feather-search" />
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table datatable">
                  <thead className="thead-light">
                    <tr style={{ textAlign: "center" }}>
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
                    {paginatedStocks.length > 0 ? (
                      paginatedStocks.map(product => {
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
                          <tr key={product._id} style={{ textAlign: 'center' }}>
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
                  {filterStocks.length === 0
                    ? "0 of 0"
                    : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filterStocks.length
                    )} of ${filterStocks.length}`}
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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <MdNavigateNext />
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StockAdujestment