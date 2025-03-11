import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import NavbarUser from "../components/NavbarUser";
import Scheduler from "../components/Calendar";
import { motion } from "framer-motion";
import StatCard from "../components/charts/StatCard";
import LineChartSample from "../components/charts/LineChart";
import PieChartSample from "../components/charts/PieChart";
import BarChartSample from "../components/charts/BarChart";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";

const DashboardAdmin = () => {
  const { userData } = useContext(AppContext);

  return (
    <div
      className="flex flex-col min-h-[140vh] bg-cover bg-center w-full"
      style={{
        background:
          "radial-gradient(circle at top center, #4A154B 10%, #4A154B 70%, #fff 95%)",
        backgroundRepeat: "repeat",
      }}
    >
      <NavbarUser />

      {/* Full-screen content */}
      <div className="flex-1 w-full px-4 lg:px-8 pt-20 mt-15">
        

        {/* Two-column layout for Stats, Charts, and Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full h-full">
          {/* Left Column: Stats and Charts */}
          <div className="flex flex-col gap-8 h-full">
            {/* Section 1: Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <StatCard
                  name="Students"
                  icon={Zap}
                  value="150"
                  color="#6366F1"
                  bgColor="bg-pink-300"
                />
                <StatCard
                  name="Guides"
                  icon={Users}
                  value="25"
                  color="#8B5CF6"
                  bgColor="bg-orange-300"
                />
                <StatCard
                  name="Classes"
                  icon={ShoppingBag}
                  value="10"
                  color="#EC4899"
                  bgColor="bg-green-300"
                />
                <StatCard
                  name="Active Accounts"
                  icon={BarChart2}
                  value="97%"
                  color="#10B981"
                  bgColor="bg-indigo-300"
                />
              </motion.div>
            </div>

            {/* Section 2: Academic Proficiency (Bar Chart) */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
              <div className="w-full h-full">
                <BarChartSample />
              </div>
            </div>

            {/* Section 3: Students Pie Chart and Lesson Mastery Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="w-full h-64"> {/* Fixed height for square size */}
                  <PieChartSample />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 h-120">
                
                <div className="w-full h-64"> {/* Fixed height for square size */}
                  <LineChartSample />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calendar */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-full">
          <h1 className="text-2xl font-semibold text-gray-900 text-left mb-6">
          {userData ? userData.roleData.name : "Admin"} Calendar
        </h1>
            <div className="w-full h-full">
              <Scheduler />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;