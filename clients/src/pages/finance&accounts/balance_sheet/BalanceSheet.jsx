


import React, { useState,useRef, useEffect } from 'react';
import balancesheet_y from '../../../assets/img/balacesheet-y.png';
import balancesheet_x from '../../../assets/img/balacesheet-x.png';
import './BalanceSheetToggle.css';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from 'html2canvas';
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme 

import calendarIcon from "../../../assets/img/date.png"; // Use your calendar icon
import axios from "axios"
import BASE_URL from '../../config/config';

const BalanceSheet = () => {
  const [view, setView] = useState("landscape");
   const sheetRef = useRef(null); 
const [companyInfo, setCompanyInfo] = useState(null);
const [totalStockValue, setTotalStockValue] = useState(0);
const [products, setProducts] = useState([]);
const token = localStorage.getItem("token");



  
// Fetching company info
useEffect(() => {
  const fetchCompanyInfo = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/companyprofile/get`,{
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("Fetched company info:", data);

    
      if (data && data.data) {
        setCompanyInfo(data.data);
      } else {
        setCompanyInfo(data);
      }
    } catch (err) {
      console.error("Error fetching company info:", err);
    }
  };

  fetchCompanyInfo();
}, []);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`,{
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);

      // calculate total selling value (sellingPrice * quantity)
      const total = res.data.reduce((acc, product) => {
        const price = Number(product.sellingPrice) || 0;
        const qty = Number(product.quantity) || 0;
        return acc + price * qty;
      }, 0);

      setTotalStockValue(total);

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


// //pdf download
// const handleDownload = () => {
//   const pdf = new jsPDF("p", "mm", "a4");
//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = pdf.internal.pageSize.getHeight();


//   if (companyInfo) {
//     pdf.setFontSize(18);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(companyInfo.companyName || "", pdfWidth / 2, 15, { align: "center" });

//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(companyInfo.companydescription || "", pdfWidth / 2, 22, { align: "center" });

//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(
//       `CIN: ${companyInfo.cin || ""}, GSTIN: ${companyInfo.gstin || ""}`,
//       pdfWidth / 2,
//       28,
//       { align: "center" }
//     );

//     pdf.setFontSize(10);
//     pdf.text(companyInfo.companyaddress || "", pdfWidth / 2, 34, { align: "center" });

//     pdf.setLineWidth(0.5);
//     pdf.line(10, 40, pdfWidth - 10, 40);
      
//   }


// // ✅ Your Code
// const assetRows = [
//   ["Bank Balance",(values.bankBalance)],
//   ["Account Receivable", (values.accountReceivable)],
//   ["Cash In Hand", (values.cashInHand)],
//   ["Prepaid Expenses", (values.prepaidExpenses)],
//   ["Property", (values.property)],
//   ["Office Equipment", (values.officeEquipment)],
//   ["Software", (values.software)],
//   ["Deposit", (values.deposit)],
//   ["Total Assets", (totalAssets)],
// ];

// const liabilityRows = [
//   ["Account Payable", (valuesSecond.accountpayable)],
//   ["Outstanding", (valuesSecond.outstanding)],
//   ["Short-term Loan", (valuesSecond.shorttermLoan)],
//   ["Long-term Loan", (valuesSecond.longtermLoan)],
//   ["Lease", (valuesSecond.lease)],
//   ["Total Liabilities", (totalLiabilities)],
// ];

// const equityRows = [
//   ["Capital", (valuesThird.capital)],
//   ["Retained Earnings",(valuesThird.retainedEarnings)],
//   ["Withdrawl", (valuesThird.withdrawl)],
//   ["Total Equities", (totalequities)],
// ];

//   // ✅ call autoTable like this (not pdf.autoTable)
//   autoTable(pdf, {
//     startY: 50,
//     head: [["Assets", "Amount"]],
//     body: assetRows,
//     theme: "grid",
//     styles: { font: "helvetica", fontSize: 10 },
//     headStyles: { fillColor: [128, 128, 128] },
//      didParseCell: function (data) {
//     // ✅ Last row "Total Assets"
//     if (data.row.index === assetRows.length - 1) {
//       data.cell.styles.fontStyle = "bold";
//     }
//   },
//   });

//   autoTable(pdf, {
//     startY: pdf.lastAutoTable.finalY + 10,
//     head: [["Liabilities", "Amount"]],
//     body: liabilityRows,
//     theme: "grid",
//     styles: { font: "helvetica", fontSize: 10 },
//     headStyles: { fillColor: [128, 128, 128] },
//      didParseCell: function (data) {
//     if (data.row.index === liabilityRows.length - 1) {
//       data.cell.styles.fontStyle = "bold";
//     }
//   },
//   });

//   autoTable(pdf, {
//     startY: pdf.lastAutoTable.finalY + 10,
//     head: [["Equities", "Amount"]],
//     body: equityRows,
//     theme: "grid",
//     styles: { font: "helvetica", fontSize: 10 },
//     headStyles: { fillColor: [128, 128, 128] },
//     didParseCell: function (data) {
//     if (data.row.index === equityRows.length - 1) {
//       data.cell.styles.fontStyle = "bold";
//     }
//   }, 
//   });

// // ✅ Footer
//   pdf.setFontSize(9);
//   pdf.setFont("times", "italic");
//   pdf.text(
//     "Generated by Balance Sheet System",
//     pdfWidth / 2,
//     pdfHeight - 10,
//     { align: "center" }
//   );
 

//   pdf.save("BalanceSheet.pdf");
// };

// // ✅ Preview Function
// const handlePreview = () => {
//   const pdf = new jsPDF("p", "mm", "a4");
//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = pdf.internal.pageSize.getHeight();

//   if (companyInfo) {
//     pdf.setFontSize(18);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(companyInfo.companyName || "", pdfWidth / 2, 15, { align: "center" });

//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "italic");
//     pdf.text(companyInfo.companydescription || "", pdfWidth / 2, 22, { align: "center" });

//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(
//       `CIN: ${companyInfo.cin || ""}, GSTIN: ${companyInfo.gstin || ""}`,
//       pdfWidth / 2,
//       28,
//       { align: "center" }
//     );

//     pdf.setFontSize(10);
//     pdf.text(companyInfo.companyaddress || "", pdfWidth / 2, 34, { align: "center" });

//     // ✅ Balance Sheet Date add
//     const today = new Date().toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//     pdf.setFontSize(11);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(`Balance Sheet Date: ${today}`, pdfWidth / 2, 40, { align: "center" });

//     pdf.setLineWidth(0.5);
//     pdf.line(10, 45, pdfWidth - 10, 45);
//   }

//   // ✅ Define your rows here
//   // ✅ Assets Table rows
// const assetRows = [
//   [{ content: "Current Assets", colSpan: 2, styles: { halign: "left", fontStyle: "bold" } }],
//   ["Bank Balance", values.bankBalance],
//   ["Account Receivable", values.accountReceivable],
//   ["Cash In Hand", values.cashInHand],
//   ["Prepaid Expenses", values.prepaidExpenses],
//   ["Total Current Assets", totalCurrentAssets],

//   [{ content: "Non-Current Assets", colSpan: 2, styles: { halign: "left", fontStyle: "bold" } }],
//   ["Property", values.property],
//   ["Office Equipment", values.officeEquipment],
//   ["Software", values.software],
//   ["Deposit", values.deposit],
//   ["Total Non-Current Assets", totalNonCurrentAssets],

//   ["Total Assets", totalAssets],
// ];

// // ✅ Liabilities Table rows
// const liabilityRows = [
//   [{ content: "Current Liabilities", colSpan: 2, styles: { halign: "left", fontStyle: "bold" } }],
//   ["Account Payable", valuesSecond.accountpayable],
//   ["Outstanding", valuesSecond.outstanding],
//   ["Short-term Loan", valuesSecond.shorttermLoan],
//   ["Total Current Liabilities", totalCurrentLiabilities],

//   [{ content: "Non-Current Liabilities", colSpan: 2, styles: { halign: "left", fontStyle: "bold" } }],
//   ["Long-term Loan", valuesSecond.longtermLoan],
//   ["Lease", valuesSecond.lease],
//   ["Total Non-Current Liabilities", totalNonCurrentLiabilities],

//   ["Total Liabilities", totalLiabilities],
// ];

//   const equityRows = [
//     ["Capital", valuesThird.capital],
//     ["Retained Earnings", valuesThird.retainedEarnings],
//     ["Withdrawl", valuesThird.withdrawl],
//     ["Total Equities", totalequities],
//   ];

//   // ✅ Assets Table
//   autoTable(pdf, {
//     startY: 55,
//     head: [["Assets", "Amount"]],
//     body: assetRows,
//     theme: "grid",
//     styles: { font: "helvetica", fontSize: 10 },
//     headStyles: { fillColor: [128, 128, 128] },
//     didParseCell: (data) => {
//       if (data.row.index === assetRows.length - 1) {
//         data.cell.styles.fontStyle = "bold";
//       }
//     },
//   });

//   // ✅ Liabilities Table
//   autoTable(pdf, {
//     startY: pdf.lastAutoTable.finalY + 10,
//     head: [["Liabilities", "Amount"]],
//     body: liabilityRows,
//     theme: "grid",
//     styles: { font: "helvetica", fontSize: 10 },
//     headStyles: { fillColor: [128, 128, 128] },
//     didParseCell: (data) => {
//       if (data.row.index === liabilityRows.length - 1) {
//         data.cell.styles.fontStyle = "bold";
//       }
//     },
//   });

//   // ✅ Equities Table
//   autoTable(pdf, {
//     startY: pdf.lastAutoTable.finalY + 10,
//     head: [["Equities", "Amount"]],
//     body: equityRows,
//     theme: "grid",
//     styles: { font: "helvetica", fontSize: 10 },
//     headStyles: { fillColor: [128, 128, 128] },
//     didParseCell: (data) => {
//       if (data.row.index === equityRows.length - 1) {
//         data.cell.styles.fontStyle = "bold";
//       }
//     },
//   });

//   // ✅ Footer
//   pdf.setFontSize(9);
//   pdf.setFont("times", "italic");
//   pdf.text(
//     "Generated by Balance Sheet System",
//     pdfWidth / 2,
//     pdfHeight - 10,
//     { align: "center" }
//   );

//   // ✅ Preview in new tab instead of download
//   const pdfBlob = pdf.output("bloburl");
//   window.open(pdfBlob);
// };

// // ✅ Download separately
// const handleDownload = () => {
//   handlePreview(); // show preview
//   // If you want auto-download also → uncomment
//   // pdf.save("BalanceSheet.pdf");
// };
// ✅ Preview Function


const handlePreview = () => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  if (companyInfo) {
    // ===== Header (Slip Bill Look) =====
    pdf.setFont("times", "bold");
    pdf.setFontSize(16);
    pdf.text(companyInfo.companyName || "", pdfWidth / 2, 15, { align: "center" });

    pdf.setFontSize(10);
    pdf.setFont("times", "italic");
    pdf.text(companyInfo.companydescription || "", pdfWidth / 2, 21, { align: "center" });

    pdf.setFont("times", "normal");
    pdf.text(
      `CIN: ${companyInfo.cin || ""}   GSTIN: ${companyInfo.gstin || ""}`,
      pdfWidth / 2,
      27,
      { align: "center" }
    );

    pdf.text(companyInfo.companyaddress || "", pdfWidth / 2, 33, { align: "center" });

    // ✅ Balance Sheet Date
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    pdf.setFontSize(11);
    pdf.setFont("times", "bold");
    pdf.text(`Balance Sheet Date: ${today}`, pdfWidth / 2, 40, { align: "center" });

    // Thin separator line
    pdf.setLineWidth(0.3);
    pdf.line(10, 45, pdfWidth - 10, 45);
  }

  // ✅ Assets Table rows
  const assetRows = [
    [{ content: "Current Assets", colSpan: 2, styles: { halign: "left", fontStyle: "bold" } }],
    [" Inventories (Stock in Hand)",totalStockValue],
    ["Bank Balance", values.bankBalance],
    ["Account Receivable", values.accountReceivable],
    ["Cash In Hand", values.cashInHand],
    ["Prepaid Expenses", values.prepaidExpenses],
    ["Advance to Supplierss", values],
    ["Total Current Assets", totalCurrentAssets],

    [{ content: "Non-Current Assets", colSpan: 2, styles: { halign: "left", fontStyle: "bold" } }],
    ["Property", values.property],
    ["Office Equipment", values.officeEquipment],
    ["Software", values.software],
    ["Deposit", values.deposit],
    ["Total Non-Current Assets", totalNonCurrentAssets],

    ["Total Assets", totalAssets],
  ];

  // ✅ Liabilities Table rows
  const liabilityRows = [
    [{ content: "Current Liabilities", colSpan: 2, styles: { halign: "left", fontStyle: "bold" } }],
    ["Account Payable", valuesSecond.accountpayable],
    ["Outstanding", valuesSecond.outstanding],
    ["GST Payable", valuesSecond],
    ["TDS Payable", valuesSecond],
    ["Short-term Loan", valuesSecond.shorttermLoan],
    ["Total Current Liabilities", totalCurrentLiabilities],

    [{ content: "Non-Current Liabilities", colSpan: 2, styles: { halign: "left", fontStyle: "bold" } }],
    ["Long-term Loan", valuesSecond.longtermLoan],
    ["Lease", valuesSecond.lease],
    ["Total Non-Current Liabilities", totalNonCurrentLiabilities],

    ["Total Liabilities", totalLiabilities],
  ];

  const equityRows = [
    ["Capital", valuesThird.capital],
    ["Retained Earnings", valuesThird.retainedEarnings],
    ["Withdrawl", valuesThird.withdrawl],
    ["Total Equities", totalequities],
  ];

  // ✅ Assets Table (Slip Look → clean borders, left align)
  autoTable(pdf, {
    startY: 55,
    head: [["Assets", "Amount"]],
    body: assetRows,
    theme: "plain", // ✅ no heavy borders
    styles: { font: "times", fontSize: 10, halign: "left", lineWidth: 0.2 },
    headStyles: { fontStyle: "bold", fillColor: [240, 240, 240] },
    didParseCell: (data) => {
      if (data.row.index === assetRows.length - 1) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // ✅ Liabilities Table
  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 8,
    head: [["Liabilities", "Amount"]],
    body: liabilityRows,
    theme: "plain",
    styles: { font: "times", fontSize: 10, halign: "left", lineWidth: 0.2 },
    headStyles: { fontStyle: "bold", fillColor: [240, 240, 240] },
    didParseCell: (data) => {
      if (data.row.index === liabilityRows.length - 1) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // ✅ Equities Table
  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 8,
    head: [["Equities", "Amount"]],
    body: equityRows,
    theme: "plain",
    styles: { font: "times", fontSize: 10, halign: "left", lineWidth: 0.2 },
    headStyles: { fontStyle: "bold", fillColor: [240, 240, 240] },
    didParseCell: (data) => {
      if (data.row.index === equityRows.length - 1) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // ===== Footer =====
  pdf.setLineWidth(0.3);
  pdf.line(10, pdfHeight - 20, pdfWidth - 10, pdfHeight - 20);

  pdf.setFontSize(9);
  pdf.setFont("times", "italic");
  pdf.text("Generated by Balance Sheet System", pdfWidth / 2, pdfHeight - 12, { align: "center" });

  // ✅ Preview in new tab instead of download
  const pdfBlob = pdf.output("bloburl");
  window.open(pdfBlob);
};

// ✅ Download separately
const handleDownload = () => {
  handlePreview();
  // pdf.save("BalanceSheet.pdf");
};


  
   const [showCalendar, setShowCalendar] = useState(false);
    const [range, setRange] = useState([
      {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-03-31"),
        key: "selection",
      },
    ]);
  
    const handleChange = (item) => {
      setRange([item.selection]);
  
    };
  
    const toggleCalendar = () => {
      setShowCalendar(!showCalendar);
    };
    const [values, setValues] = useState({
    bankBalance: 0,
    accountReceivable: 0,
    cashInHand: 0,
    prepaidExpenses: 0,
    property: 0,
    officeEquipment: 0,
    software: 0,
    deposit: 0,
  });

  const [valuesSecond, setValuesSecond] = useState({
    accountpayable: 0,
    outstanding: 0,
    shorttermLoan: 0,
    longtermLoan: 0,
    lease: 0,
  });

  const [valuesThird, setValuesThird] = useState({
    capital: 0,
    retainedEarnings: 0,
    withdrawl: 0,
  });

  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [totalequities, setTotalEquities] = useState(0);
  // New subtotal states
const [totalCurrentAssets, setTotalCurrentAssets] = useState(0);
const [totalNonCurrentAssets, setTotalNonCurrentAssets] = useState(0);
const [totalCurrentLiabilities, setTotalCurrentLiabilities] = useState(0);
const [totalNonCurrentLiabilities, setTotalNonCurrentLiabilities] = useState(0);


  // recalc totals
  useEffect(() => {
    setTotalAssets(Object.values(values).reduce((a, b) => a + b, 0));
  }, [values]);

  useEffect(() => {
    setTotalLiabilities(Object.values(valuesSecond).reduce((a, b) => a + b, 0));
  }, [valuesSecond]);

  useEffect(() => {
    setTotalEquities(Object.values(valuesThird).reduce((a, b) => a + b, 0));
  }, [valuesThird]);
  // Current Assets subtotal
useEffect(() => {
  const { bankBalance, accountReceivable, cashInHand, prepaidExpenses } = values;
  setTotalCurrentAssets(bankBalance + accountReceivable + cashInHand + prepaidExpenses);
}, [values]);

// Non-Current Assets subtotal
useEffect(() => {
  const { property, officeEquipment, software, deposit } = values;
  setTotalNonCurrentAssets(property + officeEquipment + software + deposit);
}, [values]);

// Current Liabilities subtotal
useEffect(() => {
  const { accountpayable, outstanding, shorttermLoan } = valuesSecond;
  setTotalCurrentLiabilities(accountpayable + outstanding + shorttermLoan);
}, [valuesSecond]);

// Non-Current Liabilities subtotal
useEffect(() => {
  const { longtermLoan, lease } = valuesSecond;
  setTotalNonCurrentLiabilities(longtermLoan + lease);
}, [valuesSecond]);


  // input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value) || 0;

    if (name in values) {
      setValues((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name in valuesSecond) {
      setValuesSecond((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name in valuesThird) {
      setValuesThird((prev) => ({ ...prev, [name]: numericValue }));
    }
  };

  // ⏳ Debounce save to DB when data changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveToDB();
    }, 800); // wait 0.8s after typing stops

    return () => clearTimeout(timeout);
  }, [values, valuesSecond, valuesThird, totalAssets, totalLiabilities, totalequities]);

  const saveToDB = async () => {
    try {
      const payload = {
        assets: values,
        liabilities: valuesSecond,
        equities: valuesThird,
        totals: {
          totalAssets,
          totalLiabilities,
          totalEquities: totalequities,
        },
      };
      await axios.post(`${BASE_URL}/api/balancesheet`, payload.assets,{
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Auto-saved:", payload);
    } catch (err) {
      console.error("❌ Auto-save failed", err);
    }
  };
  


  const renderTable = () => (
    <div className={`balance-sheet ${view}`} style={{padding:"5px 16px"}}>
      <div className="columnbalancesheet">
        <div className="boxbalancesheet">
          <h3 style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400",fontSize:"16px", color:"#262626"}}>Assets</h3>
          <div className="section-balancesheet">
            <p style={{borderBottom:"1px solid #E6E6E6", margin:"0"}}><strong style={{fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>1. Current Assets</strong></p>
            <ul className='ul-balancesheet' style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400", fontSize:"16px", color:"#262626"}}>
              {/* <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) Inventories (Stock in Hand) <span>xxxx</span></li> */}
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>
  (a) Inventories (Stock in Hand) 
  <span>₹{totalStockValue.toFixed(2)}</span>
</li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(b) Bank Balance <span><input type="number"  name="bankBalance"
                  onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) Account Receivable <span><input type="number" name="accountReceivable"
                  onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) Cash In Hand <span><input type="number"  name="cashInHand"
                  onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) Prepaid Expenses <span><input type="number" name="prepaidExpenses"  onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) Advance to Suppliers <span>xxxx</span></li>
              <div className="total-row-balancesheet" style={{borderBottom:"1px solid grey",backgroundColor:"transparent",fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>Total Current Assets - <span>₹{totalCurrentAssets}</span></div>
            </ul>
            <p className='m-0' style={{borderBottom:"1px solid #E6E6E6"}}><strong style={{fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>2. Non-Current Assets</strong></p>
            <ul className='ul-balancesheet' style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400", fontSize:"16px", color:"#262626"}}>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) Property, Plant & Equipment <span><input type="number" name='property' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(b) Office Equipment <span><input type="number" name='officeEquipment' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(c) Software License / ERP Cost <span><input type="number" name='software' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(d) Security Deposit <span><input type="number" name='deposit' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
               <div className="total-row-balancesheet" style={{borderBottom:"1px solid grey",backgroundColor:"transparent",fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>Total Non-Current Assets - <span>₹{totalNonCurrentAssets}</span></div>
            </ul>
          </div>
          <div className="total-row-balancesheet" style={{fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>Total Assets - <span>₹{totalAssets}</span></div>
        </div>
      </div>

      <div className="columnbalancesheet">
        <div className="boxbalancesheet">
          <h3 style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400",fontSize:"16px", color:"#262626"}}>Liabilities</h3>
          <div className="section-balancesheet">
            <p className='m-0' style={{borderBottom:"1px solid #E6E6E6"}}><strong style={{fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>1. Current Liabilities</strong></p>
            <ul className='ul-balancesheet' style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400", fontSize:"16px", color:"#262626"}}>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) Account Payable <span><input type="number" name='accountpayable' onChange={handleInputChange}  placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(b) Outstanding Expenses <span><input type="number" name='outstanding' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) GST Payable <span>xxxx</span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) TDS Payable <span>xxxx</span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) Short-Term Loans <span><input type="number" name='shorttermLoan' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
               <div className="total-row-balancesheet" style={{borderBottom:"1px solid grey",backgroundColor:"transparent",fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>Total Current Liabilites - <span>₹{totalCurrentLiabilities}</span></div>
            </ul>
            <p className='m-0' style={{borderBottom:"1px solid #E6E6E6"}}><strong style={{fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>2. Non-Current Liabilities</strong></p>
            <ul className='ul-balancesheet' style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400", fontSize:"16px", color:"#262626"}}>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(a) Long-Term Loan <span><input type="number" name='longtermLoan' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>(b) Lease Liabilities <span><input type="number" name='lease' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
               <div className="total-row-balancesheet" style={{borderBottom:"1px solid grey",backgroundColor:"transparent",fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>Total Non-Current Liabilites - <span>₹{totalNonCurrentLiabilities
                
                }</span></div>
            </ul>
          </div>
          <div className="total-row-balancesheet" style={{fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>Total Liabilities - <span>₹{totalLiabilities}</span></div>
        </div>

        <div className="boxbalancesheet">
          <h3 style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400",fontSize:"16px", color:"#262626"}}>Equity</h3>
          <div className="section-balancesheet">
            <ul className='ul-balancesheet' style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400", fontSize:"16px", color:"#262626"}}>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>1. Capital Invested <span><input type="number" name='capital' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>2. Retained Earnings / Reserves <span><input type="number" name='retainedEarnings' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
              <li className='li-balancesheet' style={{borderBottom:"1px solid #E6E6E6"}}>3. Withdrawal <span><input type="number" name='withdrawl' onChange={handleInputChange} placeholder='---' style={{textAlign:"right",border:"none", outline:"none",  backgroundColor: "transparent"}}/></span></li>
            </ul>
          </div>
          <div className="total-row-balancesheet" style={{fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"16px", color:"#262626"}}>Total Equity - <span>₹{totalequities}</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className='d-flex flex-column gap-4'>
      {/* Date Input */}
       <div style={{ position: "relative", fontFamily: "Arial" }}>
            <div
              onClick={toggleCalendar}
              style={{
                border: "1px solid #E6E6E6",
                borderRadius: "8px",
                padding: "10px 12px",
                width: "250px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                backgroundColor: "white"
              }}
            >
              <span style={{ fontSize: "14px", color: "#333" }}>
                {format(range[0].startDate, "dd/MM/yyyy")} -{" "}
                {format(range[0].endDate, "dd/MM/yyyy")}
              </span>
              <img src={calendarIcon} alt="calendar" style={{ width: "18px", height: "18px" }} />
            </div>
      
            {showCalendar && (
              <div style={{ position: "absolute", zIndex: 999, marginTop: "10px", }}>
                <DateRange
                  editableDateInputs={true}
                  onChange={handleChange}
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                  rangeColors={["#1368EC"]}
                />
              </div>
            )}
          </div>

      {/* Balance Sheet Header & Controls */}
      <div className="balance-content" style={{
        backgroundColor: "white",
        border: "1px solid #E6E6E6",
        borderRadius: "8px",
        // padding: "10px 16px"
      }}>
        <div className="balansheet-button-content" style={{borderBottom:"1px solid #E6E6E6"}}>
            <div className='d-flex justify-content-between align-items-center' style={{padding:"16px 16px"}}>
              <span style={{ color: "#262626", fontWeight: "500", fontSize: "18px", fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"18px"}}>
            Balance sheet
          </span>

          <div className='d-flex align-items-center gap-3' >
            <button
              className={`portrait-btn ${view === "portrait" ? "active" : ""}`}
              onClick={() => setView("portrait")}
              style={{
                border: "1px solid #676767",
                borderRadius: "4px",
                width: "25px",
                height: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3px"
              }}
            >
              <img src={balancesheet_y} alt="portrait" />
            </button>

            <button
              className={`landscape-btn ${view === "landscape" ? "active" : ""}`}
              onClick={() => setView("landscape")}
              style={{
                border: "1px solid #676767",
                borderRadius: "4px",
                width: "25px",
                height: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3px"
              }}
            >
              <img src={balancesheet_x} alt="landscape" />
            </button>

            <button 
             onClick={handleDownload}
            style={{
              backgroundColor: '#1368EC',
              color: "white",
              borderRadius: "4px",
              border: "none",
              padding: "5px 10px",
              fontFamily:'"Roboto", sans-serif',
              fontWeight:"400",
              fontSize:"16px"
            }}>
              Download
            </button>
             
          </div>
            </div>
        </div>

        {/* Only one layout rendered based on view */}
        <div className={`sheet ${view}`} ref={sheetRef}>
          {renderTable()}
        </div>
      </div>
      
    </div>
      </div>
    </div>
  );
}

export default BalanceSheet;

