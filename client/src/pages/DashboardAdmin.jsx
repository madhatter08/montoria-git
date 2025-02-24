//import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import NavbarUser from '../components/NavbarUser'
import Scheduler from '../components/Calendar'
import { assets } from "../assets/assets";

const DashboardAdmin = () => {
  const { userData } = useContext(AppContext);
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        background: "radial-gradient(circle at top center, #A78BFA 10%, #ffb3dd 70%, #fff 95%)",
        backgroundRepeat: "repeat",
      }}
    >
      <NavbarUser />
      <div>Dashboard Admin: {userData ? userData.roleData.name : "Admin"}</div>
      <Scheduler />

    </div>
  );
}

export default DashboardAdmin;