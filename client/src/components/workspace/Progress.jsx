import { useState, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loader from "../style/Loader";

// RemarksForm Component (unchanged)
const RemarksForm = ({ onClose, onSave, initialRemarks }) => {
  const [remarks, setRemarks] = useState(initialRemarks || "");

  const handleSave = () => {
    onSave(remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-5xl border w-96">
        <h2 className="text-xl font-bold mb-4">Edit Remarks</h2>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full h-24 p-2 border rounded-lg"
          placeholder="Enter remarks..."
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#9d16be] text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Progress Component
const Progress = () => {
  const [progress, setProgress] = useState({});
  const [selectedUser, setSelectedUser] = useState("USER NAME"); // Changed to "USER NAME" for all roles
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]); // Renamed to "users" for all roles
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState("Quarter 1");
  const [feedback, setFeedback] = useState({});
  const [unsavedFeedback, setUnsavedFeedback] = useState({});
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { backendUrl, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const quarterWeeks = {
    "Quarter 1": ["Week 1", "Week 2", "Week 3"],
    "Quarter 2": ["Week 4", "Week 5", "Week 6"],
    "Quarter 3": ["Week 7", "Week 8", "Week 9"],
    "Quarter 4": ["Week 10", "Week 11", "Week 12"],
  };

  const quarterToMongo = {
    "Quarter 1": "quarter1",
    "Quarter 2": "quarter2",
    "Quarter 3": "quarter3",
    "Quarter 4": "quarter4",
  };
  const weekToMongo = {
    "Week 1": "week1",
    "Week 2": "week2",
    "Week 3": "week3",
    "Week 4": "week4",
    "Week 5": "week5",
    "Week 6": "week6",
    "Week 7": "week7",
    "Week 8": "week8",
    "Week 9": "week9",
    "Week 10": "week10",
    "Week 11": "week11",
    "Week 12": "week12",
  };

  // Fetch initial data (classes and active users)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/school/class-list`,
          {
            withCredentials: true,
          }
        );

        if (response.status !== 200 || !response.data.success) {
          throw new Error("Failed to fetch data");
        }

        const data = response.data;
        // Filter only active users
        const activeUsers = data.students.filter(
          (user) => user.isActive === true
        );
        const uniqueClasses = [
          ...new Set(
            activeUsers.map((user) => user.studentData?.class).filter(Boolean)
          ),
        ];
        setClasses(uniqueClasses);
        setUsers(activeUsers);

        const initialProgress = {};
        const initialFeedback = {};
        activeUsers.forEach((user) => {
          initialProgress[user._id] = {};
          initialFeedback[user._id] = {
            "Quarter 1": ["", "", ""],
            "Quarter 2": ["", "", ""],
            "Quarter 3": ["", "", ""],
            "Quarter 4": ["", "", ""],
          };

          // Only process lessons for students
          if (user.role === "student" && user.studentData?.lessons) {
            user.studentData.lessons.forEach((lesson, index) => {
              let presented = false;
              let practiced = false;
              let mastered = false;
              let latestDate = lesson.start_date
                ? new Date(lesson.start_date).toLocaleDateString()
                : "";

              const subRows = lesson.subwork.map((sub, subIndex) => ({
                presented:
                  sub.status === "presented" ||
                  sub.status === "practiced" ||
                  sub.status === "mastered",
                practiced:
                  sub.status === "practiced" || sub.status === "mastered",
                mastered: sub.status === "mastered",
                date: sub.status_date
                  ? new Date(sub.status_date).toLocaleDateString()
                  : "",
                subwork_name: `Day ${subIndex + 1}: ${lesson.lesson_work}`,
                updatedBy: sub.updatedBy,
              }));

              if (subRows.length > 0) {
                const latestSubRow = subRows[subRows.length - 1];
                presented = latestSubRow.presented;
                practiced = latestSubRow.practiced;
                mastered = latestSubRow.mastered;
                latestDate = latestSubRow.date;
              } else {
                presented = true;
              }

              initialProgress[user._id][index] = {
                presented,
                practiced,
                mastered,
                remarks: lesson.remarks || "",
                expanded: false,
                subRows,
                date: latestDate,
              };
            });
          }
        });
        setProgress(initialProgress);
        setFeedback(initialFeedback);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  // Fetch feedback for the selected user
  useEffect(() => {
    const fetchFeedback = async () => {
      if (selectedUser === "USER NAME") return;

      const user = users.find((u) => formatUserName(u) === selectedUser);
      if (!user || !user.schoolId) return;

      const quarters = ["quarter1", "quarter2", "quarter3", "quarter4"];
      const quarterMapping = {
        quarter1: "Quarter 1",
        quarter2: "Quarter 2",
        quarter3: "Quarter 3",
        quarter4: "Quarter 4",
      };
      const weekMapping = {
        quarter1: ["week1", "week2", "week3"],
        quarter2: ["week4", "week5", "week6"],
        quarter3: ["week7", "week8", "week9"],
        quarter4: ["week10", "week11", "week12"],
      };

      const updatedFeedback = { ...feedback };

      try {
        for (const quarter of quarters) {
          const feedbackResponse = await axios.get(
            `${backendUrl}/api/school/get-feedback`,
            {
              params: { schoolId: user.schoolId, quarter },
              withCredentials: true,
            }
          );

          if (
            feedbackResponse.status === 200 &&
            feedbackResponse.data.success
          ) {
            const fetchedFeedback = feedbackResponse.data.data || {};
            const weekFeedback = weekMapping[quarter].map(
              (week) => fetchedFeedback[week] || ""
            );
            updatedFeedback[user._id][quarterMapping[quarter]] = weekFeedback;
          }
        }
        setFeedback(updatedFeedback);
      } catch (feedbackError) {
        console.error(
          `Error fetching feedback for ${user.schoolId}:`,
          feedbackError
        );
        toast.error("Failed to fetch feedback.");
      }
    };

    fetchFeedback();
  }, [selectedUser, users, backendUrl, feedback]);

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

  const filteredUsers = selectedClass
    ? users.filter((user) => user.studentData?.class === selectedClass)
    : [];

  const fetchSubwork = async (userId, lessonIndex) => {
    try {
      const response = await axios.get(`${backendUrl}/api/school/get-subwork`, {
        params: { studentId: userId, lessonIndex },
        withCredentials: true,
      });

      if (response.data.success) {
        setProgress((prev) => {
          const newProgress = { ...prev };
          const user = users.find((u) => u._id === userId);
          const lesson = user.studentData?.lessons?.[lessonIndex];
          if (!lesson) return prev;

          const subRows = response.data.subwork.map((sub, subIndex) => ({
            presented:
              sub.status === "presented" ||
              sub.status === "practiced" ||
              sub.status === "mastered",
            practiced: sub.status === "practiced" || sub.status === "mastered",
            mastered: sub.status === "mastered",
            date: sub.status_date
              ? new Date(sub.status_date).toLocaleDateString()
              : "",
            subwork_name: `Day ${subIndex + 1}: ${lesson.lesson_work}`,
            updatedBy: sub.updatedBy,
          }));

          newProgress[userId][lessonIndex].subRows = subRows;

          if (subRows.length > 0) {
            const latestSubRow = subRows[subRows.length - 1];
            newProgress[userId][lessonIndex] = {
              ...newProgress[userId][lessonIndex],
              presented: latestSubRow.presented,
              practiced: latestSubRow.practiced,
              mastered: latestSubRow.mastered,
              date: latestSubRow.date,
            };
          }

          return newProgress;
        });
      }
    } catch (error) {
      console.error("Error fetching subwork:", error);
      toast.error("Failed to fetch subwork data.");
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedUser("USER NAME");
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const getUserProgress = (userId) => {
    return progress[userId] || {};
  };

  const countStatus = (userId) => {
    const userProgress = getUserProgress(userId);
    const lessons = Object.values(userProgress);
    return {
      presented: lessons.filter((row) => row.presented).length,
      practiced: lessons.reduce(
        (total, row) =>
          total + row.subRows.filter((subRow) => subRow.practiced).length,
        0
      ),
      mastered: lessons.filter((row) => row.mastered).length,
      total: lessons.length,
      needsAttention: lessons.reduce(
        (total, row) =>
          total +
          (row.subRows.filter((subRow) => subRow.practiced).length >= 8
            ? 1
            : 0),
        0
      ),
    };
  };

  const toggleDropdown = async (index, user) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      newProgress[user._id][index].expanded =
        !newProgress[user._id][index].expanded;
      return newProgress;
    });

    if (!progress[user._id][index].expanded) {
      await fetchSubwork(user._id, index);
    }
  };

  const handleCheckboxChange = (userId, index, field) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      const row = { ...newProgress[userId][index] };

      if (field === "presented") {
        if (!row.presented && (row.practiced || row.mastered)) return prev;
        row.presented = !row.presented;
        if (!row.presented) {
          row.practiced = false;
          row.mastered = false;
        }
        row.date = row.presented ? new Date().toLocaleDateString() : "";
      } else if (field === "practiced" && row.presented) {
        if (!row.practiced && row.mastered) return prev;
        row.practiced = !row.practiced;
        if (!row.practiced) row.mastered = false;
      } else if (field === "mastered" && row.presented && row.practiced) {
        row.mastered = !row.mastered;
        row.date = row.mastered ? new Date().toLocaleDateString() : row.date;
      }

      newProgress[userId][index] = row;
      saveProgressToMongo(userId, index, row);
      return newProgress;
    });
  };

  const handleSubRowCheckboxChange = (userId, index, subIndex, field) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      const row = { ...newProgress[userId][index] };
      const subRow = { ...row.subRows[subIndex] };

      if (field === "presented") {
        if (!subRow.presented && (subRow.practiced || subRow.mastered))
          return prev;
        subRow.presented = !subRow.presented;
        if (!subRow.presented) {
          subRow.practiced = false;
          subRow.mastered = false;
        }
        subRow.date = subRow.presented ? new Date().toLocaleDateString() : "";
      } else if (field === "practiced" && subRow.presented) {
        if (!subRow.practiced && subRow.mastered) return prev;
        subRow.practiced = !subRow.practiced;
        if (!subRow.practiced) subRow.mastered = false;
      } else if (field === "mastered" && subRow.presented && subRow.practiced) {
        subRow.mastered = !subRow.mastered;
        subRow.date = subRow.mastered
          ? new Date().toLocaleDateString()
          : subRow.date;
      }

      row.subRows[subIndex] = subRow;

      const latestSubRow = row.subRows[row.subRows.length - 1];
      newProgress[userId][index] = {
        ...row,
        presented: latestSubRow.presented,
        practiced: latestSubRow.practiced,
        mastered: latestSubRow.mastered,
        date: latestSubRow.date,
      };

      saveProgressToMongo(userId, index, newProgress[userId][index]);
      return newProgress;
    });
  };

  const saveProgressToMongo = async (userId, lessonIndex, progressData) => {
    try {
      await axios.post(
        `${backendUrl}/api/school/save-progress`,
        {
          studentId: userId, // Renamed to userId for consistency
          lessonIndex,
          progress: {
            presented: progressData.presented,
            practiced: progressData.practiced,
            mastered: progressData.mastered,
            remarks: progressData.remarks,
            subRows: progressData.subRows,
            date: progressData.date,
          },
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Failed to save progress.");
    }
  };

  const handleAddSubwork = async (index, user) => {
    if (user.role !== "student" || !user.studentData?.lessons) return;

    const lesson = user.studentData.lessons[index];
    const subRowsCount = progress[user._id][index].subRows.length;
    const newDayNumber = subRowsCount + 1;
    const newSubwork = {
      subwork_name: `Day ${newDayNumber}: ${lesson.lesson_work}`,
      status: "presented",
      subwork_remarks: "",
      status_date: new Date(),
      updatedBy: userData.email,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/school/add-subwork`,
        {
          studentId: user._id,
          lessonIndex: index,
          subwork: newSubwork,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setProgress((prev) => {
          const newProgress = { ...prev };
          const newSubRow = {
            presented: true,
            practiced: false,
            mastered: false,
            date: new Date().toLocaleDateString(),
            subwork_name: `Day ${newDayNumber}: ${lesson.lesson_work}`,
            updatedBy: newSubwork.updatedBy,
          };

          newProgress[user._id][index].subRows.push(newSubRow);
          newProgress[user._id][index].expanded = true;

          newProgress[user._id][index] = {
            ...newProgress[user._id][index],
            presented: newSubRow.presented,
            practiced: newSubRow.practiced,
            mastered: newSubRow.mastered,
            date: newSubRow.date,
          };

          return newProgress;
        });
        toast.success("Subwork added successfully!");
      }
    } catch (error) {
      console.error("Error adding subwork:", error);
      toast.error("Failed to add subwork.");
    }
  };

  const handleEditRemarks = (index) => {
    setEditIndex(index);
  };

  const handleSaveRemarks = (index, remarks) => {
    const user = users.find((u) => formatUserName(u) === selectedUser);
    setProgress((prev) => {
      const newProgress = { ...prev };
      newProgress[user._id][index].remarks = remarks;
      saveProgressToMongo(user._id, index, newProgress[user._id][index]);
      return newProgress;
    });
    setEditIndex(null);
  };

  const handleFeedbackChange = (userId, weekIndex, value) => {
    setUnsavedFeedback((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [selectedQuarter]: {
          ...(prev[userId]?.[selectedQuarter] || ["", "", ""]),
          [weekIndex]: value,
        },
      },
    }));
  };

  const saveFeedbackToMongo = async (userId, quarter, weekIndex) => {
    const user = users.find((u) => u._id === userId);
    if (!user || !user.schoolId) {
      console.error("User not found or missing schoolId:", userId);
      toast.error("Cannot save feedback: User not found.");
      return;
    }

    const feedbackText = unsavedFeedback[userId]?.[quarter]?.[weekIndex] || "";
    const mongoQuarter = quarterToMongo[quarter];
    const mongoWeek = weekToMongo[quarterWeeks[quarter][weekIndex]];

    try {
      const response = await axios.post(
        `${backendUrl}/api/school/save-feedback`,
        {
          schoolId: user.schoolId,
          quarter: mongoQuarter,
          week: mongoWeek,
          feedbackText,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Feedback saved successfully!");
        setFeedback((prev) => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            [quarter]: prev[userId][quarter].map((val, idx) =>
              idx === weekIndex ? feedbackText : val
            ),
          },
        }));
        setUnsavedFeedback((prev) => {
          const newUnsaved = { ...prev };
          if (newUnsaved[userId]?.[quarter]?.[weekIndex] !== undefined) {
            delete newUnsaved[userId][quarter][weekIndex];
            if (Object.keys(newUnsaved[userId][quarter]).length === 0) {
              delete newUnsaved[userId][quarter];
            }
            if (Object.keys(newUnsaved[userId]).length === 0) {
              delete newUnsaved[userId];
            }
          }
          return newUnsaved;
        });
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error(
        `Failed to save feedback: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const filterProgress = (userId) => {
    const userProgress = getUserProgress(userId);
    return Object.entries(userProgress).filter(([_, row]) => {
      const practicedCount = row.subRows.filter((sub) => sub.practiced).length;
      if (filterStatus === "All") return true;
      if (filterStatus === "Not Presented")
        return !row.presented && !row.practiced && !row.mastered;
      if (filterStatus === "Presented")
        return row.presented && !row.practiced && !row.mastered;
      if (filterStatus === "Practiced") return row.practiced && !row.mastered;
      if (filterStatus === "Mastered") return row.mastered;
      if (filterStatus === "Needs Attention") return practicedCount >= 8;
      return true;
    });
  };

  const getStatusIndicator = (row) => {
    const practicedCount = row.subRows.filter((sub) => sub.practiced).length;
    if (practicedCount >= 8)
      return <span className="text-red-500 font-bold">!</span>;
    if (row.mastered)
      return (
        <span className="w-2 h-2 bg-purple-500 rounded-full inline-block"></span>
      );
    if (row.practiced)
      return (
        <span className="w-2 h-2 bg-orange-500 rounded-full inline-block"></span>
      );
    if (row.presented)
      return (
        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
      );
    return (
      <span className="w-2 h-2 bg-gray-500 rounded-full inline-block"></span>
    );
  };

  return (
    <div className="mt-30 flex-grow bg-cover bg-center p-4 overflow-auto">
      {/* Header Section */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-8">
          <div className="text-black font-bold text-2xl lg:text-4xl whitespace-nowrap">
            {selectedUser === "USER NAME" ? "USER NAME" : selectedUser}
          </div>
          <select
            className="w-full lg:w-60 h-12 bg-[#d9d9d9] rounded-[15px] px-4"
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
          <select
            className="w-full lg:w-60 h-12 bg-[#d9d9d9] rounded-[15px] px-4"
            value={selectedUser}
            onChange={handleUserChange}
          >
            <option value="USER NAME">Select User</option>
            {filteredUsers.map((user) => (
              <option key={user._id} value={formatUserName(user)}>
                {formatUserName(user)}
              </option>
            ))}
          </select>
          <div className="relative w-full lg:w-150 flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-12 bg-[#d9d9d9] rounded-[15px] px-4 pl-10 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img
                src={assets.search}
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v5.586a1 1 0 01-.293.707l-2 2A1 1 0 0110 23v-7.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z"
                  />
                </svg>
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setFilterStatus("All");
                      setShowFilterDropdown(false);
                    }}
                  >
                    All
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setFilterStatus("Not Presented");
                      setShowFilterDropdown(false);
                    }}
                  >
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                    Not Presented
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setFilterStatus("Presented");
                      setShowFilterDropdown(false);
                    }}
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Presented
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setFilterStatus("Practiced");
                      setShowFilterDropdown(false);
                    }}
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Practiced
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setFilterStatus("Mastered");
                      setShowFilterDropdown(false);
                    }}
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Mastered
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setFilterStatus("Needs Attention");
                      setShowFilterDropdown(false);
                    }}
                  >
                    <span className="text-red-500 font-bold mr-2">!</span>Needs
                    Attention
                  </div>
                </div>
              )}
            </div>
            <select
              className="w-40 h-12 bg-[#d9d9d9] rounded-[15px] px-4"
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
            >
              <option value="Quarter 1">Quarter 1</option>
              <option value="Quarter 2">Quarter 2</option>
              <option value="Quarter 3">Quarter 3</option>
              <option value="Quarter 4">Quarter 4</option>
            </select>
          </div>
        </div>
      </div>

      {/* Count Cards Section */}
      {selectedUser !== "USER NAME" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#5BB381] p-4 rounded-lg shadow text-center">
            <p className="text-lg font-bold">
              {
                countStatus(
                  users.find((u) => formatUserName(u) === selectedUser)._id
                ).presented
              }
            </p>
            <p className="text-sm text-black">Presented</p>
          </div>
          <div className="bg-[#E3B34C] p-4 rounded-lg shadow text-center">
            <p className="text-lg font-bold">
              {
                countStatus(
                  users.find((u) => formatUserName(u) === selectedUser)._id
                ).practiced
              }
            </p>
            <p className="text-sm text-black">Practiced</p>
          </div>
          <div className="bg-[#ac61ae] p-4 rounded-lg shadow text-center">
            <p className="text-lg font-bold">
              {
                countStatus(
                  users.find((u) => formatUserName(u) === selectedUser)._id
                ).mastered
              }
            </p>
            <p className="text-sm text-black">Mastered</p>
          </div>
          <div className="bg-[#aeadad] p-4 rounded-lg shadow text-center">
            <p className="text-lg font-bold">
              {
                countStatus(
                  users.find((u) => formatUserName(u) === selectedUser)._id
                ).total
              }
            </p>
            <p className="text-sm text-black">Total</p>
          </div>
          <div className="bg-[#ff4444] p-4 rounded-lg shadow text-center">
            <p className="text-lg font-bold">
              {
                countStatus(
                  users.find((u) => formatUserName(u) === selectedUser)._id
                ).needsAttention
              }
            </p>
            <p className="text-sm text-black">Needs Attention</p>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-[#4A154B] text-white">
            <tr>
              <th className="p-3 text-center w-1/4">WORK</th>
              <th className="p-3 text-center w-1/16">PRESENTED</th>
              <th className="p-3 text-center w-1/16">PRACTICED</th>
              <th className="p-3 text-center w-1/16">MASTERED</th>
              <th className="p-3 text-center w-1/6">REMARKS</th>
              <th className="p-3 text-center w-1/16">DATE</th>
              <th className="p-3 text-center w-1/12">ADD</th>
            </tr>
          </thead>
          <tbody>
            {!selectedUser || selectedUser === "USER NAME" ? (
              <tr>
                <td colSpan="7" className="p-3 text-center">
                  Select a user to review progress.
                </td>
              </tr>
            ) : (
              (() => {
                const user = users.find(
                  (u) => formatUserName(u) === selectedUser
                );
                if (!user) {
                  return (
                    <tr>
                      <td colSpan="7" className="p-3 text-center">
                        User not found.
                      </td>
                    </tr>
                  );
                }
                if (
                  user.role !== "student" ||
                  !user.studentData?.lessons?.length
                ) {
                  return (
                    <tr>
                      <td colSpan="7" className="p-3 text-center">
                        {user.role === "student"
                          ? "Oops! Create a lesson plan for this student to start tracking progress."
                          : "Progress tracking is only available for students."}
                      </td>
                    </tr>
                  );
                }
                return filterProgress(user._id).map(([index, row]) => (
                  <>
                    <tr key={index} className="border-b">
                      <td className="p-3 flex justify-between items-center">
                        <span className="flex items-center">
                          {getStatusIndicator(row)}
                          <span className="ml-2">
                            {user.studentData.lessons[index]?.lesson_work ||
                              `Work ${index + 1}`}
                          </span>
                        </span>
                        {row.subRows.length > 0 && (
                          <button
                            onClick={() => toggleDropdown(index, user)}
                            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                          >
                            {row.expanded ? "▲" : "▼"}
                          </button>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#3cd416] checked:border-gray"
                          checked={row.presented}
                          onChange={() =>
                            handleCheckboxChange(user._id, index, "presented")
                          }
                          disabled={row.practiced || row.mastered}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#e5a91b] checked:border-gray"
                          checked={row.practiced}
                          onChange={() =>
                            handleCheckboxChange(user._id, index, "practiced")
                          }
                          disabled={!row.presented || row.mastered}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#c32cdd] checked:border-gray"
                          checked={row.mastered}
                          onChange={() =>
                            handleCheckboxChange(user._id, index, "mastered")
                          }
                          disabled={!row.presented || !row.practiced}
                        />
                      </td>
                      <td className="p-3 relative">
                        {user.studentData.lessons[index]?.remarks || "-"}
                        <button
                          onClick={() => handleEditRemarks(index)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        >
                          <img
                            src={assets.edit}
                            alt="Edit"
                            className="w-5 h-5"
                          />
                        </button>
                      </td>
                      <td className="p-3">{row.date || "-"}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleAddSubwork(index, user)}
                          className="bg-[#4A154B] text-white px-4 py-2 rounded-lg"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                    {row.expanded &&
                      row.subRows.map((subRow, subIndex) => (
                        <tr
                          key={`sub-${index}-${subIndex}`}
                          className="border-b bg-gray-300"
                        >
                          <td className="p-3">{subRow.subwork_name}</td>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#3cd416] checked:border-gray"
                              checked={subRow.presented}
                              onChange={() =>
                                handleSubRowCheckboxChange(
                                  user._id,
                                  index,
                                  subIndex,
                                  "presented"
                                )
                              }
                              disabled={subRow.practiced || subRow.mastered}
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#e5a91b] checked:border-gray"
                              checked={subRow.practiced}
                              onChange={() =>
                                handleSubRowCheckboxChange(
                                  user._id,
                                  index,
                                  subIndex,
                                  "practiced"
                                )
                              }
                              disabled={!subRow.presented || subRow.mastered}
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#c32cdd] checked:border-gray"
                              checked={subRow.mastered}
                              onChange={() =>
                                handleSubRowCheckboxChange(
                                  user._id,
                                  index,
                                  subIndex,
                                  "mastered"
                                )
                              }
                              disabled={!subRow.presented || !subRow.practiced}
                            />
                          </td>
                          <td className="p-3 flex justify-between items-center">
                            {subRow.subwork_remarks || "-"}
                            <button onClick={() => handleEditRemarks(index)}>
                              <img
                                src={assets.edit}
                                alt="Edit"
                                className="w-5 h-5"
                                style={{ filter: "grayscale(100%)" }}
                              />
                            </button>
                          </td>
                          <td className="p-3">{subRow.date || "-"}</td>
                          <td className="p-3">{subRow.updatedBy || "-"}</td>
                        </tr>
                      ))}
                  </>
                ));
              })()
            )}
          </tbody>
        </table>
      </div>

      {/* Feedback Section */}
      <div className="mt-8">
        <div className="bg-[#4A154B] text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">Feedback</h2>
        </div>
        <div className="bg-white rounded-b-lg shadow p-4">
          {selectedUser !== "USER NAME" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quarterWeeks[selectedQuarter].map((weekLabel, weekIndex) => {
                const user = users.find(
                  (u) => formatUserName(u) === selectedUser
                );
                const userId = user?._id;
                const savedFeedback =
                  feedback[userId]?.[selectedQuarter]?.[weekIndex] || "";
                const unsavedValue =
                  unsavedFeedback[userId]?.[selectedQuarter]?.[weekIndex];
                const displayValue =
                  unsavedValue !== undefined ? unsavedValue : savedFeedback;

                return (
                  <div
                    key={weekIndex}
                    className="border border-gray-300 rounded-lg p-4"
                  >
                    <h4 className="font-semibold mb-2">{weekLabel}</h4>
                    <textarea
                      value={displayValue}
                      onChange={(e) =>
                        handleFeedbackChange(userId, weekIndex, e.target.value)
                      }
                      className="w-full h-24 p-2 border rounded-lg"
                      placeholder={`Enter feedback for ${weekLabel}...`}
                    />
                    <button
                      onClick={() =>
                        saveFeedbackToMongo(userId, selectedQuarter, weekIndex)
                      }
                      className="mt-2 bg-[#4A154B] text-white px-4 py-2 rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Remarks Form Modal */}
      {editIndex !== null && (
        <RemarksForm
          onClose={() => setEditIndex(null)}
          onSave={(remarks) => handleSaveRemarks(editIndex, remarks)}
          initialRemarks={
            progress[
              users.find((u) => formatUserName(u) === selectedUser)._id
            ]?.[editIndex]?.remarks || ""
          }
        />
      )}
    </div>
  );
};

export default Progress;
