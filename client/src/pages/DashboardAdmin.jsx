//import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import AdminNavbar from '../components/AdminNavbar'

const DashboardAdmin = () => {
  const { userData } = useContext(AppContext);
  return (
    <div className='flex flex-col items-center justify-items-stretch min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <AdminNavbar />
      <div>Dashboard Admin: {userData ? userData.roleData.name : "Admin"}</div>
    </div>
  );
}

export default DashboardAdmin