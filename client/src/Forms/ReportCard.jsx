import React, { useState, useEffect } from "react";
import closeIcon from "../assets/close.png"; // Adjust path as needed
import axios from "axios";

const ReportCard = ({ onClose, student }) => {
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [feedbackResults, setFeedbackResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressData, setProgressData] = useState({}); // State for progress bar data

  // Mapping quarters to weeks
  const quarterToWeeks = {
    "1": ["week1", "week2", "week3"],
    "2": ["week4", "week5", "week6"],
    "3": ["week7", "week8", "week9"],
    "4": ["week10", "week11", "week12"],
  };

  // Fetch progress data when the component mounts or student changes
  useEffect(() => {
    const fetchProgressData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `http://localhost:4000/api/school/student/${student.schoolId}/progress`,
          {
            withCredentials: true, // Adjusted for cookie-based auth
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch progress data.");
        }

        setProgressData(response.data.data || {});
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setError(err.message || "Failed to fetch progress data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (student?.schoolId) {
      fetchProgressData();
    }
  }, [student]);

  const fetchFeedbackData = async (quarter) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:4000/api/school/get-feedback?schoolId=${student.schoolId}&quarter=quarter${quarter}`,
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "No feedback found for the selected quarter.");
      }

      const feedbackData = response.data.data;
      const weeks = quarterToWeeks[quarter];
      const feedbackText = [
        feedbackData[weeks[0]] || "",
        feedbackData[weeks[1]] || "",
        feedbackData[weeks[2]] || "",
      ]
        .filter((f) => f.trim() !== "")
        .join(" ");

      if (!feedbackText) {
        throw new Error("No feedback text available to summarize.");
      }

      const summaryResponse = await axios.post(
        "http://localhost:4000/api/school/summarize-feedback",
        {
          feedback: feedbackText,
          studentName: `${student.studentData.firstName} ${student.studentData.lastName}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (!summaryResponse.data.success) {
        throw new Error(summaryResponse.data.message || "Failed to summarize feedback.");
      }

      setFeedbackResults(summaryResponse.data.summary);
    } catch (error) {
      console.error("Error fetching or summarizing feedback:", error);
      setError(error.message || "Failed to fetch or summarize feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuarterSelect = (quarter) => {
    setSelectedQuarter(quarter);
    setFeedbackResults(null);
    setError("");
  };

  const handleGenerate = () => {
    if (selectedQuarter) {
      fetchFeedbackData(selectedQuarter);
    } else {
      setError("Please select a quarter first.");
    }
  };

  // Dynamic learning areas from progress data, with fallback
  const learningAreas = Object.keys(progressData).length
    ? Object.keys(progressData)
    : ["Language", "Math", "Science"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div className="w-[1100px] h-[700px] bg-white border shadow-lg rounded-lg relative flex flex-col">
        <div className="w-full h-16 bg-[#4A154B] flex items-center justify-center text-white text-xl font-semibold rounded-t-lg">
          WORK CYCLE PROGRESS
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
        >
          <img className="w-5 h-5" src={closeIcon} alt="Close" />
        </button>
        <div className="flex flex-1 p-4">
          <div className="w-1/3 p-4 border-r flex flex-col space-y-6">
            <div className="flex space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-[#5bb381] rounded-full"></div>
                <span>Presented</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-[#e3b34c] rounded-full"></div>
                <span>Practiced</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-[#4A154B] rounded-full"></div>
                <span>Mastered</span>
              </div>
            </div>
            {learningAreas.map((area) => {
              const presented = progressData[area]?.presented || 0;
              const practiced = progressData[area]?.practiced || 0;
              const mastered = progressData[area]?.mastered || 0;
              const total = presented + practiced + mastered || 100; // Avoid division by zero

              return (
                <div key={area} className="space-y-2">
                  <h4 className="text-md font-medium">{area}</h4>
                  <div className="w-full h-7 bg-gray-200 rounded-xl overflow-hidden relative">
                    <div className="h-full flex">
                      {presented > 0 && (
                        <div
                          className="bg-[#5bb381] flex items-center justify-center"
                          style={{ width: `${(presented / total) * 100}%` }}
                        >
                          <span className="text-xs text-white">
                            {Math.round((presented / total) * 100)}%
                          </span>
                        </div>
                      )}
                      {practiced > 0 && (
                        <div
                          className="bg-[#e3b34c] flex items-center justify-center"
                          style={{ width: `${(practiced / total) * 100}%` }}
                        >
                          <span className="text-xs text-white">
                            {Math.round((practiced / total) * 100)}%
                          </span>
                        </div>
                      )}
                      {mastered > 0 && (
                        <div
                          className="bg-[#4A154B] flex items-center justify-center"
                          style={{ width: `${(mastered / total) * 100}%` }}
                        >
                          <span className="text-xs text-white">
                            {Math.round((mastered / total) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-2/3 p-2 flex flex-col">
            <div className="flex space-x-4 mb-4">
              {["1", "2", "3", "4"].map((quarter) => (
                <button
                  key={quarter}
                  className={`w-24 h-12 bg-gray-200 rounded-lg shadow-md text-gray-700 font-semibold hover:bg-gray-300 ${
                    selectedQuarter === quarter ? "bg-gray-300 text-[#4A154B]" : ""
                  }`}
                  onClick={() => handleQuarterSelect(quarter)}
                >
                  Quarter {quarter}
                </button>
              ))}
            </div>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex-1 overflow-y-auto mb-4">
              {feedbackResults ? (
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">
                    {student.studentData.firstName} {student.studentData.lastName}
                  </h3>
                  <div className="text-sm h-[400px] overflow-y-auto whitespace-pre-wrap">
                    {feedbackResults}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <p className="mt-2">Generating feedback...</p>
                    </div>
                  ) : selectedQuarter ? (
                    "Click 'Generate' to summarize feedback."
                  ) : (
                    "Select a quarter to view feedback."
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <button
                className="w-[200px] h-12 bg-[#4A154B] rounded-lg text-white text-lg font-semibold shadow-md hover:bg-purple-900 disabled:bg-purple-300"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? "GENERATING..." : "GENERATE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;