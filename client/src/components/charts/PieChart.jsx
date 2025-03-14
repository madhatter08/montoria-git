import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#F97316", "#14B8A6"];

const PieChartSample = ({ studentData }) => {
  // Process student data to count students per level
  const levelCounts = studentData.reduce((acc, student) => {
    const level = student.studentData?.level || "Unknown";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  const categoryData = [
    { name: "Junior Casa", value: levelCounts["Junior Casa"] || 0 },
    { name: "Junior Advanced Casa", value: levelCounts["Junior Advanced Casa"] || 0 },
    { name: "Advanced Casa", value: levelCounts["Advanced Casa"] || 0 },
    { name: "Toddler", value: levelCounts["Toddler"] || 0 },
    { name: "Grade 1", value: levelCounts["Grade 1"] || 0 },
    { name: "Grade 2", value: levelCounts["Grade 2"] || 0 },
    { name: "Grade 3", value: levelCounts["Grade 3"] || 0 },
  ].filter(item => item.value > 0);

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-10 border border-gray-400 h-108 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        STUDENT LEVEL DISTRIBUTION
      </h2>
      <div className="flex-1 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"  // Centers horizontally
              cy="50%"  // Centers vertically
              labelLine={false}
              outerRadius={100}  // Increased size for better visibility
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PieChartSample;