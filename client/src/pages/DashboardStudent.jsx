import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import NavbarUser from "../components/NavbarUser";

const DashboardStudent = () => {
  const { userData } = useContext(AppContext);
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <NavbarUser />
      <div>Dashboard Student: {userData ? userData.roleData.firstName : "Student"}</div>
    </div>
  );
};

export default DashboardStudent;
