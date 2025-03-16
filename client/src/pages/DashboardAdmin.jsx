import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import NavbarUser from "../components/NavbarUser";
import Calendar from "../components/Calendar";
import { motion } from "framer-motion";
import StatCard from "../components/charts/StatCard";
import PieChartSample from "../components/charts/PieChart";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import { Bar as ChartJSBar, Line as ChartJSLine, Pie as ChartJSPie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  ChartTooltip,
  ChartLegend
);

// Colors for bar graph categories
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B"];

// BarChartSample Component
const BarChartSample = ({ students, progress, classes, selectedClass, setSelectedClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [classData, setClassData] = useState({});

  const calculateSPP = (studentId) => {
    const studentProgress = progress[studentId] || {};
    const lessons = Object.values(studentProgress);
    
    if (lessons.length === 0) return 0;

    const lessonSPPs = lessons.map((lesson) => {
      const ME = lesson.mastered ? 1 : 0;
      const PL = lesson.practiced || 0;
      const OP = (lesson.practiced || 0) >= 8 ? 1 : 0;
      const lessonSPP = PL === 0 ? (ME * 100) : (ME / (PL + OP)) * 100;
      return isNaN(lessonSPP) || lessonSPP < 0 ? 0 : lessonSPP;
    });

    const totalSPP = lessonSPPs.reduce((sum, spp) => sum + spp, 0) / lessons.length;
    return isNaN(totalSPP) ? 0 : totalSPP;
  };

  const categorizeStudent = (spp) => {
    if (spp >= 90) return "Advanced";
    if (spp >= 75) return "Proficient";
    if (spp >= 50) return "Developing";
    return "Needs Attention";
  };

  useEffect(() => {
    console.log("Students data:", students);
    const newClassData = {};

    classes.forEach((cls) => {
      const classStudents = students.filter((student) => student.studentData?.class === cls);
      console.log(`Students in class ${cls}:`, classStudents);
      const distribution = {
        Advanced: 0,
        Proficient: 0,
        Developing: 0,
        "Needs Attention": 0,
      };

      classStudents.forEach((student) => {
        const spp = calculateSPP(student._id);
        const category = categorizeStudent(spp);
        distribution[category]++;
      });

      newClassData[cls] = Object.entries(distribution).map(([name, value]) => ({
        name,
        value,
      }));
    });

    setClassData(newClassData);
  }, [students, progress, classes]);

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    setIsOpen(false);
  };

  const currentData = classData[selectedClass] || [];

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 w-full h-full border border-gray-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          ACADEMIC PROFICIENCY
        </h2>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#4A154B] text-white px-4 py-2 rounded-lg hover:bg-purple-900 transition-colors duration-200 focus:outline-none"
          >
            {selectedClass || "Select Class"}
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
              {classes.map((className) => (
                <button
                  key={className}
                  onClick={() => handleClassSelect(className)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 focus:outline-none"
                >
                  {className}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" label={{ value: "Number of Students", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value, name) => [`${value} students`, name]}
            />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {currentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// LineChartSample Component
const LineChartSample = ({ progress }) => {
  const calculateMasteryData = () => {
    const masteryByMonth = {};

    Object.values(progress).forEach((studentProgress) => {
      Object.values(studentProgress).forEach((lesson) => {
        if (lesson.mastered && lesson.date) {
          const date = new Date(lesson.date);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const key = `${month} ${year}`;

          masteryByMonth[key] = (masteryByMonth[key] || 0) + 1;
        }
      });
    });

    const masteryData = Object.entries(masteryByMonth)
      .map(([name, mastered]) => ({ name, mastered }))
      .sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA - dateB;
      });

    return masteryData;
  };

  const masteryData = calculateMasteryData();

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-bold mb-4 text-gray-900">LESSON MASTERY</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={masteryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" label={{ value: "Mastered Lessons", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value) => [`${value} lessons`, "Mastered"]}
            />
            <Line
              type="monotone"
              dataKey="mastered"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// ReportForm Component
const ReportForm = ({ onReportGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [graphType, setGraphType] = useState("bar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/reports/generate",
        { prompt, graphType },
        { withCredentials: true }
      );

      if (response.data.success) {
        onReportGenerated({ graphType, data: response.data.data });
      } else {
        setError(response.data.message || "No data returned from the server.");
        onReportGenerated(null);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setError("Failed to generate report. Please try again.");
      onReportGenerated(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-lg font-medium text-gray-800">Report Request</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Show me a progress overview for Casa 3 in Quarter 2"
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-800">Graph Type</label>
        <select
          value={graphType}
          onChange={(e) => setGraphType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-[#4A154B] text-white py-3 rounded-lg hover:bg-purple-900 disabled:bg-blue-300"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

// ReportGraph Component
const ReportGraph = ({ data, graphType }) => {
  if (!data || !data.labels || !data.datasets) {
    return <div>No valid data to display</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Generated Report" },
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: data.datasets,
  };

  switch (graphType) {
    case "bar":
      return <ChartJSBar data={chartData} options={options} />;
    case "line":
      return <ChartJSLine data={chartData} options={options} />;
    case "pie":
      return <ChartJSPie data={chartData} options={options} />;
    default:
      return <div>Unsupported graph type</div>;
  }
};

// Main DashboardAdmin Component
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
  const [progress, setProgress] = useState({});
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    const fetchUsersAndProgress = async () => {
      try {
        const userRes = await axios.get(`${backendUrl}/api/user/all`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        console.log("Fetch users response:", userRes.data);
        if (userRes.data.success) {
          const users = userRes.data.users;
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
          setClasses(allClasses);
        } else {
          console.error("Failed to fetch users:", userRes.data.message);
        }

        const progressRes = await axios.get(`${backendUrl}/api/school/class-list`, {
          withCredentials: true,
        });

        if (progressRes.status === 200 && progressRes.data.success) {
          const studentsData = progressRes.data.students;
          const initialProgress = {};

          studentsData.forEach((student) => {
            initialProgress[student._id] = {};

            student.studentData.lessons.forEach((lesson, index) => {
              const presented = lesson.subwork.some(
                (sub) => sub.status === "presented" || sub.status === "practiced" || sub.status === "mastered"
              ) || true;
              const mastered = lesson.subwork.some((sub) => sub.status === "mastered");
              const totalPractices = lesson.subwork.reduce(
                (sum, sub) => sum + (sub.practicedCount || 0),
                0
              );

              initialProgress[student._id][index] = {
                presented: presented ? 1 : 0,
                practiced: totalPractices,
                mastered: mastered ? 1 : 0,
                remarks: lesson.remarks || "",
                expanded: false,
                subRows: lesson.subwork.map((sub, subIndex) => ({
                  presented: sub.status === "presented" || sub.status === "practiced" || sub.status === "mastered",
                  practiced: sub.practicedCount || 0,
                  mastered: sub.status === "mastered",
                  date: sub.status_date ? new Date(sub.status_date).toLocaleDateString() : "",
                  subwork_name: `Day ${subIndex + 1}: ${lesson.lesson_work}`,
                  updatedBy: sub.updatedBy,
                })),
                date: lesson.start_date ? new Date(lesson.start_date).toLocaleDateString() : "",
              };
            });
          });

          setProgress(initialProgress);
        } else {
          console.error("Failed to fetch student progress:", progressRes.data.message);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err.response?.data || err);
      }
    };

    if (userData?.role === "admin") fetchUsersAndProgress();
  }, [backendUrl, userData]);

  const fetchReportData = async ({ prompt, graphType }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/reports/generate`,
        { prompt, graphType },
        { withCredentials: true }
      );
      if (response.data.success) {
        setGraphType(graphType);
        setReportData(response.data.data);
      } else {
        console.error("Failed to fetch report:", response.data.message);
        setReportData(null);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportGenerated = (data) => {
    fetchReportData(data);
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
                <BarChartSample
                  students={data.students}
                  progress={progress}
                  classes={classes}
                  selectedClass={selectedClass}
                  setSelectedClass={setSelectedClass}
                />
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
                  <LineChartSample progress={progress} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 h-350">
            <h1 className="text-2xl font-semibold text-gray-900 text-left mb-6">
              {userData.adminData?.name || "Admin"} Calendar
            </h1>
            <div className="w-full h-full">
              <Calendar />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <ReportForm onReportGenerated={handleReportGenerated} />
          </div>
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