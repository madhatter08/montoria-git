import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import NavbarUser from "../components/NavbarUser";
import Scheduler from "../components/Calendar";
import { assets } from "../assets/assets";

const DashboardGuide = () => {
  const { userData } = useContext(AppContext);
  return (
    <div
          className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
          style={{
            backgroundImage: `url(${assets.background})`,
            backgroundRepeat: "repeat",
          }}
        >
      <NavbarUser />
      <div>Dashboard Guide: {userData ? userData.roleData.firstName : "Guide"}</div>
      <Scheduler />
    </div>
  );
};

export default DashboardGuide;
