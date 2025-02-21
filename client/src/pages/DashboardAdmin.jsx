//import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import NavbarDb from '../components/NavbarDb'

const DashboardAdmin = () => {
  const { userData } = useContext(AppContext);
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <NavbarDb />
      <div>Dashboard Admin: {userData ? userData.roleData.name : "Admin"}</div>
    </div>
  );
}

export default DashboardAdmin