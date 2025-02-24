import React, { useState } from "react";
import closeIcon from "../assets/close.png"; 
import logo from "../assets/montoria.png"; 
const WorkProgressForm = ({ studentData, onClose }) => {
  const {
    name,
    lrn,
    level,
    quarter,
    masteredLessons,
    inProgressCount,
    completedCount,
    attendance,
    feedbackSummary,
  } = studentData;

  const [selectedSubject, setSelectedSubject] = useState("Mathematics");

  return (
    <div className="w-full max-w-[872px] border mx-auto p-4 bg-white shadow-lg rounded-lg overflow-hidden relative">
      {/* Close Button */} 
      <button
        onClick={onClose}
            className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
        >
            <img className="w-5 h-5" src={closeIcon} alt="Close" />
        </button> 

      
      <div className="flex justify-right ml-40 my-4">
        <img
          className="w-36 h-36 rounded-full"
          src={logo}
          alt="Student"
        /><div className="text-center text-black text-2xl font-bold ml-3 mt-12">WORK CYCLE PROGRESS</div>
      </div> 
      
      {/* Student Information */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-200 rounded-lg">
        <div><strong>Name:</strong> {name}</div>
        <div><strong>Quarter:</strong> {quarter}</div>
        <div><strong>LRN:</strong> {lrn}</div>
        <div><strong>Level:</strong> {level}</div>
      </div>

      {/* Subjects */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 my-4">
        {["Mathematics", "Language", "Science", "Nature", "Practical Life", "Geography"].map(subject => (
          <button 
            key={subject} 
            className={`p-2 rounded text-center font-semibold ${selectedSubject === subject ? 'bg-[#9d16be] text-white' : 'bg-gray-300'}`} 
            onClick={() => setSelectedSubject(subject)}>
            {subject}
          </button>
        ))}
      </div>
      
      {/* Dynamic Progress Table */}
      <div className="my-4 p-4 bg-gray-200 rounded-lg">
        <h3 className="text-lg font-bold">{selectedSubject} - Mastered Lessons</h3>
        <ul className="list-disc pl-6">
          {masteredLessons.map((lesson, index) => (
            <li key={index}>{lesson}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-200 rounded-lg">
          <h3 className="text-lg font-bold">Progress</h3>
          <p>In Progress: {inProgressCount}</p>
          <p>Completed: {completedCount}</p>
        </div>
        <div className="p-4 bg-gray-200 rounded-lg">
          <h3 className="text-lg font-bold">Attendance</h3>
          <p>Present: {attendance.present}</p>
          <p>Absent: {attendance.absent}</p>
          <p>Late: {attendance.late}</p>
          <p>Excused: {attendance.excused}</p>
        </div>
      </div>

      {/* Feedback Summary */}
      <div className="my-4 p-4 bg-purple-300 text-black font-bold rounded-lg">
        <h3 className="text-lg">Feedback Summary</h3>
        <p>{feedbackSummary}</p>
      </div>
    </div>
  );
};

export default WorkProgressForm;
