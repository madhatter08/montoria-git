import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const LineChartSample = ({ progress }) => {
  // Calculate total mastered lessons per month
  const calculateMasteryData = () => {
    const masteryByMonth = {};

    // Iterate over all students' progress
    Object.values(progress).forEach((studentProgress) => {
      Object.values(studentProgress).forEach((lesson) => {
        if (lesson.mastered && lesson.date) {
          const date = new Date(lesson.date);
          const month = date.toLocaleString('default', { month: 'short' }); // e.g., "Jan", "Feb"
          const year = date.getFullYear();
          const key = `${month} ${year}`; // e.g., "Jan 2025"

          masteryByMonth[key] = (masteryByMonth[key] || 0) + 1;
        }
      });
    });

    // Convert to array format for LineChart and sort by date
    const masteryData = Object.entries(masteryByMonth)
      .map(([name, mastered]) => ({ name, mastered }))
      .sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA - dateB;
      });

    // Log the calculated data for debugging
    console.log("Mastery Data:", masteryData);

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

export default LineChartSample;