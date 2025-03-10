import { useState } from "react";
import closeIcon from "../assets/close.png";
import axios from "axios";
import PropTypes from "prop-types";

const ReportCard = ({ onClose, student }) => {
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [feedbackResults, setFeedbackResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        <div className="w-full h-16 bg-[#9d16be] flex items-center justify-center text-white text-2xl font-semibold rounded-t-lg">
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
          {/* First Section: Quarter Buttons */}
          <div className="w-1/3 p-4 border-r flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Select Quarter</h3>
            {["1", "2", "3", "4"].map((quarter) => (
              <button
                key={quarter}
                className={`w-full h-12 bg-gray-200 rounded-lg shadow-md text-gray-700 font-semibold hover:bg-gray-300 ${
                  selectedQuarter === quarter ? "bg-gray-500 text-white" : ""
                }`}
                onClick={() => handleQuarterSelect(quarter)}
              >
                Quarter {quarter}
              </button>
            ))}
          </div>

          {/* Second Section: Feedback Results and Generate Button */}
          <div className="w-2/3 p-4 flex flex-col">
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
                className="w-[200px] h-12 bg-[#9d16be] rounded-lg text-white text-lg font-semibold shadow-md hover:bg-purple-500 disabled:bg-purple-300"
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

ReportCard.propTypes = {
    onClose: PropTypes.func.isRequired,
    student: PropTypes.func.isRequired,
};

export default ReportCard;