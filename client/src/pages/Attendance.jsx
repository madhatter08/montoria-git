import React, { useState } from "react";
import NavbarUser from "../components/NavbarUser"; // Import the NavbarUser component
import { assets } from "../assets/assets"; // Import assets for the search icon

const Attendance = () => {
  // Sample data for classes and students
  const classes = ["Class A", "Class B", "Class C"];
  const students = [
    { id: 1, name: "John Doe", photo: "https://via.placeholder.com/50" },
    { id: 2, name: "Jane Smith", photo: "https://via.placeholder.com/50" },
    { id: 3, name: "Alice Johnson", photo: "https://via.placeholder.com/50" },
    { id: 4, name: "Bob Brown", photo: "https://via.placeholder.com/50" },
  ];

  // State for selected class, search query, and attendance records
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState(
    students.map((student) => ({
      id: student.id,
      name: student.name,
      photo: student.photo,
      status: "Present", // Default status
    }))
  );

  // Handle class selection
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    // Reset attendance when class changes
    setAttendance(
      students.map((student) => ({
        id: student.id,
        name: student.name,
        photo: student.photo,
        status: "Present",
      }))
    );
  };

  // Handle attendance status change
  const handleStatusChange = (id, status) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, status } : record
      )
    );
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter students based on search query
  const filteredStudents = attendance.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total attendance counts
  const totalPresent = attendance.filter((record) => record.status === "Present").length;
  const totalLate = attendance.filter((record) => record.status === "Late").length;
  const totalExcused = attendance.filter((record) => record.status === "Excused").length;
  const totalAbsent = attendance.filter((record) => record.status === "Absent").length;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        background: "radial-gradient(circle at top center, #A78BFA 10%, #ffb3dd 70%, #fff 95%)",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Include the NavbarUser component */}
      <NavbarUser />

      {/* Attendance Page Content */}
      <div className="w-full max-w-6xl p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
        

        {/* Class Selection, Search Bar, and Export Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <h1 className="text-2xl font-bold text-center">Attendance Management</h1>
          {/* Class Dropdown */}
          <select
            className="p-2 border border-gray-300 rounded-lg w-full md:w-64"
            value={selectedClass}
            onChange={handleClassChange}
          >
            <option value="">Select Class</option>
            {classes.map((cls, index) => (
              <option key={index} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          {/* Search Bar with Icon */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              className="p-2 pl-10 border border-gray-300 rounded-lg w-full"
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <img
              src={assets.search}
              alt="Search"
              className="absolute left-3 top-3 w-5 h-5"
            />
          </div>

          {/* Export Button */}
          <button
            className="p-2 bg-[#9d16be] text-white rounded-lg hover:bg-[#7a0f8f]"
            onClick={() => alert("Export functionality will be added here")}
          >
            Export
          </button>
        </div>

        {/* Total Attendance Count Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-[#77e35f] border border-gray-300 rounded-lg text-center">
            <p className="text-lg font-bold">{totalPresent}</p>
            <p className="text-sm text-gray-600">Present</p>
          </div>
          <div className="p-4 bg-[#f0a14c] border border-gray-300 rounded-lg text-center">
            <p className="text-lg font-bold">{totalLate}</p>
            <p className="text-sm text-gray-600">Late</p>
          </div>
          <div className="p-4 border bg-amber-300 border-gray-300 rounded-lg text-center">
            <p className="text-lg font-bold">{totalExcused}</p>
            <p className="text-sm text-gray-600">Excused</p>
          </div>
          <div className="p-4 bg-gray-400 order border-gray-300 rounded-lg text-center">
            <p className="text-lg font-bold">{totalAbsent}</p>
            <p className="text-sm text-gray-600">Absent</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#9d16be] text-white">
                <th className="p-4 text-left">Photo</th>
                <th className="p-4 text-left">School ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Present</th>
                <th className="p-4 text-left">Late</th>
                <th className="p-4 text-left">Excused</th>
                <th className="p-4 text-left">Absent</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((record) => (
                <tr key={record.id} className="border-b">
                  <td className="p-4">
                    <img
                      src={record.photo}
                      alt={record.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="p-4">{record.id}</td>
                  <td className="p-4">{record.name}</td>
                  <td className="p-4">
                    <input
                      type="radio"
                      name={`status-${record.id}`}
                      value="Present"
                      checked={record.status === "Present"}
                      onChange={() => handleStatusChange(record.id, "Present")}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="radio"
                      name={`status-${record.id}`}
                      value="Late"
                      checked={record.status === "Late"}
                      onChange={() => handleStatusChange(record.id, "Late")}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="radio"
                      name={`status-${record.id}`}
                      value="Excused"
                      checked={record.status === "Excused"}
                      onChange={() => handleStatusChange(record.id, "Excused")}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="radio"
                      name={`status-${record.id}`}
                      value="Absent"
                      checked={record.status === "Absent"}
                      onChange={() => handleStatusChange(record.id, "Absent")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;