// frontend/src/Forms/ReportForm.jsx
import { useState } from "react";
import axios from "axios";

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

export default ReportForm;