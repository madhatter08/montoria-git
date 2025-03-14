import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import NavbarUser from "../components/NavbarUser";
import Calendar from "../components/Calendar";
import BarChartSample from "../components/charts/BarChart";
import ReportForm from "../Forms/ReportForm";
import ReportGraph from "../components/charts/ReportGraph";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";

const DashboardGuide = () => {
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

  const handleReportGenerated = (prompt) => {
    fetchReportData(prompt);
  };

  const exportGraphToPDF = async () => {
    const graphElement = document.getElementById("report-graph");
    if (!graphElement) return;

    const canvas = await html2canvas(graphElement, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const maxPdfHeight = pdf.internal.pageSize.getHeight();
    const finalHeight = Math.min(pdfHeight, maxPdfHeight);

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
    pdf.save("report-graph.pdf");
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!userData || userData.role !== "guide") {
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
      className="flex flex-col h-420 pt-20 bg-cover bg-center w-full"
      style={{
        background: "radial-gradient(circle at top center, #4A154B 10%, #4A154B 70%, #4A154B 95%)",
        backgroundRepeat: "repeat",
      }}
    >
      <NavbarUser />
      <div className="flex-1 w-full px-2 md:px-4 lg:px-6 pt-20 pb-8">
        <div className="w-full">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Section: Bar Chart, Report Graph, and Report Form */}
            <div className="flex flex-col gap-4">
              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6 h-[480px]">
                <div className="w-full h-full">
                  <BarChartSample />
                </div>
              </div>

              {/* Report Graph */}
              <div className="bg-white rounded-lg shadow-lg p-6 h-[400px] relative">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Report Graph</h2>
                <div id="report-graph" className="w-full h-[calc(100%-3rem)] relative">
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

              {/* Report Form */}
              <div className="bg-white rounded-lg shadow-lg p-6 h-[540px]">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Report</h2>
                <div className="w-full h-[calc(100%-3rem)]">
                  <ReportForm onReportGenerated={handleReportGenerated} />
                </div>
              </div>
            </div>

            {/* Right Section: Calendar */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-lg shadow-lg p-6 h-[calc(835px+400px+200px+1rem)]">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {userData.adminData?.name || "Admin"} Calendar
                </h2>
                <div className="w-full h-[calc(100%-3rem)]">
                  <Calendar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGuide;