import { useState } from "react";
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

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

// Sample data for different classes
const CLASS_DATA = {
  "Class A": [
    { name: "Advanced", value: 55 },
    { name: "Proficient", value: 33 },
    { name: "Developing", value: 12 },
    { name: "Needs Attention", value: 8 },
  ],
  "Class B": [
    { name: "Advanced", value: 40 },
    { name: "Proficient", value: 25 },
    { name: "Developing", value: 20 },
    { name: "Needs Attention", value: 15 },
  ],
  "Class C": [
    { name: "Advanced", value: 60 },
    { name: "Proficient", value: 20 },
    { name: "Developing", value: 15 },
    { name: "Needs Attention", value: 5 },
  ],
};

const BarChartSample = () => {
  const [selectedClass, setSelectedClass] = useState("Class A");
  const [isOpen, setIsOpen] = useState(false);

  // Get the data for the selected class
  const currentData = CLASS_DATA[selectedClass];

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    setIsOpen(false);
  };

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          ACADEMIC PROFICIENCY
        </h2>
        {/* Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#4A154B] text-white px-4 py-2 rounded-lg hover:bg-purple-900 transition-colors duration-200 focus:outline-none"
          >
            {selectedClass}
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
              {Object.keys(CLASS_DATA).map((className) => (
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

export default BarChartSample;