import React, { useState } from "react";
import closeIcon from "../assets/close.png";
import WorkProgressForm from "./WorkProgressForm";


const ReportCard = ({ onClose }) => {
  const classes = ["Class A", "Class B", "Class C"];
  const students = ["John Doe", "Jane Smith", "Alice Johnson"];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];


  // State for selected values
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [showReport, setShowReport] = useState(false);


  // Mock student data
  const studentData = {
    name: selectedStudent,
    lrn: "1234567890",
    level: selectedClass,
    quarter: selectedQuarter,
    masteredLessons: ["Counting to 100", "Letter Recognition", "Basic Addition"],
    inProgressCount: 3,
    completedCount: 5,
    attendance: { present: 20, absent: 2, late: 1, excused: 1 },
    feedbackSummary: "Good progress, needs improvement in language skills.",
  };


  // Handle Generate button click
  const handleGenerate = () => {
    if (selectedClass && selectedStudent && selectedQuarter) {
      setShowReport(true);
    } else {
      alert("Please select all required fields.");
    }
  };


  // Handle closing the report form
  const handleCloseReport = () => {
    setShowReport(false);
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-transparent bg-opacity-50 z-50">
      {!showReport ? (
        <div className="w-[416px] h-[434px] bg-white border shadow-lg rounded-lg relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
          >
            <img className="w-5 h-5" src={closeIcon} alt="Close" />
          </button>


          <div className="text-center mt-6 text-gray-900 text-2xl font-semibold">
            WORK CYCLE PROGRESS
          </div>
          <div className="text-center mt-2 text-gray-700 text-sm font-light px-6">
            Please fill in the required fields below to generate the student's report card.
          </div>


          {/* Selection Fields */}
          <div className="flex flex-col items-center gap-4 mt-6">
            {/* Class Selection */}
            <select
              className="w-[275px] h-[51px] bg-gray-200 rounded-[15px] shadow-md px-4 text-gray-700 text-[15px] font-semibold"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">CLASS</option>
              {classes.map((cls, index) => (
                <option key={index} value={cls}>{cls}</option>
              ))}
            </select>


            {/* Student Selection */}
            <select
              className="w-[275px] h-[52px] bg-gray-200 rounded-[15px] shadow-md px-4 text-gray-700 text-[15px] font-semibold"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">STUDENT NAME</option>
              {students.map((student, index) => (
                <option key={index} value={student}>{student}</option>
              ))}
            </select>


            {/* Quarter Selection */}
            <select
              className="w-[275px] h-[51px] bg-gray-200 rounded-[15px] shadow-md px-4 text-gray-700 text-[15px] font-semibold"
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
            >
              <option value="">QUARTER</option>
              {quarters.map((quarter, index) => (
                <option key={index} value={quarter}>{quarter}</option>
              ))}
            </select>


            {/* Generate Button */}
            <button
              className="w-[275px] h-[51px] bg-purple-600 rounded-[15px] text-white text-xl font-semibold shadow-md mt-4 hover:bg-purple-500"
              onClick={handleGenerate}
            >
              GENERATE
            </button>
          </div>
        </div>
      ) : (
        <WorkProgressForm studentData={studentData} onClose={handleCloseReport} />
      )}
    </div>
  );
};


export default ReportCard;