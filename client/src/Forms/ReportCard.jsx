import React, { useState } from "react";
import closeIcon from "../assets/close.png";
import axios from "axios";

const ReportCard = ({ onClose, student }) => {
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [feedbackResults, setFeedbackResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFeedbackData = async (quarter) => {
    console.log("Fetching feedback data for quarter:", quarter);
    setIsLoading(true);
    setError("");
  
    try {
      // Fetch feedback data for the selected student and quarter
      const response = await axios.get(
        `http://localhost:4000/api/school/get-feedback?schoolId=${student.schoolId}&quarter=${quarter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
  
      console.log("Feedback API response:", response.data);
  
      if (response.data.success) {
        const { feedback, feedbackData } = response.data;
  
        if (!feedbackData) {
          throw new Error("No feedback data found for the selected quarter.");
        }
  
        // Combine weekly feedback entries into a single string
        const feedbackText = [
          feedbackData.week1 || "",
          feedbackData.week2 || "",
          feedbackData.week3 || "",
        ]
          .filter((f) => f.trim() !== "") // Remove empty feedback entries
          .join(" ");
  
        if (!feedbackText) {
          throw new Error("No feedback text available to summarize.");
        }
  
        // Summarize the feedback using OpenAI API
        const summaryResponse = await axios.post(
          "http://localhost:4000/api/school/summarize-feedback",
          {
            feedback: feedbackText,
            studentName: `${student.studentData.firstName} ${student.studentData.lastName}`,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
  
        console.log("Summary API response:", summaryResponse.data);
  
        if (summaryResponse.data.success) {
          setFeedbackResults(summaryResponse.data.summary);
        } else {
          throw new Error("Failed to summarize feedback.");
        }
      } else {
        throw new Error("No feedback found for the selected quarter.");
      }
    } catch (error) {
      console.error("Error fetching or summarizing feedback:", error);
      setError(error.message || "Failed to fetch or summarize feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuarterSelect = (quarter) => {
    setSelectedQuarter(quarter);
    setFeedbackResults(null); // Reset feedback when quarter changes
    setError("");
  };

  const handleGenerate = () => {
    if (selectedQuarter) {
      fetchFeedbackData(selectedQuarter);
    } else {
      setError("Please select a quarter first.");
    }
  };

  // Placeholder learning areas and bar data (update as needed)
  const learningAreas = ["Language", "Math", "Science"];
  const barData = {
    Language: [30, 40, 30], // Presented, Practiced, Mastered percentages
    Math: [20, 50, 30],
    Science: [40, 30, 30],
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div className="w-[1100px] h-[700px] bg-white border shadow-lg rounded-lg relative flex flex-col">
        {/* Header Section */}
        <div className="w-full h-16 bg-[#4A154B] flex items-center justify-center text-white text-xl font-semibold rounded-t-lg">
          WORK CYCLE PROGRESS
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
        >
          <img className="w-5 h-5" src={closeIcon} alt="Close" />
        </button>

        {/* Main Content */}
        <div className="flex flex-1 p-4">
          {/* First Section: Learning Areas and Progress Bars */}
          <div className="w-1/3 p-4 border-r flex flex-col space-y-6">
            {/* Legend at the top */}
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

            {/* Progress Bars */}
            {learningAreas.map((area) => (
              <div key={area} className="space-y-2">
                <h4 className="text-md font-medium">{area}</h4>
                <div className="w-full h-7 bg-gray-200 rounded-xl overflow-hidden relative">
                  <div className="h-full flex" style={{ width: "100%" }}>
                    <div className="bg-[#5bb381]" style={{ width: `${barData[area][0]}%` }}>
                      <span className="text-xs text-white pl-2">{barData[area][0]}%</span>
                    </div>
                    <div className="bg-[#e3b34c]" style={{ width: `${barData[area][1]}%` }}>
                      <span className="text-xs text-white pl-2">{barData[area][1]}%</span>
                    </div>
                    <div className="bg-[#4A154B]" style={{ width: `${barData[area][2]}%` }}>
                      <span className="text-xs text-white pl-2">{barData[area][2]}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Section: Quarters and Feedback Summary */}
          <div className="w-2/3 p-2 flex flex-col">
            {/* Quarter Buttons */}
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

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Feedback Results */}
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

            {/* Generate Button */}
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