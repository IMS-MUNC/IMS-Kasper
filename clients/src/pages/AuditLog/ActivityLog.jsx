import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/config";

const ActivityLog = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [logs, setLogs] = useState([]);

  const fetchAuditData = async () => {
    setLoading(true);
    try {
        const res = await axios.get(`${BASE_URL}/api/audit-logs`, {
            headers:{Authorization:`Bearer ${token}`}
        });
        setLogs(res.data);
        console.log('auditdata fetched', res.data)
    }catch(error) {
        console.log("failed to fetch audit data")
    }
  }

  useEffect(() => {
    fetchAuditData();
  },[]);
  
  return (
    <div className="page-wrapper">
      <div className="content">
        <h4 className="fw-bold mb-3">Activity </h4>
          <div className="card">
            <div className="card-body p-0">
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
      {log.newData?.productName || log.oldData?.productName || "-"}
    </td>
                        <td>{log.action}</td>
                        <td>{log.createdAt ? new Date(log.createdAt).toLocaleDateString() : '-'}</td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>
    </div>
    
  );
};

export default ActivityLog;
