import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/config";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const ActivityLog = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [saleLogs, setSaleLogs] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");
  const [showDropdown, setShowDropdown] = useState(false);


  const fetchAuditUserData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/audit-logs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userLogs = res.data.filter((user) => user.module?.toLowerCase() === "user");
      setUsers(userLogs);
      console.log('ussesss', userLogs)
    } catch (error) {
      console.error("failed to fetch user audit data", error)
    }
  }
  useEffect(() => {
    fetchAuditUserData();
  }, []);
  // handle search and filter
  useEffect(() => {
    let filtered = logs;
    if (filterAction !== "ALL") {
      filtered = filtered.filter((log) => log.action === filterAction);
    }
    if (searchTerm) {
      filtered = filtered.filter((log) => log.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    setUsers(filtered);
  }, [searchTerm, filterAction, logs, setUsers]);

  // download CSV
  const handleDownloadCSV = () => {
    const csvRows = [];
    const headers = [
      "User",
      "Action",
      "Module",
      "Record ID",
      "IP Address",
      "Timestamp",
      "Description"
    ];
    csvRows.push(headers.join(","));
    logs.forEach((log) => {
      const row = [
        log.userId?.firstName || "",
        log.action || "",
        log.module || "",
        log.newData?._id || log.oldData?._id || "",
        log.ipAddress || "",
        new Date(log.createdAt).toLocaleString(),
        `"${log.description || ""}"`,
      ];
      csvRows.push(row.join(","))
    })
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_logs.csv";
    a.click();
  }

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productLogs = res.data.filter((log) => log.module === "Product");
      setLogs(productLogs);
      console.log("auditdata fetched", productLogs);
    } catch (error) {
      console.error("failed to fetch audit data", error);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  // for sale
  const fetchSaleAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //Filter only Sales modulle logs
      const salesLogs = res.data.filter((log) => log.module === "Sales");
      setSaleLogs(salesLogs);
      console.log('salelogfc', salesLogs)
    } catch (error) {
      console.eror("Error fetching sales logs:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSaleAuditLogs();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content">
        <h4 className="fw-bold">Audit Trail</h4>
        <p>You can check and view the changes trail here</p>
        <div style={{ width: "100%", background: '#ffff', display: 'flex', alignItems: 'center', gap: "15px", padding: "10px 15px", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              // flex: 1,
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "8px 10px",
              fontSize: "14px"
            }}
          />
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "8px 12px",
                background: "#fff",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {filterAction}<MdOutlineKeyboardArrowDown />
            </button>
            {showDropdown && (
              <div
                style={{ position: "absolute", top: "40px", left: 0, background: "#fff", border: "1px solid #ddd", borderRadius: "5px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", zIndex: 10 }}>
                {["ALL", "CREATE", "UPDATE", "DELETE"].map((action) => (
                  <div
                    key={action}
                    onClick={() => {
                      setFilterAction(action);
                      setShowDropdown(false)
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      background: filterAction === action ? "#f0f0f0" : "#fff"
                    }}
                  >
                    {action}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleDownloadCSV} style={{ padding: "8px 14px", border: "none", borderRadius: "5px", background: "#007cff", color: "white", fontSize: '14px', fontWeight: "500", cursor: "pointer" }}>Download CSV</button></div>
        <h4 className="fw-bold mb-3">User</h4>
        <div className="card">
          <div className="card-body p-0">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
              <div className="table-responsive">
                <table className="table datatable text-center align-middle">
                  <thead className="thead-light text-center">
                    <tr>
                      <th>User</th>
                      <th>Action</th>
                      <th>Module</th>
                      <th>Record ID</th>
                      <th>Timestamp</th>
                      <th>IP Address</th>
                      <th>User Agent</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((log) => {
                      const isExpanded = expandedRow === log._id;
                      return (
                        <React.Fragment key={log._id}>
                          <tr>
                            <td>{log.userId.firstName}</td>
                            <td>{log.action}</td>
                            <td>{log.module}</td>
                            <td>{log.newData?._id || log.oldData?._id || "N/A"}</td>
                            <td>
                              {log.createdAt
                                ? new Date(log.createdAt).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                                : "-"}
                            </td>
                            <td>{log.ipAddress || "-"}</td>
                            <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>{log.device || "-"}</td>
                            <td>
                              <button className="btn btn-sm btn-light border" onClick={() => setExpandedRow(isExpanded ? null : log._id)}>
                                {isExpanded ? "Hide" : "view"}
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan="8" style={{ background: "#f9f9f9", textAlign: "left" }}>
                                <div style={{ display: "flex", gap: "20px", padding: "10px" }}>
                                  <div style={{ flex: 1 }}>
                                    <h6 className="text-danger fw-bold mb-2">Old Data</h6>
                                    <pre
                                      style={{
                                        background: "#fee",
                                        borderRadius: "5px",
                                        padding: "10px",
                                        maxHeight: "300px",
                                        overflow: "auto",
                                        fontSize: "13px"
                                      }}
                                    >
                                      {log.oldData ? JSON.stringify(log.oldData, null, 2) : "No previous data"}
                                    </pre>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <h6 className="text-success fw-bold mb-2">New Data</h6>
                                    <pre
                                      style={{
                                        background: "#e8f5e9",
                                        borderRadius: "5px",
                                        padding: "10px",
                                        maxHeight: "300px",
                                        overflow: "auto",
                                        fontSize: "13px",
                                      }}
                                    >
                                      {JSON.stringify(log.newData, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
        {/* product */}
        <h4 className="fw-bold mb-3">Activity </h4>
        <div className="card">
          <div className="card-body p-0">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
              <div className="table-responsive">
                <table className="table datatable text-center align-middle">
                  <thead className="thead-light text-center">
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Module</th>
                      <th>Product</th>
                      <th>Action</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id}>
                        <td>{log.userId.firstName}</td>
                        <td>{log.userId.role.roleName}</td>
                        <td>{log.module}</td>
                        {/* <td>{log.newData.productName}</td> */}
                        <td>
                          {log.newData?.productName ||
                            log.oldData?.productName ||
                            "-"}
                        </td>
                        <td>{log.action}</td>
                        <td>
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <h4 className="fw-bold mb-3">Sale</h4>
        <div className="card">
          <div className="card-body p-0">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
              <div className="table-responsive">
                <table className="table datatable text-center align-middle">
                  <thead className="thead-light text-center">
                    <tr>
                      <th>Customer</th>
                      <th>Reference No</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Module</th>
                      <th>Action</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleLogs.length > 0 ? (
                      saleLogs.map((log) => (
                        <tr key={log._id}>
                          <td>{log.customerName}</td>
                          <td>{log.newData?.referenceNumber}</td>
                          <td>
                            {log.productDetails[0]?.productName ||
                              log.productDetails[0]?.productName ||
                              "-"}
                          </td>
                          <td>{log.newData?.products[0]?.saleQty}</td>
                          <td>{log.newData?.products[0]?.sellingPrice}</td>
                          <td>{log.module}</td>
                          <td>{log.action}</td>
                          <td>
                            {log.createdAt
                              ? new Date(log.createdAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })
                              : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9">
                          {loading ? "Loading..." : "No Sales Activity Found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* purchase */}
        <h4 className="fw-bold mb-3">Purchase</h4>
        <div className="card">
          <div className="card-body p-0">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
              <div className="table-responsive">
                <table className="table datatable text-center align-middle">
                  <thead className="thead-light text-center">
                    <tr>
                      <th>Customer</th>
                      <th>Reference No</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Module</th>
                      <th>Action</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleLogs.length > 0 ? (
                      saleLogs.map((log) => (
                        <tr key={log._id}>
                          <td>{log.customerName}</td>
                          <td>{log.newData?.referenceNumber}</td>
                          <td>
                            {log.productDetails[0]?.productName ||
                              log.productDetails[0]?.productName ||
                              "-"}
                          </td>
                          <td>{log.newData?.products[0]?.saleQty}</td>
                          <td>{log.newData?.products[0]?.sellingPrice}</td>
                          <td>{log.module}</td>
                          <td>{log.action}</td>
                          <td>
                            {log.createdAt
                              ? new Date(log.createdAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })
                              : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9">
                          {loading ? "Loading..." : "No Sales Activity Found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
