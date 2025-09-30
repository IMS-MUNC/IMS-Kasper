// import React, { useState, useEffect } from "react";
// import Popup from "reactjs-popup";
// import { MdArrowForwardIos } from "react-icons/md";
// import { IoMdClose } from "react-icons/io";
// import { LuLayoutDashboard } from "react-icons/lu";
// import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
// import { Country, State, City } from "country-state-city";
// import { toast } from "react-toastify";
// import BASE_URL from "../../../pages/config/config";
// import axios from "axios";

// function AddWarehouse() {
//   // State for popup inputs
//   const [rows, setRows] = useState("");
//   const [columns, setColumns] = useState("");
//   const [width, setWidth] = useState("");
//   const [zones, setZones] = useState("0"); // Initial 0 for blank popup preview
//   // State for main layout (updated only on import)
//   const [mainRows, setMainRows] = useState(4);
//   const [mainColumns, setMainColumns] = useState(3);
//   const [mainWidth, setMainWidth] = useState(1); // Width in meters
//   const [mainZones, setMainZones] = useState(1);
//   // State for warehouse details form
//   const [warehouseName, setWarehouseName] = useState("");
//   const [phone, setphone] = useState("");
//   const [warehouseCode, setWarehouseCode] = useState("");
//   const [warehouseOwner, setWarehouseOwner] = useState("");
//   const [address, setAddress] = useState("");
//   const [country, setCountry] = useState("");
//   const [state, setState] = useState("");
//   const [city, setCity] = useState("");
//   const [pinCode, setPinCode] = useState("");

//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   const [countryList, setCountryList] = useState([]);
//   const [stateList, setStateList] = useState([]);
//   const [cityList, setCityList] = useState([]);

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setCountryList(Country.getAllCountries());
//   }, []);

//   useEffect(() => {
//     if (selectedCountry) {
//       setStateList(State.getStatesOfCountry(selectedCountry));
//     }
//   }, [selectedCountry]);

//   useEffect(() => {
//     if (selectedState) {
//       setCityList(City.getCitiesOfState(selectedCountry, selectedState));
//     }
//   }, [selectedState]);
  
//   // State for import status and message
//   const [isImported, setIsImported] = useState(false);
//   const [showMessage, setShowMessage] = useState(false);
// const token = localStorage.getItem("token");

//   // Navigation hook
//   const navigate = useNavigate();

//   // Handler for importing layout and closing popup
//   const handleImport = (close) => {
//     // Validate inputs to ensure rows and columns are at least 1
//     const parsedRows = rows === "" ? 3 : Math.max(1, parseInt(rows));
//     const parsedColumns = columns === "" ? 3 : Math.max(1, parseInt(columns));
//     const parsedWidth = width === "" ? 1 : Math.max(1, parseInt(width));
//     const parsedZones = zones === "" ? 1 : Math.max(1, parseInt(zones));

//     // Update main layout states
//     setMainRows(parsedRows);
//     setMainColumns(parsedColumns);
//     setMainWidth(parsedWidth);
//     setMainZones(parsedZones);

//     // Reset popup inputs
//     setRows("");
//     setColumns("");
//     setWidth("");
//     setZones("0");

//     // Set import status and show success message
//     setIsImported(true);
//     setShowMessage(true);

//     close(); // Close the popup after updating state
//   };

//   // Handler for Draft button
//   const handleDraft = () => {
//     const warehouseData = {
//       warehouseName,
//       phone,
//       warehouseCode,
//       warehouseOwner,
//       // contactPerson,
//       address,
//       country,
//       state,
//       city,
//       pinCode,
//       layout: {
//         rows: mainRows,
//         columns: mainColumns,
//         width: mainWidth,
//         zones: mainZones,
//       },
//     };
//     console.log("Draft saved:", warehouseData);
//     // TODO: Replace with API call or state persistence logic
//   };
//   const [formData, setFormData] = useState(handleDraft);

//   // Handler for Save button
//   const handleSave = async () => {
//     const warehouseData = {
//       warehouseName,
//       phone,
//       warehouseCode,
//       warehouseOwner,
//       address,
//       country: selectedCountry
//         ? Country.getAllCountries().find((c) => c.isoCode === selectedCountry)
//             ?.name || ""
//         : "",
//       state: selectedState
//         ? State.getStatesOfCountry(selectedCountry).find(
//             (s) => s.isoCode === selectedState
//           )?.name || ""
//         : "",
//       city: selectedCity,
//       pinCode,
//       layout: {
//         rows: mainRows,
//         columns: mainColumns,
//         width: mainWidth,
//         zones: mainZones,
//       },
//     };
//     try {
//       await axios.post(`${BASE_URL}/api/warehouse`, warehouseData,{
//          headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success("Warehouse saved successfully");
//     } catch (error) {
//       console.error("Error saving warehouse:", error);
//       console.log("diwakar eror", error);

//       toast.error(
//         error.response?.status === 409
//           ? error.response.data.message
//           : "Failed to save warehouse"
//       );
//     }
//   };

//   // Handler for Done button
//   const handleDone = () => {
//     // Reset all states to initial values
//     setWarehouseName("");
//     setphone("");
//     setWarehouseCode("");
//     setWarehouseOwner("");
//     setAddress("");
//     setCountry("");
//     setState("");
//     setCity("");
//     setPinCode("");
//     setMainRows(3);
//     setMainColumns(3);
//     setMainWidth(1);
//     setMainZones(1);
//     setIsImported(false);
//     setShowMessage(false);
//     // Navigate to AllWarehouse page
//     navigate("/warehouse"); // Adjust route as needed
//   };

//   // Effect to auto-hide the success message after 3 seconds
//   useEffect(() => {
//     if (showMessage) {
//       const timer = setTimeout(() => {
//         setShowMessage(false);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [showMessage]);
//   // const handleSubmit = async (e) => {
//   //         e.preventDefault();
//   //         setLoading(true);

//   //         try {

//   //             await axios.post(`${BASE_URL}/api/warehouse`, {

//   //             });

//   //             toast.success("Warehouse added successfully");

//   //             setForm(initialForm);
//   //             window.$(`#add-warehouse`).modal("hide");

//   //         } catch (error) {
//   //             console.error(error);

//   //             // 409 (Conflict) = duplicate warehouse
//   //             if (error.response?.status === 409) {
//   //                 toast.error(error.response.data.message);
//   //             } else {
//   //                 toast.error("Failed to add warehouse");
//   //             }
//   //         } finally {
//   //             setLoading(false);
//   //         }
//   //     };
//   // Component for rendering a single grid

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const warehouseData = {
//         warehouseName,
//         phone,
//         warehouseCode,
//         warehouseOwner,
//         address,
//         country: selectedCountry
//           ? Country.getAllCountries().find((c) => c.isoCode === selectedCountry)
//               ?.name || ""
//           : "",
//         state: selectedState
//           ? State.getStatesOfCountry(selectedCountry).find(
//               (s) => s.isoCode === selectedState
//             )?.name || ""
//           : "",
//         city: selectedCity,
//         pinCode,
//         layout: {
//           rows: mainRows,
//           columns: mainColumns,
//           width: mainWidth,
//           zones: mainZones,
//         },
//       };

//       await axios.post(`${BASE_URL}/api/warehouse`, warehouseData,{
//          headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success("Warehouse added successfully");

//       // Reset form
//       setWarehouseName("");
//       setphone("");
//       setWarehouseCode("");
//       setWarehouseOwner("");
//       setAddress("");
//       setSelectedCountry("");
//       setSelectedState("");
//       setSelectedCity("");
//       setPinCode("");
//       setMainRows(3);
//       setMainColumns(3);
//       setMainWidth(1);
//       setMainZones(1);
//       setIsImported(false);
//       setShowMessage(false);

//       navigate("/warehouse");
//     } catch (error) {
//       console.error("Error adding warehouse:", error);
//       toast.error(
//         error.response?.status === 409
//           ? error.response.data.message
//           : "Failed to add warehouse"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderGrid = (gridRows, gridColumns, gridWidth, zoneIndex) => {
//     const cellWidthPx = 50; // Equal width for all cells
//     const totalGridContentWidth = (gridColumns || 3) * (cellWidthPx + 8) - 8;

//     return (
//       <div
//         key={zoneIndex}
//         style={{
//           marginTop: "5px",
//           marginBottom: "20px",
//           marginLeft: "auto",
//           marginRight: "auto",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           boxSizing: "border-box",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: "#BBE1FF",
//             padding: "16px",
//             textAlign: "center",
//             fontWeight: "500",
//             fontSize: "16px",
//             borderRadius: "6px",
//             marginBottom: "10px",
//             width: "100%",
//             boxSizing: "border-box",
//           }}
//         >
//           Zone {zoneIndex + 1}
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             width: "100%",
//             boxSizing: "border-box",
//             marginTop: "15px",
//           }}
//         >
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: `repeat(${
//                 gridColumns || 3
//               }, ${cellWidthPx}px)`,
//               gridTemplateRows: `repeat(${gridRows || 3}, ${cellWidthPx}px)`,
//               gap: "8px",
//               width: `${totalGridContentWidth}px`,
//               borderRadius: "8px",
//             }}
//           >
//             {Array.from({ length: (gridRows || 3) * (gridColumns || 3) }).map(
//               (_, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     backgroundColor: "#D1E4FF",
//                     width: `${cellWidthPx}px`,
//                     height: `${cellWidthPx}px`,
//                     border: "1px solid #B3C9E6",
//                     borderRadius: "8px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#4A5A6B",
//                     fontSize: "12px",
//                   }}
//                 >
//                   {/* No numbering in grid cells */}
//                 </div>
//               )
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//    <div className="page-wrapper">
//     <div className="content">
//        <div
//       style={{
//         fontFamily: "Arial, sans-serif",
//         padding: "20px",
//         backgroundColor: "#F9FAFB",
//         minHeight: "100vh",
//       }}
//     >
//       {/* Success Message */}
//       {showMessage && (
//         <div
//           style={{
//             backgroundColor: "#BAFFDF",
//             border: " 1px solid #007B42",
//             color: "black",
//             padding: "10px 16px",
//             borderRadius: "8px",
//             textAlign: "center",
//             marginBottom: "20px",
//             fontWeight: "500",
//             fontSize: "16px",
//           }}
//         >
//           Warehouse layout imported successfully!
//         </div>
//       )}

//       {/* Breadcrumb Navigation */}
//       <div
//         style={{
//           color: "#6B7280",
//           display: "flex",
//           gap: "12px",
//           fontWeight: "500",
//           fontSize: "14px",
//           marginBottom: "20px",
//         }}
//       >
//         <Link
//           to="/warehouse"
//           style={{ color: "#1F2937", textDecoration: "none" }}
//         >
//           <span>Warehouse</span>
//         </Link>
//         <span>
//           <MdArrowForwardIos style={{ color: "#9CA3AF" }} />
//         </span>
//         <span style={{ color: "#1F2937" }}>Add Warehouse</span>
//       </div>

//       {/* Warehouse Details Form */}
//       <form onSubmit={handleSubmit}>
//         <div
//           style={{
//             margin: "0 auto",
//             width: "100%",
//             maxWidth: "900px",
//             backgroundColor: "#FFFFFF",
//             borderRadius: "12px",
//             padding: "24px",
//             boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
//             <div style={{ flex: 1 }}>
//               <label
//                 style={{
//                   color: "#1F2937",
//                   fontWeight: "500",
//                   fontSize: "18px",
//                   marginBottom: "8px",
//                   display: "block",
//                 }}
//               >
//                 Warehouse Name
//               </label>
//               <input
//                 type="text"
//                 value={warehouseName}
//                 onChange={(e) => setWarehouseName(e.target.value)}
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   border: "1px solid #D1D5DB",
//                   backgroundColor: "#F9FAFB",
//                   color: "#6B7280",
//                   fontSize: "14px",
//                   outline: "none",
//                 }}
//                 placeholder="Enter Warehouse Name"
//               />
//             </div>
//             <div style={{ flex: 1 }}>
//               <label
//                 style={{
//                   color: "#1F2937",
//                   fontWeight: "500",
//                   fontSize: "18px",
//                   marginBottom: "8px",
//                   display: "block",
//                 }}
//               >
//                 Contact No
//               </label>
//               <input
//                 type="number"
//                 value={phone}
//                 onChange={(e) => setphone(e.target.value)}
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   border: "1px solid #D1D5DB",
//                   backgroundColor: "#F9FAFB",
//                   color: "#6B7280",
//                   fontSize: "14px",
//                   outline: "none",
//                 }}
//                 placeholder="Enter Warehouse Name"
//               />
//             </div>
//           </div>

//           <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
//             <div style={{ flex: 1 }}>
//               <label
//                 style={{
//                   color: "#1F2937",
//                   fontWeight: "500",
//                   fontSize: "18px",
//                   marginBottom: "8px",
//                   display: "block",
//                 }}
//               >
//                 Warehouse Code
//               </label>
//               <input
//                 type="text"
//                 value={warehouseCode}
//                 onChange={(e) => setWarehouseCode(e.target.value)}
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   border: "1px solid #D1D5DB",
//                   backgroundColor: "#F9FAFB",
//                   color: "#6B7280",
//                   fontSize: "14px",
//                   outline: "none",
//                 }}
//               />
//             </div>
//             <div style={{ flex: 1 }}>
//               <label
//                 style={{
//                   color: "#1F2937",
//                   fontWeight: "500",
//                   fontSize: "18px",
//                   marginBottom: "8px",
//                   display: "block",
//                 }}
//               >
//                 Warehouse Contact Person(Manager)
//               </label>
//               <input
//                 type="text"
//                 value={warehouseOwner}
//                 onChange={(e) => setWarehouseOwner(e.target.value)}
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   border: "1px solid #D1D5DB",
//                   backgroundColor: "#F9FAFB",
//                   color: "#6B7280",
//                   fontSize: "14px",
//                   outline: "none",
//                 }}
//               />
//             </div>
//           </div>

//           <div style={{ marginBottom: "20px" }}>
//             <label
//               style={{
//                 color: "#1F2937",
//                 fontWeight: "500",
//                 fontSize: "18px",
//                 marginBottom: "8px",
//                 display: "block",
//               }}
//             >
//               Address
//             </label>
//             <textarea
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "12px",
//                 borderRadius: "8px",
//                 border: "1px solid #D1D5DB",
//                 backgroundColor: "#F9FAFB",
//                 color: "#6B7280",
//                 fontSize: "14px",
//                 minHeight: "100px",
//                 resize: "vertical",
//                 outline: "none",
//               }}
//             ></textarea>
//           </div>

//           <div style={{ display: "flex", gap: "16px" }}>
//             <div style={{ flex: 1 }}>
//               <label
//                 style={{
//                   color: "#1F2937",
//                   fontWeight: "500",
//                   fontSize: "18px",
//                   marginBottom: "8px",
//                   display: "block",
//                 }}
//               >
//                 Country
//               </label>
//               <select
//                 value={selectedCountry}
//                 onChange={(e) => {
//                   // setCountry(e.target.value)
//                   const value = e.target.value;
//                   setSelectedCountry(value);
//                   setFormData((prev) => ({
//                     ...prev,
//                     companycountry: value,
//                     companystate: "",
//                     companycity: "",
//                   }));

//                   setSelectedState(""), setSelectedCity("");
//                 }}
//                 //
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   border: "1px solid #D1D5DB",
//                   backgroundColor: "#F9FAFB",
//                   color: "#6B7280",
//                   fontSize: "14px",
//                 }}
//               >
//                 <option value="">Select Country</option>
//                 {countryList.map((country) => (
//                   <option key={country.isoCode} value={country.isoCode}>
//                     {country.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* {console.log("statelist",stateList)} */}
//             <div style={{ flex: 1 }}>
//               <label
//                 style={{
//                   color: "#1F2937",
//                   fontWeight: "500",
//                   fontSize: "18px",
//                   marginBottom: "8px",
//                   display: "block",
//                 }}
//               >
//                 State
//               </label>
//               <select
//                 value={selectedState}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   setSelectedState(value);
//                   setFormData((prev) => ({
//                     ...prev,
//                     companystate: value,
//                     companycity: "",
//                   }));
//                   setSelectedCity("");
//                 }}
//                 disabled={!selectedCountry}
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   border: "1px solid #D1D5DB",
//                   backgroundColor: "#F9FAFB",
//                   color: "#6B7280",
//                   fontSize: "14px",
//                 }}
//               >
//                 <option value="">Select State</option>

//                 {stateList.map((state) => (
//                   <option key={state.isoCode} value={state.isoCode}>
//                     {state.name}
//                   </option>
//                 ))}
//                 {/* <option value="California">California</option>
//               <option value="Maharashtra">Maharashtra</option> */}
//               </select>
//             </div>
//             <div style={{ flex: 1 }}>
//               <label
//                 style={{
//                   color: "#1F2937",
//                   fontWeight: "500",
//                   fontSize: "18px",
//                   marginBottom: "8px",
//                   display: "block",
//                 }}
//               >
//                 City
//               </label>
//               <select
//                 // value={city}
//                 // onChange={(e) => setCity(e.target.value)}
//                 value={selectedCity}
//                 onChange={(e) => setSelectedCity(e.target.value)}
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   border: "1px solid #D1D5DB",
//                   backgroundColor: "#F9FAFB",
//                   color: "#6B7280",
//                   fontSize: "14px",
//                 }}
//               >
//                 <option value="">Select City</option>
//                 {/* <option value="Los Angeles">Los Angeles</option>
//               <option value="Mumbai">Mumbai</option> */}
//                 {cityList.map((city) => (
//                   <option key={city.name} value={city.name}>
//                     {city.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={{ flex: 1 }}>
//               <label
//                 style={{
//                   color: "#1F2937",
//                   fontWeight: "500",
//                   fontSize: "18px",
//                   marginBottom: "8px",
//                   display: "block",
//                 }}
//               >
//                 Pin Code
//               </label>

//               <input
//                 value={pinCode}
//                 onChange={(e) => setPinCode(e.target.value)}
//                 type="number"
//                 style={{
//                   width: "100%",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   border: "1px solid #D1D5DB",
//                   backgroundColor: "#F9FAFB",
//                   color: "#6B7280",
//                   fontSize: "14px",
//                   outline: "none",
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Layout Section */}
//         <div
//           style={{
//             overflow: "auto",
//             margin: "30px auto",
//             width: "100%",
//             maxWidth: "900px",
//             backgroundColor: "#FFFFFF",
//             border: "2px dotted #B3C9E6",
//             borderRadius: "12px",
//             padding: "24px",
//             boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 gap: "20px",
//                 justifyContent: "center",
//                 alignItems: "flex-start",
//               }}
//             >
//               {Array.from({ length: mainZones }).map((_, zoneIndex) =>
//                 renderGrid(mainRows, mainColumns, mainWidth, zoneIndex)
//               )}
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 marginTop: "10px",
//                 color: "#6B7280",
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 marginBottom: "10px",
//               }}
//             >
//               Click to define and assign racks using rows and columns.
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 marginTop: "20px",
//               }}
//             >
//               <Popup
//                 trigger={
//                   <button
//                     type="button"
//                     style={{
//                       backgroundColor: "#3B82F6",
//                       color: "#FFFFFF",
//                       border: "none",
//                       borderRadius: "8px",
//                       padding: "12px 24px",
//                       fontWeight: "500",
//                       fontSize: "16px",
//                       cursor: "pointer",
//                       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                       transition: "background-color 0.3s",
//                     }}
//                     onMouseOver={(e) =>
//                       (e.target.style.backgroundColor = "#2563EB")
//                     }
//                     onMouseOut={(e) =>
//                       (e.target.style.backgroundColor = "#3B82F6")
//                     }
//                   >
//                     Customize Layout
//                   </button>
//                 }
//                 modal
//                 nested
//                 contentStyle={{
//                   background: "transparent",
//                   border: "none",
//                   padding: "0",
//                   borderRadius: "12px",
//                   width: "900px",
//                   maxWidth: "90vw",
//                 }}
//               >
//                 {(close) => (
//                   <div
//                     style={{
//                       backgroundColor: "#FFFFFF",
//                       borderRadius: "12px",
//                       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         backgroundColor: "#3B82F6",
//                         padding: "16px 24px",
//                         color: "#FFFFFF",
//                         fontWeight: "500",
//                         fontSize: "18px",
//                       }}
//                     >
//                       <span>Layout Creator</span>
//                       <span style={{ cursor: "pointer" }} onClick={close}>
//                         <IoMdClose />
//                       </span>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         padding: "24px",
//                         gap: "24px",
//                       }}
//                     >
//                       {/* Left Side: Input Fields */}
//                       <div style={{ flex: 1 }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "16px",
//                             alignItems: "center",
//                             marginBottom: "24px",
//                           }}
//                         >
//                           <span
//                             style={{
//                               backgroundColor: "#D1E4FF",
//                               borderRadius: "50%",
//                               padding: "12px",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             <LuLayoutDashboard />
//                           </span>
//                           <label
//                             style={{
//                               color: "#1F2937",
//                               fontWeight: "500",
//                               fontSize: "16px",
//                             }}
//                           >
//                             No. of Zones
//                           </label>
//                           <input
//                             type="number"
//                             min="0"
//                             value={zones}
//                             onChange={(e) =>
//                               setZones(
//                                 e.target.value === ""
//                                   ? ""
//                                   : Math.max(0, parseInt(e.target.value))
//                               )
//                             }
//                             style={{
//                               width: "120px",
//                               padding: "12px",
//                               borderRadius: "8px",
//                               border: "1px solid #D1D5DB",
//                               backgroundColor: "#F9FAFB",
//                               color: "#6B7280",
//                               fontSize: "14px",
//                             }}
//                           />
//                         </div>
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "16px",
//                             marginBottom: "24px",
//                           }}
//                         >
//                           <div style={{ flex: 1 }}>
//                             <label
//                               style={{
//                                 color: "#1F2937",
//                                 fontWeight: "500",
//                                 fontSize: "16px",
//                                 marginBottom: "8px",
//                                 display: "block",
//                               }}
//                             >
//                               Row
//                             </label>
//                             <input
//                               type="number"
//                               min="1"
//                               value={rows}
//                               onChange={(e) =>
//                                 setRows(
//                                   e.target.value === ""
//                                     ? ""
//                                     : Math.max(1, parseInt(e.target.value))
//                                 )
//                               }
//                               style={{
//                                 width: "100%",
//                                 padding: "12px",
//                                 borderRadius: "8px",
//                                 border: "1px solid #D1D5DB",
//                                 backgroundColor: "#F9FAFB",
//                                 color: "#6B7280",
//                                 fontSize: "14px",
//                               }}
//                             />
//                           </div>
//                           <div style={{ flex: 1 }}>
//                             <label
//                               style={{
//                                 color: "#1F2937",
//                                 fontWeight: "500",
//                                 fontSize: "16px",
//                                 marginBottom: "8px",
//                                 display: "block",
//                               }}
//                             >
//                               Column
//                             </label>
//                             <input
//                               type="number"
//                               min="1"
//                               value={columns}
//                               onChange={(e) =>
//                                 setColumns(
//                                   e.target.value === ""
//                                     ? ""
//                                     : Math.max(1, parseInt(e.target.value))
//                                 )
//                               }
//                               style={{
//                                 width: "100%",
//                                 padding: "12px",
//                                 borderRadius: "8px",
//                                 border: "1px solid #D1D5DB",
//                                 backgroundColor: "#F9FAFB",
//                                 color: "#6B7280",
//                                 fontSize: "14px",
//                               }}
//                             />
//                           </div>
//                         </div>
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "16px",
//                             marginBottom: "24px",
//                           }}
//                         >
//                           <div style={{ flex: 1 }}>
//                             <label
//                               style={{
//                                 color: "#1F2937",
//                                 fontWeight: "500",
//                                 fontSize: "16px",
//                                 marginBottom: "8px",
//                                 display: "block",
//                               }}
//                             >
//                               Width (mtr)
//                             </label>
//                             <input
//                               type="number"
//                               min="1"
//                               value={width}
//                               onChange={(e) =>
//                                 setWidth(
//                                   e.target.value === ""
//                                     ? ""
//                                     : Math.max(1, parseInt(e.target.value))
//                                 )
//                               }
//                               style={{
//                                 width: "100%",
//                                 padding: "12px",
//                                 borderRadius: "8px",
//                                 border: "1px solid #D1D5DB",
//                                 backgroundColor: "#F9FAFB",
//                                 color: "#6B7280",
//                                 fontSize: "14px",
//                               }}
//                             />
//                           </div>
//                         </div>
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "flex-end",
//                             gap: "16px",
//                           }}
//                         >
//                           <button
//                             type="button"
//                             onClick={close}
//                             style={{
//                               backgroundColor: "#6B7280",
//                               color: "#FFFFFF",
//                               border: "none",
//                               borderRadius: "8px",
//                               padding: "12px 24px",
//                               fontWeight: "500",
//                               fontSize: "16px",
//                               cursor: "pointer",
//                               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                               transition: "background-color 0.3s",
//                             }}
//                             onMouseOver={(e) =>
//                               (e.target.style.backgroundColor = "#4B5563")
//                             }
//                             onMouseOut={(e) =>
//                               (e.target.style.backgroundColor = "#6B7280")
//                             }
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => handleImport(close)}
//                             style={{
//                               backgroundColor: "#3B82F6",
//                               color: "#FFFFFF",
//                               border: "none",
//                               borderRadius: "8px",
//                               padding: "12px 24px",
//                               fontWeight: "500",
//                               fontSize: "16px",
//                               cursor: "pointer",
//                               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                               transition: "background-color 0.3s",
//                             }}
//                             onMouseOver={(e) =>
//                               (e.target.style.backgroundColor = "#2563EB")
//                             }
//                             onMouseOut={(e) =>
//                               (e.target.style.backgroundColor = "#3B82F6")
//                             }
//                           >
//                             Import
//                           </button>
//                         </div>
//                       </div>

//                       {/* Right Side: Preview Layout */}
//                       <div
//                         style={{
//                           flex: 1,
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                         }}
//                       >
//                         <span
//                           style={{
//                             color: "#1F2937",
//                             fontWeight: "500",
//                             fontSize: "16px",
//                             marginBottom: "16px",
//                           }}
//                         >
//                           Layout Preview
//                         </span>
//                         {parseInt(zones) > 0 &&
//                         rows !== "" &&
//                         columns !== "" ? (
//                           <div
//                             style={{
//                               display: "flex",
//                               flexDirection: "row",
//                               flexWrap: "wrap",
//                               gap: "20px",
//                               justifyContent: "center",
//                               alignItems: "flex-start",
//                             }}
//                           >
//                             {Array.from({ length: parseInt(zones) }).map(
//                               (_, zoneIndex) =>
//                                 renderGrid(
//                                   parseInt(rows),
//                                   parseInt(columns),
//                                   width === "" ? 1 : parseInt(width),
//                                   zoneIndex
//                                 )
//                             )}
//                           </div>
//                         ) : (
//                           <div
//                             style={{
//                               color: "#6B7280",
//                               fontSize: "14px",
//                               textAlign: "center",
//                             }}
//                           >
//                             Please enter the number of zones, rows, and columns
//                             to preview the layout.
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </Popup>
//             </div>
//           </div>
//         </div>

//         {/* Draft, Save, or Done Button */}
//         <div
//           style={{
//             margin: "30px auto",
//             width: "100%",
//             maxWidth: "900px",
//             display: "flex",
//             justifyContent: "flex-end",
//             gap: "16px",
//           }}
//         >
//           {!isImported ? (
//             <>
//               <button
//                 type="button"
//                 onClick={handleDraft}
//                 style={{
//                   backgroundColor: "#6B7280",
//                   color: "#FFFFFF",
//                   border: "none",
//                   borderRadius: "8px",
//                   padding: "12px 24px",
//                   fontWeight: "500",
//                   fontSize: "16px",
//                   cursor: "pointer",
//                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                   transition: "background-color 0.3s",
//                 }}
//                 onMouseOver={(e) =>
//                   (e.target.style.backgroundColor = "#4B5563")
//                 }
//                 onMouseOut={(e) => (e.target.style.backgroundColor = "#6B7280")}
//               >
//                 Draft
//               </button>

//               <button
//                 type="button"
//                 onClick={handleSave}
//                 style={{
//                   backgroundColor: "#3B82F6",
//                   color: "#FFFFFF",
//                   border: "none",
//                   borderRadius: "8px",
//                   padding: "12px 24px",
//                   fontWeight: "500",
//                   fontSize: "16px",
//                   cursor: "pointer",
//                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                   transition: "background-color 0.3s",
//                 }}
//                 onMouseOver={(e) =>
//                   (e.target.style.backgroundColor = "#2563EB")
//                 }
//                 onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
//               >
//                 Save
//               </button>
//             </>
//           ) : (
//             <button
//               type="button"
//               onClick={handleSubmit}
//               style={{
//                 backgroundColor: "#3B82F6",
//                 color: "#FFFFFF",
//                 border: "none",
//                 borderRadius: "8px",
//                 padding: "12px 24px",
//                 fontWeight: "500",
//                 fontSize: "16px",
//                 cursor: "pointer",
//                 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                 transition: "background-color 0.3s",
//               }}
//               onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
//               onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
//             >
//               Done
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//     </div>
//    </div>
//   );
// }

// export default AddWarehouse;



import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { MdArrowForwardIos } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import BASE_URL from "../../../pages/config/config";
import axios from "axios";
import sanitizeHtml from 'sanitize-html';

// Regex patterns for validation
const VALIDATION_PATTERNS = {
  warehouseName: /^[a-zA-Z\s\-_]{3,50}$/,
  phone: /^\+?[\d\s()-]{1,14}$/, // Updated to allow spaces, dashes, parentheses
  warehouseCode: /^[A-Z0-9]{3,10}$/,
  warehouseOwner: /^[a-zA-Z\s]{2,50}$/,
  address: /^[\w\s.,\-\/]{5,200}$/,
  pinCode: /^\d{4,10}$/,
};

// Sanitization configuration
const SANITIZE_CONFIG = {
  allowedTags: [],
  allowedAttributes: {},
  allowedCharacters: /[\w\s.,\-\/]/, // Allow letters, numbers, spaces, common punctuation
};

function AddWarehouse() {
  // State for popup inputs
  const [rows, setRows] = useState("");
  const [columns, setColumns] = useState("");
  const [width, setWidth] = useState("");
  const [zones, setZones] = useState("0"); // Initial 0 for blank popup preview
  // State for main layout (updated only on import)
  const [mainRows, setMainRows] = useState(4);
  const [mainColumns, setMainColumns] = useState(3);
  const [mainWidth, setMainWidth] = useState(1); // Width in meters
  const [mainZones, setMainZones] = useState(1);
  // State for warehouse details form
  const [warehouseName, setWarehouseName] = useState("");
  const [phone, setPhone] = useState("");
  const [warehouseCode, setWarehouseCode] = useState("");
  const [warehouseOwner, setWarehouseOwner] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");

  // State for validation errors
  const [errors, setErrors] = useState({
    warehouseName: "",
    phone: "",
    warehouseCode: "",
    warehouseOwner: "",
    address: "",
    pinCode: "",
    country: "",
    state: "",
    city: "",
  });

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setWarehouseName("");
    setPhone("");
    setWarehouseCode("");
    setWarehouseOwner("");
    setAddress("");
    setAddress("");
    setCountry("");

    setCountry("");
    setState("");
    setPinCode("");
  }

  // Retrieve token
  const token = localStorage.getItem("token");

  useEffect(() => {
    setCountryList(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setStateList(State.getStatesOfCountry(selectedCountry));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setCityList(City.getCitiesOfState(selectedCountry, selectedState));
    }
  }, [selectedState]);

  // Validation function
  const validateInput = (name, value) => {
    if (!VALIDATION_PATTERNS[name] && !["country", "state", "city"].includes(name)) return "";

    if (!value) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (VALIDATION_PATTERNS[name] && !VALIDATION_PATTERNS[name].test(value)) {
      switch (name) {
        case 'warehouseName':
          return 'Warehouse name must be 3-50 characters (letters, spaces, -, _)';
        case 'phone':
          return 'Phone number must be a valid format (e.g., +1234567890, 123-456-7890)';
        case 'warehouseCode':
          return 'Warehouse code must be 3-10 uppercase letters or numbers';
        case 'warehouseOwner':
          return 'Contact person must be 2-50 letters and spaces';
        case 'address':
          return 'Address must be 5-200 characters (letters, numbers, spaces, common punctuation)';
        case 'pinCode':
          return 'Pin code must be 4-10 digits';
        default:
          return 'Invalid input';
      }
    }
    return "";
  };

  // Sanitize and validate input
  const handleInputChange = (setter, field) => (e) => {
    const sanitizedValue = sanitizeHtml(e.target.value, SANITIZE_CONFIG);
    setter(sanitizedValue);
    setErrors((prev) => ({
      ...prev,
      [field]: validateInput(field, sanitizedValue),
    }));
  };

  // State for import status and message
  const [isImported, setIsImported] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  // Handler for importing layout and closing popup
  const handleImport = (close) => {
    const parsedRows = rows === "" ? 3 : Math.max(1, parseInt(rows));
    const parsedColumns = columns === "" ? 3 : Math.max(1, parseInt(columns));
    const parsedWidth = width === "" ? 1 : Math.max(1, parseInt(width));
    const parsedZones = zones === "" ? 1 : Math.max(1, parseInt(zones));

    setMainRows(parsedRows);
    setMainColumns(parsedColumns);
    setMainWidth(parsedWidth);
    setMainZones(parsedZones);

    setRows("");
    setColumns("");
    setWidth("");
    setZones("0");

    setIsImported(true);
    setShowMessage(true);

    close();
  };

  // Handler for Draft button
  const handleDraft = () => {
    const warehouseData = {
      warehouseName: sanitizeHtml(warehouseName, SANITIZE_CONFIG),
      phone: sanitizeHtml(phone, SANITIZE_CONFIG),
      warehouseCode: sanitizeHtml(warehouseCode, SANITIZE_CONFIG),
      warehouseOwner: sanitizeHtml(warehouseOwner, SANITIZE_CONFIG),
      address: sanitizeHtml(address, SANITIZE_CONFIG),
      country: selectedCountry
        ? Country.getAllCountries().find((c) => c.isoCode === selectedCountry)?.name || ""
        : "",
      state: selectedState
        ? State.getStatesOfCountry(selectedCountry).find((s) => s.isoCode === selectedState)?.name || ""
        : "",
      city: sanitizeHtml(selectedCity, SANITIZE_CONFIG),
      pinCode: sanitizeHtml(pinCode, SANITIZE_CONFIG),
      layout: {
        rows: mainRows,
        columns: mainColumns,
        width: mainWidth,
        zones: mainZones,
      },
    };
    console.log("Draft saved:", warehouseData);
    // TODO: Replace with API call or state persistence logic
  };

  // Handler for Save button
  const handleSave = async () => {
    const newErrors = {
      warehouseName: validateInput('warehouseName', warehouseName),
      phone: validateInput('phone', phone),
      warehouseCode: validateInput('warehouseCode', warehouseCode),
      warehouseOwner: validateInput('warehouseOwner', warehouseOwner),
      address: validateInput('address', address),
      pinCode: validateInput('pinCode', pinCode),
      country: selectedCountry ? "" : "Country is required",
      state: selectedState ? "" : "State is required",
      city: selectedCity ? "" : "City is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      toast.error("Please fix all validation errors before saving");
      return;
    }

    if (!token) {
      toast.error("Authentication token is missing. Please log in.");
      return;
    }

    const warehouseData = {
      warehouseName: sanitizeHtml(warehouseName, SANITIZE_CONFIG),
      phone: sanitizeHtml(phone, SANITIZE_CONFIG),
      warehouseCode: sanitizeHtml(warehouseCode, SANITIZE_CONFIG),
      warehouseOwner: sanitizeHtml(warehouseOwner, SANITIZE_CONFIG),
      address: sanitizeHtml(address, SANITIZE_CONFIG),
      country: selectedCountry
        ? Country.getAllCountries().find((c) => c.isoCode === selectedCountry)?.name || ""
        : "",
      state: selectedState
        ? State.getStatesOfCountry(selectedCountry).find((s) => s.isoCode === selectedState)?.name || ""
        : "",
      city: sanitizeHtml(selectedCity, SANITIZE_CONFIG),
      pinCode: sanitizeHtml(pinCode, SANITIZE_CONFIG),
      layout: {
        rows: mainRows,
        columns: mainColumns,
        width: mainWidth,
        zones: mainZones,
      },
    };

    try {
      await axios.post(`${BASE_URL}/api/warehouse`, warehouseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Warehouse saved successfully");
    } catch (error) {
      console.error("Error saving warehouse:", error.response?.data, error.response?.status, error.message);
      toast.error(
        error.response?.status === 409
          ? error.response.data.message
          : "Failed to save warehouse"
      );
    }
  };

  // Handler for Done button
  const handleDone = () => {
    setWarehouseName("");
    setPhone("");
    setWarehouseCode("");
    setWarehouseOwner("");
    setAddress("");
    setCountry("");
    setState("");
    setCity("");
    setPinCode("");
    setMainRows(3);
    setMainColumns(3);
    setMainWidth(1);
    setMainZones(1);
    setIsImported(false);
    setShowMessage(false);
    setErrors({});
    navigate("/warehouse");
  };

  // Effect to auto-hide the success message after 3 seconds
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {
      warehouseName: validateInput('warehouseName', warehouseName),
      phone: validateInput('phone', phone),
      warehouseCode: validateInput('warehouseCode', warehouseCode),
      warehouseOwner: validateInput('warehouseOwner', warehouseOwner),
      address: validateInput('address', address),
      pinCode: validateInput('pinCode', pinCode),
      country: selectedCountry ? "" : "Country is required",
      state: selectedState ? "" : "State is required",
      city: selectedCity ? "" : "City is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      toast.error("Please fix all validation errors before submitting");
      setLoading(false);
      return;
    }

    if (!token) {
      toast.error("Authentication token is missing. Please log in.");
      setLoading(false);
      return;
    }

    const warehouseData = {
      warehouseName: sanitizeHtml(warehouseName, SANITIZE_CONFIG),
      phone: sanitizeHtml(phone, SANITIZE_CONFIG),
      warehouseCode: sanitizeHtml(warehouseCode, SANITIZE_CONFIG),
      warehouseOwner: sanitizeHtml(warehouseOwner, SANITIZE_CONFIG),
      address: sanitizeHtml(address, SANITIZE_CONFIG),
      country: selectedCountry
        ? Country.getAllCountries().find((c) => c.isoCode === selectedCountry)?.name || ""
        : "",
      state: selectedState
        ? State.getStatesOfCountry(selectedCountry).find((s) => s.isoCode === selectedState)?.name || ""
        : "",
      city: sanitizeHtml(selectedCity, SANITIZE_CONFIG),
      pinCode: sanitizeHtml(pinCode, SANITIZE_CONFIG),
      layout: {
        rows: mainRows,
        columns: mainColumns,
        width: mainWidth,
        zones: mainZones,
      },
    };

    try {
      await axios.post(`${BASE_URL}/api/warehouse`, warehouseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Warehouse added successfully");

      setWarehouseName("");
      setPhone("");
      setWarehouseCode("");
      setWarehouseOwner("");
      setAddress("");
      setSelectedCountry("");
      setSelectedState("");
      setSelectedCity("");
      setPinCode("");
      setMainRows(3);
      setMainColumns(3);
      setMainWidth(1);
      setMainZones(1);
      setIsImported(false);
      setShowMessage(false);
      setErrors({});

      navigate("/warehouse");
    } catch (error) {
      console.error("Error adding warehouse:", error.response?.data, error.response?.status, error.message);
      toast.error(
        error.response?.status === 409
          ? error.response.data.message
          : "Failed to add warehouse"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderGrid = (gridRows, gridColumns, gridWidth, zoneIndex) => {
    const cellWidthPx = 50;
    const totalGridContentWidth = (gridColumns || 3) * (cellWidthPx + 8) - 8;

    return (
      <div
        key={zoneIndex}
        style={{
          marginTop: "5px",
          marginBottom: "20px",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            backgroundColor: "#BBE1FF",
            padding: "16px",
            textAlign: "center",
            fontWeight: "500",
            fontSize: "16px",
            borderRadius: "6px",
            marginBottom: "10px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          Zone {zoneIndex + 1}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            boxSizing: "border-box",
            marginTop: "15px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridColumns || 3}, ${cellWidthPx}px)`,
              gridTemplateRows: `repeat(${gridRows || 3}, ${cellWidthPx}px)`,
              gap: "8px",
              width: `${totalGridContentWidth}px`,
              borderRadius: "8px",
            }}
          >
            {Array.from({ length: (gridRows || 3) * (gridColumns || 3) }).map(
              (_, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#D1E4FF",
                    width: `${cellWidthPx}px`,
                    height: `${cellWidthPx}px`,
                    border: "1px solid #B3C9E6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4A5A6B",
                    fontSize: "12px",
                  }}
                >
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "100px",
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        marginTop: "-20px"
      }}
    >
      {showMessage && (
        <div
          style={{
            backgroundColor: "#BAFFDF",
            border: "1px solid #007B42",
            color: "black",
            padding: "10px 16px",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "500",
            fontSize: "16px",
          }}
        >
          Warehouse layout imported successfully!
        </div>
      )}

      <div
        style={{
          color: "#6B7280",
          display: "flex",
          gap: "12px",
          fontWeight: "500",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        <Link
          to="/warehouse"
          style={{ color: "#1F2937", textDecoration: "none" }}
        >
          <span>Warehouse</span>
        </Link>
        <span>
          <MdArrowForwardIos style={{ color: "#9CA3AF" }} />
        </span>
        <span style={{ color: "#1F2937" }}>Add Warehouse</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            margin: "0 auto",
            width: "100%",
            maxWidth: "900px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#1F2937",
                  fontWeight: "500",
                  fontSize: "18px",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Warehouse Name 
              </label>
              <input
                type="text"
                value={warehouseName}
                onChange={handleInputChange(setWarehouseName, 'warehouseName')}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.warehouseName ? '#EF4444' : '#D1D5DB'}`,
                  backgroundColor: "#F9FAFB",
                  color: "#6B7280",
                  fontSize: "14px",
                  outline: "none",
                }}
                placeholder="Enter Warehouse Name"
              />
            </div>                                    
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#1F2937",
                  fontWeight: "500",
                  fontSize: "18px",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Contact No <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handleInputChange(setPhone, 'phone')}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.phone ? '#EF4444' : '#D1D5DB'}`,
                  backgroundColor: "#F9FAFB",
                  color: "#6B7280",
                  fontSize: "14px",
                  outline: "none",
                }}
                placeholder="Enter Contact Number"
              />
              {errors.phone && (
                <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.phone}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#1F2937",
                  fontWeight: "500",
                  fontSize: "18px",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Warehouse Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={warehouseCode}
                onChange={handleInputChange(setWarehouseCode, 'warehouseCode')}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.warehouseCode ? '#EF4444' : '#D1D5DB'}`,
                  backgroundColor: "#F9FAFB",
                  color: "#6B7280",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              {errors.warehouseCode && (
                <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.warehouseCode}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#1F2937",
                  fontWeight: "500",
                  fontSize: "18px",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Warehouse Contact Person(Manager) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={warehouseOwner}
                onChange={handleInputChange(setWarehouseOwner, 'warehouseOwner')}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.warehouseOwner ? '#EF4444' : '#D1D5DB'}`,
                  backgroundColor: "#F9FAFB",
                  color: "#6B7280",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              {errors.warehouseOwner && (
                <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.warehouseOwner}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                color: "#1F2937",
                fontWeight: "500",
                fontSize: "18px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Address <span className="text-danger">*</span>
            </label>
            <textarea
              value={address}
              onChange={handleInputChange(setAddress, 'address')}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: `1px solid ${errors.address ? '#EF4444' : '#D1D5DB'}`,
                backgroundColor: "#F9FAFB",
                color: "#6B7280",
                fontSize: "14px",
                minHeight: "100px",
                resize: "vertical",
                outline: "none",
              }}
            ></textarea>
            {errors.address && (
              <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>
                {errors.address}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#1F2937",
                  fontWeight: "500",
                  fontSize: "18px",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Country <span className="text-danger">*</span>
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCountry(value);
                  setSelectedState("");
                  setSelectedCity("");
                  setErrors((prev) => ({
                    ...prev,
                    country: validateInput('country', value),
                    state: "",
                    city: "",
                  }));
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.country ? '#EF4444' : '#D1D5DB'}`,
                  backgroundColor: "#F9FAFB",
                  color: "#6B7280",
                  fontSize: "14px",
                }}
              >
                <option value="">Select Country</option>
                {countryList.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.country}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#1F2937",
                  fontWeight: "500",
                  fontSize: "18px",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                State <span className="text-danger">*</span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedState(value);
                  setSelectedCity("");
                  setErrors((prev) => ({
                    ...prev,
                    state: validateInput('state', value),
                    city: "",
                  }));
                }}
                disabled={!selectedCountry}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.state ? '#EF4444' : '#D1D5DB'}`,
                  backgroundColor: "#F9FAFB",
                  color: "#6B7280",
                  fontSize: "14px",
                }}
              >
                <option value="">Select State</option>
                {stateList.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.state}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#1F2937",
                  fontWeight: "500",
                  fontSize: "18px",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                City <span className="text-danger">*</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  const value = sanitizeHtml(e.target.value, SANITIZE_CONFIG);
                  setSelectedCity(value);
                  setErrors((prev) => ({
                    ...prev,
                    city: validateInput('city', value),
                  }));
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.city ? '#EF4444' : '#D1D5DB'}`,
                  backgroundColor: "#F9FAFB",
                  color: "#6B7280",
                  fontSize: "14px",
                }}
              >
                <option value="">Select City</option>
                {cityList.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city && (
                <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.city}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  color: "#1F2937",
                  fontWeight: "500",
                  fontSize: "18px",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Pin Code <span className="text-danger">*</span>
              </label>
              <input
                value={pinCode}
                onChange={handleInputChange(setPinCode, 'pinCode')}
                type="number"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.pinCode ? '#EF4444' : '#D1D5DB'}`,
                  backgroundColor: "#F9FAFB",
                  color: "#6B7280",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              {errors.pinCode && (
                <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.pinCode}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            overflow: "auto",
            margin: "30px auto",
            width: "100%",
            maxWidth: "900px",
            backgroundColor: "#FFFFFF",
            border: "2px dotted #B3C9E6",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {Array.from({ length: mainZones }).map((_, zoneIndex) =>
                renderGrid(mainRows, mainColumns, mainWidth, zoneIndex)
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: "400",
                marginBottom: "10px",
              }}
            >
              Click to define and assign racks using rows and columns.
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Popup
                trigger={
                  <button
                    type="button"
                    style={{
                      backgroundColor: "#3B82F6",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontWeight: "500",
                      fontSize: "16px",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#2563EB")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#3B82F6")
                    }
                  >
                    Customize Layout
                  </button>
                }
                modal
                nested
                contentStyle={{
                  background: "transparent",
                  border: "none",
                  padding: "0",
                  borderRadius: "12px",
                  width: "900px",
                }}
              >
                {(close) => (
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      overflow: "hidden",
                      margin: "0 auto",
                      width: "100%",
                      marginTop: "20px",
                      marginLeft: "35px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#3B82F6",
                        padding: "16px 24px",
                        color: "#FFFFFF",
                        fontWeight: "500",
                        fontSize: "18px",
                      }}
                    >
                      <span>Layout Creator</span>
                      <span style={{ cursor: "pointer" }} onClick={close}>
                        <IoMdClose />
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        padding: "24px",
                        gap: "24px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            alignItems: "center",
                            marginBottom: "24px",
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#D1E4FF",
                              borderRadius: "50%",
                              padding: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <LuLayoutDashboard />
                          </span>
                          <label
                            style={{
                              color: "#1F2937",
                              fontWeight: "500",
                              fontSize: "16px",
                            }}
                          >
                            No. of Zones <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            
                            value={zones}
                            onChange={(e) =>
                              setZones(
                                e.target.value === ""
                                  ? ""
                                  : Math.max(0, parseInt(e.target.value))
                              )
                            }
                            style={{
                              width: "120px",
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #D1D5DB",
                              backgroundColor: "#F9FAFB",
                              color: "#6B7280",
                              fontSize: "14px",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            marginBottom: "24px",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <label
                              style={{
                                color: "#1F2937",
                                fontWeight: "500",
                                fontSize: "16px",
                                marginBottom: "8px",
                                display: "block",
                              }}
                            >
                              Row <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              value={rows}
                              onChange={(e) =>
                                setRows(
                                  e.target.value === ""
                                    ? ""
                                    : Math.max(1, parseInt(e.target.value))
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #D1D5DB",
                                backgroundColor: "#F9FAFB",
                                color: "#6B7280",
                                fontSize: "14px",
                              }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label
                              style={{
                                color: "#1F2937",
                                fontWeight: "500",
                                fontSize: "16px",
                                marginBottom: "8px",
                                display: "block",
                              }}
                            >
                              Column <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              required 
                              value={columns}
                              onChange={(e) =>
                                setColumns(
                                  e.target.value === ""
                                    ? ""
                                    : Math.max(1, parseInt(e.target.value))
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #D1D5DB",
                                backgroundColor: "#F9FAFB",
                                color: "#6B7280",
                                fontSize: "14px",
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            marginBottom: "24px",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <label
                              style={{
                                color: "#1F2937",
                                fontWeight: "500",
                                fontSize: "16px",
                                marginBottom: "8px",
                                display: "block",
                              }}
                            >
                              Width (mtr)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={width}
                              onChange={(e) =>
                                setWidth(
                                  e.target.value === ""
                                    ? ""
                                    : Math.max(1, parseInt(e.target.value))
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #D1D5DB",
                                backgroundColor: "#F9FAFB",
                                color: "#6B7280",
                                fontSize: "14px",
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "16px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={close}
                            style={{
                              backgroundColor: "#6B7280",
                              color: "#FFFFFF",
                              border: "none",
                              borderRadius: "8px",
                              padding: "12px 24px",
                              fontWeight: "500",
                              fontSize: "16px",
                              cursor: "pointer",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              transition: "background-color 0.3s",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#4B5563")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#6B7280")
                            }
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleImport(close)}
                            style={{
                              backgroundColor: "#3B82F6",
                              color: "#FFFFFF",
                              border: "none",
                              borderRadius: "8px",
                              padding: "12px 24px",
                              fontWeight: "500",
                              fontSize: "16px",
                              cursor: "pointer",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              transition: "background-color 0.3s",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#2563EB")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#3B82F6")
                            }
                          >
                            Import
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#1F2937",
                            fontWeight: "500",
                            fontSize: "16px",
                            marginBottom: "16px",
                          }}
                        >
                          Layout Preview
                        </span>
                        {parseInt(zones) > 0 &&
                          rows !== "" &&
                          columns !== "" ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              flexWrap: "wrap",
                              gap: "20px",
                              justifyContent: "center",
                              alignItems: "flex-start",
                            }}
                          >
                            {Array.from({ length: parseInt(zones) }).map(
                              (_, zoneIndex) =>
                                renderGrid(
                                  parseInt(rows),
                                  parseInt(columns),
                                  width === "" ? 1 : parseInt(width),
                                  zoneIndex
                                )
                            )}
                          </div>
                        ) : (
                          <div
                            style={{
                              color: "#6B7280",
                              fontSize: "14px",
                              textAlign: "center",
                            }}
                          >
                            Please enter the number of zones, rows, and columns
                            to preview the layout.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          </div>
        </div>

        <div
          style={{
            margin: "30px auto",
            width: "100%",
            maxWidth: "900px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
          }}
        >
          {!isImported ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#6B7280",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "500",
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#4B5563")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#6B7280")}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "500",
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#2563EB")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
              >
                Save
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                backgroundColor: "#3B82F6",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontWeight: "500",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
            >
              Done
            </button>
          )}
        </div>
      </form>
    </div>
      </div>
    </div>
  );
}

export default AddWarehouse;