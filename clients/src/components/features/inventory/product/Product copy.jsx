// import React, { useState } from "react";

// const DynamicProductFields = () => {
//   const [categoryBlocks, setCategoryBlocks] = useState([]);
//   const [brandBlocks, setBrandBlocks] = useState([]);

//   const handleAddCategory = () => {
//     setCategoryBlocks([...categoryBlocks, {}]);
//   };

//   const handleAddBrand = () => {
//     setBrandBlocks([...brandBlocks, {}]);
//   };

//   const handleRemoveCategory = (index) => {
//     const updated = [...categoryBlocks];
//     updated.splice(index, 1);
//     setCategoryBlocks(updated);
//   };

//   const handleRemoveBrand = (index) => {
//     const updated = [...brandBlocks];
//     updated.splice(index, 1);
//     setBrandBlocks(updated);
//   };

//   return (
//     <div className="container py-4">
//       <button className="btn btn-primary me-2" onClick={handleAddCategory}>
//         Add Category
//       </button>
//       <button className="btn btn-secondary" onClick={handleAddBrand}>
//         Add Brand
//       </button>

//       <div className="mt-4">
//         {categoryBlocks.map((_, index) => (
//           <div className="row mb-3" key={`cat-${index}`}>
//             <div className="col-lg-4 col-sm-6 col-12">
//               <div className="form-group">
//                 <label>Category</label>
//                 <select className="form-select">
//                   <option>Select</option>
//                   <option>Computers</option>
//                 </select>
//               </div>
//             </div>
//             <div className="col-lg-4 col-sm-6 col-12">
//               <div className="form-group">
//                 <label>Choose Category</label>
//                 <select className="form-select">
//                   <option>Select</option>
//                   <option>Computers</option>
//                 </select>
//               </div>
//             </div>
//             <div className="col-lg-4 col-sm-6 col-12 d-flex align-items-center">
//               <div className="form-group w-100">
//                 <label>Sub Category</label>
//                 <select className="form-select">
//                   <option>Select</option>
//                   <option>Computers</option>
//                 </select>
//               </div>
//               <button
//                 type="button"
//                 className="btn btn-outline-danger ms-2"
//                 onClick={() => handleRemoveCategory(index)}
//               >
//                 <i className="far fa-trash-alt"></i>
//               </button>
//             </div>
//           </div>
//         ))}

//         {brandBlocks.map((_, index) => (
//           <div className="row mb-3" key={`brand-${index}`}>
//             <div className="col-lg-4 col-sm-6 col-12">
//               <div className="form-group">
//                 <label>Brand</label>
//                 <select className="form-select">
//                   <option>Select</option>
//                   <option>Computers</option>
//                 </select>
//               </div>
//             </div>
//             <div className="col-lg-4 col-sm-6 col-12">
//               <div className="form-group">
//                 <label>Unit</label>
//                 <select className="form-select">
//                   <option>Select</option>
//                   <option>Computers</option>
//                 </select>
//               </div>
//             </div>
//             <div className="col-lg-4 col-sm-6 col-12 d-flex align-items-center">
//               <div className="form-group w-100">
//                 <label>Selling Type</label>
//                 <select className="form-select">
//                   <option>Select</option>
//                   <option>Computers</option>
//                 </select>
//               </div>
//               <button
//                 type="button"
//                 className="btn btn-outline-danger ms-2"
//                 onClick={() => handleRemoveBrand(index)}
//               >
//                 <i className="far fa-trash-alt"></i>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DynamicProductFields;


// final
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import "../../../../styles/product/product-list.css";

function ProductList() {
  const [products, setProducts] = useState([]);

  // To track which tab is active for each product
  // We'll use an object with productId as key
  const [activeTabs, setActiveTabs] = useState({});  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
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
    setActiveTabs((prev) => ({ ...prev, [productId]: tab }))
  }

  return (
    <div className="container">
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map((product) => (
          <div key={product._id} className="section-container mb-4">
            {/* Header */}
            <div className="section-header">
              <div className="section-title">
                <div className="icon-container"><FaShoppingBag/></div>
                <div>
                   <h1>{product.productName}</h1>
                   <p className="section-subtitle">
                     SKU-{product.sku} • Available Qty - {product.quantity} {product.unit}
                   </p>
                 </div>
               </div>
               <div className="edit-icon"><FaPencilAlt/></div>
            </div>

            {/* Tabs */}
            <div className="button-group mb-3">
              {["general", "pricing", "description", "variants"].map((tab) => (
                <div
                   key={tab}
                   className={`button-${activeTabs[product._id] === tab ? "active" : "inactive"} button-${tab}`}
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
               ))}
            </div>

            {/* Tab Content */}
            {activeTabs[product._id] === "general" && (
              <div className="categories mb-4">
             
                <div className="category">
                   <div className="category-item">
                     <p className="label">Category</p>
                     <p className="value">{product.category?.name}</p>
                   </div>
                   <div className="category-item">
                     <p className="label">SKU</p>
                     <p className="value">{product.sku}</p>
                   </div>
                   <div className="category-item">
                     <p className="label">Reorder Level</p>
                     <p className="value">{product.quantityAlert}</p>
                   </div>
                 </div>
                 <div className="category">
                   <div className="category-item">
                     <p className="label">Brand</p>
                     <p className="value">{product.brand}</p>
                   </div>
                   <div className="category-item">
                     <p className="label">Barcode</p>
                     <p className="value">{product.itemBarcode}</p>
                   </div>
                 </div>
               </div>
            )}

            {activeTabs[product._id] === "pricing" && (
              <div className="categories mb-4">
                <div className="category">
                   <div className="category-item">
                     <p className="label">Purchase</p>
                     <p className="value">{product.purchasePrice}</p>
                   </div>
                   <div className="category-item">
                     <p className="label">Selling</p>
                     <p className="value">{product.sellingPrice}</p>
                   </div>
                   <div className="category-item">
                     <p className="label">Wholesale</p>
                     <p className="value">{product.wholesalePrice}</p>
                   </div>
                   <div className="category-item">
                     <p className="label">Retail</p>
                     <p className="value">{product.retailPrice}</p>
                   </div>
                 </div>
               </div>
            )}

            {activeTabs[product._id] === "description" && (
              <div className="media-content mb-4">
                {product.images?.[0] && (
                   <img src={product.images[0].url} alt={product.productName} className="media-image" />
                 )}

                <div>
                   <div className="seo-content">
                     <div>
                       <p className="label">SEO Title</p>
                       <p className="value">{product.seoTitle}</p>
                     </div>
                     <div>
                       <p className="label">SEO Description</p>
                       <p className="value">{product.seoDescription}</p>
                     </div>
                   </div>
                   <div>
                     <p className="label">Description</p>
                     <p className="value">{product.description}</p>
                   </div>
                 </div>
               </div>
            )}

            {activeTabs[product._id] === "variants" && product.variants && (
              <div className="variants mb-4">
                <div className="variants-header">
                   <p className="label">Variant</p>
                   <p className="label">Quantity</p>
                 </div>
                 {Object.entries(product.variants).map(([variant, qty]) => (
                   <div key={variant} className="variants-content">
                     <p>{variant}</p>
                     <p>{qty}</p>
                   </div>
                 ))}
               </div>
            )}

          </div>
        ))
      )}

    </div>
  )
}

export default ProductList;
// --------------------------------------------------


// temp file 
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FaPencilAlt } from "react-icons/fa";
// import { FaShoppingBag } from "react-icons/fa";
// import "../../../../styles/product/product-list.css";

// function ProductList() {
//   const [products, setProducts] = useState([]);

//   // To track which tab is active for each product
//   // We'll use an object with productId as key
//   const [activeTabs, setActiveTabs] = useState({});  

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/products");
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
//     setActiveTabs((prev) => ({ ...prev, [productId]: tab }))
//   }

//   return (
//     <div className="container">
//       {products.length === 0 ? (
//         <p>Loading products...</p>
//       ) : (
//         products.map((product) => (
//           <div key={product._id} className="section-container mb-4">
//             {/* Header */}
//             <div className="section-header">
//               <div className="section-title">
//                 <div className="icon-container"><FaShoppingBag/></div>
//                 <div>
//                    <h1>{product.productName}</h1>
//                    <p className="section-subtitle">
//                      SKU-{product.sku} • Available Qty - {product.quantity} {product.unit}
//                    </p>
//                  </div>
//                </div>
//                <div className="edit-icon"><FaPencilAlt/></div>
//             </div>

//             {/* Tabs */}
//             <div className="button-group mb-3">
//               {["general", "pricing", "description", "variants"].map((tab) => (
//                 <div
//                    key={tab}
//                    className={`button-${activeTabs[product._id] === tab ? "active" : "inactive"} button-${tab}`}
//                    onClick={() => handleTabClick(product._id, tab)}
//                  >
//                    <p>
//                      {tab === "general"
//                        ? "General Information"
//                        : tab === "pricing"
//                        ? "Pricing & Tax"
//                        : tab === "description"
//                        ? "Description & Media"
//                        : "Variants"}
//                    </p>
//                  </div>
//                ))}
//             </div>

//             {/* Tab Content */}
//             {activeTabs[product._id] === "general" && (
//               <div className="categories mb-4">
             
//                 <div className="category">
//                    <div className="category-item">
//                      <p className="label">Category</p>
//                      <p className="value">{product.category}</p>
//                    </div>
//                    <div className="category-item">
//                      <p className="label">SKU</p>
//                      <p className="value">{product.sku}</p>
//                    </div>
//                    <div className="category-item">
//                      <p className="label">Reorder Level</p>
//                      <p className="value">{product.quantityAlert}</p>
//                    </div>
//                  </div>
//                  <div className="category">
//                    <div className="category-item">
//                      <p className="label">Brand</p>
//                      <p className="value">{product.brand}</p>
//                    </div>
//                    <div className="category-item">
//                      <p className="label">Barcode</p>
//                      <p className="value">{product.itemBarcode}</p>
//                    </div>
//                  </div>
//                </div>
//             )}

//             {activeTabs[product._id] === "pricing" && (
//               <div className="categories mb-4">
//                 <div className="category">
//                    <div className="category-item">
//                      <p className="label">Purchase</p>
//                      <p className="value">{product.purchasePrice}</p>
//                    </div>
//                    <div className="category-item">
//                      <p className="label">Selling</p>
//                      <p className="value">{product.sellingPrice}</p>
//                    </div>
//                    <div className="category-item">
//                      <p className="label">Wholesale</p>
//                      <p className="value">{product.wholesalePrice}</p>
//                    </div>
//                    <div className="category-item">
//                      <p className="label">Retail</p>
//                      <p className="value">{product.retailPrice}</p>
//                    </div>
//                  </div>
//                </div>
//             )}

//             {activeTabs[product._id] === "description" && (
//               <div className="media-content mb-4">
//                 {product.images?.[0] && (
//                    <img src={product.images[0].url} alt={product.productName} className="media-image" />
//                  )}

//                 <div>
//                    <div className="seo-content">
//                      <div>
//                        <p className="label">SEO Title</p>
//                        <p className="value">{product.seoTitle}</p>
//                      </div>
//                      <div>
//                        <p className="label">SEO Description</p>
//                        <p className="value">{product.seoDescription}</p>
//                      </div>
//                    </div>
//                    <div>
//                      <p className="label">Description</p>
//                      <p className="value">{product.description}</p>
//                    </div>
//                  </div>
//                </div>
//             )}

//             {activeTabs[product._id] === "variants" && product.variants && (
//               <div className="variants mb-4">
//                 <div className="variants-header">
//                    <p className="label">Variant</p>
//                    <p className="label">Quantity</p>
//                  </div>
//                  {Object.entries(product.variants).map(([variant, qty]) => (
//                    <div key={variant} className="variants-content">
//                      <p>{variant}</p>
//                      <p>{qty}</p>
//                    </div>
//                  ))}
//                </div>
//             )}

//           </div>
//         ))
//       )}

//     </div>
//   )
// }

// export default ProductList;



// without api
// import { useState } from "react";
// import { FaPencilAlt } from "react-icons/fa";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { FaShoppingBag } from "react-icons/fa";
// // import fruits from "./image/fruits.jpg";
// import Image from "../../../../assets/img/fruits.jpg"
// import "../../../../styles/product/product-list.css";
// import { TbChevronUp, TbRefresh } from "react-icons/tb";
// import { Link } from "react-router-dom";

// function Product() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [isOpen1, setIsOpen1] = useState(false);
//   const [isOpen2, setIsOpen2] = useState(false);
//   const [isOpen3, setIsOpen3] = useState(false);

//   const isToggle = () => {
//     setIsOpen(!isOpen);
//     setIsOpen1(false);
//     setIsOpen2(false);
//     setIsOpen3(false);
//   };

//   const isToggle1 = () => {
//     setIsOpen1(!isOpen1);
//     setIsOpen(false);
//     setIsOpen2(false);
//     setIsOpen3(false);
//   };

//   const isToggle2 = () => {
//     setIsOpen2(!isOpen2);
//     setIsOpen(false);
//     setIsOpen1(false);
//     setIsOpen3(false);
//   };

//   const isToggle3 = () => {
//     setIsOpen3(!isOpen3);
//     setIsOpen(false);
//     setIsOpen1(false);
//     setIsOpen2(false);
//   };

//   return (
//     <>
//       <div className="page-wrapper">
//          <div className="page-header">
//                   <div className="add-item d-flex">
//                     <div className="page-title">
//                       <h4 className="fw-bold">Product List</h4>
//                       <h6>Manage your products</h6>
//                     </div>
//                   </div>
//                   <div className="table-top-head me-2">
//                     <li>
//                       <button
//                         type="button"
//                         data-bs-toggle="tooltip"
//                         data-bs-placement="top"
//                         title="Refresh"
//                         className="icon-btn"
//                       >
//                         <TbRefresh />
//                       </button>
//                     </li>
//                     <li>
//                       <button
//                         type="button"
//                         data-bs-toggle="tooltip"
//                         data-bs-placement="top"
//                         title="Collapse"
//                         id="collapse-header"
//                         className="icon-btn"
//                       >
//                         <TbChevronUp />
//                       </button>
//                     </li>
//                   </div>
        
//                   <div className="page-btn mt-0">
//                     <button className="btn btn-secondary">
//                       <Link to="back"></Link>back to product
//                     </button>
//                   </div>
//                 </div>
        
//         {/* Kashmiri Apple */}
//         {/* <div className="header">
//           <FaArrowLeftLong />
//           <h1>Kashmiri Apple</h1>
//         </div> */}

//         {/* All Content */}
//         <div className="content">
//           {/* Buttons */}
//           <div className="button-group">
//             {/* General Information */}
//             <div
//               className={
//                 isOpen ? "button-active button-top-left" : "button-inactive button-top-left"
//               }
//               onClick={isToggle}
//             >
//               <p>General Information</p>
//             </div>

//             {/* Pricing & Tax */}
//             <div
//               className={isOpen1 ? "button-active" : "button-inactive"}
//               onClick={isToggle1}
//             >
//               <p>Pricing & Tax</p>
//             </div>

//             {/* Description & Media */}
//             <div
//               className={isOpen2 ? "button-active" : "button-inactive"}
//               onClick={isToggle2}
//             >
//               <p>Description & Media</p>
//             </div>

//             {/* Variants */}
//             <div
//               className={isOpen3 ? "button-active button-last" : "button-inactive button-last"}
//               onClick={isToggle3}
//             >
//               <p>Variants</p>
//             </div>
//           </div>

//           {/* Toggle Sections */}
//           <div className="row">
//             <div className="col-6">
//   <div className="">
//             {isOpen && (
//               <div className="section-container">
//                 {/* Heading */}
//                 <div className="section-header">
//                   <div className="section-title">
//                     <div className="icon-container">
//                       <FaShoppingBag />
//                     </div>
//                     <div>
//                       <h1 className="section-title-text">Kashmiri Apple</h1>
//                       <p className="section-subtitle">
//                         SKU-KAPL-021 • Goods • Available Qty - 76kg
//                       </p>
//                     </div>
//                   </div>
//                   <div className="edit-icon">
//                     <FaPencilAlt />
//                   </div>
//                 </div>

//                 {/* All Categories */}
//                 <div className="categories">
//                   {/* Category */}
//                   <div className="category">
//                     <div className="category-item">
//                       <p className="label">Category</p>
//                       <p className="value">FRUITS</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Supplier SKU</p>
//                       <p className="value">KAPL-011</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Reorder Level</p>
//                       <p className="value">12 QTY</p>
//                     </div>
//                   </div>

//                   {/* Brands */}
//                   <div className="category">
//                     <div className="category-item">
//                       <p className="label">Brands/Manufacturer</p>
//                       <p className="value">Kashmiri Apple</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Barcode</p>
//                       <p className="value">UPC - 1234 5678 9090</p>
//                       <p className="value">EAN - 1234 5678 9090</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Initial Stock Quantity</p>
//                       <p className="value">448</p>
//                     </div>
//                   </div>

//                   {/* Product Type */}
//                   <div className="category">
//                     <div className="category-item">
//                       <p className="label">Product Type</p>
//                       <p className="value">Simple</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Warehouse Location</p>
//                       <p className="value">Noida Sector 62</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Track by</p>
//                       <p className="value">Serial No.</p>
//                     </div>
//                   </div>

//                   {/* Supplier */}
//                   <div className="category">
//                     <div className="category-item">
//                       <p className="label">Supplier</p>
//                       <p className="value">Alok Ranjan</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Lead Time</p>
//                       <p className="value">16</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Status</p>
//                       <p className="value">Returnable</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {isOpen1 && (
//               <div className="section-container">
//                 {/* Heading */}
//                 <div className="section-header">
//                   <div className="section-title">
//                     <div className="icon-container">
//                       <FaShoppingBag />
//                     </div>
//                     <div>
//                       <p className="section-title-text">Kashmiri Apple</p>
//                       <p className="section-subtitle">
//                         SKU-KAPL-021 • Goods • Available Qty - 76kg
//                       </p>
//                     </div>
//                   </div>
//                   <div className="edit-icon">
//                     <FaPencilAlt />
//                   </div>
//                 </div>

//                 {/* All Categories */}
//                 <div className="categories">
//                   {/* Category */}
//                   <div className="category">
//                     <div className="category-item">
//                       <p className="label">Purchase Price</p>
//                       <p className="value">FRUITS</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Unit</p>
//                       <p className="value">KAPL-011</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">HSN / SAC</p>
//                       <p className="value">16 days</p>
//                     </div>
//                   </div>

//                   {/* Brands */}
//                   <div className="category">
//                     <div className="category-item">
//                       <p className="label">Selling price</p>
//                       <p className="value">Kashmiri Apple</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Discount</p>
//                       <p className="value">UPC - 1234 5678 9090</p>
//                       <p className="value">EAN - 1234 5678 9090</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">GST Rate</p>
//                       <p className="value">12 QTY</p>
//                     </div>
//                   </div>

//                   {/* Product Type */}
//                   <div className="category">
//                     <div className="category-item">
//                       <p className="label">Wholesale Price / Bulk Price</p>
//                       <p className="value">Simple</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Discount Period</p>
//                       <p className="value">Noida Sector 62</p>
//                     </div>
//                   </div>

//                   {/* Supplier */}
//                   <div className="category">
//                     <div className="category-item">
//                       <p className="label">Quantity</p>
//                       <p className="value">Alok Ranjan</p>
//                     </div>
//                     <div className="category-item">
//                       <p className="label">Tax Rate</p>
//                       <p className="value">KG</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {isOpen2 && (
//               <div className="section-container">
//                 {/* Description & Media Content */}
//                 <div className="section-header">
//                   <div className="section-title">
//                     <div className="icon-container">
//                       <FaShoppingBag />
//                     </div>
//                     <div>
//                       <h1 className="section-title-text">Kashmiri Apple</h1>
//                       <p className="section-subtitle">
//                         SKU-KAPL-021 • Goods • Available Qty - 76kg
//                       </p>
//                     </div>
//                   </div>
//                   <div className="edit-icon">
//                     <FaPencilAlt />
//                   </div>
//                 </div>
//                 <div>
//                   <div className="media-content">
//                     <img src={Image} alt="fruits" className="media-image" />
//                     <div>
//                       <div className="seo-content">
//                         <div>
//                           <p className="label">SEO META TITLE</p>
//                           <p className="value">Raseele Aam</p>
//                         </div>
//                         <div>
//                           <p className="label">SEO META Description</p>
//                           <p className="value">Ratnagiri Ke Raseele Aam</p>
//                         </div>
//                       </div>

//                       <div className="keywords">
//                         <p className="label">Keywords</p>
//                         <p className="value">
//                           Mango, Fruits, Kashmiri aam, Ratnagiri aam, langra
//                           aam, keshri aam
//                         </p>
//                       </div>

//                       <div>
//                         <p className="label">Description</p>
//                         <p className="value">
//                           Mangoes, Often referred to as the "king of fruits,"
//                           are not only delicious but also packed with nutrients.
//                           They are rich in vitamins A and C, which are essential
//                           for maintaining healthy skin and boosting the immune
//                           system. Additionally, mangoes contain antioxidants
//                           that help combat free radicals in the body. Their
//                           sweet, juicy smoothies, salads, and desserts.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {isOpen3 && (
//               <div className="section-container">
//                 {/* Variants Content */}
//                 <div className="section-header">
//                   <div className="section-title">
//                     <div className="icon-container">
//                       <FaShoppingBag />
//                     </div>
//                     <div>
//                       <h1 className="section-title-text">Kashmiri Apple</h1>
//                       <p className="section-subtitle">
//                         SKU-KAPL-021 • Goods • Available Qty - 76kg
//                       </p>
//                     </div>
//                   </div>
//                   <div className="edit-icon">
//                     <FaPencilAlt />
//                   </div>
//                 </div>

//                 <div className="variants-header">
//                   <p className="label">Color</p>
//                   <p className="label">Quantity</p>
//                 </div>
//                 <div className="variants-content">
//                   <p>Red</p>
//                   <p>00</p>
//                 </div>
//               </div>
//             )}
//           </div>
//             </div>
//           </div>
        
//         </div>
//       </div>
//     </>
//   );
// }

// export default Product;


// import React from 'react'

// const Product = () => {
//   return (
//     <div>Product</div>
//   )
// }

// export default Product