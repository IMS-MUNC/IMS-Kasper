// import React, {useState, useEffect} from "react";
// import { MdNavigateNext } from "react-icons/md";

// const ExpenseFormEdit = ({show, handleClose }) => {
//    if (!show) return null;
//      const [previewUrl, setPreviewUrl] = useState(null);

//   useEffect(() => {
//     const imageUrl = localStorage.getItem("previewImage");
//     if (imageUrl) {
//       setPreviewUrl(imageUrl);
//     }
//   }, []);
//   return (
//     <div >
//         <div>
//             <span style={{color:"#676767", fontSize:"18px", fontFamily:'"Roboto", sans-serif',fontWeight:"500"}}>Accounting & Finance<MdNavigateNext /></span>
//             <span style={{color:"#676767", fontSize:"18px", fontFamily:'"Roboto", sans-serif',fontWeight:"500"}}>Expense Report<MdNavigateNext /></span>
//             <span style={{color:"#262626",fontSize:"18px", fontFamily:'"Roboto", sans-serif',fontWeight:"500"}}>Tea</span>
//         </div>
//               <div className="d-flex gap-3" style={{margin:"20px auto" , width:"1000px",}}>
//                 <div style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",borderRadius:"8px", backgroundColor:"white"}}>
//                  <div style={{borderRadius:"8px",padding:"20px", backgroundColor:"white",  display:"flex", flexDirection:"column", gap:"15px"}}>
//                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
//                     <span style={{color:"#262626",fontSize:"18px", fontFamily:'"Roboto", sans-serif',fontWeight:"500"}}>Expense Details</span>
//                     <span style={{color:"#262626",fontSize:"18px", fontFamily:'"Roboto", sans-serif',fontWeight:"400"}}>12/08/2025</span>
//                  </div>
//                   <div className="d-flex flex-column">
//                     <span style={{color:"#262626",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"500"}}>Expense Name</span>
//                     <span style={{color:"#676767",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"500"}}>Tea</span>
//                   </div>
//                    <div className="d-flex flex-column gap-2">
//                     <span style={{color:"#262626",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"500"}}>Notes</span>
//                     <textarea name="" id="" placeholder="For Office guest" style={{ fontFamily:'"Roboto", sans-serif',fontSize:"14px",border:"2px dashed #C2C2C2", padding:"10px 20px", borderRadius:"8px", height:"120px", color:"#676767", backgroundColor:"#FBFBFB"}}></textarea>
//                    </div>
//                     <div className="d-flex justify-content-between">
//                         <div className="d-flex flex-column">
//                             <span style={{color:"#262626",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"400"}}>Payment Mode</span>
//                             <span style={{color:"#676767",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"400"}}>UPI</span>
//                         </div>
//                         <div className="d-flex flex-column">
//                             <span style={{color:"#262626",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"400"}}>Paid To</span>
//                             <span style={{color:"#676767",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"400"}}>Shop</span>
//                         </div>
//                         <div className="d-flex flex-column">
//                             <span style={{color:"#262626",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"400"}}>Amount</span>
//                             <span style={{color:"#676767",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"400"}}>Chair</span>
//                         </div>
//                     </div>
//             </div>
//              <div style={{borderRadius:"8px",padding:"20px", backgroundColor:"white", margin:"20px auto", width:"800px", display:"flex", flexDirection:"column", gap:"15px"}}>
//                   <div style={{color:"#262626",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"500"}}><span>Receipt Image</span></div>

//                    <div>
//                      <span style={{color:"#262626",fontSize:"16px", fontFamily:'"Roboto", sans-serif',fontWeight:"400"}}>Media</span>
//                       <div style={{ fontFamily:'"Roboto", sans-serif',fontSize:"14px",border:"2px dashed #C2C2C2", padding:"10px 20px", borderRadius:"8px", height:"200px", color:"#676767",}}>
//                          {previewUrl ? (
//           <img src={previewUrl} alt="Uploaded" style={{ maxHeight: "100%", maxWidth: "100%" }} />
//         ) : (
//           "No image uploaded"
//         )}
//                       </div>
//                    </div>
//              </div>
//              </div>
//               <div className="d-flex gap-3">
//                 <button style={{border:"none", backgroundColor:"#F1F1F1",boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", width:"80px", height:"30px", borderRadius:"4px" }}>Pending</button>
//                 <button style={{border:"none" , backgroundColor:"#464545ff", color:"white", borderRadius:"4px", width:"40px", height:"30px", }}>Edit</button>
//               </div>
//               </div>
//     </div>
//   );
// };

// export default ExpenseFormEdit;




// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { MdOutlineNavigateNext } from "react-icons/md";
// import { DateRange } from "react-date-range";
// import "react-date-range/dist/styles.css"; 
// import "react-date-range/dist/theme/default.css"; 
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import calendarIcon from "../../../assets/img/date.png";
// import image from '../../../assets/img/image.png';
// import axios from "axios";
// import BASE_URL from "../../config/config.js";
// import { RxCross2 } from "react-icons/rx";

// const ExpenseFormSecond = ({onClose }) => {
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [files, setFiles] = useState([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [notes, setNotes] = useState("");
//   const [isSaved, setIsSaved] = useState(false);
//   const [expenses , setExpenses ] = useState("")
//   const [expenseTitle, setExpenseTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [paymentMode, setPaymentMode] = useState("");
//   const [paidTo, setPaidTo] = useState("");
//   const [date, setDate] = useState(new Date());
//   const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);

//   const navigate = useNavigate();

//     useEffect(() => {
//     const fetchExpenses = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/expenses`);
//         setExpenses(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching expenses:", err);
//       }
//     };
//     fetchExpenses();
//   }, []);
//     // ❌ Close handler
//   const handleClose = () => {
//     if (onClose) {
//       onClose();   // agar parent se state based modal hai
//     } else {
//       navigate(-1); // warna back kar do
//     }
//   };

//   useEffect(() => {
//     return () => {
//       files.forEach(f => URL.revokeObjectURL(f.preview));
//     };
//   }, [files]);

//   const toggleCalendar = () => setShowCalendar(!showCalendar);

//   const modules = {
//     toolbar: [
//       [{ 'header': [1, 2, false] }],
//       [{ 'font': [] }],
//       [{ 'size': [] }],
//       ['bold', 'italic', 'underline'],
//       [{ 'color': [] }, { 'background': [] }],
//       [{ 'align': [] }],
//       ['link', 'image', 'video'],
//       ['code-block'],
//       ['clean']
//     ]
//   };

//   const formats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline',
//     'color', 'background',
//     'align',
//     'link', 'image', 'video',
//     'code-block'
//   ];

//   // ✅ Save Expense
//   const handleSave = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("date", date.toISOString());
//       formData.append("paymentStatus", paymentStatus);
//       formData.append("expenseTitle", expenseTitle);
//       formData.append("amount", Number(amount) || 0);
//       formData.append("notes", notes);
//       formData.append("paymentMode", paymentMode);
//       formData.append("paidTo", paidTo);
//       files.forEach(f => formData.append("receipt", f));

//       const res = await axios.post(`${BASE_URL}/api/expenses`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("✅ Saved:", res.data);
//       setIsSaved(true);
//     } catch (error) {
//       console.error("❌ Error saving expense:", error.response?.data || error.message);
//     }
//      setIsSaved(true);

//     // ✅ 1 second baad "expense-report" page par navigate
//     setTimeout(() => {
//       navigate("/expense-report");
//     }, 2000);
//   };

//   // ✅ Save Draft
//   const handleDraft = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("date", date.toISOString());
//       formData.append("paymentStatus", paymentStatus || "Pending");
//       formData.append("expenseTitle", expenseTitle);
//       formData.append("amount", Number(amount) || 0);
//       formData.append("notes", notes);
//       formData.append("paymentMode", paymentMode);
//       formData.append("paidTo", paidTo);
//       files.forEach(f => formData.append("receipt", f));
//       formData.append("status", "Draft");

//       const res = await axios.post(`${BASE_URL}/api/expenses`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("📝 Draft Saved:", res.data);
//     } catch (error) {
//       console.error("❌ Error saving draft:", error);
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);
//   };

//   // const handleDrop = (e) => {
//   //   e.preventDefault();
//   //   setIsDragging(false);
//   //   const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
//   //     f.type === "image/png" || f.type === "image/jpeg"
//   //   );
//   //   setFiles(droppedFiles);
//   // };
//   const handleDrop = (e) => {
//   e.preventDefault();
//   setIsDragging(false);
//   const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
//     f.type === "image/png" || f.type === "image/jpeg" || f.type === "application/pdf"
//   );
//   setFiles(droppedFiles);
// };


//   // --- styles ---
//   const formContainerStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", maxWidth: "807px", margin: "10px auto", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", fontFamily:'"Roboto", sans-serif' };
//   const rowStyle = { display: "flex", gap: "20px", marginBottom: "15px" };
//   const colStyle = { flex: 1 };
//   const formGroupStyle = { marginBottom: "15px" };
//   const inputStyle = { width: "100%", padding: "8px 12px", marginTop: "5px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", color:"#676767" };
//   const checkboxGroupStyle = { display: "flex", gap: "15px", margin: "8px 0" };
//   const receiptContainerStyle = { marginTop: "20px", borderRadius: "8px", padding: "20px", cursor: "pointer", border: "2px dashed #ccc", textAlign: "center" };
//   const uploadContentStyle = { zIndex: 2 };
//   const uploadIconStyle = { fontSize: "32px", display: "block", marginBottom: "10px" };
//   const browseTextStyle = { color: "#007bff", cursor: "pointer" };
//   const formActionsStyle = { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" };
//   const draftBtnStyle = { background: "white", border: "none", padding: "8px 20px", borderRadius: "6px", color: "#333", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" };
//   const saveBtnStyle = { background: "#262626", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "6px" };

//   return (
//     <div style={{position:"fixed", top:"0px", bottom:"0", left:"0", right:"0", zIndex:"9999", backgroundColor:"#00000063", overflowY:"auto"}}>
//       {/* <span style={{padding:"0px 10px"}}>
//         <Link style={{color:"#676767",fontWeight:"500", fontSize:"18px", textDecoration:"none"}}>Accounting & Finance</Link>
//         <MdOutlineNavigateNext style={{color:"#676767", fontWeight:"500", fontSize:"18px"}}/>
//         <Link style={{color:"#262626", fontWeight:"500", fontSize:"18px", textDecoration:"none"}}>Add Expenses</Link>
//       </span> */}
              
//       <div className="succefull-msg" style={{ display: isSaved ? "block" : "none",border:"1px solid #007B42", backgroundColor:"#BAFFDF", padding:"10px 16px", borderRadius:"8px", margin:"0 auto" ,width:"807px"}}>
//         <span>🎉 You Have Successfully Added a new Expense. </span>
//       </div>

//       <div style={formContainerStyle}>
//          <div style={{display:"flex", justifyContent:"end"}}><span onClick={handleClose}   style={{borderRadius:"50%", backgroundColor:"red",color:"white", padding:"5px", width:"25px", height:"25px", justifyContent:"center", display:"flex",alignItems:"center"}}><RxCross2 /></span></div>
//         {/* Top Row */}
//         <div style={rowStyle}>
//           <div style={colStyle}>
//             <label>Date</label>
//             <div style={checkboxGroupStyle}>
//               <label><input type="checkbox" /> Today</label>
//               <label><input type="checkbox" /> Yesterday</label>
//             </div>
//             <div style={{ position: "relative" }}>
//               <div onClick={toggleCalendar} style={{border:"1px solid #E6E6E6", borderRadius:"8px", padding:"10px 12px", width:"250px", display:"flex", justifyContent:"space-between", cursor:"pointer"}}>
//                 <span style={{ fontSize: "14px", color: "#676767" }}>{date.toDateString()}</span>
//                 <img src={calendarIcon} alt="calendar" style={{ width: "18px", height: "18px" }} />
//               </div>
//               {showCalendar && (
//                 <div style={{ position: "absolute", zIndex: 999, marginTop: "10px" }}>
//                   <DateRange
//                     editableDateInputs={true}
//                     moveRangeOnFirstSelection={false}
//                     ranges={range}
//                     onChange={(item) => {
//                       setRange([item.selection]);
//                       setDate(item.selection.startDate);
//                     }}
//                     rangeColors={["#1368EC"]}
//                   />
//                 </div>
//               )}
//             </div>
          
//           </div>

//           <div style={colStyle}>
//             <label>Payment Status</label>
//             <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} style={inputStyle}>
//               <option value="">Select Status</option>
//               <option value="Paid">Paid</option>
//               <option value="Pending">Pending</option>
//               <option value="Failed">Failed</option>
//             </select>
//           </div>
//         </div>

//         {/* Expense Title */}
//         <div style={formGroupStyle}>
//           <label>Expense Title</label>
//           <input type="text" placeholder="Expense Title" style={inputStyle} value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} />
//         </div>

//         {/* Notes */}
//         <div style={{ padding: "10px 0" }}>
//           <label>Notes</label>
//           <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
//             <ReactQuill theme="snow" value={notes} onChange={setNotes} modules={modules} formats={formats} placeholder="Text Here" style={{height:"230px", border:"none"}} />
//           </div>
//         </div>

//         {/* Payment Mode & Paid To */}
//         <div style={rowStyle}>
//           <div style={colStyle}>
//             <label>Payment Mode</label>
//             <input type="text" placeholder="UPI" style={inputStyle} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}/>
//           </div>
//           <div style={colStyle}>
//             <label>Paid To</label>
//             <input type="text" placeholder="Shop" style={inputStyle} value={paidTo} onChange={(e) => setPaidTo(e.target.value)}/>
//           </div>
//         </div>

//         {/* Amount */}
//         <div style={formGroupStyle}>
//           <label>Amount</label>
//           <input type="number" placeholder="₹ 0.00" style={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}/>
//         </div>

// <div 
//   style={{ 
//     ...receiptContainerStyle, 
//     border: isDragging ? "2px solid #1368EC" : "2px dashed #ccc", 
//     backgroundColor: isDragging ? "#f0f8ff" : "white" 
//   }}
//   onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//   onDragLeave={() => setIsDragging(false)}
//   onDrop={handleDrop}
// >
//   <label htmlFor="receipt-upload" style={uploadContentStyle}>
//     <div style={uploadContentStyle}>
//       <span role="img" aria-label="upload" style={uploadIconStyle}>
//         {files.length > 0 ? files.map((f, i) => (
//           f.type === "application/pdf" ? (
//             <div key={i} style={{ 
//               width: "120px", height: "120px", 
//               display: "flex", alignItems: "center", justifyContent: "center",
//               border: "1px solid #ddd", borderRadius: "6px", marginRight:"10px",
//               backgroundColor:"#f9f9f9", fontSize:"12px", fontWeight:"500"
//             }}>
//               📄 {f.name}
//             </div>
//           ) : (
//             <img 
//               key={i} 
//               src={URL.createObjectURL(f)} 
//               alt="preview" 
//               style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "6px", marginRight:"10px" }} 
//             />
//           )
//         )) : <img src={image} alt="placeholder" />}
//       </span>
//       <p>Drag your file here, or <span style={browseTextStyle}>browse</span></p>
//       <small>Supports JPEG, PNG, JPG, PDF</small>
//     </div>
//   </label>
//   <input
//     id="receipt-upload"
//     type="file"
//     accept="image/png, image/jpeg, application/pdf"
//     multiple
//     onChange={handleFileChange}
//     style={{ display: "none" }}
//   />
// </div>


//         {/* Actions */}
//         <div style={formActionsStyle}>
//           <button style={saveBtnStyle} >Save</button>  
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpenseFormSecond;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import calendarIcon from "../../../assets/img/date.png";
import image from '../../../assets/img/image.png';
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import BASE_URL from "../../config/config";

const ExpenseFormSecond = ({ onClose, expense }) => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [notes, setNotes] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);

  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  // Pre-fill form if `expense` prop is provided
  useEffect(() => {
    if (expense) {
      setPaymentStatus(expense.paymentStatus || "");
      setNotes(expense.notes || "");
      setExpenseTitle(expense.expenseTitle || "");
      setAmount(expense.amount || "");
      setPaymentMode(expense.paymentMode || "");
      setPaidTo(expense.paidTo || "");
      setDate(expense.date ? new Date(expense.date) : new Date());
      setRange([{ startDate: expense.date ? new Date(expense.date) : new Date(), endDate: expense.date ? new Date(expense.date) : new Date(), key: "selection" }]);
      if (expense.files) setFiles(expense.files); // if backend already has file URLs
    }
  }, [expense]);

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      [{ 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['code-block'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline',
    'color', 'background',
    'align',
    'link', 'image', 'video',
    'code-block'
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
      f.type === "image/png" || f.type === "image/jpeg" || f.type === "application/pdf"
    );
    setFiles(droppedFiles);
  };


  const handleSave = async () => {
  try {
    // Validate required fields
    if (!expenseTitle || !amount || !paymentMode || !paidTo || !paymentStatus) {
      alert("Please fill all required fields.");
      return;
    }

    if (expense && !expense._id) {
      alert("Invalid expense ID.");
      return;
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      alert("Amount must be a valid number.");
      return;
    }

    const validStatuses = ["Paid", "Pending", "Failed"];
    if (!validStatuses.includes(paymentStatus)) {
      alert("Invalid payment status.");
      return;
    }

    const formData = new FormData();
    formData.append("paymentStatus", paymentStatus);
    formData.append("notes", notes);
    formData.append("expenseTitle", expenseTitle);
    formData.append("amount", parsedAmount);
    formData.append("paymentMode", paymentMode);
    formData.append("paidTo", paidTo);
    formData.append("date", date.toISOString());
    if (files.length > 0) {
      formData.append("receipt", files[0]); // Use correct field name and single file
      console.log("Uploading file:", files[0].name, files[0].type);
    }

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const token = localStorage.getItem("token"); // Adjust based on your auth
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    if (expense && expense._id) {
      // console.log("Sending PUT request to:", `http://localhost:5500/api/expenses/${expense._id}`);
      await axios.put(`${BASE_URL}api/expenses/${expense._id}`, formData, config,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // console.log("Sending POST request to:", `http://localhost:5500/api/expenses`);
      await axios.post(`${BASE_URL}/api/expenses`, formData, config,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    handleClose();
  } catch (error) {
    console.error("Error saving expense:", error);
    alert(`Failed to save expense: ${error.response?.data?.error || "Server error"}`);
  }
};
  return (
    <div style={{position:"fixed", top:"0px", bottom:"0", left:"0", right:"0", zIndex:"9999", backgroundColor:"#00000063", overflowY:"auto"}}>
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", maxWidth: "807px", margin: "10px auto", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", fontFamily:'"Roboto", sans-serif' }}>
        <div style={{display:"flex", justifyContent:"end"}}>
          <span onClick={handleClose} style={{borderRadius:"50%", backgroundColor:"red",color:"white", padding:"5px", width:"25px", height:"25px", justifyContent:"center", display:"flex",alignItems:"center"}}>
            <RxCross2 />
          </span>
        </div>

        {/* Top Row */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Date</label>
            <div style={{ display: "flex", gap: "15px", margin: "8px 0" }}>
              <label><input type="checkbox" /> Today</label>
              <label><input type="checkbox" /> Yesterday</label>
            </div>
            <div style={{ position: "relative" }}>
              <div onClick={toggleCalendar} style={{border:"1px solid #E6E6E6", borderRadius:"8px", padding:"10px 12px", width:"250px", display:"flex", justifyContent:"space-between", cursor:"pointer"}}>
                <span style={{ fontSize: "14px", color: "#676767" }}>{date.toDateString()}</span>
                <img src={calendarIcon} alt="calendar" style={{ width: "18px", height: "18px" }} />
              </div>
              {showCalendar && (
                <div style={{ position: "absolute", zIndex: 999, marginTop: "10px" }}>
                  <DateRange
                    editableDateInputs={true}
                    moveRangeOnFirstSelection={false}
                    ranges={range}
                    onChange={(item) => {
                      setRange([item.selection]);
                      setDate(item.selection.startDate);
                    }}
                    rangeColors={["#1368EC"]}
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <label>Payment Status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} style={{ width: "100%", padding: "8px 12px", marginTop: "5px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", color:"#676767" }}>
              <option value="">Select Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Expense Title */}
        <div style={{ marginBottom: "15px" }}>
          <label>Expense Title</label>
          <input type="text" placeholder="Expense Title" style={{ width: "100%", padding: "8px 12px", marginTop: "5px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", color:"#676767" }} value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} />
        </div>

        {/* Notes */}
        <div style={{ padding: "10px 0" }}>
          <label>Notes</label>
          <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
            <ReactQuill theme="snow" value={notes} onChange={setNotes} modules={modules} formats={formats} placeholder="Text Here" style={{height:"230px", border:"none"}} />
          </div>
        </div>

        {/* Payment Mode & Paid To */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Payment Mode</label>
            <input type="text" placeholder="UPI" style={{ width: "100%", padding: "8px 12px", marginTop: "5px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", color:"#676767" }} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}/>
          </div>
          <div style={{ flex: 1 }}>
            <label>Paid To</label>
            <input type="text" placeholder="Shop" style={{ width: "100%", padding: "8px 12px", marginTop: "5px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", color:"#676767" }} value={paidTo} onChange={(e) => setPaidTo(e.target.value)}/>
          </div>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: "15px" }}>
          <label>Amount</label>
          <input type="number" placeholder="₹ 0.00" style={{ width: "100%", padding: "8px 12px", marginTop: "5px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", color:"#676767" }} value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}/>
        </div>

        {/* Receipt Upload */}
        <div 
          style={{ 
            marginTop: "20px", borderRadius: "8px", padding: "20px", cursor: "pointer", border: isDragging ? "2px solid #1368EC" : "2px dashed #ccc", backgroundColor: isDragging ? "#f0f8ff" : "white" 
          }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <label htmlFor="receipt-upload">
            <div>
              <span>
                {files.length > 0 ? files.map((f, i) => (
                  f.type === "application/pdf" ? (
                    <div key={i} style={{ width: "120px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ddd", borderRadius: "6px", marginRight:"10px", backgroundColor:"#f9f9f9", fontSize:"12px", fontWeight:"500" }}>
                      📄 {f.name}
                    </div>
                  ) : (
                    <img key={i} src={URL.createObjectURL(f)} alt="preview" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "6px", marginRight:"10px" }} />
                  )
                )) : <img src={image} alt="placeholder" />}
              </span>
              <p>Drag your file here, or <span style={{ color: "#007bff", cursor: "pointer" }}>browse</span></p>
              <small>Supports JPEG, PNG, JPG, PDF</small>
            </div>
          </label>
          <input id="receipt-upload" type="file" accept="image/png, image/jpeg, application/pdf" multiple onChange={handleFileChange} style={{ display: "none" }} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
          <button onClick={handleSave} style={{ background: "#262626", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "6px" }}>
            Save
          </button>  
        </div>
      </div>
    </div>
  );
};

export default ExpenseFormSecond;


