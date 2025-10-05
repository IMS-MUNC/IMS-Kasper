import { toast } from 'react-toastify';
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { FaFileExcel, FaFilePdf, FaPencilAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import "../../../../styles/product/product-list.css";
import BASE_URL from "../../../../pages/config/config";
import { CiCirclePlus } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronRight, FaFileCsv } from "react-icons/fa";
import { TbEdit, TbEye, TbRefresh, TbTrash } from 'react-icons/tb';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const Product = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [products, setProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [expiringCount, setExpiringCount] = useState(0);
  const [activeTabs, setActiveTabs] = useState({});
  // Pagination and filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  // Filter dropdowns
  const [brandOptions, setBrandOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [hsnOptions, setHsnOptions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedHsn, setSelectedHsn] = useState(null);
  const [search, setSearch] = useState("");


  // Fetch filter options (brands, categories, hsn)
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Brands
    axios.get(`${BASE_URL}/api/brands/active-brands`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setBrandOptions(res.data.brands.map(b => ({ value: b._id, label: b.brandName }))))
      .catch(() => setBrandOptions([]));
    // Categories
    axios.get(`${BASE_URL}/api/category/categories`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCategoryOptions(res.data.map(c => ({ value: c._id, label: c.categoryName }))))
      .catch(() => setCategoryOptions([]));
    // HSN
    axios.get(`${BASE_URL}/api/hsn/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setHsnOptions(res.data.map(h => ({ value: h._id, label: h.code || h.hsnCode || h.name }))))
      .catch(() => setHsnOptions([]));
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) { setSubcategoryOptions([]); setSelectedSubcategory(null); return; }
    const token = localStorage.getItem("token");
    axios.get(`${BASE_URL}/api/subcategory/by-category/${selectedCategory.value}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSubcategoryOptions(res.data.map(s => ({ value: s._id, label: s.subCategoryName }))))
      .catch(() => setSubcategoryOptions([]));
  }, [selectedCategory]);

  // Fetch products with filters and pagination
  const fetchProducts = React.useCallback(async () => {
    const token = localStorage.getItem("token");
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };
    if (selectedBrand) params.brand = selectedBrand.value;
    if (selectedCategory) params.category = selectedCategory.value;
    if (selectedSubcategory) params.subcategory = selectedSubcategory.value;
    if (selectedHsn) params.hsn = selectedHsn.value;
    if (search) params.search = search;
    try {
      const res = await axios.get(`${BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setProducts(res.data.products);
      setTotal(res.data.total);
      // Initialize all to "general"
      const initialTabs = res.data.products.reduce((acc, product) => {
        acc[product._id] = "general";
        return acc;
      }, {});
      setActiveTabs(initialTabs);
    } catch (err) {
      setProducts([]);
      setTotal(0);
      console.error("Failed to fetch products", err);
    }
  }, [selectedBrand, selectedCategory, selectedSubcategory, selectedHsn, search, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleTabClick = (productId, tab) => {
    setActiveTabs((prev) => ({ ...prev, [productId]: tab }));
  };

  //expiry code----------------------------------------------------------------------------------------------------------------------------------------------------------------------


  const getExpiryStatus = (expiryValue) => {
    const qtyString =
      Array.isArray(expiryValue) && expiryValue.length > 0
        ? expiryValue[0]
        : expiryValue;

    if (
      typeof qtyString === "string" &&
      qtyString.match(/^\d{2}-\d{2}-\d{4}$/)
    ) {
      const [day, month, year] = qtyString.split("-").map(Number);
      const expiryDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiryDate.setHours(0, 0, 0, 0);

      if (!isNaN(expiryDate.getTime())) {
        const diffTime = expiryDate - today;
        const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (daysDiff <= 0) return "Expired";
        if (daysDiff <= 2) return "Expiring Soon";
      }
    }
    return "";
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`, {
        });
        setProducts(res.data);

        let names = [];
        const count = res.data.reduce((acc, product) => {
          if (product.variants && product.variants.Expiry) {
            const status = getExpiryStatus(product.variants.Expiry);
            if (status === "Expired" || status === "Expiring Soon") {
              acc++;
              names.push(product.productName); // collect product name
            }
          }
          return acc;
        }, 0);

        setExpiringCount(count);
        setExpiringProducts(names);

        // Initialize tabs
        const initialTabs = res.data.reduce((acc, product) => {
          acc[product._id] = "general";
          return acc;
        }, {});
        setActiveTabs(initialTabs);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  //popup-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const [popup, setPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // store product
  const formRef = useRef(null);

  const handlePopupOpen = (product) => {
    setSelectedProduct(product); // set product
    setPopup(true); // open popup
  };

  const handlePopupClose = () => {
    setPopup(false); // open popup
  };

  const closeForm = () => {
    setPopup(false);
    setSelectedProduct(null); // clear selected product
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        closeForm();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const totalItems = products.length;
  // const totalPages = Math.ceil(totalItems / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const paginatedData = products.slice(startIndex, endIndex);

  //delete product--------------------------------------------------------------------------------------------------------------------------------------------------------

  const handleDelete = async (product) => {
    console.log("Deleting product:", product);
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
        if (paginatedData.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
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
    const doc = new jsPDF();
    doc.text("Category", 14, 15);
    const tableColumns = ["Product Name", "SKU", "Quantity", "Status", "Price"];

    const tableRows = products.map((e) => [
      e.productName,
      e.sku,
      e.quantity,
      e.trackType,
      e.sellingPrice,
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

    doc.save("products.pdf");
  };

  //download excel---------------------------------------------------------------------------------------------------------------------------------------------------------

  const handleExcel = () => {
    const tableColumns = ["Product Name", "SKU", "Quantity", "Status", "Price"];

    const tableRows = products.map((e) => [
      e.productName,
      e.sku,
      e.quantity,
      e.trackType,
      e.sellingPrice,
    ]);

    const data = [tableColumns, ...tableRows];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "products.xlsx");
  };

  //download csv-----------------------------------------------------------------------------------------------------------------------------------------------------------

  const handleCSV = () => {
    const tableHeader = ["Product Name", "SKU", "Quantity", "Status", "Price"];
    const csvRows = [
      tableHeader.join(","),
      ...products.map((e) =>
        [e.productName, e.sku, e.quantity, e.trackType, e.sellingPrice].join(
          ","
        )
      ),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //import excel-------------------------------------------------------------------------------------------------------------------------------------------------------------



  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx")) {
      alert("Please select a valid .xlsx file");
      e.target.value = "";
      return;
    }

    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", file);

      // Send to backend
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }
      await axios.post(`${BASE_URL}/api/products/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Imported successfully!");
    } catch (err) {
      console.error("Import Error:", err.response?.data || err.message || err);
      alert(
        "Error while Import: " +
        (err.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      e.target.value = ""; // Clear input
    }
  };


  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Product List</h4>
              <h6>Manage your products</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" onClick={handlePdf}><FaFilePdf style={{ color: "red" }} /></a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel" onClick={handleExcel}><FaFileExcel style={{ color: "orange" }} /></a>
            </li>
            <li>
              <a
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Refresh"
              // onClick={() => {
              //   fetchProducts();
              //   toast.success("Product list refreshed successfully!");
              // }}
              >
                <TbRefresh className="ti ti-refresh" />
              </a>
            </li>
            {/* <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
            </li> */}
          </ul>
          <div className="page-btn">
            <Link to="/add-product">
              <a className="btn btn-primary"><i className="ti ti-circle-plus me-1" />Add Product</a>
            </Link>
          </div>
          <div className="page-btn import">
            <a href="#" className="btn btn-secondary color" data-bs-toggle="modal" data-bs-target="#view-notes"><i data-feather="download" className="me-1" />Import Product</a>
          </div>
        </div>
        {/* Filter UI */}
        {/* <div className="row mb-3">
          <div className="col-md-2">
            <Select options={brandOptions} value={selectedBrand} onChange={setSelectedBrand} placeholder="Brand" isClearable />
          </div>
          <div className="col-md-2">
            <Select options={categoryOptions} value={selectedCategory} onChange={setSelectedCategory} placeholder="Category" isClearable />
          </div>
          <div className="col-md-2">
            <Select options={subcategoryOptions} value={selectedSubcategory} onChange={setSelectedSubcategory} placeholder="Subcategory" isClearable />
          </div>
          <div className="col-md-2">
            <Select options={hsnOptions} value={selectedHsn} onChange={setSelectedHsn} placeholder="HSN" isClearable />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div> */}
        {/* Pagination Controls */}
        {/* <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span>Page {currentPage} of {Math.ceil(total / itemsPerPage) || 1}</span>
            <button className="btn btn-sm btn-outline-secondary ms-2" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
            <button className="btn btn-sm btn-outline-secondary ms-2" disabled={currentPage >= Math.ceil(total / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
          <div>
            <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
            </select>
          </div>
        </div> */}
        {/* /product list */}
        <div className="card">

          <div className="card-header">
            <div className="row align-items-center justify-content-between">

              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by product name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Right Side: Brand and Category */}
              <div className="col-md-6 ms-auto">
                <div className="row justify-content-end">
                  <div className="col-md-4">
                    <Select
                      options={brandOptions}
                      value={selectedBrand}
                      onChange={setSelectedBrand}
                      placeholder="Brand"
                      isClearable
                    />
                  </div>
                  <div className="col-md-4">
                    <Select
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      placeholder="Category"
                      isClearable
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    {/* <th className="no-sort">
                  <label className="checkboxs">
                    <input type="checkbox" id="select-all" />
                    <span className="checkmarks" />
                  </label>
                </th> */}
                    <th>SKU </th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Unit</th>
                    <th>Qty</th>
                    {/* <th>Created By</th> */}
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>

                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "12px" }}
                      >
                        No products available
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr>
                        {/* <td>
                  <label className="checkboxs">
                    <input type="checkbox" />
                    <span className="checkmarks" />
                  </label>
                </td> */}
                        <td>{product.sku} </td>
                        <td onClick={() => handlePopupOpen(product)}>
                          <div className="d-flex align-items-center">
                            {product.images?.[0] && (
                              <a href="" className="avatar avatar-md me-2">
                                <img src={product.images[0].url}
                                  alt={product.productName || "No Image"}
                                  style={{ objectFit: "cover" }}
                                />
                              </a>
                            )}
                            <a className="text-capitalize">{product.productName} </a>
                          </div>
                        </td>
                        <td className="text-capitalize">{product.category?.categoryName}</td>
                        <td className="text-capitalize">{product.brand?.brandName}</td>
                        <td className="text-capitalize">₹{product.purchasePrice}</td>
                        <td className="text-capitalize">{product.unit}</td>
                        <td>{product.quantity}</td>
                        {/* <td>
                  <div className="d-flex align-items-center">
                    <a href="" className="avatar avatar-sm me-2">
                      <img src="assets/img/users/user-30.jpg" alt="product" />
                    </a>
                    <a href="">James Kirwin</a>
                  </div>
                </td> */}
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a className="me-2 p-2" onClick={() => handlePopupOpen(product)}>
                              <TbEye data-feather="eye" className="feather-eye" />
                            </a>
                            <a className="me-2 p-2" onClick={() => navigate(`/product/edit/${product._id}`)}>
                              <TbEdit data-feather="edit" className="feather-edit" />
                            </a>
                            <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" onClick={() => handleDelete(product)}>
                              <TbTrash data-feather="trash-2" className="feather-trash-2" />
                            </a>
                          </div>
                        </td>
                      </tr>

                    ))
                  )}


                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <div
            className="d-flex justify-content-end gap-3"
            style={{ padding: "10px 20px" }}
          >

            <select className="form-select w-auto" value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
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
              <span>Page {currentPage} of {Math.ceil(total / itemsPerPage) || 1}</span>
              {" "}
              <button
                style={{
                  border: "none",
                  color: "grey",
                  backgroundColor: "white",
                }}
                disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                <GrFormPrevious />
              </button>{" "}
              <button
                style={{ border: "none", backgroundColor: "white" }}
                disabled={currentPage >= Math.ceil(total / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)}>
                <MdNavigateNext />
              </button>
            </span>
          </div>
        </div>
        {/* /product list */}
      </div>
      {/* popup */}
      {popup && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "100px",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(199, 197, 197, 0.4)",
            backdropFilter: "blur(1px)",
            display: "flex",
            justifyContent: "center",
            zIndex: "10",
            overflowY: "auto",
          }}
        >
          <div
            ref={formRef}
            style={{
              maxWidth: "1300px",
              maxHeight: "670px",
              width: "838px",
              height: "347px",
              margin: "auto",
              overflowY: "auto",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            {/* All Content */}
            <div className="contents gap-2">

              {/* Tabs */}
              <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="button-group">
                  {["general", "pricing", "description", "variants"].map(
                    (tab) => (
                      <div
                        key={tab}
                        style={{ borderBottom: activeTabs[selectedProduct._id] === tab ? '2px solid black' : 'none' }}
                        className={`button-${activeTabs[selectedProduct._id] === tab
                          ? "active"
                          : "inactive"
                          } button-${tab}`}
                        onClick={() =>
                          handleTabClick(selectedProduct._id, tab)
                        }
                      >
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            textTransform: "none",
                            cursor: "pointer",
                          }}
                        >
                          {tab === "general"
                            ? "General Information"
                            : tab === "pricing"
                              ? "Pricing & Tax"
                              : tab === "description"
                                ? "Description & Media"
                                : "Variants"}
                        </p>
                      </div>
                    )
                  )}
                </div>
                <div style={{ position: 'relative', top: '3px', right: '5px' }}>
                  <span style={{ backgroundColor: 'red', color: 'white', padding: '5px 13px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' }} onClick={handlePopupClose}>x</span>
                </div>
              </div>

              {/* Toggle Sections */}
              <div className="" style={{ padding: '15px 25px' }}>
                {activeTabs[selectedProduct._id] === "general" && (
                  <div className="section-container">

                    {/* product info */}
                    <div className="section-header" style={{ backgroundColor: '#F5F6FA', alignItems: 'center' }}>
                      <div className="section-title">
                        <div
                          className="icon-container"
                          style={{
                            height: "50px",
                            width: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "8px",
                            overflow: "hidden",
                            padding: "2px",
                          }}
                        >
                          {/* <FaShoppingBag /> */}
                          {selectedProduct.images?.[0] && (
                            <img
                              src={selectedProduct.images[0].url}
                              alt={selectedProduct.productName}
                              className="media-image"
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                              }}
                            />
                          )}
                        </div>

                        <div>
                          <h3 className="section-title-text" style={{ color: 'black' }}>
                            {selectedProduct.productName}
                          </h3>
                          <br />
                          <h6 className="section-subtitle">

                            SKU-{selectedProduct.sku} • {selectedProduct.itemType} • Available Qty -{" "}
                            {selectedProduct.quantity} {selectedProduct.unit}
                            {selectedProduct.variants &&
                              Object.keys(selectedProduct.variants).includes(
                                "Expiry"
                              ) ? (
                              Object.entries(selectedProduct.variants)
                                .filter(([variant]) => variant === "Expiry")
                                .map(([variant, qty]) => {
                                  let statusText = "";
                                  let displayQty = "0"; // Default display value
                                  let statusdisc = "";
                                  // Extract qtyString from array or use qty directly
                                  const qtyString =
                                    Array.isArray(qty) && qty.length > 0
                                      ? qty[0]
                                      : qty;
                                  // Set displayQty to qtyString if it's a string, else keep "0"
                                  if (typeof qtyString === "string") {
                                    displayQty = qtyString;
                                  }
                                  // Process date if qtyString matches DD-MM-YYYY format
                                  if (
                                    typeof qtyString === "string" &&
                                    qtyString.match(/^\d{2}-\d{2}-\d{4}$/)
                                  ) {
                                    try {
                                      const [day, month, year] = qtyString
                                        .split("-")
                                        .map(Number);
                                      const expiryDate = new Date(
                                        year,
                                        month - 1,
                                        day
                                      );
                                      const today = new Date(); // Current date (August 27, 2025, 5:44 PM IST)
                                      today.setHours(0, 0, 0, 0); // Reset time to midnight
                                      expiryDate.setHours(0, 0, 0, 0); // Reset time for expiry
                                      if (!isNaN(expiryDate.getTime())) {
                                        const diffTime = expiryDate - today;
                                        const daysDiff = Math.ceil(
                                          diffTime / (1000 * 60 * 60 * 24)
                                        );
                                        if (daysDiff <= 0) {
                                          statusdisc = "Expired";
                                        } else if (daysDiff <= 2) {
                                          statusdisc = "Expiring Soon";
                                        } else {
                                          statusdisc = "";
                                        }
                                      } else {
                                        console.log(
                                          "Invalid date for qtyString:",
                                          qtyString
                                        ); // Debug: Log invalid date
                                      }
                                    } catch (error) {
                                      console.log(
                                        "Error parsing date for qtyString:",
                                        qtyString,
                                        error
                                      ); // Debug: Log errors
                                    }
                                  } else {
                                    console.log(
                                      "Non-string or invalid format qtyString:",
                                      qtyString
                                    ); // Debug: Log invalid format
                                  }
                                  return (
                                    <span key={variant} style={{ color: "red" }}>
                                      {statusdisc ? " • " + statusdisc : ""}
                                    </span>
                                  );
                                })
                            ) : (
                              <span key="Expiry"></span>
                            )}
                          </h6>
                        </div>
                      </div>
                      <div
                        style={{
                          // background: "#007bff",
                          // color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                        onClick={() =>
                          navigate(`/product/edit/${selectedProduct._id}`)
                        }
                      >
                        <FiEdit />
                      </div>

                    </div>

                    {/* All Categories */}
                    <div className="categories">
                      {/* Category */}
                      <div className="category">
                        <div className="category-item">
                          <p className="label">Category</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.category?.categoryName || "N/A"}
                          </p>
                        </div>
                        <div className="category-item">
                          <p className="label">Sub Category</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.subcategory?.subCategoryName || "N/A"}
                          </p>
                        </div>
                        {/* <div className="category-item">
                              <p className="label">Initial Stock</p>
                              <p
                                className="value"
                                style={{
                                  color:'black',
                                  fontWeight:'400',
                                  fontSize: "15px",
                                  marginTop: "-20px",
                                }}
                              >
                                {selectedProduct.initialStock || "N/A"}
                              </p>
                            </div> */}
                        <div className="category-item">
                          <p className="label">Reorder Level</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.reorderLevel || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Brands */}
                      <div className="category">
                        <div className="category-item">
                          <p className="label">Brands/Manufacturer</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.brand?.brandName || "N/A"}
                          </p>
                        </div>
                        <div className="category-item">
                          <p className="label">Barcode</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.itemBarcode || "N/A"}
                          </p>
                          {/* <p className="value">EAN - 1234 5678 9090</p> */}
                        </div>
                        <div className="category-item">
                          <p className="label">Initial Stock Quantity</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.initialStock || "N/A"}
                          </p>
                        </div>
                        {/* <div className="category-item">
                              <p className="label">Lead Time</p>
                              <p
                                className="value"
                                style={{
                                  color:'black',
                                  fontWeight:'400',
                                  fontSize: "15px",
                                  marginTop: "-20px",
                                }}
                              >
                                {selectedProduct.leadTime || "N/A"}
                              </p>
                            </div> */}
                        {/* <div className="category-item">
                              <p className="label">Serial Number</p>
                              <p
                                className="value"
                                style={{
                                  color:'black',
                                  fontWeight:'400',
                                  fontSize: "15px",
                                  marginTop: "-20px",
                                }}
                              >
                                {selectedProduct.serialNumber || "N/A"}
                              </p>
                            </div> */}
                      </div>

                      {/* Product Type */}
                      <div className="category">
                        <div className="category-item">
                          <p className="label">Product Type</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.productType || "N/A"}
                          </p>
                        </div>
                        <div className="category-item">
                          <p className="label">Warehouse Name</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.warehouseName || "N/A"}
                          </p>
                        </div>
                        {/* <div className="category-item">
                              <p className="label">Warehouse Location</p>
                              <p
                                className="value"
                                style={{
                                  color:'black',
                                  fontWeight:'400',
                                  fontSize: "15px",
                                  marginTop: "-20px",
                                }}
                              >
                                {selectedProduct.address || "N/A"}
                              </p>
                            </div> */}
                        <div className="category-item">
                          <p className="label">Track by</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.serialNumber || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Supplier & Warehouse */}
                      <div className="category">
                        {/* <div className="category-item">
                            <p className="label">Supplier</p>
                            <p
                              className="value"
                              style={{
                                color: 'black',
                                fontWeight: '400',
                                fontSize: "15px",
                                marginTop: "-20px",
                              }}
                            >
                              {selectedProduct.supplierName || "-"}
                            </p>
                          </div> */}



                        {/* <div className="category-item">
                              <p className="label">Store</p>
                              <p
                                className="value"
                                style={{
                                  color:'black',
                                  fontWeight:'400',
                                  fontSize: "15px",
                                  marginTop: "-20px",
                                }}
                              >
                                {selectedProduct.store || "-"}
                              </p>
                            </div> */}
                        <div className="category-item">
                          <p className="label">Lead Time</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.leadTime || "N/A"}
                          </p>
                        </div>
                        <div className="category-item">
                          <p className="label">Status</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.isReturnable === 'true' ? 'Returnable' : 'Non-Returnable'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTabs[selectedProduct._id] === "pricing" && (
                  <div className="section-container">

                    {/* product info */}
                    <div className="section-header" style={{ backgroundColor: '#F5F6FA', alignItems: 'center' }}>
                      <div className="section-title">
                        <div
                          className="icon-container"
                          style={{
                            height: "50px",
                            width: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "8px",
                            overflow: "hidden",
                            padding: "2px",
                          }}
                        >
                          {/* <FaShoppingBag /> */}
                          {selectedProduct.images?.[0] && (
                            <img
                              src={selectedProduct.images[0].url}
                              alt={selectedProduct.productName}
                              className="media-image"
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                              }}
                            />
                          )}
                        </div>

                        <div>
                          <h3 className="section-title-text" style={{ color: 'black' }}>
                            {selectedProduct.productName}
                          </h3>
                          <br />
                          <h6 className="section-subtitle">

                            SKU-{selectedProduct.sku} • {selectedProduct.itemType} • Available Qty -{" "}
                            {selectedProduct.quantity} {selectedProduct.unit}
                            {selectedProduct.variants &&
                              Object.keys(selectedProduct.variants).includes(
                                "Expiry"
                              ) ? (
                              Object.entries(selectedProduct.variants)
                                .filter(([variant]) => variant === "Expiry")
                                .map(([variant, qty]) => {
                                  let statusText = "";
                                  let displayQty = "0"; // Default display value
                                  let statusdisc = "";
                                  // Extract qtyString from array or use qty directly
                                  const qtyString =
                                    Array.isArray(qty) && qty.length > 0
                                      ? qty[0]
                                      : qty;
                                  // Set displayQty to qtyString if it's a string, else keep "0"
                                  if (typeof qtyString === "string") {
                                    displayQty = qtyString;
                                  }
                                  // Process date if qtyString matches DD-MM-YYYY format
                                  if (
                                    typeof qtyString === "string" &&
                                    qtyString.match(/^\d{2}-\d{2}-\d{4}$/)
                                  ) {
                                    try {
                                      const [day, month, year] = qtyString
                                        .split("-")
                                        .map(Number);
                                      const expiryDate = new Date(
                                        year,
                                        month - 1,
                                        day
                                      );
                                      const today = new Date(); // Current date (August 27, 2025, 5:44 PM IST)
                                      today.setHours(0, 0, 0, 0); // Reset time to midnight
                                      expiryDate.setHours(0, 0, 0, 0); // Reset time for expiry
                                      if (!isNaN(expiryDate.getTime())) {
                                        const diffTime = expiryDate - today;
                                        const daysDiff = Math.ceil(
                                          diffTime / (1000 * 60 * 60 * 24)
                                        );
                                        if (daysDiff <= 0) {
                                          statusdisc = "Expired";
                                        } else if (daysDiff <= 2) {
                                          statusdisc = "Expiring Soon";
                                        } else {
                                          statusdisc = "";
                                        }
                                      } else {
                                        console.log(
                                          "Invalid date for qtyString:",
                                          qtyString
                                        ); // Debug: Log invalid date
                                      }
                                    } catch (error) {
                                      console.log(
                                        "Error parsing date for qtyString:",
                                        qtyString,
                                        error
                                      ); // Debug: Log errors
                                    }
                                  } else {
                                    console.log(
                                      "Non-string or invalid format qtyString:",
                                      qtyString
                                    ); // Debug: Log invalid format
                                  }
                                  return (
                                    <span key={variant} style={{ color: "red" }}>
                                      {statusdisc ? " • " + statusdisc : ""}
                                    </span>
                                  );
                                })
                            ) : (
                              <span key="Expiry"></span>
                            )}
                          </h6>
                        </div>
                      </div>
                      <div
                        style={{
                          // background: "#007bff",
                          // color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                        onClick={() =>
                          navigate(`/product/edit/${selectedProduct._id}`)
                        }
                      >
                        <FiEdit />
                      </div>

                    </div>

                    {/* All Categories */}
                    <div className="categories">
                      {/* Category */}
                      <div className="category">
                        <div className="category-item">
                          <p className="label">Purchase Price</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.purchasePrice}
                          </p>
                        </div>
                        <div className="category-item">
                          <p className="label">Unit</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.unit}
                          </p>
                        </div>
                        <div className="category-item">
                          <p className="label">HSN / SAC</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.hsnCode || "-"}
                          </p>
                        </div>
                      </div>

                      {/* Brands */}
                      <div className="category">
                        <div className="category-item">
                          <p className="label">Selling price</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.sellingPrice}
                          </p>
                        </div>
                        <div className="category-item">
                          <p className="label">Discount</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.discountValue} {selectedProduct.discountType == "Percentage" ? "%" : 'rupee'}
                          </p>
                          {/* <p className="value">EAN - 1234 5678 9090</p> */}
                        </div>
                        <div className="category-item">
                          <p className="label">GST Rate</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.tax}%
                          </p>
                        </div>
                      </div>

                      {/* Product Type */}
                      <div className="category">
                        <div className="category-item">
                          <p className="label">
                            Wholesale Price / Bulk Price
                          </p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.wholesalePrice}
                          </p>
                        </div>
                        <div className="category-item">
                          <p className="label">
                            Retail Price
                          </p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.retailPrice}
                          </p>
                        </div>
                        <div className="category-item">
                          <p className="label">GST Type</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.taxType}
                          </p>
                        </div>
                      </div>

                      {/* Supplier */}
                      <div className="category">
                        <div className="category-item">
                          <p className="label">Quantity</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.quantity}
                          </p>
                        </div>
                        <div className="category-item">
                          <p className="label">Quantity Alert</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.quantityAlert}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTabs[selectedProduct._id] === "description" && (
                  <div className="section-container">
                    {/* product info */}
                    <div className="section-header" style={{ backgroundColor: '#F5F6FA', alignItems: 'center' }}>
                      <div className="section-title">
                        <div
                          className="icon-container"
                          style={{
                            height: "50px",
                            width: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "8px",
                            overflow: "hidden",
                            padding: "2px",
                          }}
                        >
                          {/* <FaShoppingBag /> */}
                          {selectedProduct.images?.[0] && (
                            <img
                              src={selectedProduct.images[0].url}
                              alt={selectedProduct.productName}
                              className="media-image"
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                              }}
                            />
                          )}
                        </div>

                        <div>
                          <h3 className="section-title-text" style={{ color: 'black' }}>
                            {selectedProduct.productName}
                          </h3>
                          <br />
                          <h6 className="section-subtitle">

                            SKU-{selectedProduct.sku} • {selectedProduct.itemType} • Available Qty -{" "}
                            {selectedProduct.quantity} {selectedProduct.unit}
                            {selectedProduct.variants &&
                              Object.keys(selectedProduct.variants).includes(
                                "Expiry"
                              ) ? (
                              Object.entries(selectedProduct.variants)
                                .filter(([variant]) => variant === "Expiry")
                                .map(([variant, qty]) => {
                                  let statusText = "";
                                  let displayQty = "0"; // Default display value
                                  let statusdisc = "";
                                  // Extract qtyString from array or use qty directly
                                  const qtyString =
                                    Array.isArray(qty) && qty.length > 0
                                      ? qty[0]
                                      : qty;
                                  // Set displayQty to qtyString if it's a string, else keep "0"
                                  if (typeof qtyString === "string") {
                                    displayQty = qtyString;
                                  }
                                  // Process date if qtyString matches DD-MM-YYYY format
                                  if (
                                    typeof qtyString === "string" &&
                                    qtyString.match(/^\d{2}-\d{2}-\d{4}$/)
                                  ) {
                                    try {
                                      const [day, month, year] = qtyString
                                        .split("-")
                                        .map(Number);
                                      const expiryDate = new Date(
                                        year,
                                        month - 1,
                                        day
                                      );
                                      const today = new Date(); // Current date (August 27, 2025, 5:44 PM IST)
                                      today.setHours(0, 0, 0, 0); // Reset time to midnight
                                      expiryDate.setHours(0, 0, 0, 0); // Reset time for expiry
                                      if (!isNaN(expiryDate.getTime())) {
                                        const diffTime = expiryDate - today;
                                        const daysDiff = Math.ceil(
                                          diffTime / (1000 * 60 * 60 * 24)
                                        );
                                        if (daysDiff <= 0) {
                                          statusdisc = "Expired";
                                        } else if (daysDiff <= 2) {
                                          statusdisc = "Expiring Soon";
                                        } else {
                                          statusdisc = "";
                                        }
                                      } else {
                                        console.log(
                                          "Invalid date for qtyString:",
                                          qtyString
                                        ); // Debug: Log invalid date
                                      }
                                    } catch (error) {
                                      console.log(
                                        "Error parsing date for qtyString:",
                                        qtyString,
                                        error
                                      ); // Debug: Log errors
                                    }
                                  } else {
                                    console.log(
                                      "Non-string or invalid format qtyString:",
                                      qtyString
                                    ); // Debug: Log invalid format
                                  }
                                  return (
                                    <span key={variant} style={{ color: "red" }}>
                                      {statusdisc ? " • " + statusdisc : ""}
                                    </span>
                                  );
                                })
                            ) : (
                              <span key="Expiry"></span>
                            )}
                          </h6>
                        </div>
                      </div>
                      <div
                        style={{
                          // background: "#007bff",
                          // color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                        onClick={() =>
                          navigate(`/product/edit/${selectedProduct._id}`)
                        }
                      >
                        <FiEdit />
                      </div>

                    </div>


                    <div style={{ display: 'flex', justifyContent: 'start', padding: '20px' }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          width: "250px",
                          height: "150px",
                          alignItems: "center",
                          overflow: "hidden",
                          padding: "2px",
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      >
                        {selectedProduct.images?.[0] && (
                          <img
                            src={selectedProduct.images[0].url}
                            alt={selectedProduct.productName}
                            className="media-image"
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </div>

                      <div style={{}}>
                        <div className="" style={{ display: 'flex', justifyContent: 'start' }}>
                          <div className="category-item">
                            <p className="label">SEO META TITLE</p>
                            <p

                              style={{
                                color: 'black',
                                fontWeight: '400',
                                fontSize: "15px",
                                marginTop: "-20px",
                              }}
                            >
                              {selectedProduct.seoTitle}
                            </p>
                          </div>
                          <div className="category-item">
                            <p className="label">SEO META Description</p>
                            <p

                              style={{
                                color: 'black',
                                fontWeight: '400',
                                fontSize: "15px",
                                marginTop: "-20px",
                              }}
                            >
                              {selectedProduct.seoDescription}
                            </p>
                          </div>
                        </div>
                        <div className="category-item">
                          <p className="label">Description</p>
                          <p
                            className="value"
                            style={{
                              color: 'black',
                              fontWeight: '400',
                              fontSize: "15px",
                              marginTop: "-20px",
                            }}
                          >
                            {selectedProduct.description.length > 100 ? selectedProduct.description.slice(0, 100) + '...' : selectedProduct.description}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {activeTabs[selectedProduct._id] === "variants" &&
                  selectedProduct.variants && (
                    <div className="section-container" style={{ border: 'none' }}>

                      {/* product info */}
                      <div className="section-header" style={{ backgroundColor: '#F5F6FA', alignItems: 'center' }}>
                        <div className="section-title">
                          <div
                            className="icon-container"
                            style={{
                              height: "50px",
                              width: "50px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: "8px",
                              overflow: "hidden",
                              padding: "2px",
                            }}
                          >
                            {/* <FaShoppingBag /> */}
                            {selectedProduct.images?.[0] && (
                              <img
                                src={selectedProduct.images[0].url}
                                alt={selectedProduct.productName}
                                className="media-image"
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                          </div>

                          <div>
                            <h3 className="section-title-text" style={{ color: 'black' }}>
                              {selectedProduct.productName}
                            </h3>
                            <br />
                            <h6 className="section-subtitle">

                              SKU-{selectedProduct.sku} • {selectedProduct.itemType} • Available Qty -{" "}
                              {selectedProduct.quantity} {selectedProduct.unit}
                              {selectedProduct.variants &&
                                Object.keys(selectedProduct.variants).includes(
                                  "Expiry"
                                ) ? (
                                Object.entries(selectedProduct.variants)
                                  .filter(([variant]) => variant === "Expiry")
                                  .map(([variant, qty]) => {
                                    let statusText = "";
                                    let displayQty = "0"; // Default display value
                                    let statusdisc = "";
                                    // Extract qtyString from array or use qty directly
                                    const qtyString =
                                      Array.isArray(qty) && qty.length > 0
                                        ? qty[0]
                                        : qty;
                                    // Set displayQty to qtyString if it's a string, else keep "0"
                                    if (typeof qtyString === "string") {
                                      displayQty = qtyString;
                                    }
                                    // Process date if qtyString matches DD-MM-YYYY format
                                    if (
                                      typeof qtyString === "string" &&
                                      qtyString.match(/^\d{2}-\d{2}-\d{4}$/)
                                    ) {
                                      try {
                                        const [day, month, year] = qtyString
                                          .split("-")
                                          .map(Number);
                                        const expiryDate = new Date(
                                          year,
                                          month - 1,
                                          day
                                        );
                                        const today = new Date(); // Current date (August 27, 2025, 5:44 PM IST)
                                        today.setHours(0, 0, 0, 0); // Reset time to midnight
                                        expiryDate.setHours(0, 0, 0, 0); // Reset time for expiry
                                        if (!isNaN(expiryDate.getTime())) {
                                          const diffTime = expiryDate - today;
                                          const daysDiff = Math.ceil(
                                            diffTime / (1000 * 60 * 60 * 24)
                                          );
                                          if (daysDiff <= 0) {
                                            statusdisc = "Expired";
                                          } else if (daysDiff <= 2) {
                                            statusdisc = "Expiring Soon";
                                          } else {
                                            statusdisc = "";
                                          }
                                        } else {
                                          console.log(
                                            "Invalid date for qtyString:",
                                            qtyString
                                          ); // Debug: Log invalid date
                                        }
                                      } catch (error) {
                                        console.log(
                                          "Error parsing date for qtyString:",
                                          qtyString,
                                          error
                                        ); // Debug: Log errors
                                      }
                                    } else {
                                      console.log(
                                        "Non-string or invalid format qtyString:",
                                        qtyString
                                      ); // Debug: Log invalid format
                                    }
                                    return (
                                      <span key={variant} style={{ color: "red" }}>
                                        {statusdisc ? " • " + statusdisc : ""}
                                      </span>
                                    );
                                  })
                              ) : (
                                <span key="Expiry"></span>
                              )}
                            </h6>
                          </div>
                        </div>
                        <div
                          style={{
                            // background: "#007bff",
                            // color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            marginRight: "8px",
                          }}
                          onClick={() =>
                            navigate(`/product/edit/${selectedProduct._id}`)
                          }
                        >
                          <FiEdit />
                        </div>

                      </div>

                      <div className="" style={{ border: '1px solid #F5F6FA', borderRadius: '6px', marginTop: '15px' }}>
                        {Object.entries(selectedProduct.variants).map(
                          ([variant, value], index) => (
                            <div key={variant} className="" style={{ padding: '10px 15px', display: 'flex', backgroundColor: index % 2 === 0 ? 'white' : '#F5F6FA' }}>
                              <span style={{ width: '100px' }}>{variant}</span>
                              <span style={{ color: 'black' }}>: {value}</span>
                            </div>
                          )
                        )}
                      </div>

                    </div>
                  )}
              </div>

            </div>

          </div>
        </div>
      )}
    </div>


  )
}

export default Product


//new verson----------------------------------------------------------------------------------------------------------------------------------------

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { FaFileExcel, FaFilePdf, FaPencilAlt } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { FaShoppingBag } from "react-icons/fa";
// import "../../../../styles/product/product-list.css";
// import BASE_URL from "../../../../pages/config/config";
// import { CiCirclePlus } from "react-icons/ci";
// import { IoEyeOutline } from "react-icons/io5";
// import { FiEdit } from "react-icons/fi";
// import { RiDeleteBinLine } from "react-icons/ri";
// import { FaAngleLeft } from "react-icons/fa6";
// import { FaChevronRight, FaFileCsv } from "react-icons/fa";
// import { TbEdit, TbRefresh, TbTrash } from 'react-icons/tb';

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";

// function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [activeTabs, setActiveTabs] = useState({});
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const token = localStorage.getItem("token"); // Make sure the token is stored here after login

//       try {
//         const res = await axios.get(`${BASE_URL}/api/products`, {
//           headers: {
//             Authorization: `Bearer ${token}`, // ✅ token sent properly
//           },
//         });
//         setProducts(res.data);
//         // Initialize all to "general"
//         const initialTabs = res.data.reduce((acc, product) => {
//           acc[product._id] = "general";
//           return acc;
//         }, {});
//         setActiveTabs(initialTabs);
//       } catch (err) {
//         console.error("Failed to fetch products", err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const handleTabClick = (productId, tab) => {
//     setActiveTabs((prev) => ({ ...prev, [productId]: tab }));
//   };

//   //expiry code----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//   const [expiringProducts, setExpiringProducts] = useState([]);

//   const getExpiryStatus = (expiryValue) => {
//     const qtyString =
//       Array.isArray(expiryValue) && expiryValue.length > 0
//         ? expiryValue[0]
//         : expiryValue;

//     if (
//       typeof qtyString === "string" &&
//       qtyString.match(/^\d{2}-\d{2}-\d{4}$/)
//     ) {
//       const [day, month, year] = qtyString.split("-").map(Number);
//       const expiryDate = new Date(year, month - 1, day);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       expiryDate.setHours(0, 0, 0, 0);

//       if (!isNaN(expiryDate.getTime())) {
//         const diffTime = expiryDate - today;
//         const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         if (daysDiff <= 0) return "Expired";
//         if (daysDiff <= 2) return "Expiring Soon";
//       }
//     }
//     return "";
//   };

//   const [expiringCount, setExpiringCount] = useState(0);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/products`);
//         setProducts(res.data);

//         let names = [];
//         const count = res.data.reduce((acc, product) => {
//           if (product.variants && product.variants.Expiry) {
//             const status = getExpiryStatus(product.variants.Expiry);
//             if (status === "Expired" || status === "Expiring Soon") {
//               acc++;
//               names.push(product.productName); // collect product name
//             }
//           }
//           return acc;
//         }, 0);

//         setExpiringCount(count);
//         setExpiringProducts(names);

//         // Initialize tabs
//         const initialTabs = res.data.reduce((acc, product) => {
//           acc[product._id] = "general";
//           return acc;
//         }, {});
//         setActiveTabs(initialTabs);
//       } catch (err) {
//         console.error("Failed to fetch products", err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   //popup-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//   const [popup, setPopup] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null); // store product
//   const formRef = useRef(null);

//   const handlePopupOpen = (product) => {
//     setSelectedProduct(product); // set product
//     setPopup(true); // open popup
//   };

//   const handlePopupClose = () => {
//     setPopup(false); // open popup
//   };

//   const closeForm = () => {
//     setPopup(false);
//     setSelectedProduct(null); // clear selected product
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (formRef.current && !formRef.current.contains(event.target)) {
//         closeForm();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const totalItems = products.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedData = products.slice(startIndex, endIndex);

//   //delete product--------------------------------------------------------------------------------------------------------------------------------------------------------

//   const handleDelete = async (product) => {
//     console.log("Deleting product:", product);
//     if (
//       window.confirm(`Are you sure you want to delete ${product.productName}?`)
//     ) {
//       try {
//         const token = localStorage.getItem("token");
//         await axios.delete(`${BASE_URL}/api/products/pro/${product._id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProducts((prevProducts) =>
//           prevProducts.filter((p) => p._id !== product._id)
//         );
//         if (paginatedData.length === 1 && currentPage > 1) {
//           setCurrentPage((prev) => prev - 1);
//         }
//         alert("Product deleted successfully!");
//       } catch (err) {
//         console.error("Failed to delete product:", err.response?.data || err);
//         alert(
//           `Failed to delete product: ${err.response?.data?.message || err.message
//           }`
//         );
//       }
//     }
//   };

//   //download pdf-------------------------------------------------------------------------------------------------------------------------------------------

//   const handlePdf = () => {
//     const doc = new jsPDF();
//     doc.text("Category", 14, 15);
//     const tableColumns = ["Product Name", "SKU", "Quantity", "Status", "Price"];

//     const tableRows = products.map((e) => [
//       e.productName,
//       e.sku,
//       e.quantity,
//       e.trackType,
//       e.sellingPrice,
//     ]);

//     autoTable(doc, {
//       head: [tableColumns],
//       body: tableRows,
//       startY: 20,
//       styles: {
//         fontSize: 8,
//       },
//       headStyles: {
//         fillColor: [155, 155, 155],
//         textColor: "white",
//       },
//       theme: "striped",
//     });

//     doc.save("products.pdf");
//   };

//   //download excel---------------------------------------------------------------------------------------------------------------------------------------------------------

//   const handleExcel = () => {
//     const tableColumns = ["Product Name", "SKU", "Quantity", "Status", "Price"];

//     const tableRows = products.map((e) => [
//       e.productName,
//       e.sku,
//       e.quantity,
//       e.trackType,
//       e.sellingPrice,
//     ]);

//     const data = [tableColumns, ...tableRows];

//     const worksheet = XLSX.utils.aoa_to_sheet(data);

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

//     XLSX.writeFile(workbook, "products.xlsx");
//   };

//   //download csv-----------------------------------------------------------------------------------------------------------------------------------------------------------

//   const handleCSV = () => {
//     const tableHeader = ["Product Name", "SKU", "Quantity", "Status", "Price"];
//     const csvRows = [
//       tableHeader.join(","),
//       ...products.map((e) =>
//         [e.productName, e.sku, e.quantity, e.trackType, e.sellingPrice].join(
//           ","
//         )
//       ),
//     ];
//     const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "products.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   //import excel-------------------------------------------------------------------------------------------------------------------------------------------------------------

//   const fileInputRef = useRef();

//   const handleImportClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.name.endsWith(".xlsx")) {
//       alert("Please select a valid .xlsx file");
//       e.target.value = "";
//       return;
//     }

//     try {
//       // Create FormData and append the file
//       const formData = new FormData();
//       formData.append("file", file);

//       // Send to backend
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No token found in localStorage");
//       }
//       await axios.post(`${BASE_URL}/api/products/import`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success("Imported successfully!");
//     } catch (err) {
//       console.error("Import Error:", err.response?.data || err.message || err);
//       alert(
//         "Error while Import: " +
//         (err.response?.data?.message || err.message || "Unknown error")
//       );
//     } finally {
//       e.target.value = ""; // Clear input
//     }
//   };

//   return (
//     <div className="page-wrapper ">
//       <div className="content">
//         <div>
//           <div
//             style={{
//               background: "#fff",
//               padding: "10px 20px",
//               borderRadius: "12px",
//               boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//               marginTop: "0px",
//             }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <div>
//                 <h5
//                   style={{
//                     marginBottom: "10px",
//                     fontWeight: "700",
//                     color: "#333",
//                   }}
//                 >
//                   Products
//                 </h5>
//                 <h6 style={{ fontWeight: "400" }}>Manage Your Products</h6>
//               </div>

//               <div className="d-flex gap-2">
//                 <div className="table-top-head me-2">
//                   <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
//                     <label className="" title="">Export : </label>
//                     <button
//                       type="button"
//                       title="Pdf"
//                       style={{
//                         backgroundColor: "white",
//                         display: "flex",
//                         alignItems: "center",
//                         border: "none",
//                       }}
//                       onClick={handlePdf}
//                     >
//                       <FaFilePdf style={{ color: "red" }} />
//                     </button>
//                     <button
//                       type="button"
//                       title="Export Excel"
//                       style={{
//                         backgroundColor: "white",
//                         display: "flex",
//                         alignItems: "center",
//                         border: "none",
//                       }}
//                       onClick={handleExcel}
//                     >
//                       <FaFileExcel style={{ color: "orange" }} />
//                     </button>
//                   </li>
//                   {/* <li>
//                     <button
//                       type="button"
//                       className="icon-btn"
//                       title="Export Excel"
//                       onClick={handleExcel}
//                     >
//                       <FaFileExcel style={{ color: "orange" }} />
//                     </button>
//                   </li> */}
//                   <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
//                     {/* <label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls" hidden /><FaFileExcel style={{ color: "green" }} /></label> */}
//                     <label className="" title="">Import : </label>
//                     <label className="" title="Import Excel">
//                       <button
//                         type="button"
//                         onClick={handleImportClick}
//                         style={{
//                           backgroundColor: "white",
//                           display: "flex",
//                           alignItems: "center",
//                           border: "none",
//                         }}
//                       >
//                         <FaFileExcel style={{ color: "green" }} />
//                       </button>
//                       <input
//                         type="file"
//                         accept=".xlsx"
//                         ref={fileInputRef}
//                         style={{ display: "none" }}
//                         onChange={handleFileChange}
//                       />
//                     </label>
//                   </li>
//                   <li>
//                     <button data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" onClick={() => location.reload()} className="fs-20" style={{ backgroundColor: 'white', color: '', padding: '5px 5px', display: 'flex', alignItems: 'center', border: '1px solid #e8eaebff', cursor: 'pointer', borderRadius: '4px' }}><TbRefresh className="ti ti-refresh" /></button>
//                   </li>
//                 </div>
//                 <Link to="/add-product">
//                   <a className="btn btn-primary" style={{ marginTop: "5px" }}>
//                     <CiCirclePlus className="me-1" />
//                     Add Products
//                   </a>
//                 </Link>
//               </div>
//             </div>

//             <div style={{ marginTop: "15px" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                 }}
//               >
//                 <thead>
//                   <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
//                     <th
//                       style={{ padding: "12px", borderTopLeftRadius: "12px" }}
//                     >
//                       Product Name
//                     </th>
//                     <th style={{}}>SKU</th>
//                     <th style={{}}>Available QTY</th>
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Category</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Brands/Manufacturer</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Product Type</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Supplier</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Supplier SKU</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Barcode</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Warehouse Location</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Warehouse</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Reorder Level</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Initial Stock Quantity</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Track by</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Lead Time</th> */}
//                     <th style={{}}>Status</th>
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Purchase Price</th> */}
//                     <th style={{}}>Selling price</th>
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Wholesale Price / Bulk Price</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Quantity</th> */}
//                     {/* <th style={{ }}>Unit</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Discount</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Discount Period</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>HSN / SAC</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>GST Rate</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>SEO META TITLE</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>SEO META Description</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Description</th> */}
//                     {/* <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Varient</th> */}
//                     <th
//                       style={{
//                         textAlign: "center",
//                         borderTopRightRadius: "12px",
//                       }}
//                     >
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedData.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan="6"
//                         style={{ textAlign: "center", padding: "12px" }}
//                       >
//                         No products available
//                       </td>
//                     </tr>
//                   ) : (
//                     paginatedData.map((product) => (
//                       <tr
//                         key={product._id}
//                         style={{ borderBottom: "1px solid #eee" }}
//                       >
//                         <td
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "10px",
//                             padding: "5px",
//                           }}
//                         >
//                           {product.images?.[0] && (
//                             <div
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 backgroundColor: "white",
//                                 width: "40px",
//                                 height: "40px",
//                                 alignItems: "center",
//                                 borderRadius: "8px",
//                                 overflow: "hidden",
//                                 border: "1px solid #ccc",
//                                 padding: "2px",
//                               }}
//                             >
//                               <img
//                                 src={product.images[0].url}
//                                 alt={product.productName}
//                                 style={{
//                                   height: "100%",
//                                   width: "100%",
//                                   objectFit: "contain",
//                                 }}
//                               />
//                             </div>
//                           )}
//                           {!product.images?.[0] && (
//                             <div
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 backgroundColor: "white",
//                                 width: "40px",
//                                 height: "40px",
//                                 alignItems: "center",
//                                 borderRadius: "8px",
//                                 overflow: "hidden",
//                                 border: "1px solid #ccc",
//                                 padding: "2px",
//                               }}
//                             >
//                               <span style={{ color: "#ccc", fontSize: "8px" }}>
//                                 No Image
//                               </span>
//                             </div>
//                           )}
//                           {product.productName}
//                         </td>
//                         <td style={{}}>{product.sku}</td>
//                         <td style={{}}>
//                           {product.quantity} {product.unit}
//                         </td>
//                         {/* <td style={{ padding: "12px" }}>{product.category?.categoryName}</td>
//                   <td style={{ padding: "12px" }}>{product.brand?.brandName}</td>
//                   <td style={{ padding: "12px" }}>{product.itemType}</td>
//                   <td style={{ padding: "12px" }}>{product.supplierName || '-'}</td>
//                   <td style={{ padding: "12px" }}>KAPL-011</td>
//                   <td style={{ padding: "12px" }}>{product.itemBarcode}</td>
//                   <td style={{ padding: "12px" }}>{product.warehouse}</td>
//                   <td style={{ padding: "12px" }}>{product.warehouseName || '-'}</td>
//                   <td style={{ padding: "12px" }}>{product.reorderLevel}</td>
//                   <td style={{ padding: "12px" }}>{product.initialStock}</td>
//                   <td style={{ padding: "12px" }}>Serial No.</td>
//                   <td style={{ padding: "12px" }}>{product.leadTime}</td> */}
//                         <td style={{}}>{product.trackType}</td>
//                         {/* <td style={{ padding: "12px" }}>{product.purchasePrice}</td> */}
//                         <td style={{ padding: "12px" }}>
//                           ₹{product.sellingPrice}
//                         </td>
//                         {/* <td style={{ padding: "12px" }}>{product.wholesalePrice}</td>
//                   <td style={{ padding: "12px" }}>{product.quantity}</td> */}
//                         {/* <td style={{ }}>{product.unit}</td> */}
//                         {/* <td style={{ padding: "12px" }}>{product.discountValue}</td>
//                   <td style={{ padding: "12px" }}>{product.purchasePrice}</td>
//                   <td style={{ padding: "12px" }}>{product.hsnCode || '-'}</td>
//                   <td style={{ padding: "12px" }}>{product.tax}</td>
//                   <td style={{ padding: "12px" }}>{product.seoTitle}</td>
//                   <td style={{ padding: "12px" }}>{product.seoDescription}</td>
//                   <td style={{ padding: "12px" }}>{product.description}</td>
//                   <td style={{ padding: "12px" }}>{Object.entries(product.variants).map(
//                           ([variant, qty]) => (
//                             <div key={variant} >
//                              <td><span>{variant} - {qty}</span></td>
//                             </div>
//                           )
//                         )}</td> */}
//                         <td style={{}}>
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               gap: "5px",
//                             }}
//                           >
//                             <button
//                               style={{
//                                 // background: "#007bff",
//                                 // color: "#fff",
//                                 border: "none",
//                                 padding: "6px 12px",
//                                 borderRadius: "6px",
//                                 cursor: "pointer",
//                                 marginRight: "8px",
//                               }}
//                               onClick={() => handlePopupOpen(product)}
//                             >
//                               <IoEyeOutline />
//                             </button>
//                             <button
//                               style={{
//                                 // background: "#007bff",
//                                 // color: "#fff",
//                                 border: "none",
//                                 padding: "6px 12px",
//                                 borderRadius: "6px",
//                                 cursor: "pointer",
//                                 marginRight: "8px",
//                               }}
//                               onClick={() =>
//                                 navigate(`/product/edit/${product._id}`)
//                               }
//                             >
//                               <FiEdit />
//                             </button>
//                             <button
//                               style={{
//                                 // background: "#dc3545",
//                                 // color: "#fff",
//                                 border: "none",
//                                 padding: "6px 12px",
//                                 borderRadius: "6px",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => handleDelete(product)}
//                             >
//                               <RiDeleteBinLine />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "end",
//             alignItems: "center",
//             marginTop: "20px",
//             gap: "20px",
//           }}
//         >
//           <div>{itemsPerPage} per page</div>
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <span>
//               {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
//             </span>
//             <span style={{ color: "grey" }}>|</span>
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               style={{
//                 border: "none",
//                 background: "none",
//                 cursor: currentPage === 1 ? "not-allowed" : "pointer",
//               }}
//             >
//               <FaAngleLeft />
//             </button>
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               style={{
//                 border: "none",
//                 background: "none",
//                 cursor: currentPage === totalPages ? "not-allowed" : "pointer",
//               }}
//             >
//               <FaChevronRight />
//             </button>
//           </div>
//         </div>

//         {/* popup */}
//         {popup && (
//           <div
//             style={{
//               position: "fixed",
//               top: "0",
//               left: "0",
//               width: "100%",
//               height: "100%",
//               backgroundColor: "rgba(199, 197, 197, 0.4)",
//               backdropFilter: "blur(1px)",
//               display: "flex",
//               justifyContent: "center",
//               zIndex: "10",
//               overflowY: "auto",
//             }}
//           >
//             <div
//               ref={formRef}
//               style={{
//                 maxWidth: "1300px",
//                 maxHeight: "670px",
//                 width: "838px",
//                 height: "347px",
//                 margin: "auto",
//                 overflowY: "auto",
//                 borderRadius: "8px",
//                 backgroundColor: "#fff",
//                 boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//               }}
//             >
//               {/* All Content */}
//               <div className="contents gap-2">

//                 {/* Tabs */}
//                 <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <div className="button-group">
//                     {["general", "pricing", "description", "variants"].map(
//                       (tab) => (
//                         <div
//                           key={tab}
//                           style={{ borderBottom: activeTabs[selectedProduct._id] === tab ? '2px solid black' : 'none' }}
//                           className={`button-${activeTabs[selectedProduct._id] === tab
//                             ? "active"
//                             : "inactive"
//                             } button-${tab}`}
//                           onClick={() =>
//                             handleTabClick(selectedProduct._id, tab)
//                           }
//                         >
//                           <p
//                             style={{
//                               fontSize: "15px",
//                               fontWeight: "600",
//                               textTransform: "none",
//                               cursor: "pointer",
//                             }}
//                           >
//                             {tab === "general"
//                               ? "General Information"
//                               : tab === "pricing"
//                                 ? "Pricing & Tax"
//                                 : tab === "description"
//                                   ? "Description & Media"
//                                   : "Variants"}
//                           </p>
//                         </div>
//                       )
//                     )}
//                   </div>
//                   <div style={{ position: 'relative', top: '3px', right: '5px' }}>
//                     <span style={{ backgroundColor: 'red', color: 'white', padding: '5px 13px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' }} onClick={handlePopupClose}>x</span>
//                   </div>
//                 </div>

//                 {/* Toggle Sections */}
//                 <div className="" style={{ padding: '15px 25px' }}>
//                   {activeTabs[selectedProduct._id] === "general" && (
//                     <div className="section-container">

//                       {/* product info */}
//                       <div className="section-header" style={{ backgroundColor: '#F5F6FA', alignItems: 'center' }}>
//                         <div className="section-title">
//                           <div
//                             className="icon-container"
//                             style={{
//                               height: "50px",
//                               width: "50px",
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               borderRadius: "8px",
//                               overflow: "hidden",
//                               padding: "2px",
//                             }}
//                           >
//                             {/* <FaShoppingBag /> */}
//                             {selectedProduct.images?.[0] && (
//                               <img
//                                 src={selectedProduct.images[0].url}
//                                 alt={selectedProduct.productName}
//                                 className="media-image"
//                                 style={{
//                                   height: "100%",
//                                   width: "100%",
//                                   objectFit: "contain",
//                                 }}
//                               />
//                             )}
//                           </div>

//                           <div>
//                             <h3 className="section-title-text" style={{ color: 'black' }}>
//                               {selectedProduct.productName}
//                             </h3>
//                             <br />
//                             <h6 className="section-subtitle">

//                               SKU-{selectedProduct.sku} • {selectedProduct.itemType} • Available Qty -{" "}
//                               {selectedProduct.quantity} {selectedProduct.unit}
//                               {selectedProduct.variants &&
//                                 Object.keys(selectedProduct.variants).includes(
//                                   "Expiry"
//                                 ) ? (
//                                 Object.entries(selectedProduct.variants)
//                                   .filter(([variant]) => variant === "Expiry")
//                                   .map(([variant, qty]) => {
//                                     let statusText = "";
//                                     let displayQty = "0"; // Default display value
//                                     let statusdisc = "";
//                                     // Extract qtyString from array or use qty directly
//                                     const qtyString =
//                                       Array.isArray(qty) && qty.length > 0
//                                         ? qty[0]
//                                         : qty;
//                                     // Set displayQty to qtyString if it's a string, else keep "0"
//                                     if (typeof qtyString === "string") {
//                                       displayQty = qtyString;
//                                     }
//                                     // Process date if qtyString matches DD-MM-YYYY format
//                                     if (
//                                       typeof qtyString === "string" &&
//                                       qtyString.match(/^\d{2}-\d{2}-\d{4}$/)
//                                     ) {
//                                       try {
//                                         const [day, month, year] = qtyString
//                                           .split("-")
//                                           .map(Number);
//                                         const expiryDate = new Date(
//                                           year,
//                                           month - 1,
//                                           day
//                                         );
//                                         const today = new Date(); // Current date (August 27, 2025, 5:44 PM IST)
//                                         today.setHours(0, 0, 0, 0); // Reset time to midnight
//                                         expiryDate.setHours(0, 0, 0, 0); // Reset time for expiry
//                                         if (!isNaN(expiryDate.getTime())) {
//                                           const diffTime = expiryDate - today;
//                                           const daysDiff = Math.ceil(
//                                             diffTime / (1000 * 60 * 60 * 24)
//                                           );
//                                           if (daysDiff <= 0) {
//                                             statusdisc = "Expired";
//                                           } else if (daysDiff <= 2) {
//                                             statusdisc = "Expiring Soon";
//                                           } else {
//                                             statusdisc = "";
//                                           }
//                                         } else {
//                                           console.log(
//                                             "Invalid date for qtyString:",
//                                             qtyString
//                                           ); // Debug: Log invalid date
//                                         }
//                                       } catch (error) {
//                                         console.log(
//                                           "Error parsing date for qtyString:",
//                                           qtyString,
//                                           error
//                                         ); // Debug: Log errors
//                                       }
//                                     } else {
//                                       console.log(
//                                         "Non-string or invalid format qtyString:",
//                                         qtyString
//                                       ); // Debug: Log invalid format
//                                     }
//                                     return (
//                                       <span key={variant} style={{ color: "red" }}>
//                                         {statusdisc ? " • " + statusdisc : ""}
//                                       </span>
//                                     );
//                                   })
//                               ) : (
//                                 <span key="Expiry"></span>
//                               )}
//                             </h6>
//                           </div>
//                         </div>
//                         <div
//                           style={{
//                             // background: "#007bff",
//                             // color: "#fff",
//                             border: "none",
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             cursor: "pointer",
//                             marginRight: "8px",
//                           }}
//                           onClick={() =>
//                             navigate(`/product/edit/${selectedProduct._id}`)
//                           }
//                         >
//                           <FiEdit />
//                         </div>

//                       </div>

//                       {/* All Categories */}
//                       <div className="categories">
//                         {/* Category */}
//                         <div className="category">
//                           <div className="category-item">
//                             <p className="label">Category</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.category?.categoryName || "N/A"}
//                             </p>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">Sub Category</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.subcategory?.subCategoryName || "N/A"}
//                             </p>
//                           </div>
//                           {/* <div className="category-item">
//                               <p className="label">Initial Stock</p>
//                               <p
//                                 className="value"
//                                 style={{
//                                   color:'black',
//                                   fontWeight:'400',
//                                   fontSize: "15px",
//                                   marginTop: "-20px",
//                                 }}
//                               >
//                                 {selectedProduct.initialStock || "N/A"}
//                               </p>
//                             </div> */}
//                           <div className="category-item">
//                             <p className="label">Reorder Level</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.reorderLevel || "N/A"}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Brands */}
//                         <div className="category">
//                           <div className="category-item">
//                             <p className="label">Brands/Manufacturer</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.brand?.brandName || "N/A"}
//                             </p>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">Barcode</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.itemBarcode || "N/A"}
//                             </p>
//                             {/* <p className="value">EAN - 1234 5678 9090</p> */}
//                           </div>
//                           <div className="category-item">
//                             <p className="label">Initial Stock Quantity</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.initialStock || "N/A"}
//                             </p>
//                           </div>
//                           {/* <div className="category-item">
//                               <p className="label">Lead Time</p>
//                               <p
//                                 className="value"
//                                 style={{
//                                   color:'black',
//                                   fontWeight:'400',
//                                   fontSize: "15px",
//                                   marginTop: "-20px",
//                                 }}
//                               >
//                                 {selectedProduct.leadTime || "N/A"}
//                               </p>
//                             </div> */}
//                           {/* <div className="category-item">
//                               <p className="label">Serial Number</p>
//                               <p
//                                 className="value"
//                                 style={{
//                                   color:'black',
//                                   fontWeight:'400',
//                                   fontSize: "15px",
//                                   marginTop: "-20px",
//                                 }}
//                               >
//                                 {selectedProduct.serialNumber || "N/A"}
//                               </p>
//                             </div> */}
//                         </div>

//                         {/* Product Type */}
//                         <div className="category">
//                           <div className="category-item">
//                             <p className="label">Product Type</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.productType || "N/A"}
//                             </p>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">Warehouse Name</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.warehouseName || "N/A"}
//                             </p>
//                           </div>
//                           {/* <div className="category-item">
//                               <p className="label">Warehouse Location</p>
//                               <p
//                                 className="value"
//                                 style={{
//                                   color:'black',
//                                   fontWeight:'400',
//                                   fontSize: "15px",
//                                   marginTop: "-20px",
//                                 }}
//                               >
//                                 {selectedProduct.address || "N/A"}
//                               </p>
//                             </div> */}
//                           <div className="category-item">
//                             <p className="label">Track by</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.serialNumber || "N/A"}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Supplier & Warehouse */}
//                         <div className="category">
//                           <div className="category-item">
//                             <p className="label">Supplier</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.supplierName || "-"}
//                             </p>
//                           </div>
//                           {/* <div className="category-item">
//                               <p className="label">Store</p>
//                               <p
//                                 className="value"
//                                 style={{
//                                   color:'black',
//                                   fontWeight:'400',
//                                   fontSize: "15px",
//                                   marginTop: "-20px",
//                                 }}
//                               >
//                                 {selectedProduct.store || "-"}
//                               </p>
//                             </div> */}
//                           <div className="category-item">
//                             <p className="label">Lead Time</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.leadTime || "N/A"}
//                             </p>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">Status</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.isReturnable === 'true' ? 'Returnable' : 'Non-Returnable'}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {activeTabs[selectedProduct._id] === "pricing" && (
//                     <div className="section-container">

//                       {/* product info */}
//                       <div className="section-header" style={{ backgroundColor: '#F5F6FA', alignItems: 'center' }}>
//                         <div className="section-title">
//                           <div
//                             className="icon-container"
//                             style={{
//                               height: "50px",
//                               width: "50px",
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               borderRadius: "8px",
//                               overflow: "hidden",
//                               padding: "2px",
//                             }}
//                           >
//                             {/* <FaShoppingBag /> */}
//                             {selectedProduct.images?.[0] && (
//                               <img
//                                 src={selectedProduct.images[0].url}
//                                 alt={selectedProduct.productName}
//                                 className="media-image"
//                                 style={{
//                                   height: "100%",
//                                   width: "100%",
//                                   objectFit: "contain",
//                                 }}
//                               />
//                             )}
//                           </div>

//                           <div>
//                             <h3 className="section-title-text" style={{ color: 'black' }}>
//                               {selectedProduct.productName}
//                             </h3>
//                             <br />
//                             <h6 className="section-subtitle">

//                               SKU-{selectedProduct.sku} • {selectedProduct.itemType} • Available Qty -{" "}
//                               {selectedProduct.quantity} {selectedProduct.unit}
//                               {selectedProduct.variants &&
//                                 Object.keys(selectedProduct.variants).includes(
//                                   "Expiry"
//                                 ) ? (
//                                 Object.entries(selectedProduct.variants)
//                                   .filter(([variant]) => variant === "Expiry")
//                                   .map(([variant, qty]) => {
//                                     let statusText = "";
//                                     let displayQty = "0"; // Default display value
//                                     let statusdisc = "";
//                                     // Extract qtyString from array or use qty directly
//                                     const qtyString =
//                                       Array.isArray(qty) && qty.length > 0
//                                         ? qty[0]
//                                         : qty;
//                                     // Set displayQty to qtyString if it's a string, else keep "0"
//                                     if (typeof qtyString === "string") {
//                                       displayQty = qtyString;
//                                     }
//                                     // Process date if qtyString matches DD-MM-YYYY format
//                                     if (
//                                       typeof qtyString === "string" &&
//                                       qtyString.match(/^\d{2}-\d{2}-\d{4}$/)
//                                     ) {
//                                       try {
//                                         const [day, month, year] = qtyString
//                                           .split("-")
//                                           .map(Number);
//                                         const expiryDate = new Date(
//                                           year,
//                                           month - 1,
//                                           day
//                                         );
//                                         const today = new Date(); // Current date (August 27, 2025, 5:44 PM IST)
//                                         today.setHours(0, 0, 0, 0); // Reset time to midnight
//                                         expiryDate.setHours(0, 0, 0, 0); // Reset time for expiry
//                                         if (!isNaN(expiryDate.getTime())) {
//                                           const diffTime = expiryDate - today;
//                                           const daysDiff = Math.ceil(
//                                             diffTime / (1000 * 60 * 60 * 24)
//                                           );
//                                           if (daysDiff <= 0) {
//                                             statusdisc = "Expired";
//                                           } else if (daysDiff <= 2) {
//                                             statusdisc = "Expiring Soon";
//                                           } else {
//                                             statusdisc = "";
//                                           }
//                                         } else {
//                                           console.log(
//                                             "Invalid date for qtyString:",
//                                             qtyString
//                                           ); // Debug: Log invalid date
//                                         }
//                                       } catch (error) {
//                                         console.log(
//                                           "Error parsing date for qtyString:",
//                                           qtyString,
//                                           error
//                                         ); // Debug: Log errors
//                                       }
//                                     } else {
//                                       console.log(
//                                         "Non-string or invalid format qtyString:",
//                                         qtyString
//                                       ); // Debug: Log invalid format
//                                     }
//                                     return (
//                                       <span key={variant} style={{ color: "red" }}>
//                                         {statusdisc ? " • " + statusdisc : ""}
//                                       </span>
//                                     );
//                                   })
//                               ) : (
//                                 <span key="Expiry"></span>
//                               )}
//                             </h6>
//                           </div>
//                         </div>
//                         <div
//                           style={{
//                             // background: "#007bff",
//                             // color: "#fff",
//                             border: "none",
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             cursor: "pointer",
//                             marginRight: "8px",
//                           }}
//                           onClick={() =>
//                             navigate(`/product/edit/${selectedProduct._id}`)
//                           }
//                         >
//                           <FiEdit />
//                         </div>

//                       </div>

//                       {/* All Categories */}
//                       <div className="categories">
//                         {/* Category */}
//                         <div className="category">
//                           <div className="category-item">
//                             <p className="label">Purchase Price</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.purchasePrice}
//                             </p>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">Unit</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.unit}
//                             </p>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">HSN / SAC</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.hsnCode || "-"}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Brands */}
//                         <div className="category">
//                           <div className="category-item">
//                             <p className="label">Selling price</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.sellingPrice}
//                             </p>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">Discount</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.discountValue} {selectedProduct.discountType == "Percentage" ? "%" : 'rupee'}
//                             </p>
//                             {/* <p className="value">EAN - 1234 5678 9090</p> */}
//                           </div>
//                           <div className="category-item">
//                             <p className="label">GST Rate</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.tax}%
//                             </p>
//                           </div>
//                         </div>

//                         {/* Product Type */}
//                         <div className="category">
//                           <div className="category-item">
//                             <p className="label">
//                               Wholesale Price / Bulk Price
//                             </p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.wholesalePrice}
//                             </p>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">
//                               Retail Price
//                             </p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.retailPrice}
//                             </p>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">GST Type</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.taxType}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Supplier */}
//                         <div className="category">
//                           <div className="category-item">
//                             <p className="label">Quantity</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.quantity}
//                             </p>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">Quantity Alert</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.quantityAlert}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {activeTabs[selectedProduct._id] === "description" && (
//                     <div className="section-container">
//                       {/* product info */}
//                       <div className="section-header" style={{ backgroundColor: '#F5F6FA', alignItems: 'center' }}>
//                         <div className="section-title">
//                           <div
//                             className="icon-container"
//                             style={{
//                               height: "50px",
//                               width: "50px",
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               borderRadius: "8px",
//                               overflow: "hidden",
//                               padding: "2px",
//                             }}
//                           >
//                             {/* <FaShoppingBag /> */}
//                             {selectedProduct.images?.[0] && (
//                               <img
//                                 src={selectedProduct.images[0].url}
//                                 alt={selectedProduct.productName}
//                                 className="media-image"
//                                 style={{
//                                   height: "100%",
//                                   width: "100%",
//                                   objectFit: "contain",
//                                 }}
//                               />
//                             )}
//                           </div>

//                           <div>
//                             <h3 className="section-title-text" style={{ color: 'black' }}>
//                               {selectedProduct.productName}
//                             </h3>
//                             <br />
//                             <h6 className="section-subtitle">

//                               SKU-{selectedProduct.sku} • {selectedProduct.itemType} • Available Qty -{" "}
//                               {selectedProduct.quantity} {selectedProduct.unit}
//                               {selectedProduct.variants &&
//                                 Object.keys(selectedProduct.variants).includes(
//                                   "Expiry"
//                                 ) ? (
//                                 Object.entries(selectedProduct.variants)
//                                   .filter(([variant]) => variant === "Expiry")
//                                   .map(([variant, qty]) => {
//                                     let statusText = "";
//                                     let displayQty = "0"; // Default display value
//                                     let statusdisc = "";
//                                     // Extract qtyString from array or use qty directly
//                                     const qtyString =
//                                       Array.isArray(qty) && qty.length > 0
//                                         ? qty[0]
//                                         : qty;
//                                     // Set displayQty to qtyString if it's a string, else keep "0"
//                                     if (typeof qtyString === "string") {
//                                       displayQty = qtyString;
//                                     }
//                                     // Process date if qtyString matches DD-MM-YYYY format
//                                     if (
//                                       typeof qtyString === "string" &&
//                                       qtyString.match(/^\d{2}-\d{2}-\d{4}$/)
//                                     ) {
//                                       try {
//                                         const [day, month, year] = qtyString
//                                           .split("-")
//                                           .map(Number);
//                                         const expiryDate = new Date(
//                                           year,
//                                           month - 1,
//                                           day
//                                         );
//                                         const today = new Date(); // Current date (August 27, 2025, 5:44 PM IST)
//                                         today.setHours(0, 0, 0, 0); // Reset time to midnight
//                                         expiryDate.setHours(0, 0, 0, 0); // Reset time for expiry
//                                         if (!isNaN(expiryDate.getTime())) {
//                                           const diffTime = expiryDate - today;
//                                           const daysDiff = Math.ceil(
//                                             diffTime / (1000 * 60 * 60 * 24)
//                                           );
//                                           if (daysDiff <= 0) {
//                                             statusdisc = "Expired";
//                                           } else if (daysDiff <= 2) {
//                                             statusdisc = "Expiring Soon";
//                                           } else {
//                                             statusdisc = "";
//                                           }
//                                         } else {
//                                           console.log(
//                                             "Invalid date for qtyString:",
//                                             qtyString
//                                           ); // Debug: Log invalid date
//                                         }
//                                       } catch (error) {
//                                         console.log(
//                                           "Error parsing date for qtyString:",
//                                           qtyString,
//                                           error
//                                         ); // Debug: Log errors
//                                       }
//                                     } else {
//                                       console.log(
//                                         "Non-string or invalid format qtyString:",
//                                         qtyString
//                                       ); // Debug: Log invalid format
//                                     }
//                                     return (
//                                       <span key={variant} style={{ color: "red" }}>
//                                         {statusdisc ? " • " + statusdisc : ""}
//                                       </span>
//                                     );
//                                   })
//                               ) : (
//                                 <span key="Expiry"></span>
//                               )}
//                             </h6>
//                           </div>
//                         </div>
//                         <div
//                           style={{
//                             // background: "#007bff",
//                             // color: "#fff",
//                             border: "none",
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             cursor: "pointer",
//                             marginRight: "8px",
//                           }}
//                           onClick={() =>
//                             navigate(`/product/edit/${selectedProduct._id}`)
//                           }
//                         >
//                           <FiEdit />
//                         </div>

//                       </div>


//                       <div style={{ display: 'flex', justifyContent: 'start', padding: '20px' }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "center",
//                             width: "250px",
//                             height: "150px",
//                             alignItems: "center",
//                             overflow: "hidden",
//                             padding: "2px",
//                             border: '1px solid #ccc',
//                             borderRadius: '4px'
//                           }}
//                         >
//                           {selectedProduct.images?.[0] && (
//                             <img
//                               src={selectedProduct.images[0].url}
//                               alt={selectedProduct.productName}
//                               className="media-image"
//                               style={{
//                                 height: "100%",
//                                 width: "100%",
//                                 objectFit: "contain",
//                               }}
//                             />
//                           )}
//                         </div>

//                         <div style={{}}>
//                           <div className="" style={{ display: 'flex', justifyContent: 'start' }}>
//                             <div className="category-item">
//                               <p className="label">SEO META TITLE</p>
//                               <p

//                                 style={{
//                                   color: 'black',
//                                   fontWeight: '400',
//                                   fontSize: "15px",
//                                   marginTop: "-20px",
//                                 }}
//                               >
//                                 {selectedProduct.seoTitle}
//                               </p>
//                             </div>
//                             <div className="category-item">
//                               <p className="label">SEO META Description</p>
//                               <p

//                                 style={{
//                                   color: 'black',
//                                   fontWeight: '400',
//                                   fontSize: "15px",
//                                   marginTop: "-20px",
//                                 }}
//                               >
//                                 {selectedProduct.seoDescription}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="category-item">
//                             <p className="label">Description</p>
//                             <p
//                               className="value"
//                               style={{
//                                 color: 'black',
//                                 fontWeight: '400',
//                                 fontSize: "15px",
//                                 marginTop: "-20px",
//                               }}
//                             >
//                               {selectedProduct.description.length > 100 ? selectedProduct.description.slice(0, 100) + '...' : selectedProduct.description}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                     </div>
//                   )}

//                   {activeTabs[selectedProduct._id] === "variants" &&
//                     selectedProduct.variants && (
//                       <div className="section-container" style={{ border: 'none' }}>

//                         {/* product info */}
//                         <div className="section-header" style={{ backgroundColor: '#F5F6FA', alignItems: 'center' }}>
//                           <div className="section-title">
//                             <div
//                               className="icon-container"
//                               style={{
//                                 height: "50px",
//                                 width: "50px",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 borderRadius: "8px",
//                                 overflow: "hidden",
//                                 padding: "2px",
//                               }}
//                             >
//                               {/* <FaShoppingBag /> */}
//                               {selectedProduct.images?.[0] && (
//                                 <img
//                                   src={selectedProduct.images[0].url}
//                                   alt={selectedProduct.productName}
//                                   className="media-image"
//                                   style={{
//                                     height: "100%",
//                                     width: "100%",
//                                     objectFit: "contain",
//                                   }}
//                                 />
//                               )}
//                             </div>

//                             <div>
//                               <h3 className="section-title-text" style={{ color: 'black' }}>
//                                 {selectedProduct.productName}
//                               </h3>
//                               <br />
//                               <h6 className="section-subtitle">

//                                 SKU-{selectedProduct.sku} • {selectedProduct.itemType} • Available Qty -{" "}
//                                 {selectedProduct.quantity} {selectedProduct.unit}
//                                 {selectedProduct.variants &&
//                                   Object.keys(selectedProduct.variants).includes(
//                                     "Expiry"
//                                   ) ? (
//                                   Object.entries(selectedProduct.variants)
//                                     .filter(([variant]) => variant === "Expiry")
//                                     .map(([variant, qty]) => {
//                                       let statusText = "";
//                                       let displayQty = "0"; // Default display value
//                                       let statusdisc = "";
//                                       // Extract qtyString from array or use qty directly
//                                       const qtyString =
//                                         Array.isArray(qty) && qty.length > 0
//                                           ? qty[0]
//                                           : qty;
//                                       // Set displayQty to qtyString if it's a string, else keep "0"
//                                       if (typeof qtyString === "string") {
//                                         displayQty = qtyString;
//                                       }
//                                       // Process date if qtyString matches DD-MM-YYYY format
//                                       if (
//                                         typeof qtyString === "string" &&
//                                         qtyString.match(/^\d{2}-\d{2}-\d{4}$/)
//                                       ) {
//                                         try {
//                                           const [day, month, year] = qtyString
//                                             .split("-")
//                                             .map(Number);
//                                           const expiryDate = new Date(
//                                             year,
//                                             month - 1,
//                                             day
//                                           );
//                                           const today = new Date(); // Current date (August 27, 2025, 5:44 PM IST)
//                                           today.setHours(0, 0, 0, 0); // Reset time to midnight
//                                           expiryDate.setHours(0, 0, 0, 0); // Reset time for expiry
//                                           if (!isNaN(expiryDate.getTime())) {
//                                             const diffTime = expiryDate - today;
//                                             const daysDiff = Math.ceil(
//                                               diffTime / (1000 * 60 * 60 * 24)
//                                             );
//                                             if (daysDiff <= 0) {
//                                               statusdisc = "Expired";
//                                             } else if (daysDiff <= 2) {
//                                               statusdisc = "Expiring Soon";
//                                             } else {
//                                               statusdisc = "";
//                                             }
//                                           } else {
//                                             console.log(
//                                               "Invalid date for qtyString:",
//                                               qtyString
//                                             ); // Debug: Log invalid date
//                                           }
//                                         } catch (error) {
//                                           console.log(
//                                             "Error parsing date for qtyString:",
//                                             qtyString,
//                                             error
//                                           ); // Debug: Log errors
//                                         }
//                                       } else {
//                                         console.log(
//                                           "Non-string or invalid format qtyString:",
//                                           qtyString
//                                         ); // Debug: Log invalid format
//                                       }
//                                       return (
//                                         <span key={variant} style={{ color: "red" }}>
//                                           {statusdisc ? " • " + statusdisc : ""}
//                                         </span>
//                                       );
//                                     })
//                                 ) : (
//                                   <span key="Expiry"></span>
//                                 )}
//                               </h6>
//                             </div>
//                           </div>
//                           <div
//                             style={{
//                               // background: "#007bff",
//                               // color: "#fff",
//                               border: "none",
//                               padding: "6px 12px",
//                               borderRadius: "6px",
//                               cursor: "pointer",
//                               marginRight: "8px",
//                             }}
//                             onClick={() =>
//                               navigate(`/product/edit/${selectedProduct._id}`)
//                             }
//                           >
//                             <FiEdit />
//                           </div>

//                         </div>

//                         <div className="" style={{ border: '1px solid #F5F6FA', borderRadius: '6px', marginTop: '15px' }}>
//                           {Object.entries(selectedProduct.variants).map(
//                             ([variant, qty], index) => (
//                               <div key={variant} className="" style={{ padding: '10px 15px', display: 'flex', backgroundColor: index % 2 === 0 ? 'white' : '#F5F6FA' }}>
//                                 <span style={{ width: '100px' }}>{variant}</span>
//                                 <span style={{ color: 'black' }}>: {qty}</span>
//                               </div>
//                             )
//                           )}
//                         </div>

//                       </div>
//                     )}
//                 </div>

//               </div>

//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductList;
// --------------------------------------------------
