import React, { useState, useEffect, useContext } from "react";
import NavbarUser from "../components/NavbarUser";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import Loader from "../components/style/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Attendance = () => {
  const { backendUrl } = useContext(AppContext);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch students and attendance data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch students
        const studentResponse = await axios.get(`${backendUrl}/api/school/class-list`, {
          withCredentials: true,
        });
        if (studentResponse.status !== 200) {
          throw new Error("Failed to fetch students");
        }
        const studentData = studentResponse.data.students;
        setStudents(studentData);

        // Fetch attendance for the selected date
        const attendanceResponse = await axios.get(
          `${backendUrl}/api/attendance/date/${selectedDate}`,
          { withCredentials: true }
        );
        const attendanceData = attendanceResponse.data.records || [];

        // Merge student data with attendance data
        const mergedAttendance = studentData.map((student) => {
          const record = attendanceData.find((r) => r.schoolId === student.schoolId);
          return {
            schoolId: student.schoolId,
            name: `${student.studentData.lastName}, ${student.studentData.firstName} ${student.studentData.middleName?.charAt(0) || ""}.`,
            photo: student.studentData.photo || "https://placehold.co/50x50",
            status: record ? record.status : "",
          };
        });
        setAttendance(mergedAttendance);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 404) {
          // No attendance data for this date, initialize with empty statuses
          const initialAttendance = students.map((student) => ({
            schoolId: student.schoolId,
            name: `${student.studentData.lastName}, ${student.studentData.firstName} ${student.studentData.middleName?.charAt(0) || ""}.`,
            photo: student.studentData.photo || "https://placehold.co/50x50",
            status: "",
          }));
          setAttendance(initialAttendance);
        } else {
          setError("Failed to load data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl, selectedDate]); // Re-fetch when date changes

  // Handle class selection
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    const filtered = students
      .filter((student) => !e.target.value || student.studentData.class === e.target.value)
      .map((student) => {
        const existingRecord = attendance.find((r) => r.schoolId === student.schoolId);
        return {
          schoolId: student.schoolId,
          name: `${student.studentData.lastName}, ${student.studentData.firstName} ${student.studentData.middleName?.charAt(0) || ""}.`,
          photo: student.studentData.photo || "https://placehold.co/50x50",
          status: existingRecord ? existingRecord.status : "",
        };
      });
    setAttendance(filtered);
  };

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Handle attendance status change
  const handleStatusChange = (schoolId, status) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.schoolId === schoolId ? { ...record, status } : record
      )
    );
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear all attendance statuses
  const handleClearAttendance = () => {
    setAttendance((prev) =>
      prev.map((record) => ({ ...record, status: "" }))
    );
    toast.info("Attendance cleared!");
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

  // Save attendance records to the database
  const handleSaveAttendance = async () => {
    const recordsToSave = attendance.filter((record) => record.status !== "");
    if (recordsToSave.length === 0) {
      toast.warn("No attendance data to save. Please select a status for at least one student.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/attendance/save`,
        {
          class: selectedClass,
          date: selectedDate,
          records: recordsToSave.map((record) => ({
            schoolId: record.schoolId,
            status: record.status,
          })),
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Attendance saved successfully!");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error(`Failed to save attendance: ${error.response?.data?.message || error.message}`);
    }
  };

  // Export attendance to CSV
  const handleExportToCSV = () => {
    const headers = ["School ID", "Name", "Status", "Class", "Date"];
    const rows = attendance.map((record) => [
      record.schoolId,
      record.name,
      record.status || "Not Recorded",
      selectedClass || "All Classes",
      selectedDate,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_${selectedClass || "All"}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading and error states
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      className="flex flex-col pt-50 pb-20 items-center justify-center min-h-screen"
      style={{
        background: "radial-gradient(circle at top center, #e4e2e4 10%, #e4e2e4 70%, #e4e2e4 95%)",
        backgroundRepeat: "repeat",
      }}
    >
      <NavbarUser />
      <div className="w-full max-w-7xl p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
        {/* Class Selection, Date Picker, Search Bar, Export, Save, and Clear Buttons */}
        <div className="flex flex-col md:flex-row gap-2 mb-6 items-center">
          <h1 className="text-2xl font-bold text-center">Attendance Management</h1>
          <select
            className="p-2 border border-gray-300 rounded-lg w-full md:w-64"
            value={selectedClass}
            onChange={handleClassChange}
          >
            <option value="">Select Class</option>
            {[...new Set(students.map((s) => s.studentData.class))].map((cls, index) => (
              <option key={index} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="p-2 border border-gray-300 rounded-lg w-full md:w-40"
            value={selectedDate}
            onChange={handleDateChange}
          />

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

          <button
            className="p-2 bg-[#4A154B] text-white rounded-lg hover:bg-[#7a0f8f]"
            onClick={handleExportToCSV}
          >
            Export
          </button>
          <button
            className="p-2 bg-[#5BB381] text-white rounded-lg hover:bg-[#4a926b]"
            onClick={handleSaveAttendance}
          >
            Save
          </button>
          <button
            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onClick={handleClearAttendance}
          >
            Clear
          </button>
        </div>

        {/* Total Attendance Count Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-[#5BB381] border border-gray-300 rounded-lg text-center">
            <p className="text-lg font-bold">{totalPresent}</p>
            <p className="text-sm text-gray-600">Present</p>
          </div>
          <div className="p-4 bg-[#E3B34C] border border-gray-300 rounded-lg text-center">
            <p className="text-lg font-bold">{totalLate}</p>
            <p className="text-sm text-gray-600">Late</p>
          </div>
          <div className="p-4 border bg-amber-300 border-gray-300 rounded-lg text-center">
            <p className="text-lg font-bold">{totalExcused}</p>
            <p className="text-sm text-gray-600">Excused</p>
          </div>
          <div className="p-4 bg-gray-400 border border-gray-300 rounded-lg text-center">
            <p className="text-lg font-bold">{totalAbsent}</p>
            <p className="text-sm text-gray-600">Absent</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#4A154B] text-white">
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
                <tr key={record.schoolId} className="border-b">
                  <td className="p-4">
                    <img
                      src={record.photo}
                      alt={record.name}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => (e.target.src = "https://placehold.co/50x50")}
                    />
                  </td>
                  <td className="p-4">{record.schoolId}</td>
                  <td className="p-4">{record.name}</td>
                  <td className="p-4">
                    <input
                      type="radio"
                      name={`status-${record.schoolId}`}
                      value="Present"
                      checked={record.status === "Present"}
                      onChange={() => handleStatusChange(record.schoolId, "Present")}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="radio"
                      name={`status-${record.schoolId}`}
                      value="Late"
                      checked={record.status === "Late"}
                      onChange={() => handleStatusChange(record.schoolId, "Late")}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="radio"
                      name={`status-${record.schoolId}`}
                      value="Excused"
                      checked={record.status === "Excused"}
                      onChange={() => handleStatusChange(record.schoolId, "Excused")}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="radio"
                      name={`status-${record.schoolId}`}
                      value="Absent"
                      checked={record.status === "Absent"}
                      onChange={() => handleStatusChange(record.schoolId, "Absent")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Attendance;