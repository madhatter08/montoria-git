import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import NavbarDb from "../components/NavbarDb";
const DashboardStudent = () => {
  const { userData } = useContext(AppContext);
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <NavbarDb />
      <div>Dashboard Student: {userData ? userData.roleData.firstName : "Student"}</div>
    </div>
  );
};

export default DashboardStudent;
