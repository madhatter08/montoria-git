import React, { useState } from "react";
import ReportCard from "../../Forms/ReportCard"; // Adjust the path as needed

const Class = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportCard, setShowReportCard] = useState(false); // State to control form visibility

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGenerateReport = () => {
    setShowReportCard(true); // Show the ReportCard form
  };

  const handleCloseReportCard = () => {
    setShowReportCard(false); // Hide the ReportCard form
  };

  // Sample data for the table
  const students = [
    {
      id: 1,
      photo: "https://placehold.co/120x120",
      schoolId: "12345",
      lrn: "987654321",
      name: "John Doe",
      gender: "Male",
      level: "Grade 1",
      age: 7,
      birthday: "2016-05-12",
      remarks: "Good",
    },
    {
      id: 2,
      photo: "https://placehold.co/120x120",
      schoolId: "67890",
      lrn: "123456789",
      name: "Jane Smith",
      gender: "Female",
      level: "Grade 2",
      age: 8,
      birthday: "2015-08-20",
      remarks: "Excellent",
    },
    {
      id: 3,
      photo: "https://placehold.co/120x120",
      schoolId: "54321",
      lrn: "567890123",
      name: "Alice Johnson",
      gender: "Female",
      level: "Grade 3",
      age: 9,
      birthday: "2014-03-15",
      remarks: "Needs Improvement",
    },
    // Add more rows as needed
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Class Page</h1>

      {/* Dropdowns, Search Bar, and Generate Report Button */}
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Dropdowns on the Left */}
        <div className="flex space-x-4">
          {/* Class Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700"></label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="w-48 h-12 mb-8 mt-12 bg-[#d9d9d9] rounded-[15px] px-4"
            >
              <option value="">Select Class</option>
              <option value="Class A">Class A</option>
              <option value="Class B">Class B</option>
              <option value="Class C">Class C</option>
            </select>
          </div>

          {/* Level Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700"></label>
            <select
              value={selectedLevel}
              onChange={handleLevelChange}
              className="w-48 h-12 mb-8 mt-12 bg-[#d9d9d9] rounded-[15px] px-4"
            >
              <option value="">Select Level</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
            </select>
          </div>
        </div>

        {/* Search Bar in the Middle */}
        <div className="flex-1 lg:flex-none lg:w-96 mb-8 mt-12">
          <label className="block text-sm font-medium text-gray-700"></label>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-12 bg-[#d9d9d9] rounded-[15px] px-4"
          />
        </div>

        {/* Generate Report Button on the Right */}
        <div>
          <button
            onClick={handleGenerateReport}
            className="px-6 mt-4.5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-400"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Table with Remaining Columns */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#9d16be] text-white">
            <tr>
              <th className="p-3 text-left">PHOTO</th>
              <th className="p-3 text-left">SCHOOL ID</th>
              <th className="p-3 text-left">LRN</th>
              <th className="p-3 text-left">STUDENT NAME</th>
              <th className="p-3 text-left">GENDER</th>
              <th className="p-3 text-left">LEVEL</th>
              <th className="p-3 text-left">AGE</th>
              <th className="p-3 text-left">BIRTHDAY</th>
              <th className="p-3 text-left">REMARKS</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="p-3">
                  <img
                    src={student.photo}
                    alt="Student"
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="p-3">{student.schoolId}</td>
                <td className="p-3">{student.lrn}</td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.gender}</td>
                <td className="p-3">{student.level}</td>
                <td className="p-3">{student.age}</td>
                <td className="p-3">{student.birthday}</td>
                <td className="p-3">{student.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ReportCard Form Pop-up */}
      {showReportCard && <ReportCard onClose={handleCloseReportCard} />}
    </div>
  );
};

export default Class;