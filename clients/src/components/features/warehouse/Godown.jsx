// import React, { useState, useCallback, useEffect, useRef } from "react";
// import { MdArrowForwardIos } from "react-icons/md";
// import {
//   FaSearch,
//   FaArrowRight,
//   FaAngleLeft,
//   FaChevronRight,
// } from "react-icons/fa";

// import { IoMdClose } from "react-icons/io";
// import { IoSearch } from "react-icons/io5";

// import { RiArrowUpDownLine } from "react-icons/ri";
// // import "./Godown.css";
// import Popup from "./popup";
// import { Link, useParams } from "react-router-dom";

// import BASE_URL from "../../../pages/config/config";
// import axios from "axios";

// function Godown() {
//   const { id } = useParams();
//   const [warehouses, setWarehouses] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [warehousesDetails, setWarehousesDetails] = useState(null); // State for warehouse details
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedproduct, setSelectedProduct] = useState(null);

//   const [selectedItem, setSelectedItem] = useState({ zone: "", grid: "" });

//   const detailsWarehouses = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`${BASE_URL}/api/warehouse/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }); // <- endpoint
//       // console.log("diwakar", res.data);

//       setWarehousesDetails(res.data.warehouse); // backend: { success, data }
//     } catch (err) {
//       setError(err);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     detailsWarehouses();
//   }, [detailsWarehouses]);

//   // const handleGridClick = (e, grid, zone) => {
//   //   const style = window.getComputedStyle(e.target);
//   //   console.log(
//   //     "Clicked item:",
//   //     grid,
//   //     "Zone:",
//   //     zone,
//   //     "Background color:",
//   //     style.backgroundColor
//   //   ); // Debug log
//   //   if (
//   //     style.backgroundColor === "rgb(255, 255, 255)" ||
//   //     style.backgroundColor === "#ffffff"
//   //   ) {
//   //     setSelectedItem({ zone, grid });
//   //     setIsPopupOpen(true);
//   //   } else {
//   //     console.log("Popup not opened, background color:", style.backgroundColor); // Debug log
//   //   }
//   // };

//   const closePopup = () => {
//     setIsPopupOpen(false);
//   };

//   const products = [
//     {
//       name: "Ponds Moisturizer cream",
//       sku: "JDFG846",
//       qty: 654,
//       img: "https://via.placeholder.com/40",
//     },
//     {
//       name: "Office Chair",
//       sku: "JDFG846",
//       qty: 566,
//       img: "https://via.placeholder.com/40",
//     },
//     {
//       name: "Luxury Handbag",
//       sku: "JDFG846",
//       qty: 254,
//       img: "https://via.placeholder.com/40",
//     },
//     {
//       name: "Gaming Mouse",
//       sku: "JDFG846",
//       qty: 12,
//       img: "https://via.placeholder.com/40",
//     },
//   ];

//   // Pagination state and derived values
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;
//   const totalCount = products.length;
//   const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
//   const safePage = Math.min(currentPage, totalPages);
//   const startIndex = (safePage - 1) * pageSize;
//   const endIndexExclusive = Math.min(startIndex + pageSize, totalCount);
//   const displayStart = totalCount === 0 ? 0 : startIndex + 1;
//   const displayEnd = endIndexExclusive;
//   const paginatedProducts = products.slice(startIndex, endIndexExclusive);

//   //Fetch Warehouse Data
//   const fetchWarehouses = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`${BASE_URL}/api/warehouse`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }); // <- endpoint
//       console.log("Warehouseserer:", res.data.data);

//       setWarehouses(res.data.data); // backend: { success, data }
//     } catch (err) {
//       setError(err);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchWarehouses();
//   }, [fetchWarehouses]);

//   //Grid
//   const [grid, setGrid] = useState([]);
//   useEffect(() => {
//     if (warehousesDetails?.layout?.zones) {
//       const zoneCount = Number(warehousesDetails?.layout?.zones || 0);
//       const zoneArray = Array.from(
//         { length: zoneCount },
//         (_, i) => `Zone ${i + 1}`
//       );
//       setZones(zoneArray);
//     } else {
//       setZones([]);
//     }
//   }, [warehousesDetails]);

//   const [popup, setIsPopupOpen] = useState(false);
//   const formRef = useRef(null);
//   const handlePopup = () => {
//     setIsPopupOpen(!popup);
//   };
//   const closeForm = () => {
//     setIsPopupOpen(false);
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

//   const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
//   const [activeTabs, setActiveTabs] = useState({});

//   // Search functionality
//   const [product, setProducts] = useState([]);
//   const [productSearchQuery, setProductSearchQuery] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await axios.get(`${BASE_URL}/api/products`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProducts(res.data);
//         setAllProducts(res.data); // Store all products
//         if (res.data.length > 0) {
//         }
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

//   // Product search functionality
//   const handleProductSearch = (query) => {
//     setSearchQuery(query);
//     setProductSearchQuery(query);

//     if (!query.trim()) {
//       setProducts(allProducts);
//       return;
//     }

//     const searchTerm = query.toLowerCase();
//     const filteredProducts = allProducts.filter((product) => {
//       return (
//         product.productName?.toLowerCase().includes(searchTerm) ||
//         (product.brand &&
//           typeof product.brand === "object" &&
//           product.brand.name?.toLowerCase().includes(searchTerm)) ||
//         (product.brand &&
//           typeof product.brand === "string" &&
//           product.brand.toLowerCase().includes(searchTerm)) ||
//         product.seoTitle?.toLowerCase().includes(searchTerm) ||
//         product.seoDescription?.toLowerCase().includes(searchTerm) ||
//         (product.category &&
//           typeof product.category === "object" &&
//           product.category.name?.toLowerCase().includes(searchTerm)) ||
//         (product.category &&
//           typeof product.category === "string" &&
//           product.category.toLowerCase().includes(searchTerm)) ||
//         (product.subcategory &&
//           typeof product.subcategory === "object" &&
//           product.subcategory.name?.toLowerCase().includes(searchTerm)) ||
//         (product.subcategory &&
//           typeof product.subcategory === "string" &&
//           product.subcategory.toLowerCase().includes(searchTerm))
//       );
//     });

//     setProducts(filteredProducts);
//     setSearchResults(filteredProducts); // ✅ update dropdown
//     setShowDropdown(true);
//   };

//   const handleSelectedProduct = (product) => {
//     setSelectedProduct(product);
//     setSearchQuery(product.productName || "");
//     setShowDropdown(false);
//   };

//   return (
//     <div>
//       {/* Breadcrumb Navigation */}
//       <div style={{ padding: "20px", overflowY: "auto", height: "88vh" }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div
//             style={{
//               color: "#676767",
//               display: "flex",
//               gap: "16px",
//               fontWeight: "500",
//               alignItems: "center",
//             }}
//           >
//             <span>Warehouse</span>
//             <MdArrowForwardIos style={{ color: "#b0afafff" }} />
//             <Link
//               style={{ color: "#676767", textDecoration: "none" }}
//               to={"/Warehouse"}
//             >
//               All Warehouse
//             </Link>
//             <MdArrowForwardIos style={{ color: "#b0afafff" }} />
//             <Link
//               style={{ color: "#676767", textDecoration: "none" }}
//               to={"/WarehouseDetails"}
//             >
//               {warehousesDetails?.warehouseName}
//             </Link>
//             <MdArrowForwardIos style={{ color: "#b0afafff" }} />
//             <span
//               style={{
//                 fontFamily: "Roboto",
//                 fontWeight: "500",
//                 fontSize: "18px",
//                 color: "#262626",
//               }}
//             >
//               Godown
//             </span>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div
//           style={{
//             width: "100%",
//             display: "flex",
//             justifyContent: "space-between",
//             gap: "9px",
//             alignItems: "center",
//             marginTop: "20px",
//           }}
//         >
//           <div
//             style={{
//               alignItems: "center",
//               display: "flex",
//               backgroundColor: "#f9f9f9",
//               width: "90%",
//               gap: "19px",
//               justifyContent: "space-between",
//               padding: "4px 16px",
//               border: "1px solid #e6e6e6",
//               borderRadius: "8px",
//             }}
//           >
//             <div
//               style={{
//                 padding: "4px 16px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "9px",
//               }}
//             >
//               <FaSearch />
//               <input
//                 type="search"
//                 placeholder="Search Items"
//                 style={{
//                   border: "none",
//                   outline: "none",
//                   backgroundColor: "transparent",
//                 }}
//               />
//             </div>
//             <div
//               style={{
//                 padding: "4px",
//                 border: "1px solid #f1f1f1",
//                 borderRadius: "4px",
//               }}
//             >
//               <RiArrowUpDownLine />
//             </div>
//           </div>
//           <div
//             style={{
//               backgroundColor: "#fff",
//               padding: "8px 16px",
//               border: "1px solid #e6e6e6",
//               borderRadius: "8px",
//             }}
//           >
//             <select
//               name="zone"
//               onChange={(e) => {
//                 if (e.target.value) {
//                   window.location.href = `http://localhost:3000${e.target.value
//                     .toLowerCase()
//                     .replace(" ", "")}`;
//                 }
//               }}
//               style={{ border: "none", outline: "none" }}
//             >
//               <option
//                 value=""
//                 style={{
//                   padding: "4px 16px",
//                   color: "#676767",
//                   fontFamily: "Roboto",
//                   fontWeight: "400",
//                   fontSize: "16px",
//                 }}
//               >
//                 All Zones
//               </option>
//               <option value="/SelectPage">Zone 1</option>
//               <option value="/zone2">Zone 2</option>
//               <option value="/zone3">Zone 3</option>
//               <option value="/zone4">Zone 4</option>
//               <option value="/zone5">Zone 5</option>
//               <option value="/zone6">Zone 6</option>
//               <option value="/zone7">Zone 7</option>
//             </select>
//           </div>
//         </div>

//         {/* Zone 04 Grid */}
//         {zones.length > 0 ? (
//           zones.map((zone, idx) => (
//             <>
//               <div key={idx}>
//                 <div
//                   style={{
//                     margin: "0 auto",
//                     display: "flex",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <div
//                     style={{
//                       transform: "rotate(-0deg)",
//                       backgroundColor: "#3f99e1",
//                       padding: "24px",
//                       color: "#FFF",
//                       justifyContent: "space-between",
//                       display: "flex",
//                       border: "1px solid #e6e6e6",
//                       borderRadius: "8px",
//                       marginTop: "40px",
//                       marginBottom: "20px",
//                       width: "40%",
//                     }}
//                   >
//                     <span className="invisible">hg</span>
//                     <span className="zone-text">Zone {idx + 1}</span>
//                     <span style={{ transform: "rotate(0deg)" }}>
//                       <FaArrowRight />
//                     </span>
//                   </div>
//                 </div>

//                 <main
//                   style={{
//                     width: "40%",
//                     margin: "0 auto",
//                     display: "grid",
//                     gridTemplateRows: `repeat(${warehousesDetails?.layout?.columns}, 1fr)`,
//                     gridTemplateColumns: `repeat(${warehousesDetails?.layout?.rows}, 1fr)`,

//                     gridRowGap: "10px",
//                     gridColumnGap: "10px",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   {[
//                     "A1",
//                     "B1",
//                     "C1",
//                     "D1",
//                     "A2",
//                     "B2",
//                     "C2",
//                     "D2",
//                     "A3",
//                     "B3",
//                     "C3",
//                     "D3",
//                     "A4",
//                     "B4",
//                     "C4",
//                     "D4",
//                     "A5",
//                     "B5",
//                     "C5",
//                     "D5",
//                   ].map((item, idx) => (
//                     <div
//                       key={idx}
//                       onClick={handlePopup}
//                       style={{
//                         border: "1px solid #e6e6e6",
//                         color: "#000000",
//                         borderRadius: "8px",
//                         fontFamily: "Roboto",
//                         fontWeight: "400",
//                         fontSize: "16px",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         display: "flex",
//                         cursor: "pointer",
//                         backgroundColor: "#ffffff",
//                       }}
//                     >
//                       {item}
//                     </div>
//                   ))}
//                 </main>
//               </div>
//             </>
//           ))
//         ) : (
//           <div></div>
//         )}

//         {/* Zone 03 and Zone 05 Section */}
//         {/* <div
//           style={{
//             display: "flex",
//             justifyContent: "space-evenly",
//             padding: "24px",
//           }}
//         >
         
//           <div
//             style={{
//               transform: "rotate(-90deg)",
//               // marginBottom: "100px",
//               width: "300px",
//               marginTop: "40px",
//             }}
//           >
//             <div
//               style={{
//                 transform: "rotate(0deg)",
//                 backgroundColor: "#3f99e1",
//                 padding: "24px",
//                 color: "#FFF",
//                 justifyContent: "space-between",
//                 display: "flex",
//                 border: "1px solid #e6e6e6",
//                 borderRadius: "8px",
//                 marginTop: "150px",
//                 marginBottom: "20px",
//                 width: "100%",
//               }}
//             >
//               <span className="invisible">hg</span>
//               <span className="zone-text">Zone 03</span>
//               <span
//                 style={{
//                   transform: "rotate(0deg)",
//                 }}
//               >
//                 <FaArrowRight />
//               </span>
//             </div>
//             <main
//               style={{
//                 width: "100%",
//                 display: "grid",
//                 gridTemplateRows: "40px 40px 40px",
//                 gridTemplateColumns: "repeat(4, 1fr)",
//                 gap: "10px",
//               }}
//             >
//               {["A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3"].map(
//                 (item, idx) => {
//                   let extraStyle = {};
//                   if (item === "B1") {
//                     extraStyle = { gridColumn: "2 / 4", gridRow: "1 / 2" };
//                   } else if (item === "B2") {
//                     extraStyle = { gridColumn: "2 / 4", gridRow: "2 / 3" };
//                   } else if (item === "B3") {
//                     extraStyle = { gridColumn: "2 / 4", gridRow: "3 / 4" };
//                   }
//                   return (
//                     <div
//                       key={idx}
//                       onClick={(e) => handleGridClick(e, item, "Zone 03")}
//                       style={{
//                         border: "1px solid #e6e6e6",
//                         borderRadius: "8px",
//                         fontFamily: "Roboto",
//                         fontWeight: "400",
//                         fontSize: "16px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                         backgroundColor: ["A1", "C2", "B3", "C3"].includes(item)
//                           ? "#ffffff"
//                           : "#e3f3ff",
//                         ...extraStyle,
//                       }}
//                     >
//                       {item}
//                     </div>
//                   );
//                 }
//               )}
//             </main>
//           </div>

         
//           <div
//             style={{
//               backgroundColor: "#fff",
//               padding: "24px",
//               border: "1px solid #e6e6e6",
//               borderRadius: "8px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <div
//                 style={{ display: "flex", alignItems: "center", gap: "50px" }}
//               >
//                 <span
//                   style={{
//                     fontFamily: "Roboto",
//                     fontWeight: "500",
//                     fontSize: "16px",
//                     color: "#262626",
//                   }}
//                 >
//                   Zone 04
//                 </span>
//                 <div
//                   style={{ display: "flex", alignItems: "center", gap: "16px" }}
//                 >
//                   <span
//                     style={{
//                       border: "1px solid #e6e6e6",
//                       borderRadius: "4px",
//                       padding: "8px",
//                       fontFamily: "Roboto",
//                       fontWeight: "400",
//                       fontSize: "16px",
//                       color: "#676767",
//                     }}
//                   >
//                     Assign Product
//                   </span>
//                   <select
//                     name="rack"
//                     style={{
//                       border: "1px solid #e6e6e6",
//                       borderRadius: "4px",
//                       padding: "8px",
//                       fontFamily: "Roboto",
//                       fontWeight: "400",
//                       fontSize: "16px",
//                       color: "#676767",
//                     }}
//                   >
//                     <option value="" disabled selected>
//                       Rack 1
//                     </option>
//                   </select>
//                   <select
//                     name="grid"
//                     style={{
//                       border: "1px solid #e6e6e6",
//                       borderRadius: "4px",
//                       padding: "8px",
//                       fontFamily: "Roboto",
//                       fontWeight: "400",
//                       fontSize: "16px",
//                       color: "#676767",
//                     }}
//                   >
//                     <option value="" disabled selected>
//                       A1
//                     </option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//             <div
//               style={{
//                 borderRadius: "8px",
//                 border: "1px solid #e6e6e6",
//                 marginTop: "10px",
//                 // backgroundColor: "#f7f7f7",
//               }}
//             >
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr
//                     style={{
//                       backgroundColor: "#f7f7f7",
//                       color: "#676767",
//                       fontSize: "16px",
//                       fontWeight: "400",
//                       fontFamily: "Roboto",
//                       borderRadius: "8px",
//                     }}
//                   >
//                     <th style={{ padding: "8px", borderTopLeftRadius: "8px" }}>
//                       Product
//                     </th>
//                     <th style={{}}>SKU</th>
//                     <th style={{ padding: "8px", borderTopRightRadius: "8px" }}>
//                       Quantity
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedProducts.map((product, index) => (
//                     <tr key={index} style={{ borderTop: "1px solid #e6e6e6" }}>
//                       <td
//                         style={{
//                           borderBottomLeftRadius: "8px",
//                           padding: "8px",
//                         }}
//                       >
//                         <img
//                           src={product.img}
//                           style={{
//                             width: "40px",
//                             height: "40px",
//                             marginRight: "10px",
//                             border: "none",
//                             // marginLeft: "5px",
//                           }}
//                         />
//                         {product.name}
//                       </td>
//                       <td style={{}}>{product.sku}</td>
//                       <td
//                         style={{
//                           borderBottomRightRadius: "8px",
//                           padding: "8px",
//                         }}
//                       >
//                         {product.qty}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
           
//             <div
//               className="pagination"
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 gap: "20px",
//                 marginTop: "10px",
//               }}
//             >
//               <div className="pagination-boxx">10 per page</div>
//               <div className="pagination-boxx pagination-info">
//                 <span></span>
//                 <span style={{ color: "grey" }}>
//                   {displayStart} - {displayEnd} of {totalCount}
//                 </span>
//                 <button
//                   className="pagination-arrow"
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                 >
//                   <FaAngleLeft />
//                 </button>
//                 <button
//                   className="pagination-arrow"
//                   onClick={() =>
//                     setCurrentPage(Math.min(totalPages, currentPage + 1))
//                   }
//                   disabled={currentPage === totalPages}
//                 >
//                   <FaChevronRight />
//                 </button>
//               </div>
//             </div>
//           </div>

         
//           <div
//             style={{
//               transform: "rotate(90deg)",
//               // marginBottom: "100px",
//               marginTop: "40px",
//             }}
//           >
//             <div
//               style={{
//                 transform: "rotate(0deg)",
//                 backgroundColor: "#3f99e1",
//                 padding: "24px",
//                 color: "#FFF",
//                 justifyContent: "space-between",
//                 display: "flex",
//                 border: "1px solid #e6e6e6",
//                 borderRadius: "8px",
//                 marginTop: "150px",
//                 marginBottom: "20px",
//                 width: "300px",
//               }}
//             >
//               <span className="invisible">hg</span>
//               <span className="zone-text">Zone 05</span>
//               <span style={{ transform: "rotate(0deg)" }}>
//                 <FaArrowRight />
//               </span>
//             </div>
//             <main
//               style={{
//                 width: "100%",
//                 display: "grid",
//                 gridTemplateRows: "40px 40px 40px",
//                 gridTemplateColumns: "repeat(4, 1fr)",
//                 gap: "10px",
//               }}
//             >
//               {["A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3"].map(
//                 (item, idx) => {
//                   let extraStyle = {};
//                   if (item === "B1") {
//                     extraStyle = { gridColumn: "2 / 4", gridRow: "1 / 2" };
//                   } else if (item === "B2") {
//                     extraStyle = { gridColumn: "2 / 4", gridRow: "2 / 3" };
//                   } else if (item === "B3") {
//                     extraStyle = { gridColumn: "2 / 4", gridRow: "3 / 4" };
//                   }
//                   return (
//                     <div
//                       key={idx}
//                       onClick={(e) => handleGridClick(e, item, "Zone 05")}
//                       style={{
//                         border: "1px solid #e6e6e6",
//                         borderRadius: "8px",
//                         fontFamily: "Roboto",
//                         fontWeight: "400",
//                         fontSize: "16px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                         backgroundColor: ["A1", "C2", "B3", "C3"].includes(item)
//                           ? "#ffffff"
//                           : "#e3f3ff",
//                         ...extraStyle,
//                       }}
//                     >
//                       {item}
//                     </div>
//                   );
//                 }
//               )}
//             </main>
//           </div>
//         </div> */}

//         {/* Zone 06 and Zone 07 (corrected to Zone 06 and Zone 07) */}

//         {/* <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginLeft: "110px",
//             marginRight: "70px",
//           }}
//         >
          
//           <div
//             style={{
//               width: "303px",
//               height: "345px",
//               marginTop: "0px",
//               transform: "rotate(-90deg)",
//             }}
//           >
//             <div
//               style={{
//                 transform: "rotate(0deg)",
//                 backgroundColor: "#3f99e1",
//                 padding: "24px",
//                 color: "#FFF",
//                 justifyContent: "space-between",
//                 display: "flex",
//                 border: "1px solid #e6e6e6",
//                 borderRadius: "8px",
//                 marginTop: "150px",
//                 marginBottom: "20px",
//               }}
//             >
//               <span className="invisible">hg</span>
//               <span className="zone-text">Zone 06</span>
//               <span style={{ transform: "rotate(0deg)" }}>
//                 <FaArrowRight />
//               </span>
//             </div>
//             <main
//               style={{
//                 width: "100%",
//                 display: "grid",
//                 gridTemplateRows: "40px 40px 40px",
//                 gridTemplateColumns: "repeat(3, 1fr)",
//                 gap: "10px",
//               }}
//             >
//               {["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"].map(
//                 (item, idx) => (
//                   <div
//                     key={idx}
//                     onClick={(e) => handleGridClick(e, item, "Zone 06")}
//                     style={{
//                       border: "1px solid #e6e6e6",
//                       borderRadius: "8px",
//                       fontFamily: "Roboto",
//                       fontWeight: "400",
//                       fontSize: "16px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                       backgroundColor: ["A1", "C2", "B3"].includes(item)
//                         ? "#ffffff"
//                         : "#e3f3ff",
//                     }}
//                   >
//                     {item}
//                   </div>
//                 )
//               )}
//             </main>
//           </div>

         
//           <div
//             style={{
//               width: "303px",
//               height: "345px",
//               marginTop: "0px",
//               transform: "rotate(90deg)",
//               marginLeft: "50px",
//             }}
//           >
//             <div
//               style={{
//                 transform: "rotate(0deg)",
//                 backgroundColor: "#3f99e1",
//                 padding: "24px",
//                 color: "#FFF",
//                 justifyContent: "space-between",
//                 display: "flex",
//                 border: "1px solid #e6e6e6",
//                 borderRadius: "8px",
//                 marginTop: "195px",
//                 marginBottom: "20px",
//               }}
//             >
//               <span className="invisible">hg</span>
//               <span className="zone-text">Zone 07</span>
//               <span style={{ transform: "rotate(0deg)" }}>
//                 <FaArrowRight />
//               </span>
//             </div>
//             <main
//               style={{
//                 width: "100%",
//                 display: "grid",
//                 gridTemplateRows: "40px 40px 40px",
//                 gridTemplateColumns: "repeat(3, 1fr)",
//                 gap: "10px",
//               }}
//             >
//               {["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"].map(
//                 (item, idx) => (
//                   <div
//                     key={idx}
//                     onClick={(e) => handleGridClick(e, item, "Zone 07")}
//                     style={{
//                       border: "1px solid #e6e6e6",
//                       borderRadius: "8px",
//                       fontFamily: "Roboto",
//                       fontWeight: "400",
//                       fontSize: "16px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                       backgroundColor: ["A1", "C2", "B3"].includes(item)
//                         ? "#ffffff"
//                         : "#e3f3ff",
//                     }}
//                   >
//                     {item}
//                   </div>
//                 )
//               )}
//             </main>
//           </div>
//         </div> */}

//         {/* Popup */}
//         {/* <Popup
//           isOpen={isPopupOpen}
//           onClose={closePopup}
//           selectedItem={selectedItem.grid}
//           zoneName={selectedItem.zone}
//         /> */}

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
//               padding: "100px",
//             }}
//           >
//             <div
//               ref={formRef}
//               style={{
//                 width: "800px",
//                 height: "600px",
//                 margin: "auto",
//                 marginTop: "10px",
//                 padding: "10px 16px",
//                 overflowY: "auto",
//                 borderRadius: "8px",
//               }}
//             >
//               {/* Search Box */}

//               {/* Add New Customer Button */}
//               <div
//                 style={{
//                   top: "0",
//                   left: "0",
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: "#ffffff",
//                   display: "flex",
//                   justifyContent: "center",
//                   //  alignItems: 'center',
//                   zIndex: "1000",
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundColor: "#fff",
//                     padding: "20px",
//                     borderRadius: "8px",
//                     textAlign: "center",
//                     width: "100%",
//                     overflowY: "auto",
//                     boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//                     position: "relative",
//                   }}
//                 >
//                   <div
//                     style={{
//                       backgroundColor: "#1368ec",
//                       color: "#fff",
//                       padding: "16px 18px",
//                       borderTopLeftRadius: "8px",
//                       borderTopRightRadius: "8px",
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <h2 style={{ margin: "0" }}>Assign Product</h2>
//                   </div>

//                   <div style={{ marginTop: "10px" }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px",
//                         marginBottom: "20px",
//                         padding: "5px 10px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           color: "#676767",
//                           fontFamily: "roboto",
//                           fontWeight: "400",
//                           fontSize: "16px",
//                         }}
//                       >
//                         zone -
//                       </span>
//                       {/* grid name */}
//                       <span
//                         style={{
//                           color: "#262626",
//                           fontFamily: "roboto",
//                           fontWeight: "400",
//                           fontSize: "16px",
//                         }}
//                       >
//                         {selectedItem.productName}
//                       </span>
//                     </div>

//                     {/* search bar */}

//                     {/* Search Box */}
//                     <div style={{ position: "relative", marginBottom: "20px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           border: "1px solid #E1E1E1",
//                           borderRadius: "8px",
//                           backgroundColor: "#fff",
//                           padding: "6px 12px",
//                         }}
//                       >
//                         <IoSearch
//                           style={{
//                             fontSize: "20px",
//                             marginRight: "10px",
//                             color: "#C2C2C2",
//                           }}
//                         />
//                         <input
//                           type="text"
//                           placeholder="Search by name, email, or phone number..."
//                           value={searchQuery}
//                           onChange={(e) => handleProductSearch(e.target.value)}
//                           style={{
//                             width: "100%",
//                             padding: "8px",
//                             fontSize: "16px",
//                             border: "none",
//                             outline: "none",
//                             color: "#333",
//                           }}
//                         />
//                       </div>

//                       {/* Search Results Dropdown */}
//                       {showDropdown && searchResults.length > 0 && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             top: "100%",
//                             left: 0,
//                             right: 0,
//                             backgroundColor: "white",
//                             border: "1px solid #E1E1E1",
//                             borderRadius: "8px",
//                             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                             maxHeight: "300px",
//                             overflowY: "auto",
//                             zIndex: 1000,
//                           }}
//                         >
//                           {searchResults.map((product) => (
//                             <div
//                               key={product._id}
//                               onClick={() => handleSelectedProduct(product)} // you can replace with select handler
//                               style={{
//                                 padding: "12px 16px",
//                                 cursor: "pointer",
//                               }}
//                             >
//                               <div
//                                 style={{ fontWeight: "600", textAlign: "left" }}
//                               >
//                                 {product.productName || "No Name"}
//                               </div>
//                               <div
//                                 style={{ fontSize: "14px", color: "#666" }}
//                               ></div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* No Results Message */}
//                       {showDropdown &&
//                         searchResults.length === 0 &&
//                         searchQuery.trim() !== "" && (
//                           <div
//                             style={{
//                               position: "absolute",
//                               top: "100%",
//                               left: 0,
//                               right: 0,
//                               backgroundColor: "white",
//                               border: "1px solid #E1E1E1",
//                               borderRadius: "8px",
//                               padding: "16px",
//                               textAlign: "center",
//                               color: "#666",
//                               zIndex: 1000,
//                             }}
//                           >
//                             No product found matching "{searchQuery}"
//                           </div>
//                         )}
//                     </div>

//                     <div
//                       style={{
//                         border: "1px solid #c2c2c2",
//                         color: "#ffffff",
//                         borderRadius: "8px",
//                         gap: "10px",
//                         marginTop: "5px",
//                       }}
//                     >
//                       <div style={{ padding: "10px 16px" }}>
//                         <p style={{ color: "#676767", margin: "20px 0" }}>
//                           You haven't added any products yet.
//                           <br /> Use{" "}
//                           <span style={{ color: "#177ecc" }}>
//                             browse
//                           </span> or{" "}
//                           <span style={{ color: "#177ecc" }}>search</span> to
//                           get started.
//                         </p>
//                       </div>
//                       <div
//                         style={{
//                           position: "absolute",
//                           bottom: "10px",
//                           right: "20px",
//                           justifyContent: "right",
//                           display: "flex",
//                         }}
//                       >
//                         <button
//                           style={{
//                             padding: "8px 16px",
//                             backgroundColor: "#007bff",
//                             color: "#fff",
//                             border: "none",
//                             borderRadius: "4px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Done
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div
//         style={{
//           overflow: "auto",
//           display: "flex",
//           justifyContent: "center",
//           position: "fixed",
//           bottom: "0px",
//           width: "100%",
//           backgroundColor: "#f7f7f7",
//           padding: "10px",
//           left: "1px",
//         }}
//       >
//         <div style={{ display: "flex", gap: "10px" }}>
//           <div style={{ display: "flex", gap: "10px" }}>
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 padding: "5px 15px",
//                 borderRadius: "5px",
//               }}
//             ></div>
//             <span>Available</span>
//           </div>
//           <div style={{ display: "flex", gap: "10px" }}>
//             <div
//               style={{
//                 backgroundColor: "#e3f3ff",
//                 padding: "5px 15px",
//                 borderRadius: "5px",
//               }}
//             ></div>
//             <span>Occupied</span>
//           </div>
//           <div style={{ display: "flex", gap: "10px" }}>
//             <div
//               style={{
//                 backgroundColor: "#1368ec",
//                 padding: "5px 15px",
//                 borderRadius: "5px",
//               }}
//             ></div>
//             <span>Selected</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Godown;




// NEW CODE ===============================================================================================================


import React, { useState, useCallback, useEffect, useRef } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import {
  FaSearch,
  FaArrowRight,
  FaChevronRight,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { RiArrowUpDownLine } from "react-icons/ri";
import { FaAngleLeft, FaAngleRight, FaTrash } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import BASE_URL from "../../../pages/config/config";
import axios from "axios";

function Godown() {
  const { id } = useParams();
  const [warehousesDetails, setWarehousesDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(""); // State for zone filter
  const [selectedItem, setSelectedItem] = useState({ zone: "", grid: "" });
  const [selectedProduct, setSelectedProduct] = useState(null); // Renamed for clarity
  const [selectedCell, setSelectedCell] = useState(""); // New state for selected cell
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false); // Loading state for save
  const [saveError, setSaveError] = useState(null); // Error state for save
  const [selectedCellItems, setSelectedCellItems] = useState([]); // New state for cell items
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const [itemsPerPage] = useState(5); // New state for items per page
  const formRef = useRef(null);

  // Fetch warehouse details
  const detailsWarehouses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/warehouse/${id}`);
      
      setWarehousesDetails(res.data.warehouse);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    detailsWarehouses();
  }, [detailsWarehouses]);

  // Set zones from warehousesDetails.blocks
  useEffect(() => {
    if (Array.isArray(warehousesDetails?.blocks)) {
      setZones(warehousesDetails.blocks);
    } else {
      setZones([]);
    }
  }, [warehousesDetails]);

  // Handle popup open/close
  const handlePopup = (zone, cellId) => {
    setSelectedItem({ zone, grid: cellId });
    const zoneIndex = zones.findIndex((z) => z.zone === zone);
    const cellIndex = zones[zoneIndex]?.cells.findIndex(
      (cell) => cell.name === cellId
    );
    if (zoneIndex !== -1 && cellIndex !== -1) {
      const cell = zones[zoneIndex].cells[cellIndex];
      setSelectedCellItems(cell.items || []);
    } else {
      setSelectedCellItems([]);
    }
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null); // Clear selected product on close
    setSaveError(null); // Clear save error
    setSelectedCellItems([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        closePopup();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Save product to cell in database
  const saveProductToCell = async () => {
    if (!selectedProduct || !selectedItem.zone || !selectedItem.grid) {
      setSaveError("Please select a product and cell.");
      return;
    }

    setSaveLoading(true);
    setSaveError(null);

    try {
      // Find the zone index
      const zoneIndex = zones.findIndex((z) => z.zone === selectedItem.zone);

      // Use the grid ID directly as the cell name (e.g., "1", "2")
      const cellName = selectedItem.grid;
      // Find the cell index by matching the name field
      const cellIndex = zones[zoneIndex].cells.findIndex(
        (cell) => cell.name === cellName
      );

      if (zoneIndex === -1 || cellIndex === -1) {
        throw new Error("Invalid zone or cell.");
      }

      // Send PATCH request to update cell with product
      console.log("Sending PATCH request:", {
        warehouseId: id,
        zone: selectedItem.zone,
        cellIndex,
        productId: selectedProduct._id,
      });
      const response = await axios.patch(
        `${BASE_URL}/api/warehouse/${id}/zone/${selectedItem.zone}/cell/${cellIndex}`,
        {
          productId: selectedProduct._id,
          quantity: 1, // Add quantity
          barcode: selectedProduct.barcode || `BARCODE-${selectedProduct._id}`, // Add barcode if available
        }
      );

      // Update local state to reflect the change
      setZones((prevZones) => {
        const updatedZones = [...prevZones];
        updatedZones[zoneIndex].cells[cellIndex] = {
          ...updatedZones[zoneIndex].cells[cellIndex],
          product: selectedProduct, // Update product field
          items: [
            ...(updatedZones[zoneIndex].cells[cellIndex].items || []),
            {
              productId: selectedProduct._id,
              quantity: 1,
              barcode: selectedProduct.barcode || `BARCODE-${selectedProduct._id}`,
            },
          ], // Update items array
        };
        return updatedZones;
      });

      setSelectedCellItems((prevItems) => [
        ...prevItems,
        {
          productId: selectedProduct.productId,
          quantity: selectedProduct.quantity,
          barcode: selectedProduct.barcode,
          product: selectedProduct.productId,
        },
      ]);

      // Close popup on success
      closePopup();
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save product.");
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  // Filter zones based on selectedZone
  const filteredZones = selectedZone
    ? zones.filter((zone) => zone.zone === selectedZone)
    : zones;

  // Product search and selection logic (unchanged from your code)
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Filter products by warehouse ID
        const res = await axios.get(`${BASE_URL}/api/products?warehouse=${id}`);
        setProducts(res.data);
        setAllProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, [id]);

  const handleProductSearch = (query) => {
    setSearchQuery(query);
    setProductSearchQuery(query);

    if (!query.trim()) {
      setProducts(allProducts);
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filteredProducts = allProducts.filter((product) => {
      return (
        product.productName?.toLowerCase().includes(searchTerm) ||
        (product.brand &&
          typeof product.brand === "object" &&
          product.brand.name?.toLowerCase().includes(searchTerm)) ||
        (product.brand &&
          typeof product.brand === "string" &&
          product.brand.toLowerCase().includes(searchTerm)) ||
        product.seoTitle?.toLowerCase().includes(searchTerm) ||
        product.seoDescription?.toLowerCase().includes(searchTerm) ||
        (product.category &&
          typeof product.category === "object" &&
          product.category.name?.toLowerCase().includes(searchTerm)) ||
        (product.category &&
          typeof product.category === "string" &&
          product.category.toLowerCase().includes(searchTerm)) ||
        (product.subcategory &&
          typeof product.subcategory === "object" &&
          product.subcategory.name?.toLowerCase().includes(searchTerm)) ||
        (product.subcategory &&
          typeof product.subcategory === "string" &&
          product.subcategory.toLowerCase().includes(searchTerm))
      );
    });

    setProducts(filteredProducts);
    setSearchResults(filteredProducts);
    setShowDropdown(true);
  };

  const handleSelectedProduct = (product) => {
    setSelectedProduct(product);
    setSearchQuery(product.productName || "");
    setShowDropdown(false);
  };

  const handleClearCustomer = () => {
    setSelectedProduct(null);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };


  // Pagination logic
  const getPaginatedItems = () => {
    if (!selectedZone || !filteredZones.length) return [];
    let allItems = filteredZones[0].cells.flatMap((cell) =>
      cell.items?.map((item) => ({ ...item, cellName: cell.name })) || []
    );
    if (selectedCell) {
      allItems = allItems.filter((item) => item.cellName === selectedCell);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allItems.slice(startIndex, endIndex);
  };

  const totalItems = selectedZone
    ? filteredZones[0]?.cells
      .flatMap((cell) =>
        selectedCell
          ? cell.name === selectedCell
            ? cell.items || []
            : []
          : cell.items || []
      )
      .length
    : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  // Remove item from cell
  const removeItemFromCell = async (itemIndex) => {
    if (!selectedItem.zone || !selectedItem.grid) {
      setSaveError("No cell selected.");
      return;
    }

    setSaveLoading(true);
    setSaveError(null);

    try {
      const zoneIndex = zones.findIndex((z) => z.zone === selectedItem.zone);
      const cellName = selectedItem.grid;
      const cellIndex = zones[zoneIndex].cells.findIndex(
        (cell) => cell.name === cellName
      );

      if (zoneIndex === -1 || cellIndex === -1) {
        throw new Error("Invalid zone or cell.");
      }

      const itemToRemove = selectedCellItems[itemIndex];

      await axios.patch(
        `${BASE_URL}/api/warehouse/${id}/zone/${selectedItem.zone}/cell/${cellIndex}/remove-item`,
        {
          productId: itemToRemove.productId._id,
          barcode: itemToRemove.barcode,
        }
      );

      setZones((prevZones) => {
        const updatedZones = [...prevZones];
        updatedZones[zoneIndex].cells[cellIndex].items = updatedZones[
          zoneIndex
        ].cells[cellIndex].items.filter((_, idx) => idx !== itemIndex);
        if (updatedZones[zoneIndex].cells[cellIndex].items.length === 0) {
          updatedZones[zoneIndex].cells[cellIndex].product = null;
        }
        return updatedZones;
      });

      setSelectedCellItems((prevItems) =>
        prevItems.filter((_, idx) => idx !== itemIndex)
      );

      detailsWarehouses();
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to remove item.");
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
      <div style={{ padding: "20px", overflowY: "auto", height: "85vh" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#676767",
              display: "flex",
              gap: "16px",
              fontWeight: "500",
              alignItems: "center",
            }}
          >
            <span>Warehouse</span>
            <MdArrowForwardIos style={{ color: "#b0afafff" }} />
            <Link
              style={{ color: "#676767", textDecoration: "none" }}
              to={"/Warehouse"}
            >
              All Warehouse
            </Link>
            <MdArrowForwardIos style={{ color: "#b0afafff" }} />
            <Link
              style={{ color: "#676767", textDecoration: "none" }}
              to={`/WarehouseDetails/${warehousesDetails?._id}`}
            >
              {warehousesDetails?.warehouseName}
            </Link>
            <MdArrowForwardIos style={{ color: "#b0afafff" }} />
            <span
              style={{
                fontFamily: "Roboto",
                fontWeight: "500",
                fontSize: "18px",
                color: "#262626",
              }}
            >
              Godown
            </span>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            gap: "9px",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              backgroundColor: "#f9f9f9",
              width: "90%",
              gap: "19px",
              justifyContent: "space-between",
              padding: "4px 16px",
              border: "1px solid #e6e6e6",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                padding: "4px 16px",
                display: "flex",
                alignItems: "center",
                gap: "9px",
              }}
            >
              <FaSearch />
              <input
                type="search"
                placeholder="Search Items"
                style={{
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                }}
              />
            </div>
            <div
              style={{
                padding: "4px",
                border: "1px solid #f1f1f1",
                borderRadius: "4px",
              }}
            >
              <RiArrowUpDownLine />
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "8px 16px",
              border: "1px solid #e6e6e6",
              borderRadius: "8px",
            }}
          >
            <select
              name="zone"
              value={selectedZone}
              onChange={(e) => {
                setSelectedZone(e.target.value);
                setSelectedCell(""); // Reset cell filter when zone changes
                setCurrentPage(1); // Reset to page 1 when zone changes
              }}
              style={{ border: "none", outline: "none" }}
            >
              <option value="">All Zones</option>
              {zones.map((zone, idx) => (
                <option key={idx} value={zone.zone}>
                  {zone.zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredZones?.length > 0 ? (
          filteredZones.map((zone, zoneIdx) => {
            // Generate cell IDs based on rows and columns (e.g., A1, A2, ..., E4)
            const rows = warehousesDetails?.layout?.rows;
            const columns = warehousesDetails?.layout?.columns;
            const cellIds = [];
            for (let i = 1; i <= rows * columns; i++) {
              cellIds.push(`${i}`);
            }

            return (
              <>
                <div key={zoneIdx} style={{ margin: 'auto 0', width: '100%', justifyContent: 'center', display: 'flex' }}>
                  <div style={{ width: '500px', maxWidth: '1000px' }}>

                    <div
                      style={{
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#3f99e1",
                          padding: "24px",
                          color: "#FFF",
                          justifyContent: "space-between",
                          display: "flex",
                          border: "1px solid #e6e6e6",
                          borderRadius: "8px",
                          marginTop: "40px",
                          marginBottom: "20px",
                          width: "100%",
                        }}
                      >
                        <span className="invisible">hg</span>
                        <span className="zone-text">{zone.zone}</span>
                        <span>
                          <FaArrowRight />
                        </span>
                      </div>
                    </div>

                    <main
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        gridRowGap: "10px",
                        gridColumnGap: "10px",
                        justifyContent: "space-between",
                      }}
                    >
                      {Array.isArray(zone.cells) && zone.cells.length > 0 ? (
                        zone.cells.map((cell, cellIdx) => (
                          <div
                            key={cellIdx}
                            onClick={() => handlePopup(zone.zone, cellIds[cellIdx])}
                            style={{
                              border: "1px solid #e6e6e6",
                              color: "#000000",
                              borderRadius: "8px",
                              fontFamily: "Roboto",
                              fontWeight: "400",
                              fontSize: "16px",
                              alignItems: "center",
                              justifyContent: "center",
                              display: "flex",
                              cursor: "pointer",
                              backgroundColor: cell.items && cell.items.length > 0 ? "#e3f3ff" : "#ffffff",
                            }}
                          >
                            {cellIds[cellIdx]}
                          </div>
                        ))
                      ) : (
                        <div>No cells available</div>
                      )}
                    </main>

                  </div>
                </div>

              </>
            );
          })
        ) : (
          <div>No zones available</div>
        )}

        {isPopupOpen && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(199, 197, 197, 0.4)",
              backdropFilter: "blur(1px)",
              display: "flex",
              justifyContent: "center",
              zIndex: "10",
              overflowY: "auto",
              padding: "100px",
            }}
          >
            <div
              ref={formRef}
              style={{
                width: "900px",
                height: "700px",
                margin: "auto",
                marginTop: "20px",
                padding: "10px 16px",
                overflowY: "auto",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                  width: "100%",
                  height:'500px',
                  overflowY: "auto",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#1368ec",
                    color: "#fff",
                    padding: "16px 18px",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2 style={{ margin: "0" }}>Assign Product</h2>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "20px",
                      padding: "5px 10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#676767",
                        fontFamily: "roboto",
                        fontWeight: "400",
                        fontSize: "16px",
                      }}
                    >
                      {selectedItem.zone} ,
                    </span>
                    <span
                      style={{
                        color: "#262626",
                        fontFamily: "roboto",
                        fontWeight: "400",
                        fontSize: "16px",
                      }}
                    >
                      Cell - {selectedItem.grid}
                    </span>
                  </div>


                  {selectedCellItems.length > 0 ? (
                    <div style={{ textAlign: "left", marginBottom: "20px" }}>
                      <h3 style={{ margin: "0 0 10px 0", color: "#262626" }}>
                        Items in Cell
                      </h3>
                      {selectedCellItems.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            color: "#262626",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            padding: "5px",
                            backgroundColor: "#f9f9f9",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: '10px'
                            }}
                          >
                            <div style={{ width: "40px", height: "40px" }}>
                              <img
                                src={item.productId?.images?.[0]?.url}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  marginRight: "10px",
                                  border: "none",
                                  objectFit: "contain",
                                }}
                                alt={item.product?.productName || "No Image"}
                              />
                            </div>
                            <div>
                              <div>{item.productId.productName}</div>
                              <div style={{ fontSize: "14px", color: "#676767" }}>
                                Quantity: {item.productId.quantity}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItemFromCell(index)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc3545",
                              cursor: saveLoading ? "not-allowed" : "pointer",
                              fontSize: "16px",
                              padding: "2px 8px",
                            }}
                            title="Remove item"
                            disabled={saveLoading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div style={{ position: "relative", marginBottom: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #E1E1E1",
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            padding: "6px 12px",
                          }}
                        >
                          <IoSearch
                            style={{
                              fontSize: "20px",
                              marginRight: "10px",
                              color: "#C2C2C2",
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Search by name, email, or phone number..."
                            value={searchQuery}
                            onChange={(e) => handleProductSearch(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              fontSize: "16px",
                              border: "none",
                              outline: "none",
                              color: "#333",
                            }}
                          />
                        </div>

                        {showDropdown && searchResults.length > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              backgroundColor: "white",
                              border: "1px solid #E1E1E1",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              maxHeight: "200px",
                              overflowY: "auto",
                              zIndex: 1000,
                            }}
                          >
                            {searchResults.map((product) => (
                              <div
                                key={product._id}
                                onClick={() => handleSelectedProduct(product)}
                                style={{
                                  padding: "12px 16px",
                                  cursor: "pointer",
                                }}
                              >
                                <div
                                  style={{ fontWeight: "600", textAlign: "left" }}
                                >
                                  {product.productName || "No Name"}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {showDropdown &&
                          searchResults.length === 0 &&
                          searchQuery.trim() !== "" && (
                            <div
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                backgroundColor: "white",
                                border: "1px solid #E1E1E1",
                                borderRadius: "8px",
                                padding: "16px",
                                textAlign: "center",
                                color: "#666",
                                zIndex: 1000,
                              }}
                            >
                              No product found matching "{searchQuery}"
                            </div>
                          )}
                      </div>

                      {selectedProduct ? (
                        <div
                          style={{
                            textAlign: "left",
                            marginTop: "20px",
                          }}
                        >
                          <div
                            style={{
                              color: "#262626",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "10px",
                              border: '1px solid #ccc',
                              borderRadius: '6px',
                              padding: '5px',
                              backgroundColor: '#f9f9f9',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <div style={{ width: '40px', height: '40px', }}>
                                <img
                                  src={selectedProduct?.images?.[0]?.url}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    marginRight: "10px",
                                    border: "none",
                                    objectFit: 'contain'
                                  }}
                                  alt={selectedProduct.productName}
                                />
                              </div>
                              <span>{selectedProduct.productName}</span>
                            </div>
                            <button
                              onClick={handleClearCustomer}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#dc3545",
                                cursor: "pointer",
                                fontSize: "12px",
                                padding: "2px 8px",
                                borderRadius: "4px",
                              }}
                              title="Clear product"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            border: "1px solid #c2c2c2",
                            borderRadius: "8px",
                            gap: "10px",
                            marginTop: "5px",
                          }}
                        >
                          <div style={{ padding: "10px 16px" }}>
                            <p style={{ color: "#676767", margin: "20px 0" }}>
                              You haven't added any products yet.
                              <br /> Use
                              <span style={{ color: "#177ecc" }}> browse</span> or
                              <span style={{ color: "#177ecc" }}> search</span> to
                              get started.
                            </p>
                          </div>
                        </div>
                      )}


                      {saveError && (
                        <div
                          style={{
                            color: "#dc3545",
                            fontSize: "14px",
                            marginTop: "20px",
                            textAlign: "left",
                          }}
                        >
                          {saveError}
                        </div>
                      )}
                      <div
                        style={{
                          bottom: "10px",
                          right: "20px",
                          justifyContent: "right",
                          display: "flex",
                          marginTop: '20px'
                        }}
                      >
                        <button
                          style={{
                            padding: "8px 16px",
                            backgroundColor: saveLoading ? "#6c757d" : "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: saveLoading ? "not-allowed" : "pointer",
                          }}
                          onClick={saveProductToCell}
                          disabled={saveLoading}
                        >
                          {saveLoading ? "Saving..." : "Done"}
                        </button>
                      </div>

                    </>
                  )}

                </div>

              </div>
            </div>
          </div>
        )}

        {selectedZone && filteredZones.length > 0 && (
          <div style={{ margin: "auto 0", width: "100%", justifyContent: "center", display: "flex" }}>
            <div style={{ width: "500px", maxWidth: "1000px" }}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "24px",
                  border: "1px solid #e6e6e6",
                  borderRadius: "8px",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "50px" }}
                  >
                    <span
                      style={{
                        fontFamily: "Roboto",
                        fontWeight: "500",
                        fontSize: "16px",
                        color: "#262626",
                      }}
                    >
                      {selectedZone}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "16px" }}
                  >
                    <span
                      style={{
                        border: "1px solid #e6e6e6",
                        borderRadius: "4px",
                        padding: "8px",
                        fontFamily: "Roboto",
                        fontWeight: "400",
                        fontSize: "16px",
                        color: "#676767",
                        cursor: "pointer",
                      }}
                    >
                      Assign Product
                    </span>
                    <select
                      name="grid"
                      style={{
                        border: "1px solid #e6e6e6",
                        borderRadius: "4px",
                        padding: "8px",
                        fontFamily: "Roboto",
                        fontWeight: "400",
                        fontSize: "16px",
                        color: "#676767",
                        width: '70px'
                      }}
                      onChange={(e) => {
                        setSelectedCell(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All</option>
                      {filteredZones[0].cells.map((cell, idx) => (
                        <option key={idx} value={cell.name}>
                          {cell.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e6e6e6",
                    marginTop: "10px",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f7f7f7",
                          color: "#676767",
                          fontSize: "16px",
                          fontWeight: "400",
                          fontFamily: "Roboto",
                          borderRadius: "8px",
                        }}
                      >
                        <th style={{ padding: "8px", borderTopLeftRadius: "8px" }}>
                          Product
                        </th>
                        <th>SKU</th>
                        <th style={{ padding: "8px", borderTopRightRadius: "8px" }}>
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedItems().length > 0 ? (
                        getPaginatedItems().map((item, itemIdx) => (
                          <tr key={`${item.cellName}-${itemIdx}`} style={{ borderTop: "1px solid #e6e6e6" }}>
                            <td
                              style={{
                                borderBottomLeftRadius: "8px",
                                padding: "8px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={item.productId?.images?.[0]?.url || "https://via.placeholder.com/40"}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  marginRight: "10px",
                                  border: "none",
                                  objectFit: "contain",
                                }}
                                alt={item.productId?.productName || "No Image"}
                              />
                              {item.productId?.productName || "Unknown Product"}
                            </td>
                            <td>{item.productId?.sku || "N/A"}</td>
                            <td
                              style={{
                                borderBottomRightRadius: "8px",
                                padding: "8px",
                              }}
                            >
                              {item.productId.quantity}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" style={{ padding: "8px", textAlign: "center" }}>
                            No items in {selectedCell ? `cell ${selectedCell}` : "this zone"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div
                  className=""
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    gap: "20px",
                    marginTop: "15px",
                  }}
                >
                  <div className="pagination-boxx">{itemsPerPage} per page</div>
                  <div className="pagination-boxx pagination-info">
                    <span style={{ color: "grey" }}>
                      {totalItems > 0 ? `${currentPage} of ${totalPages}` : "0 of 0"}
                    </span>
                    <button
                      className=""
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      style={{ border: 'none', backgroundColor: 'white' }}
                    >
                      <FaAngleLeft />
                    </button>
                    <button
                      className=""
                      disabled={currentPage === totalPages || totalItems === 0}
                      onClick={() => handlePageChange(currentPage + 1)}
                      style={{ border: 'none', backgroundColor: 'white' }}
                    >
                      <FaAngleRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          bottom: "0px",
          width: "100%",
          backgroundColor: "#f7f7f7",
          padding: "10px",
          left: "1px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "5px 15px",
                borderRadius: "5px",
              }}
            ></div>
            <span>Available</span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#e3f3ff",
                padding: "5px 15px",
                borderRadius: "5px",
              }}
            ></div>
            <span>Occupied</span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#1368ec",
                padding: "5px 15px",
                borderRadius: "5px",
              }}
            ></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Godown;