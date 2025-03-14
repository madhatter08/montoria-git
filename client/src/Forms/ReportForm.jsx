import { useState } from "react";
import axios from "axios";

const ReportForm = ({ onReportGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [graphType, setGraphType] = useState("bar"); // Default to bar
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [filters, setFilters] = useState(""); // e.g., "Math, Grade 10"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const requestData = {
      prompt, // Natural language input
      graphType, // "bar", "line", "pie"
      dateRange, // { start: "2023-01-01", end: "2023-12-31" }
      filters, // Additional filters as a string
    };

    try {
      const response = await axios.post("http://localhost:4000/api/reports/generate", requestData);
      if (response.data) {
        onReportGenerated(response.data); // Expected: { type, labels, datasets }
      } else {
        setError("No data returned from the server.");
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
          placeholder="E.g., Show student performance in Math"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg font-medium text-gray-800">Start Date</label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-800">End Date</label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-800">Filters (optional)</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
          value={filters}
          onChange={(e) => setFilters(e.target.value)}
          placeholder="E.g., Math, Grade 10"
        />
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

export default ReportForm;