import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import calendarIcon from "../../../assets/img/date.png";
import image from '../../../assets/img/image.png';
import axios from "axios";
import BASE_URL from "../../config/config.js";

const ExpenseFormSecond = () => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  
  const [expenseTitle, setExpenseTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

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

  // ✅ Save Expense
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("date", date.toISOString());
      formData.append("paymentStatus", paymentStatus);
      formData.append("expenseTitle", expenseTitle);
      formData.append("amount", Number(amount) || 0);
      formData.append("notes", notes);
      formData.append("paymentMode", paymentMode);
      formData.append("paidTo", paidTo);
      files.forEach(f => formData.append("receipt", f));

      const res = await axios.post(`${BASE_URL}/api/expenses`, formData, {
        headers: { "Content-Type": "multipart/form-data" ,
                    Authorization: `Bearer ${token}`,

        },
      });

      console.log("✅ Saved:", res.data);
      setIsSaved(true);
    } catch (error) {
      console.error("❌ Error saving expense:", error.response?.data || error.message);
    }
     setIsSaved(true);

    // ✅ 1 second baad "expense-report" page par navigate
    setTimeout(() => {
      navigate("/expense-report");
    }, 2000);
  };

  // ✅ Save Draft
  const handleDraft = async () => {
    try {
      const formData = new FormData();
      formData.append("date", date.toISOString());
      formData.append("paymentStatus", paymentStatus || "Pending");
      formData.append("expenseTitle", expenseTitle);
      formData.append("amount", Number(amount) || 0);
      formData.append("notes", notes);
      formData.append("paymentMode", paymentMode);
      formData.append("paidTo", paidTo);
      files.forEach(f => formData.append("receipt", f));
      formData.append("status", "Draft");

      const res = await axios.post(`${BASE_URL}/api/expenses`, formData, {
        headers: { "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,

         },
      });

      console.log("📝 Draft Saved:", res.data);
    } catch (error) {
      console.error("❌ Error saving draft:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   setIsDragging(false);
  //   const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
  //     f.type === "image/png" || f.type === "image/jpeg"
  //   );
  //   setFiles(droppedFiles);
  // };
  const handleDrop = (e) => {
  e.preventDefault();
  setIsDragging(false);
  const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
    f.type === "image/png" || f.type === "image/jpeg" || f.type === "application/pdf"
  );
  setFiles(droppedFiles);
};


  // --- styles ---
  const formContainerStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", maxWidth: "807px", margin: "10px auto", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", fontFamily:'"Roboto", sans-serif' };
  const rowStyle = { display: "flex", gap: "20px", marginBottom: "15px" };
  const colStyle = { flex: 1 };
  const formGroupStyle = { marginBottom: "15px" };
  const inputStyle = { width: "100%", padding: "8px 12px", marginTop: "5px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", color:"#676767" };
  const checkboxGroupStyle = { display: "flex", gap: "15px", margin: "8px 0" };
  const receiptContainerStyle = { marginTop: "20px", borderRadius: "8px", padding: "20px", cursor: "pointer", border: "2px dashed #ccc", textAlign: "center" };
  const uploadContentStyle = { zIndex: 2 };
  const uploadIconStyle = { fontSize: "32px", display: "block", marginBottom: "10px" };
  const browseTextStyle = { color: "#007bff", cursor: "pointer" };
  const formActionsStyle = { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" };
  const draftBtnStyle = { background: "white", border: "none", padding: "8px 20px", borderRadius: "6px", color: "#333", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" };
  const saveBtnStyle = { background: "#262626", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "6px" };

  return (
    <div>
      <span style={{padding:"0px 10px"}}>
        <Link style={{color:"#676767",fontWeight:"500", fontSize:"18px", textDecoration:"none"}}>Accounting & Finance</Link>
        <MdOutlineNavigateNext style={{color:"#676767", fontWeight:"500", fontSize:"18px"}}/>
        <Link style={{color:"#262626", fontWeight:"500", fontSize:"18px", textDecoration:"none"}}>Add Expenses</Link>
      </span>

      <div className="succefull-msg" style={{ display: isSaved ? "block" : "none",border:"1px solid #007B42", backgroundColor:"#BAFFDF", padding:"10px 16px", borderRadius:"8px", margin:"0 auto" ,width:"807px"}}>
        <span>🎉 You Have Successfully Added a new Expense. </span>
      </div>

      <div style={formContainerStyle}>
        {/* Top Row */}
        <div style={rowStyle}>
          <div style={colStyle}>
            <label>Date</label>
            <div style={checkboxGroupStyle}>
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

          <div style={colStyle}>
            <label>Payment Status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} style={inputStyle}>
              <option value="">Select Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Expense Title */}
        <div style={formGroupStyle}>
          <label>Expense Title</label>
          <input type="text" placeholder="Expense Title" style={inputStyle} value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} />
        </div>

        {/* Notes */}
        <div style={{ padding: "10px 0" }}>
          <label>Notes</label>
          <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
            <ReactQuill theme="snow" value={notes} onChange={setNotes} modules={modules} formats={formats} placeholder="Text Here" style={{height:"230px", border:"none"}} />
          </div>
        </div>

        {/* Payment Mode & Paid To */}
        <div style={rowStyle}>
          <div style={colStyle}>
            <label>Payment Mode</label>
            <input type="text" placeholder="UPI" style={inputStyle} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}/>
          </div>
          <div style={colStyle}>
            <label>Paid To</label>
            <input type="text" placeholder="Shop" style={inputStyle} value={paidTo} onChange={(e) => setPaidTo(e.target.value)}/>
          </div>
        </div>

        {/* Amount */}
        <div style={formGroupStyle}>
          <label>Amount</label>
          <input type="number" placeholder="₹ 0.00" style={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}/>
        </div>

        {/* Receipt Upload */}
        {/* <div style={{ ...receiptContainerStyle, border: isDragging ? "2px solid #1368EC" : "2px dashed #ccc", backgroundColor: isDragging ? "#f0f8ff" : "white" }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <label htmlFor="receipt-upload" style={uploadContentStyle}>
            <div style={uploadContentStyle}>
              <span role="img" aria-label="upload" style={uploadIconStyle}>
                {files.length > 0 ? files.map((f, i) => (
                  <img key={i} src={URL.createObjectURL(f)} alt="preview" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "6px", marginRight:"10px" }} />
                )) : <img src={image} alt="placeholder" />}
              </span>
              <p>Drag your image here, or <span style={browseTextStyle}>browse</span></p>
              <small>Supports JPEG, PNG, JPG</small>
            </div>
          </label>
          <input
            id="receipt-upload"
            type="file"
            accept="image/png, image/jpeg"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div> */}
        {/* Receipt Upload */}
<div 
  style={{ 
    ...receiptContainerStyle, 
    border: isDragging ? "2px solid #1368EC" : "2px dashed #ccc", 
    backgroundColor: isDragging ? "#f0f8ff" : "white" 
  }}
  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={handleDrop}
>
  <label htmlFor="receipt-upload" style={uploadContentStyle}>
    <div style={uploadContentStyle}>
      <span role="img" aria-label="upload" style={uploadIconStyle}>
        {files.length > 0 ? files.map((f, i) => (
          f.type === "application/pdf" ? (
            <div key={i} style={{ 
              width: "120px", height: "120px", 
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #ddd", borderRadius: "6px", marginRight:"10px",
              backgroundColor:"#f9f9f9", fontSize:"12px", fontWeight:"500"
            }}>
              📄 {f.name}
            </div>
          ) : (
            <img 
              key={i} 
              src={URL.createObjectURL(f)} 
              alt="preview" 
              style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "6px", marginRight:"10px" }} 
            />
          )
        )) : <img src={image} alt="placeholder" />}
      </span>
      <p>Drag your file here, or <span style={browseTextStyle}>browse</span></p>
      <small>Supports JPEG, PNG, JPG, PDF</small>
    </div>
  </label>
  <input
    id="receipt-upload"
    type="file"
    accept="image/png, image/jpeg, application/pdf"
    multiple
    onChange={handleFileChange}
    style={{ display: "none" }}
  />
</div>


        {/* Actions */}
        <div style={formActionsStyle}>
          {!isSaved && (
            <button className="draft-btn" style={draftBtnStyle} onClick={handleDraft}>Draft</button>
          )}
          <button style={saveBtnStyle} onClick={handleSave}>{isSaved ? "Done" : "Save"}</button>  
        </div>
      </div>
    </div>
  );
};

export default ExpenseFormSecond;
