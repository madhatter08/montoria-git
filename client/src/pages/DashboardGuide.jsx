import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import NavbarDb from "../components/NavbarDb";

const DashboardGuide = () => {
  const { userData } = useContext(AppContext);
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <NavbarDb />
      <div>Dashboard Guide: {userData ? userData.roleData.firstName : "Guide"}</div>
    </div>
  );
};

export default DashboardGuide;
