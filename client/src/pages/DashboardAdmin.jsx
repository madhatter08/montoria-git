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
          Dashboard Admin: {userData ? userData.roleData.name : "Admin"}
        </h1>

        {/* Section 1: Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
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

        {/* Section 2: Charts */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            <div className="bg-white rounded-lg shadow-md p-4">
              <LineChartSample />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <PieChartSample />
            </div>
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
              <BarChartSample />
            </div>
          </div>
        </div>

        {/* Section 3: Calendar */}
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

export default DashboardAdmin;