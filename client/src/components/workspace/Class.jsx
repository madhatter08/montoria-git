import { useState, useEffect, useContext } from "react";
import ReportCard from "../../Forms/ReportCard"; // Adjust the path as needed
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
  const [users, setUsers] = useState([]); // Renamed to "users" to include all roles
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${backendUrl}/api/school/class-list`,
          {
            withCredentials: true,
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch users");
        }

        const data = response.data;
        // Filter to only include active users
        const activeUsers = data.students.filter(
          (user) => user.isActive === true
        );
        setUsers(activeUsers);
        console.log("Fetched active users:", activeUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backendUrl]);

  // Extract unique classes and levels from active users (students only for now)
  const classes = [
    ...new Set(users.map((user) => user.studentData?.class).filter(Boolean)),
  ];
  const levels = [
    ...new Set(users.map((user) => user.studentData?.level).filter(Boolean)),
  ];

  // Format name based on role
  const formatUserName = (user) => {
    if (user.role === "student" && user.studentData) {
      const { lastName, firstName, middleName } = user.studentData;
      const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";
      return `${lastName}, ${firstName} ${middleInitial}`;
    } else if (user.role === "guide" && user.guideData) {
      const { lastName, firstName, middleName } = user.guideData;
      const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";
      return `${lastName}, ${firstName} ${middleInitial}`;
    } else if (user.role === "admin" && user.adminData) {
      return user.adminData.name || "N/A";
    }
    return "N/A";
  };

  const handleClassChange = (e) => setSelectedClass(e.target.value);
  const handleLevelChange = (e) => setSelectedLevel(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleUserClick = async (user) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/school/student/${user.schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch user data");
      }

      setSelectedStudent(response.data);
      setShowReportCard(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCloseReportCard = () => {
    setShowReportCard(false);
    setSelectedStudent(null);
  };

  // Filter users based on class, level, and search query
  const filteredUsers = users.filter((user) => {
    const matchesClass = selectedClass
      ? user.studentData?.class === selectedClass
      : true;
    const matchesLevel = selectedLevel
      ? user.studentData?.level === selectedLevel
      : true;

    const searchLower = searchQuery.toLowerCase();
    const userName = formatUserName(user).toLowerCase();
    const schoolId = user.schoolId.toLowerCase();
    const gender = user.studentData?.gender?.toLowerCase() || "";
    const age = user.studentData?.age?.toString() || "";
    const birthday = user.studentData?.birthday
      ? new Date(user.studentData.birthday).toLocaleDateString()
      : "";
    const remarks = user.studentData?.remarks?.toLowerCase() || "";

    const matchesSearch =
      userName.includes(searchLower) ||
      schoolId.includes(searchLower) ||
      gender.includes(searchLower) ||
      age.includes(searchLower) ||
      birthday.includes(searchLower) ||
      remarks.includes(searchLower);

    return matchesClass && matchesLevel && matchesSearch;
  });

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
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Class Page</h1>

      {/* Dropdowns and Search Bar */}
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#4A154B] text-white">
            <tr>
              <th className="p-3 text-left">PHOTO</th>
              <th className="p-3 text-left">SCHOOL ID</th>
              <th className="p-3 text-left">ROLE</th> {/* Added Role column */}
              <th className="p-3 text-left">LRN</th>
              <th className="p-3 text-left">NAME</th>
              <th className="p-3 text-left">GENDER</th>
              <th className="p-3 text-left">LEVEL</th>
              <th className="p-3 text-left">AGE</th>
              <th className="p-3 text-left">BIRTHDAY</th>
              <th className="p-3 text-left">REMARKS</th>
              <th className="p-1 text-left">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    <img
                      src={
                        user.studentData?.photo ||
                        user.guideData?.photo ||
                        user.adminData?.photo ||
                        "https://placehold.co/120x120"
                      }
                      alt={formatUserName(user)}
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="p-3">{user.schoolId}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">{user.studentData?.lrn || "N/A"}</td>
                  <td className="p-3">{formatUserName(user)}</td>
                  <td className="p-3">{user.studentData?.gender || "N/A"}</td>
                  <td className="p-3">{user.studentData?.level || "N/A"}</td>
                  <td className="p-3">{user.studentData?.age || "N/A"}</td>
                  <td className="p-3">
                    {user.studentData?.birthday
                      ? new Date(user.studentData.birthday).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">{user.studentData?.remarks || "N/A"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleUserClick(user)}
                      className="text-[#4A154B] hover:text-purple-900"
                    >
                      <FaFileAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="p-3 text-center">
                  No active users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ReportCard Form Pop-up */}
      {showReportCard && selectedStudent && (
        <ReportCard onClose={handleCloseReportCard} student={selectedStudent} />
      )}
    </div>
  );
};

export default Class;
