// final
import { useEffect, useState } from "react";
import axios from "axios";
import { FaFileExcel, FaFilePdf, FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import "../../../../styles/product/product-list.css";
import BASE_URL from "../../../../pages/config/config";
import { CiCirclePlus } from "react-icons/ci";

function ProductList() {
  const [products, setProducts] = useState([]);
  console.log("Products:", products);
  const [activeTabs, setActiveTabs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token"); // Make sure the token is stored here after login

      try {
        const res = await axios.get(`${BASE_URL}/api/products`,{
           headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
        });
        setProducts(res.data);
        // Initialize all to "general"
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

  const handleTabClick = (productId, tab) => {
    setActiveTabs((prev) => ({ ...prev, [productId]: tab }));
  };

  return (
    <div className="page-wrapper ">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Products</h4>
              <h6>Manage your products</h6>
            </div>
          </div>

          <div className="table-top-head me-2">
            <li><button type="button" className="icon-btn" title="Pdf"><FaFilePdf /></button></li>
            <li><label className="icon-btn m-0" title="Import Excel"><input type="file" accept=".xlsx, .xls" hidden /><FaFileExcel style={{ color: "green" }} /></label></li>
            <li><button type="button" className="icon-btn" title="Export Excel"><FaFileExcel /></button></li>
          </div>
          <div className="d-flex gap-2">
            {/* <a className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-purchase"><CiCirclePlus className="me-1" />Add Products</a> */}
            {/* <a className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#view-notes"><i data-feather="download" className="me-2" />Import Purchase</a> */}
          </div>
        </div>

        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <div className="">
              {/* All Content */}
              <div className="contents gap-2">
                {/* Tabs */}
                <div className="button-group">
                  {["general", "pricing", "description", "variants"].map(
                    (tab) => (
                      <div
                        key={tab}
                        className={`button-${activeTabs[product._id] === tab ? "active" : "inactive"
                          } button-${tab}`}
                        onClick={() => handleTabClick(product._id, tab)}
                      >
                        <p>
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

                {/* Toggle Sections */}
                <div className="toggle-section mb-3">
                  {activeTabs[product._id] === "general" && (
                    <div className="section-container">
                      {/* Heading */}
                      <div className="section-header">
                        <div className="section-title">
                          <div className="icon-container">
                            <FaShoppingBag />
                          </div>
                          <div>
                            <h1 className="section-title-text">
                              {product.productName}
                            </h1>
                            <p className="section-subtitle">
                              {/* SKU-KAPL-021 • Goods • Available Qty - 76kg */}
                              SKU-{product.sku} • Available Qty -{" "}
                              {product.quantity} {product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="edit-icon" style={{ cursor: "pointer" }} onClick={() => navigate(`/product/edit/${product._id}`)}>
                          <FaPencilAlt />
                        </div>
                      </div>

                      {/* All Categories */}
                      <div className="categories">
                        {/* Category */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Category</p>
                            <p className="value">
                              {product.category?.categoryName}
                            </p>
                          </div>
                          <div className="category-item">
                            <p className="label">Supplier SKU</p>
                            <p className="value">KAPL-011</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Reorder Level</p>
                            <p className="value">{product.reorderLevel}</p>
                          </div>
                        </div>

                        {/* Brands */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Brands/Manufacturer</p>
                            <p className="value">{product.brand?.brandName}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Barcode</p>
                            <p className="value">{product.itemBarcode}</p>
                            {/* <p className="value">EAN - 1234 5678 9090</p> */}
                          </div>
                          <div className="category-item">
                            <p className="label">Initial Stock Quantity</p>
                            <p className="value">{product.initialStock}</p>
                          </div>
                        </div>

                        {/* Product Type */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Product Type</p>
                            <p className="value">{product.itemType}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Warehouse Location</p>
                            <p className="value">{product.warehouse}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Track by</p>
                            <p className="value">Serial No.</p>
                          </div>
                        </div>

                        {/* Supplier & Warehouse */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Supplier</p>
                            <p className="value">{product.supplierName || '-'}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Warehouse</p>
                            <p className="value">{product.warehouseName || '-'}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Lead Time</p>
                            <p className="value">{product.leadTime}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Status</p>
                            <p className="value">{product.trackType}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTabs[product._id] === "pricing" && (
                    <div className="section-container">
                      {/* Heading */}
                      <div className="section-header">
                        <div className="section-title">
                          <div className="icon-container">
                            <FaShoppingBag />
                          </div>
                          <div>
                            <p className="section-title-text">{product.productName}</p>
                            <p className="section-subtitle">
                              SKU-{product.sku} • Available Qty -{" "}
                              {product.quantity} {product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="edit-icon">
                          <FaPencilAlt />
                        </div>
                      </div>

                      {/* All Categories */}
                      <div className="categories">
                        {/* Category */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Purchase Price</p>
                            <p className="value">{product.purchasePrice}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Unit</p>
                            <p className="value">{product.unit}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">HSN / SAC</p>
                            <p className="value">{product.hsnCode || '-'}</p>
                          </div>
                        </div>

                        {/* Brands */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Selling price</p>
                            <p className="value">{product.sellingPrice}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Discount</p>
                            <p className="value">{product.discountValue}</p>
                            {/* <p className="value">EAN - 1234 5678 9090</p> */}
                          </div>
                          <div className="category-item">
                            <p className="label">GST Rate</p>
                            <p className="value">{product.tax}</p>
                          </div>
                        </div>

                        {/* Product Type */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Wholesale Price / Bulk Price</p>
                            <p className="value">{product.wholesalePrice}</p>
                          </div>
                          <div className="category-item">
                            <p className="label">Discount Period</p>
                            {/* <p className="value">{product.purchasePrice}</p> */}
                          </div>
                        </div>

                        {/* Supplier */}
                        <div className="category">
                          <div className="category-item">
                            <p className="label">Quantity</p>
                            <p className="value"> {product.quantity}</p>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {activeTabs[product._id] === "description" && (
                    <div className="section-container">
                      {/* Description & Media Content */}
                      <div className="section-header">
                        <div className="section-title">
                          <div className="icon-container">
                            <FaShoppingBag />
                          </div>
                          <div>
                            <h1 className="section-title-text">
                              {product.productName}
                            </h1>
                            <p className="section-subtitle">
                              SKU-{product.sku} • Available Qty -{" "}
                              {product.quantity} {product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="edit-icon">
                          <FaPencilAlt />
                        </div>
                      </div>
                      <div>
                        <div className="media-content">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.productName}
                              className="media-image"
                              style={{ height: "250px", width: "255px" }}
                            />
                          )}

                          <div>
                            <div className="seo-content">
                              <div>
                                <p className="label">SEO META TITLE</p>
                                <p className="value">{product.seoTitle}</p>
                              </div>
                              <div>
                                <p className="label">SEO META Description</p>
                                <p className="value">{product.seoDescription}</p>
                              </div>
                            </div>
                            <div>
                              <p className="label">Description</p>
                              <p className="value">{product.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTabs[product._id] === "variants" && product.variants && (
                    <div className="section-container">
                      {/* Variants Content */}
                      <div className="section-header">
                        <div className="section-title">
                          <div className="icon-container">
                            <FaShoppingBag />
                          </div>
                          <div>
                            <h1 className="section-title-text">
                              {product.productName}
                            </h1>
                            <p className="section-subtitle">
                              SKU-{product.sku} • Available Qty -{" "}
                              {product.quantity} {product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="edit-icon">
                          <FaPencilAlt />
                        </div>
                      </div>
                      <div className="variants mb-4">
                        <div className="variants-header">
                          <p className="label">Variant</p>
                        </div>
                        {Object.entries(product.variants).map(
                          ([variant, qty]) => (
                            <div key={variant} className="variants-content">
                              <p>{variant}</p>
                              <p>{qty}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;
// --------------------------------------------------
