import React from 'react'
import Sidebar from '../components/SideBar/Sidebar'
import { Outlet } from 'react-router-dom'

const MailPage = () => {
  return (
    <div >
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default MailPage;
