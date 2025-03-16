import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const SchoolYearForm = ({ onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [quarters, setQuarters] = useState([
    { name: "Q1", start: "01-01", end: "03-31" },
    { name: "Q2", start: "04-01", end: "06-30" },
    { name: "Q3", start: "07-01", end: "09-30" },
    { name: "Q4", start: "10-01", end: "12-31" },
  ]);
  const [currentQuarter, setCurrentQuarter] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  // Fetch current school year status on mount
  useEffect(() => {
    const fetchSchoolYearStatus = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/school/school-year", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        if (response.data.success && response.data.isActive) {
          setStartDate(response.data.startDate.split("T")[0]); // Format as YYYY-MM-DD
          setCurrentQuarter(response.data.currentQuarter);
        }
      } catch (err) {
        console.error("Error fetching school year status:", err);
      }
    };
    fetchSchoolYearStatus();
  }, []);

  const handleQuarterChange = (index, field, value) => {
    const newQuarters = [...quarters];
    newQuarters[index][field] = value;
    setQuarters(newQuarters);
  };

  const determineCurrentQuarter = (startDate) => {
    const today = new Date();
    const year = new Date(startDate).getFullYear();
    for (const q of quarters) {
      const start = new Date(`${year}-${q.start}`);
      const end = new Date(`${year}-${q.end}`);
      if (today >= start && today <= end) return q.name;
    }
    return "";
  };

  const handleStartSchoolYear = async () => {
    if (!startDate) {
      setError("Please select a start date.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/api/school/school-year", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      if (response.data.success && response.data.isActive) {
        setWarning("A school year is already running. Do you want to reset it?");
        return;
      }

      await startNewSchoolYear();
    } catch (err) {
      if (err.response?.data?.isActive) {
        setWarning("A school year is already running. Do you want to reset it?");
      } else {
        console.error("Error checking school year:", err);
        setError("Failed to start school year.");
      }
    }
  };

  const startNewSchoolYear = async () => {
    try {
      const currentQuarter = determineCurrentQuarter(startDate);
      const response = await axios.post(
        "http://localhost:4000/api/school/start-school-year",
        { startDate, quarters, currentQuarter },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setCurrentQuarter(currentQuarter);
        setWarning("");
        setError("");
      } else {
        setError("Failed to start school year.");
      }
    } catch (err) {
      console.error("Error starting school year:", err);
      setError("Failed to start school year.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">School Year Management</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">School Year Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border-2 rounded-lg w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Edit Quarters</label>
          {quarters.map((q, index) => (
            <div key={q.name} className="flex gap-2 mb-2">
              <input
                type="text"
                value={q.name}
                onChange={(e) => handleQuarterChange(index, "name", e.target.value)}
                className="p-2 border-2 rounded-lg w-1/4"
              />
              <input
                type="text"
                value={q.start}
                onChange={(e) => handleQuarterChange(index, "start", e.target.value)}
                className="p-2 border-2 rounded-lg w-1/3"
                placeholder="MM-DD"
              />
              <input
                type="text"
                value={q.end}
                onChange={(e) => handleQuarterChange(index, "end", e.target.value)}
                className="p-2 border-2 rounded-lg w-1/3"
                placeholder="MM-DD"
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Current Quarter</label>
          <p className="p-2 bg-gray-100 rounded-lg">{currentQuarter || "Not set"}</p>
        </div>

        <button
          type="button"
          onClick={handleStartSchoolYear}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4"
        >
          Start School Year
        </button>

        {warning && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-700 rounded-lg">
            {warning}
            <div className="flex gap-2 mt-2">
              <button
                onClick={startNewSchoolYear}
                className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setWarning("")}
                className="p-1 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

SchoolYearForm.propTypes = { onClose: PropTypes.func.isRequired };

export default SchoolYearForm;