import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/config";

const ActivityLog = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [logs, setLogs] = useState([]);
  const [saleLogs, setSaleLogs] = useState([]);

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
      console.log("failed to fetch audit data");
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
        <h4 className="fw-bold mb-3">Activity </h4>
        <div className="card">
          <div className="card-body p-0">
            <div style={{display:'flex', flexDirection:'column', gap:'100px'}}>
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
            <div style={{display:'flex', flexDirection:'column', gap:'100px'}}>
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
            <div style={{display:'flex', flexDirection:'column', gap:'100px'}}>
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
