import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ExpenseReportProductModal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // query param se file read karo
  const queryParams = new URLSearchParams(location.search);
  const fileUrl = queryParams.get("file");

  if (!fileUrl) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2>No Receipt Found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
  
      }}
    >
      <div style={{ width: "100%", height: "95%", position: "relative" ,display:"flex", justifyContent:"center"}}>
        {isPdf ? (
          <iframe
            src={`${fileUrl}#zoom=100`} // 👈 PDF ko 100% zoom (actual/original size)
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{
              border: "none",
              borderRadius: "8px",
              background: "#fff",
            }}
          />
        ) : (
          <img
            src={fileUrl}
            alt="Receipt"
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              borderRadius: "8px",
              
            }}
          />
        )}

      
      </div>
    </div>
  );
};

export default ExpenseReportProductModal;
