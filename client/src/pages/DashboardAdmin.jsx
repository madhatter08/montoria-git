import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import NavbarUser from '../components/NavbarUser';
import Scheduler from '../components/Calendar';
import { motion } from "framer-motion";
import StatCard from '../components/charts/StatCard';
import LineChartSample from '../components/charts/LineChart';
import PieChartSample from '../components/charts/PieChart';
import BarChartSample from '../components/charts/BarChart';
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

        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
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

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <div className="w-full">
            <LineChartSample />
          </div>
          <div className="w-full">
            <PieChartSample />
          </div>
          <div className="lg:col-span-2 w-full">
            <BarChartSample />
          </div>
        </div>

        {/* Scheduler */}
        <div className="mt-10 w-full flex justify-center">
          <div className="w-full max-w-6xl">
            <Scheduler />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
