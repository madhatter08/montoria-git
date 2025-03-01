import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import NavbarUser from "../components/NavbarUser";
import Scheduler from "../components/Calendar";
import BarChartSample from "../components/charts/BarChart";

const DashboardGuide = () => {
  const { userData } = useContext(AppContext);

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-cover bg-center w-full"
      style={{
        background:
          "radial-gradient(circle at top center, #A78BFA 10%, #ffb3dd 70%, #fff 95%)",
        backgroundRepeat: "repeat",
      }}
    >
      <NavbarUser />

      {/* Ensure content is below Navbar */}
      <div className="w-full max-w-7xl px-4 lg:px-8 pt-20">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Dashboard Guide: {userData ? userData.roleData.firstName : "Guide"}
        </h1>

        {/* Section 1: Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics</h2>
          <div className="w-full">
            <BarChartSample />
          </div>
        </div>

        {/* Section 2: Calendar */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Calendar</h2>
          <div className="w-full">
            <Scheduler />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGuide;