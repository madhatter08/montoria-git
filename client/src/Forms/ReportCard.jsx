import React, { useState } from "react";
import closeIcon from "../assets/close.png";
import axios from "axios";

const ReportCard = ({ onClose, student }) => {
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [feedbackResults, setFeedbackResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Dummy data for the bar graph
  const learningAreas = ["Math", "Nature", "Language", "Science", "Arts"];
  const barData = {
    Math: [80, 60, 40], // [Presented, Practiced, Mastered]
    Nature: [70, 50, 30],
    Language: [90, 70, 50],
    Science: [85, 65, 45],
    Arts: [75, 55, 35],
  };

  // Handle Generate button click
  const handleGenerate = async () => {
    if (!selectedQuarter) {
      setError("Please select a quarter.");
      return;
    }

    setIsLoading(true); // Set loading state to true
    setError("");

    try {
      // Check if the student has quarters data
      if (!student.studentData || !student.studentData.quarters) {
        setError("No quarters data found for the student.");
        return;
      }

      // Find the selected quarter's feedback
      const quarterData = student.studentData.quarters.find(
        (q) => q.quarter === parseInt(selectedQuarter)
      );

      if (!quarterData || !quarterData.feedback || quarterData.feedback.length === 0) {
        setError("No feedback found for the selected quarter.");
        return;
      }

      // Prepare feedback text for summarization
      const feedbackText = quarterData.feedback
        .map((fb) => fb.feedback_text)
        .join(" ");

      // Call the DeepSeek API to summarize feedback
      const summaryResponse = await axios.post(
        "http://localhost:4000/api/school/summarize-feedback",
        {
          feedback: feedbackText,
          studentName: `${student.studentData.firstName} ${student.studentData.lastName}`, // Include student's name
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (!summaryResponse.data.success) {
        throw new Error("Failed to summarize feedback.");
      }

      // Set the summarized feedback
      setFeedbackResults(summaryResponse.data.summary);
    } catch (error) {
      console.error("Error generating feedback:", error);
      setError(error.response?.data?.message || "Failed to generate feedback. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Handle Quarter button click
  const handleQuarterSelect = (quarter) => {
    setSelectedQuarter(quarter);
    setFeedbackResults(null); // Clear feedback results when a new quarter is selected
    setError(""); // Clear any previous errors
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
                  <div
                    className="h-full flex"
                    style={{
                      width: "100%",
                    }}
                  >
                    <div
                      className="bg-[#5bb381]"
                      style={{ width: `${barData[area][0]}%` }}
                    >
                      <span className="text-xs text-white pl-2">{barData[area][0]}%</span>
                    </div>
                    <div
                      className="bg-[#e3b34c]"
                      style={{ width: `${barData[area][1]}%` }}
                    >
                      <span className="text-xs text-white pl-2">{barData[area][1]}%</span>
                    </div>
                    <div
                      className="bg-[#4A154B]"
                      style={{ width: `${barData[area][2]}%` }}
                    >
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
                  <h3 className="text-lg font-semibold mb-2">STUDENT NAME</h3>
                  <div className="tex-sm h-[400px] overflow-y-auto whitespace-pre-wrap">
                    {feedbackResults}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {isLoading ? ( // Show loader when Generate button is clicked
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <p className="mt-2">Generating feedback...</p>
                    </div>
                  ) : (
                    "No feedback generated yet."
                  )}
                </div>
              )}
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                className="w-[200px] h-12 bg-[#4A154B] rounded-lg text-white text-lg font-semibold shadow-md hover:bg-purple-900 disabled:bg-purple-300"
                onClick={handleGenerate}
                disabled={isLoading || !selectedQuarter}
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