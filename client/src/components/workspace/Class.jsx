import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReportCard from "../../Forms/ReportCard";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";
import Loader from "../style/Loader";

const Class = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportCard, setShowReportCard] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const { backendUrl, isLoggedIn, loading: authLoading } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication and fetch students
  useEffect(() => {
    if (authLoading) return; // Wait for auth state to resolve

    if (!isLoggedIn) {
      console.warn("User not logged in. Redirecting to login.");
      setError("You must be logged in to view this page.");
      navigate("/login");
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${backendUrl}/api/school/class-list`, {
          withCredentials: true, // Rely on cookie-based auth
        });

        if (response.status !== 200 || !response.data.success) {
          throw new Error(response.data.message || "Failed to fetch students");
        }

        const data = response.data;
        setStudents(data.students || []);
        console.log("Fetched students:", data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load student data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [backendUrl, isLoggedIn, authLoading, navigate]);

  // Extract unique classes and levels from student data
  const classes = [...new Set(students.map((student) => student.studentData?.class).filter(Boolean))];
  const levels = [...new Set(students.map((student) => student.studentData?.level).filter(Boolean))];

  // Format student name
  const formatStudentName = (student) => {
    const { lastName, firstName, middleName } = student.studentData || {};
    const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";
    return `${lastName || ""}, ${firstName || ""} ${middleInitial}`;
  };

  const handleClassChange = (e) => setSelectedClass(e.target.value);
  const handleLevelChange = (e) => setSelectedLevel(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleStudentClick = async (student) => {
    console.log("Action button clicked for student:", student.schoolId);
    if (!isLoggedIn) {
      console.warn("User not logged in. Redirecting to login.");
      setError("Please log in to view student report cards.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}/api/school/student/${student.schoolId}`,
        {
          withCredentials: true, // Rely on cookie-based auth
        }
      );

      console.log("Student data response:", response.data);
      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Failed to fetch student data");
      }

      setSelectedStudent(response.data);
      setShowReportCard(true);
      console.log("ReportCard should now be visible.");
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError(`Failed to fetch student data: ${error.message}`);
    }
  };

  const handleCloseReportCard = () => {
    setShowReportCard(false);
    setSelectedStudent(null);
    setError(null);
    console.log("ReportCard closed.");
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesClass = selectedClass ? student.studentData?.class === selectedClass : true;
    const matchesLevel = selectedLevel ? student.studentData?.level === selectedLevel : true;

    const searchLower = searchQuery.toLowerCase();
    const studentName = formatStudentName(student).toLowerCase();
    const schoolId = (student.schoolId || "").toLowerCase();
    const gender = (student.studentData?.gender || "").toLowerCase();
    const age = (student.studentData?.age || "").toString();
    const birthday = student.studentData?.birthday
      ? new Date(student.studentData.birthday).toLocaleDateString()
      : "";
    const remarks = (student.studentData?.remarks || "").toLowerCase();

    const matchesSearch =
      studentName.includes(searchLower) ||
      schoolId.includes(searchLower) ||
      gender.includes(searchLower) ||
      age.includes(searchLower) ||
      birthday.includes(searchLower) ||
      remarks.includes(searchLower);

    return matchesClass && matchesLevel && matchesSearch;
  });

  if (authLoading || loading) {
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

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Class Page</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-lg text-sm">
          {error}
          {error.includes("log in") && (
            <button
              onClick={() => navigate("/login")}
              className="ml-2 text-blue-600 underline"
            >
              Go to Login
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700"></label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="w-80 h-12 mb-8 mt-12 bg-[#d9d9d9] rounded-[15px] px-4"
            >
              <option value="">Select Class</option>
              {classes.map((cls, index) => (
                <option key={index} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700"></label>
            <select
              value={selectedLevel}
              onChange={handleLevelChange}
              className="w-80 h-12 mb-8 mt-12 bg-[#d9d9d9] rounded-[15px] px-4"
            >
              <option value="">Select Level</option>
              {levels.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex-1 lg:flex-none lg:w-110 mb-8 mt-12">
          <label className="block text-sm font-medium text-gray-700"></label>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-12 bg-[#d9d9d9] rounded-[15px] px-4"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#4A154B] text-white">
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
              <th className="p-1 text-left">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    <img
                      src={student.studentData?.photo || "https://placehold.co/120x120"}
                      alt="Student"
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="p-3">{student.schoolId}</td>
                  <td className="p-3">{student.studentData?.lrn || "N/A"}</td>
                  <td className="p-3">{formatStudentName(student)}</td>
                  <td className="p-3">{student.studentData?.gender || "N/A"}</td>
                  <td className="p-3">{student.studentData?.level || "N/A"}</td>
                  <td className="p-3">{student.studentData?.age || "N/A"}</td>
                  <td className="p-3">
                    {student.studentData?.birthday
                      ? new Date(student.studentData.birthday).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">{student.studentData?.remarks || "N/A"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleStudentClick(student)}
                      className="text-[#4A154B] hover:text-purple-900"
                      title="View Report Card"
                    >
                      <FaFileAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="p-3 text-center">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showReportCard && selectedStudent && (
        <ReportCard onClose={handleCloseReportCard} student={selectedStudent} />
      )}
    </div>
  );
};

export default Class;