import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "recharts";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B"];

const BarChartSample = ({ students = [], progress = {}, classes = [] }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [classData, setClassData] = useState({});

  const calculateSPP = (studentId) => {
    const studentProgress = progress[studentId] || {};
    const lessons = Object.values(studentProgress);

    if (lessons.length === 0) return 0;

    const lessonSPPs = lessons.map((lesson) => {
      const ME = lesson.mastered ? 1 : 0;
      const PL = lesson.practiced ? 1 : 0;
      const OP =
        lesson.subRows.filter((sub) => sub.practiced).length >= 8 ? 1 : 0;
      const lessonSPP = PL === 0 ? ME * 100 : (ME / (PL + OP)) * 100;
      return isNaN(lessonSPP) || lessonSPP < 0 ? 0 : lessonSPP;
    });

    const totalSPP =
      lessonSPPs.reduce((sum, spp) => sum + spp, 0) / lessons.length;
    return isNaN(totalSPP) ? 0 : totalSPP;
  };

  const categorizeStudent = (spp) => {
    if (spp >= 90) return "Advanced";
    if (spp >= 75) return "Proficient";
    if (spp >= 50) return "Developing";
    return "Needs Attention";
  };

  useEffect(() => {
    const newClassData = {};
    if (Array.isArray(classes)) {
      classes.forEach((cls) => {
        const classStudents = students.filter((student) => student.studentData?.class === cls);
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
    }
    setClassData(newClassData);
    console.log("Class data calculated:", newClassData); // Debug
  }, [students, progress, classes]);

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    setIsOpen(false);
  };

  const currentData = classData[selectedClass] || [];

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">ACADEMIC PROFICIENCY</h2>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#4A154B] text-white px-4 py-2 rounded-lg hover:bg-purple-900 transition-colors duration-200 focus:outline-none"
          >
            {selectedClass || "Select Class"}
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
              {classes.length > 0 ? (
                classes.map((className) => (
                  <button
                    key={className}
                    onClick={() => handleClassSelect(className)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 focus:outline-none"
                  >
                    {className}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-700">No classes available</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {currentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default BarChartSample;





