import React from 'react'
import Sidebar from '../components/SideBar/Sidebar'
import { Outlet } from 'react-router-dom'

const MailPage = () => {
  return (
    <div className='page-wrapper' style={{ display: 'flex', width: '100%' }}>
      <div className="content">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default MailPage;
