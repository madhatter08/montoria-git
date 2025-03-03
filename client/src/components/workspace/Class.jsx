import { useState, useEffect, useContext } from "react";
import ReportCard from "../../Forms/ReportCard"; // Adjust the path as needed
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const Class = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportCard, setShowReportCard] = useState(false);
  const [students, setStudents] = useState([]); // State to store student data
  const { backendUrl } = useContext(AppContext);

  // Fetch student data from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/school/class-list`,
          {
            withCredentials: true,
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch students");
        }

        const data = response.data;
        setStudents(data.students); // Set the fetched student data
        console.log("Fetched students:", data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [backendUrl]);

  // Extract unique classes and levels from student data
  const classes = [
    ...new Set(students.map((student) => student.studentData.class)),
  ];
  const levels = [
    ...new Set(students.map((student) => student.studentData.level)),
  ];

  // Format student name as [lastName, firstName middleName (initial + period)]
  const formatStudentName = (student) => {
    const { lastName, firstName, middleName } = student.studentData;
    const middleInitial = middleName ? `${middleName.charAt(0)}.` : ""; // Get the first letter of middleName
    return `${lastName}, ${firstName} ${middleInitial}`;
  };

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
    setShowReportCard(true);
  };

  const handleCloseReportCard = () => {
    setShowReportCard(false);
  };

  // Filter students based on selected class, level, and search query
  const filteredStudents = students.filter((student) => {
    const matchesClass = selectedClass
      ? student.studentData.class === selectedClass
      : true;
    const matchesLevel = selectedLevel
      ? student.studentData.level === selectedLevel
      : true;

    // Convert all searchable fields to lowercase for case-insensitive comparison
    const searchLower = searchQuery.toLowerCase();
    const studentName = formatStudentName(student).toLowerCase();
    const schoolId = student.schoolId.toLowerCase();
    const gender = student.studentData.gender.toLowerCase();
    const age = student.studentData.age.toString();
    const birthday = new Date(
      student.studentData.birthday
    ).toLocaleDateString();
    const remarks = student.studentData.remarks.toLowerCase();

    // Check if the search query matches any of the fields
    const matchesSearch =
      studentName.includes(searchLower) ||
      schoolId.includes(searchLower) ||
      gender.includes(searchLower) ||
      age.includes(searchLower) ||
      birthday.includes(searchLower) ||
      remarks.includes(searchLower);

    return matchesClass && matchesLevel && matchesSearch;
  });

  return (
    <div className="p-8 bg-white min-h-screen">
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
              {classes.map((cls, index) => (
                <option key={index} value={cls}>
                  {cls}
                </option>
              ))}
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
              {levels.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
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
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student._id} className="border-b">
                  <td className="p-3">
                    <img
                      src={
                        student.studentData.photo ||
                        "https://placehold.co/120x120"
                      }
                      alt="Student"
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="p-3">{student.schoolId}</td>
                  <td className="p-3">{student.studentData.lrn}</td>
                  <td className="p-3">{formatStudentName(student)}</td>
                  <td className="p-3">{student.studentData.gender}</td>
                  <td className="p-3">{student.studentData.level}</td>
                  <td className="p-3">{student.studentData.age}</td>
                  <td className="p-3">
                    {new Date(
                      student.studentData.birthday
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-3">{student.studentData.remarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-3 text-center">
                  No result found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ReportCard Form Pop-up */}
      {showReportCard && <ReportCard onClose={handleCloseReportCard} />}
    </div>
  );
};

export default Class;
