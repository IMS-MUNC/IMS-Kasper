import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from "../SideBar/Sidebar"


const MailPage = () => {
  return (
    // <div style={{ display: 'flex', width: '100%', gap: '15px' }}>
    <div className="page-wrapper" >
      <div className="content"
        style={{
          display: "flex",
          width: "100%",
          gap: "15px",
          flexDirection: "row",
          flexWrap: "nowrap",
          transition: "all 0.3s ease",
        }}
      >
        <Sidebar />
        <Outlet />
      </div>
    </div>
    // </div>
  )
}

export default MailPage;
