// client/src/pages/DashboardAdmin.jsx
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import NavbarUser from "../components/NavbarUser";
import Calendar from "../components/Calendar";
import { motion } from "framer-motion";
import StatCard from "../components/charts/StatCard";
import LineChartSample from "../components/charts/LineChart";
import PieChartSample from "../components/charts/PieChart";
import BarChartSample from "../components/charts/BarChart";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import ReportForm from "../Forms/ReportForm";
import ReportGraph from "../components/charts/ReportGraph";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";

const DashboardAdmin = () => {
  const { userData, backendUrl, loading } = useContext(AppContext);
  const [reportData, setReportData] = useState(null);
  const [graphType, setGraphType] = useState("bar");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    students: [],
    admin: [],
    guide: [],
    admission: [],
    classesCount: 0,
    activeAccounts: "0%",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/all`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        console.log("Fetch users response:", res.data);
        if (res.data.success) {
          const users = res.data.users;
          const students = users.filter((user) => user.role === "student");
          const admin = users.filter((user) => user.role === "admin");
          const guide = users.filter((user) => user.role === "guide");

          const allClasses = [
            ...new Set([
              ...students.map((s) => s.studentData?.class).filter(Boolean),
              ...guide.map((g) => g.guideData?.class).filter(Boolean),
            ]),
          ];

          const totalAccounts = users.length;
          const activeAccounts = users.filter((user) => user.isActive).length;
          const activePercentage =
            totalAccounts > 0
              ? ((activeAccounts / totalAccounts) * 100).toFixed(0) + "%"
              : "0%";

          setData({
            students,
            admin,
            guide,
            admission: [],
            classesCount: allClasses.length,
            activeAccounts: activePercentage,
          });
        } else {
          console.error("Failed to fetch users:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err.response?.data || err);
      }
    };

    if (userData?.role === "admin") fetchUsers();
  }, [backendUrl, userData]);

  const fetchReportData = async (prompt) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/reports/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt }),
      });
      const result = await response.json();
      console.log("Fetch report response:", result);
      if (result.success) {
        setGraphType(result.data.graphType);
        setReportData(result.data.data);
      } else {
        console.error("Failed to fetch report:", result.message);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle report generation from ReportForm
  const handleReportGenerated = (prompt) => {
    fetchReportData(prompt);
  };

  // Export only the Report Graph Display section to PDF
  const exportGraphToPDF = async () => {
    const graphElement = document.getElementById("report-graph");
    if (!graphElement) return;

    // Capture only the graph section
    const canvas = await html2canvas(graphElement, {
      scale: 2, // Increase resolution for better quality
      useCORS: true, // Handle cross-origin images if any
    });
    const imgData = canvas.toDataURL("image/png");

    // Create a new PDF with dimensions based on the graph element
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Ensure the PDF height doesn't exceed A4 height (297mm), adjust if needed
    const maxPdfHeight = pdf.internal.pageSize.getHeight();
    const finalHeight = Math.min(pdfHeight, maxPdfHeight);

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
    pdf.save("report-graph.pdf");
  };

  console.log("DashboardAdmin userData.role:", userData?.role);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!userData || userData.role !== "admin") {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">
          {userData ? "Not available: Admin access only." : "Please log in to access the admin dashboard."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-[200vh] bg-cover bg-center w-full"
      style={{
        background: "radial-gradient(circle at top center, #4A154B 10%, #4A154B 70%, #fff 95%)",
        backgroundRepeat: "repeat",
      }}
    >
      <NavbarUser />
      <div className="flex-1 w-full px-4 lg:px-8 pt-20 mt-15">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full h-full">
          <div className="flex flex-col gap-8 h-full">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <StatCard name="Students" icon={Zap} value={data.students.length} color="#6366F1" bgColor="bg-pink-300" />
                <StatCard name="Guides" icon={Users} value={data.guide.length} color="#8B5CF6" bgColor="bg-orange-300" />
                <StatCard name="Classes" icon={ShoppingBag} value={data.classesCount} color="#EC4899" bgColor="bg-green-300" />
                <StatCard name="Active Accounts" icon={BarChart2} value={data.activeAccounts} color="#10B981" bgColor="bg-indigo-300" />
              </motion.div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
              <div className="w-full h-full">
                <BarChartSample />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="w-full h-64">
                  <PieChartSample studentData={data.students} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 h-120">
                <div className="w-full h-64">
                  <LineChartSample />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            <h1 className="text-2xl font-semibold text-gray-900 text-left mb-6">
              {userData.adminData?.name || "Admin"} Calendar
            </h1>
            <div className="w-full h-full">
              <Calendar />
            </div>
          </div>
        </div>

        {/* Bottom Section: Report Form and Graph Display */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Report Form (1/4 width on large screens) */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <ReportForm onReportGenerated={handleReportGenerated} />
          </div>

          {/* Graph Display (3/4 width on large screens) */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Graph</h2>
            <div id="report-graph" className="w-full h-96 relative">
              {reportData && (
                <button
                  onClick={exportGraphToPDF}
                  className="absolute top-0 right-0 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 z-10"
                >
                  Export PDF
                </button>
              )}
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="text-lg">Loading report...</p>
                </div>
              ) : reportData ? (
                <ReportGraph data={reportData} graphType={graphType} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="text-lg">Generate a report to see the graph here...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;