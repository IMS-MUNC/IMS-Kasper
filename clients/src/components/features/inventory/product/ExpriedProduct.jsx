import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { exportToExcel, exportToPDF } from './exportUtils';
import BASE_URL from "../../../../pages/config/config";
import axios from 'axios';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { TbEdit, TbRefresh, TbTrash } from 'react-icons/tb';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ExpriedProduct = () => {
  // Columns for export
  const exportColumns = ['sku', 'productName', 'manufactured', 'expiry', 'quantity', 'supplierName', 'warehouseName'];

  // Sort state
  const [sortBy, setSortBy] = useState('Last 7 Days');
  const [sortOrder, setSortOrder] = useState('desc');

  const navigate = useNavigate();

  // Sort function
  const sortProducts = (productsToSort) => {
    return [...productsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'Recently Added':
          const dateA = new Date(a.createdAt || a.created_at || 0);
          const dateB = new Date(b.createdAt || b.created_at || 0);
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        case 'Ascending':
          return a.productName.localeCompare(b.productName);
        case 'Descending':
          return b.productName.localeCompare(a.productName);
        case 'Last Month':
        case 'Last 7 Days':
        default:
          // Sort by expiry date
          const getExpiryDate = (product) => {
            const expiryArr = product.variants?.get?.('Expiry') || product.variants?.['Expiry'] || product.variants?.get?.('expiry') || product.variants?.['expiry'];
            if (!expiryArr || expiryArr.length === 0) return new Date(0);
            const dateStr = expiryArr[0];
            if (typeof dateStr === "string") {
              const dateMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
              if (dateMatch) {
                const [, day, month, year] = dateMatch;
                return new Date(year, month - 1, day);
              }
            }
            return new Date(0);
          };
          const expiryA = getExpiryDate(a);
          const expiryB = getExpiryDate(b);
          return sortOrder === 'desc' ? expiryB - expiryA : expiryA - expiryB;
      }
    });
  };

  // Handle sort selection
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    if (newSortBy === 'Ascending' || newSortBy === 'Descending') {
      setSortOrder(newSortBy === 'Ascending' ? 'asc' : 'desc');
    }
  };

  // Prepare export data
  const getExportData = () => {
    return products.filter(product => {
      const expiryArr = product.variants?.get?.('Expiry') || product.variants?.['Expiry'] || product.variants?.get?.('expiry') || product.variants?.['expiry'];
      if (!expiryArr || expiryArr.length === 0) return false;
      return expiryArr.some(dateStr => {
        // Handle multiple date formats: DD-MM-YYYY, D-M-YYYY, DD/MM/YYYY, etc.
        if (typeof dateStr === "string") {
          // Try DD-MM-YYYY or D-M-YYYY format
          const dateMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
          if (dateMatch) {
            const [, day, month, year] = dateMatch.map(Number);
            if (day && month && year && day <= 31 && month <= 12) {
              const expDate = new Date(year, month - 1, day);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              expDate.setHours(0, 0, 0, 0);

              if (!isNaN(expDate.getTime())) {
                return expDate < today; // Check if expired
              }
            }
          }
        }
        return false;
      });
    }).map(product => ({
      sku: product.sku || 'N/A',
      productName: product.productName || product.name || 'N/A',
      manufactured: (product.variants?.get?.('Manufactured') || product.variants?.['Manufactured'] || ['N/A']).join(', '),
      expiry: (product.variants?.get?.('Expiry') || product.variants?.['Expiry'] || ['N/A']).join(', '),
      quantity: product.quantity ?? 'N/A',
      supplierName: product.supplierName || 'N/A',
      warehouseName: product.warehouseName || 'N/A',
    }));
  };

  // Export handlers
  const handleExcelExport = () => {
    exportToExcel(getExportData(), exportColumns);
  };
  const handlePDFExport = () => {
    exportToPDF(getExportData(), exportColumns);
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warned, setWarned] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get('/api/products', {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          },
        });
        setProducts(res.data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0 && !warned) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      const expiredProducts = products.filter(product => {
        const expiryArr = product.variants?.get?.('Expiry') || product.variants?.['Expiry'] || product.variants?.get?.('expiry') || product.variants?.['expiry'];
        if (!expiryArr || expiryArr.length === 0) return false;
        return expiryArr.some(dateStr => {
          // Handle multiple date formats: DD-MM-YYYY, D-M-YYYY, DD/MM/YYYY, etc.
          if (typeof dateStr === "string") {
            // Try DD-MM-YYYY or D-M-YYYY format
            const dateMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
            if (dateMatch) {
              const [, day, month, year] = dateMatch.map(Number);
              if (day && month && year && day <= 31 && month <= 12) {
                const expDate = new Date(year, month - 1, day);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                expDate.setHours(0, 0, 0, 0);

                if (!isNaN(expDate.getTime())) {
                  return expDate < today; // Check if expired
                }
              }
            }
          }
          return false;
        });
      });
      if (expiredProducts.length > 0) {
        window.toast && window.toast.error(`${expiredProducts.length} products have expired!`);
        setWarned(true);
      }
    }
  }, [loading, products, warned]);

  //download pdf-------------------------------------------------------------------------------------------------------------------------------------------

  const handlePdf = () => {
    const expiredProductsData = getExportData();
    const doc = new jsPDF();
    doc.text("Expired Products", 14, 15);
    const tableColumns = ["SKU", "Product Name", "Manufactured", "Expiry", "Quantity", "Supplier", "Warehouse"];

    const tableRows = expiredProductsData.map((e) => [
      e.sku,
      e.productName,
      e.manufactured,
      e.expiry,
      e.quantity,
      e.supplierName,
      e.warehouseName,
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

    doc.save("expired-products.pdf");
  };

  //download excel---------------------------------------------------------------------------------------------------------------------------------------------------------

  const handleExcel = () => {
    const expiredProductsData = getExportData();
    const tableColumns = ["SKU", "Product Name", "Manufactured", "Expiry", "Quantity", "Supplier", "Warehouse"];

    const tableRows = expiredProductsData.map((e) => [
      e.sku,
      e.productName,
      e.manufactured,
      e.expiry,
      e.quantity,
      e.supplierName,
      e.warehouseName,
    ]);

    const data = [tableColumns, ...tableRows];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExpiredProducts");

    XLSX.writeFile(workbook, "expired-products.xlsx");
  };

  //product delete---------------------------------------------------------------------------------------------------------------------------------------------

  const handleDelete = async (product) => {
    // console.log("Deleting product:", product);
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

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Expired Products</h4>
              <h6>Manage your expired products</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <a onClick={handlePdf} title="Download PDF" ><FaFilePdf className="fs-20" style={{ color: "red" }} /></a>
            </li>
            <li>
              <a onClick={handleExcel} title="Download Excel" ><FaFileExcel className="fs-20" style={{ color: "green" }} /></a>
            </li>
            <li>
              <button data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" onClick={() => location.reload()} className="fs-20" style={{ backgroundColor: 'white', color: '', padding: '5px 5px', display: 'flex', alignItems: 'center', border: '1px solid #e8eaebff', cursor: 'pointer', borderRadius: '4px' }}><TbRefresh className="ti ti-refresh" /></button>
            </li>
            {/* <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
        </li> */}
          </ul>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              {/* <div className="dropdown me-2">
            <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
              Product
            </a>
            <ul className="dropdown-menu  dropdown-menu-end p-3">
              <li>
                <a className="dropdown-item rounded-1">Lenovo IdeaPad 3</a>
              </li>
              <li>
                <a className="dropdown-item rounded-1">Beats Pro </a>
              </li>
              <li>
                <a className="dropdown-item rounded-1">Nike Jordan</a>
              </li>
              <li>
                <a className="dropdown-item rounded-1">Apple Series 5 Watch</a>
              </li>
            </ul>
          </div> */}
              <div className="dropdown">
                <a className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Sort By : {sortBy}
                </a>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <a className="dropdown-item rounded-1" onClick={() => handleSortChange('Recently Added')} style={{ cursor: 'pointer' }}>Recently Added</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1" onClick={() => handleSortChange('Ascending')} style={{ cursor: 'pointer' }}>Ascending</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1" onClick={() => handleSortChange('Descending')} style={{ cursor: 'pointer' }}>Descending</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1" onClick={() => handleSortChange('Last Month')} style={{ cursor: 'pointer' }}>Last Month</a>
                  </li>
                  <li>
                    <a className="dropdown-item rounded-1" onClick={() => handleSortChange('Last 7 Days')} style={{ cursor: 'pointer' }}>Last 7 Days</a>
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
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Manufactured Date</th>
                    <th>Expired Date</th>
                    <th>Quantity</th>
                    <th>Supplier</th>
                    <th>Warehouse</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  {sortProducts(products.filter(product => {
                    const expiryArr = product.variants?.get?.('Expiry') || product.variants?.['Expiry'] || product.variants?.get?.('expiry') || product.variants?.['expiry'];
                    if (!expiryArr || expiryArr.length === 0) return false;
                    // Only show products that are already expired
                    return expiryArr.some(dateStr => {
                      if (typeof dateStr === "string") {
                        const dateMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
                        if (dateMatch) {
                          const [, day, month, year] = dateMatch.map(Number);
                          if (day && month && year && day <= 31 && month <= 12) {
                            const expDate = new Date(year, month - 1, day);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            expDate.setHours(0, 0, 0, 0);
                            if (!isNaN(expDate.getTime())) {
                              return expDate < today; // Show only expired products
                            }
                          }
                        }
                      }
                      return false;
                    });
                  })).length > 0 ? (
                    sortProducts(products.filter(product => {
                      const expiryArr = product.variants?.get?.('Expiry') || product.variants?.['Expiry'] || product.variants?.get?.('expiry') || product.variants?.['expiry'];
                      if (!expiryArr || expiryArr.length === 0) return false;
                      return expiryArr.some(dateStr => {
                        if (typeof dateStr === "string") {
                          const dateMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
                          if (dateMatch) {
                            const [, day, month, year] = dateMatch.map(Number);
                            if (day && month && year && day <= 31 && month <= 12) {
                              const expDate = new Date(year, month - 1, day);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              expDate.setHours(0, 0, 0, 0);
                              if (!isNaN(expDate.getTime())) {
                                return expDate < today;
                              }
                            }
                          }
                        }
                        return false;
                      });
                    })).map(product => (
                      <tr key={product._id}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>{product.sku || 'N/A'}</td>
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
                        <td>{(product.variants?.get?.('Manufactured') || product.variants?.['Manufactured'] || ['N/A']).join(', ')}</td>
                        <td>{(product.variants?.get?.('Expiry') || product.variants?.['Expiry'] || ['N/A']).join(', ')}</td>
                        <td>{product.quantity ?? 'N/A'}</td>
                        <td>{product.supplierName || 'N/A'}</td>
                        <td>{product.warehouseName || 'N/A'}</td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a data-bs-toggle="modal" data-bs-target="#edit-expired-product" className="me-2 p-2" onClick={() => navigate(`/product/edit/${product._id}`)}>
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
                      <td colSpan="8" className="text-center">No Expiry Product</td>
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

  )
}

export default ExpriedProduct



// import React from 'react'
// import { GrFormPrevious } from 'react-icons/gr';
// import { MdNavigateNext } from 'react-icons/md';
// const ExpiryData = [
//   {
//     id: 1,
//     name: "Product 01",
//     quantityReceived: "85 Kg",
//     warehouse: "WH-01",
//     category: "AB Industries",
//     exptime: "Today",
//     source: "--"
//   },
//   {
//     id: 2,
//     name: "Product 01",
//     quantityReceived: "22 Kg",
//     warehouse: "WH-01",
//     category: "AB Industries",
//     exptime: "Today",
//     source: "--"
//   },
//   {
//     id: 3,
//     name: "Product 01",
//     quantityReceived: "567 Boxes",
//     warehouse: "WH-01",
//     category: "AB Industries",
//     exptime: "Tomorrow",
//     source: "53 Boxes are Damaged"
//   },
//   {
//     id: 4,
//     name: "Product 01",
//     quantityReceived: "567 Boxes",
//     warehouse: "WH-01",
//     category: "AB Industries",
//     exptime: "Tomorrow",
//     source: "--"
//   },
//   {
//     id: 5,
//     name: "Product 01",
//     quantityReceived: "567 Boxes",
//     warehouse: "WH-01",
//     category: "AB Industries",
//     exptime: "Tomorrow",
//     source: "Need more 1000 Ltr"
//   },
//   {
//     id: 6,
//     name: "Product 01",
//     quantityReceived: "567 Boxes",
//     warehouse: "WH-01",
//     category: "AB Industries",
//     exptime: "21/09/2025",
//     source: "53 Boxes are Damaged"
//   },
//   {
//     id: 7,
//     name: "Product 01",
//     quantityReceived: "567 Boxes",
//     warehouse: "WH-01",
//     category: "AB Industries",
//     exptime: "21/09/2025",
//     source: "--"
//   },
//   {
//     id: 8,
//     name: "Product 01",
//     quantityReceived: "654 Bundle",
//     warehouse: "WH-01",
//     category: "AB Industries",
//     exptime: "21/09/2025",
//     source: "--"
//   },
//   {
//     id: 9,
//     name: "Product 01",
//     quantityReceived: "889 Ltr",
//     warehouse: "WH-01",
//     category: "AB Industries",
//     exptime: "21/09/2025",
//     source: "Need more 1000 Ltr"
//   },
// ]

// const exptime = (exptime) => {
//   switch (exptime) {
//     case "Today": return "today";
//     case "Tomorrow": return "tomorrow";
//     default: return "other";
//   }
// }
// const ExpriedProduct = () => {
//   return (
//     <div className='container-fluid'>
//       <div className='m-2 bg-white rounded-3 ebody'>

//         {/* header */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 15px', marginTop: '20px' }}>

//           <div>
//             <span className='ehead'>Expiry Items</span>
//           </div>

//           <div style={{ display: 'flex', gap: '15px' }} className='efilter'>

//             <input type="text" placeholder='Search items here...' style={{ borderRadius: '10px', border: '1px solid gray', padding: '10px', width: '400px', color: 'gray' }} className='einput-search' />

//             <div style={{ borderRadius: '10px', border: '1px solid gray', padding: '10px', width: '200px', color: 'gray' }} className='einput-date'>
//               <label>Date</label>
//               <input type="date" placeholder='Date' />
//             </div>

//             <select style={{ borderRadius: '10px', border: '1px solid gray', padding: '10px', width: '200px', color: 'gray' }} className='eselect-transaction'>
//               <option>Transaction type</option>
//               <option>option 2</option>
//             </select>

//           </div>
//         </div>

//         {/* table */}
//         <div style={{ padding: '0px 15px 10px' }}>
//           <table style={{ width: '100%' }}>
//             <thead>
//               <tr style={{ width: '100%', backgroundColor: '#007AFF', color: 'white' }}>
//                 <td style={{ borderTopLeftRadius: '10px', padding: '5px 5px', width: '40%' }}>Product name</td>
//                 <td style={{ width: '12%' }}>Quantity Received</td>
//                 <td style={{ width: '12%' }}>Warehouse</td>
//                 <td style={{ width: '12%' }}>Category</td>
//                 <td style={{ width: '12%' }}>Expiry Date</td>
//                 <td style={{ borderTopRightRadius: '10px', width: '12%' }}>Remarks / Notes</td>
//               </tr>
//             </thead>
//             <tbody>
//               {ExpiryData.map((e) =>
//                 <tr key={e.id} style={{ borderTop: '1px solid gray' }}>
//                   <td style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                     <div>
//                       <input type="checkbox" />
//                     </div>
//                     <div>
//                       <span style={{ color: '#007AFF' }}>{e.name}</span>
//                       <br />
//                       <span style={{ color: 'gray' }}>(SKU)</span>
//                     </div>
//                   </td>
//                   <td style={{ color: 'gray' }}>{e.quantityReceived}</td>
//                   <td style={{ color: 'gray' }}>{e.warehouse}</td>
//                   <td style={{ color: 'gray' }}>{e.category}</td>
//                   <td style={{ color: 'gray' }}><span className={`${exptime(e.exptime)}`} style={{ padding: '2px 5px', borderRadius: '5px' }}>{e.exptime}</span></td>
//                   <td style={{ color: 'gray' }}>{e.source}</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* result index */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 15px 20px', alignItems: 'center' }}>
//           <div style={{ display: 'flex', gap: '10px' }}>
//             <span style={{ color: 'gray' }}>Result Per page</span>
//             <select style={{ border: '1px solid gray', color: 'gray', borderRadius: '5px' }}>
//               <option>10</option>
//               <option>20</option>
//             </select>
//           </div>
//           <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//             <GrFormPrevious style={{ color: '#007AFF' }} />
//             <div style={{}}>
//               <button style={{ backgroundColor: '#007AFF', color: 'white', border: '1px solid gray' }}>01</button>
//               <button style={{ border: '1px solid gray', color: 'gray' }}>02</button>
//               <button style={{ border: '1px solid gray', color: 'gray' }}>03</button>
//             </div>
//             <MdNavigateNext style={{ color: '#007AFF' }} /></div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ExpriedProduct


