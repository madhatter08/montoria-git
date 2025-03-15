import { useState, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

// Mock RemarksForm component
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

const Progress = () => {
  const [progress, setProgress] = useState({});
  const [selectedStudent, setSelectedStudent] = useState("STUDENT NAME");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState("Quarter 1");
  const [feedback, setFeedback] = useState({});
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { backendUrl, userData } = useContext(AppContext);

  const quarterWeeks = {
    "Quarter 1": ["Week 1", "Week 2", "Week 3"],
    "Quarter 2": ["Week 4", "Week 5", "Week 6"],
    "Quarter 3": ["Week 7", "Week 8", "Week 9"],
    "Quarter 4": ["Week 10", "Week 11", "Week 12"]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/school/class-list`,
          { withCredentials: true }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }

        const data = response.data;
        const uniqueClasses = [
          ...new Set(data.students.map((student) => student.studentData.class)),
        ];
        setClasses(uniqueClasses);
        setStudents(data.students);

        const initialProgress = {};
        const initialFeedback = {};
        data.students.forEach(student => {
          initialProgress[student._id] = {};
          initialFeedback[student._id] = {
            "Quarter 1": ["", "", ""],
            "Quarter 2": ["", "", ""],
            "Quarter 3": ["", "", ""],
            "Quarter 4": ["", "", ""]
          };
          student.studentData.lessons.forEach((_, index) => {
            initialProgress[student._id][index] = {
              presented: false,
              practiced: false,
              mastered: false,
              remarks: "",
              expanded: false,
              subRows: [],
              date: ""
            };
          });
        });
        setProgress(initialProgress);
        setFeedback(initialFeedback);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backendUrl]);

  const filteredStudents = selectedClass
    ? students.filter((student) => student.studentData.class === selectedClass)
    : [];

  const fetchSubwork = async (studentId, lessonIndex) => {
    try {
      const response = await axios.get(`${backendUrl}/api/school/get-subwork`, {
        params: { studentId, lessonIndex },
        withCredentials: true,
      });

      if (response.data.success) {
        setProgress((prev) => {
          const newProgress = { ...prev };
          newProgress[studentId][lessonIndex].subRows = response.data.subwork.map(
            (sub) => ({
              presented: sub.status === "presented",
              practiced: sub.status === "practiced",
              mastered: sub.status === "mastered",
              date: sub.status_date
                ? new Date(sub.status_date).toLocaleDateString()
                : "",
            })
          );
          const latestSubRow = newProgress[studentId][lessonIndex].subRows.slice(-1)[0] || {};
          newProgress[studentId][lessonIndex] = {
            ...newProgress[studentId][lessonIndex],
            ...latestSubRow
          };
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
    setSelectedStudent("STUDENT NAME");
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const getStudentProgress = (studentId) => {
    return progress[studentId] || {};
  };

  const countStatus = (studentId) => {
    const studentProgress = getStudentProgress(studentId);
    const lessons = Object.values(studentProgress);
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
          total + (row.subRows.filter((subRow) => subRow.practiced).length >= 8 ? 1 : 0),
        0
      )
    };
  };

  const toggleDropdown = async (index, student) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      newProgress[student._id][index].expanded = !newProgress[student._id][index].expanded;
      return newProgress;
    });

    if (!progress[student._id][index].expanded) {
      await fetchSubwork(student._id, index);
    }
  };

  const handleCheckboxChange = (studentId, index, field) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      const row = { ...newProgress[studentId][index] };

      if (field === "presented") {
        row.presented = !row.presented;
        if (!row.presented) {
          row.practiced = false;
          row.mastered = false;
        }
        row.date = row.presented ? new Date().toLocaleDateString() : "";
      } else if (field === "practiced" && row.presented) {
        row.practiced = !row.practiced;
        if (!row.practiced) row.mastered = false;
      } else if (field === "mastered" && row.presented && row.practiced) {
        row.mastered = !row.mastered;
        row.date = row.mastered ? new Date().toLocaleDateString() : row.date;
      }

      newProgress[studentId][index] = row;
      saveProgressToMongo(studentId, index, row);
      return newProgress;
    });
  };

  const handleSubRowCheckboxChange = (studentId, index, subIndex, field) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      const row = { ...newProgress[studentId][index] };
      const subRow = { ...row.subRows[subIndex] };

      if (field === "presented") {
        subRow.presented = !subRow.presented;
        if (!subRow.presented) {
          subRow.practiced = false;
          subRow.mastered = false;
        }
        subRow.date = subRow.presented ? new Date().toLocaleDateString() : "";
      } else if (field === "practiced" && subRow.presented) {
        subRow.practiced = !subRow.practiced;
        if (!subRow.practiced) subRow.mastered = false;
      } else if (field === "mastered" && subRow.presented && subRow.practiced) {
        subRow.mastered = !subRow.mastered;
        subRow.date = subRow.mastered ? new Date().toLocaleDateString() : subRow.date;
      }

      row.subRows[subIndex] = subRow;
      newProgress[studentId][index] = { ...row, ...subRow };
      saveProgressToMongo(studentId, index, newProgress[studentId][index]);
      return newProgress;
    });
  };

  const saveProgressToMongo = async (studentId, lessonIndex, progressData) => {
    try {
      await axios.post(
        `${backendUrl}/api/school/save-progress`,
        {
          studentId,
          lessonIndex,
          progress: {
            presented: progressData.presented,
            practiced: progressData.practiced,
            mastered: progressData.mastered,
            remarks: progressData.remarks,
            subRows: progressData.subRows,
            date: progressData.date
          }
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Failed to save progress.");
    }
  };

  const handleAddSubwork = async (index, student) => {
    const lesson = student.studentData.lessons[index];
    const newSubwork = {
      subwork_name: `Day ${lesson.subwork.length + 1}: ${lesson.lesson_work}`,
      status: "presented",
      subwork_remarks: "",
      status_date: new Date(),
      updatedBy: userData.email,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/school/add-subwork`,
        {
          studentId: student._id,
          lessonIndex: index,
          subwork: newSubwork,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setProgress((prev) => {
          const newProgress = { ...prev };
          newProgress[student._id][index].subRows.push({
            presented: true,
            practiced: false,
            mastered: false,
            date: new Date().toLocaleDateString(),
          });
          newProgress[student._id][index].expanded = true;
          newProgress[student._id][index] = {
            ...newProgress[student._id][index],
            ...newProgress[student._id][index].subRows.slice(-1)[0]
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
    const student = students.find((s) => s.studentData.firstName === selectedStudent);
    setProgress((prev) => {
      const newProgress = { ...prev };
      newProgress[student._id][index].remarks = remarks;
      saveProgressToMongo(student._id, index, newProgress[student._id][index]);
      return newProgress;
    });
    setEditIndex(null);
  };

  const handleFeedbackChange = (studentId, weekIndex, value) => {
    setFeedback((prev) => {
      const newFeedback = { ...prev };
      newFeedback[studentId][selectedQuarter][weekIndex] = value;
      saveFeedbackToMongo(studentId, selectedQuarter, newFeedback[studentId][selectedQuarter]);
      return newFeedback;
    });
  };

  const saveFeedbackToMongo = async (studentId, quarter, feedbackData) => {
    try {
      await axios.post(
        `${backendUrl}/api/school/save-feedback`,
        {
          studentId,
          quarter,
          feedback: feedbackData
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error("Failed to save feedback.");
    }
  };

  const filterProgress = (studentId) => {
    const studentProgress = getStudentProgress(studentId);
    return Object.entries(studentProgress).filter(([_, row]) => {
      const practicedCount = row.subRows.filter((sub) => sub.practiced).length;
      if (filterStatus === "All") return true;
      if (filterStatus === "Not Presented") return !row.presented && !row.practiced && !row.mastered;
      if (filterStatus === "Presented") return row.presented && !row.practiced && !row.mastered;
      if (filterStatus === "Practiced") return row.practiced && !row.mastered;
      if (filterStatus === "Mastered") return row.mastered;
      if (filterStatus === "Needs Attention") return practicedCount >= 8;
      return true;
    });
  };

  const getStatusIndicator = (row) => {
    const practicedCount = row.subRows.filter((sub) => sub.practiced).length;
    if (practicedCount >= 8) return <span className="text-red-500 font-bold">!</span>;
    if (row.mastered) return <span className="w-2 h-2 bg-purple-500 rounded-full inline-block"></span>;
    if (row.practiced) return <span className="w-2 h-2 bg-orange-500 rounded-full inline-block"></span>;
    if (row.presented) return <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>;
    return <span className="w-2 h-2 bg-gray-500 rounded-full inline-block"></span>;
  };

  return (
    <div className="mt-30 flex-grow bg-cover bg-center p-4 overflow-auto">
      {/* Header Section */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-8">
          <div className="text-black font-bold text-2xl lg:text-4xl whitespace-nowrap">
            {selectedStudent === "STUDENT NAME"
              ? "STUDENT NAME"
              : (() => {
                  const student = students.find(
                    (s) => s.studentData.firstName === selectedStudent
                  );
                  if (student) {
                    const { lastName, firstName, middleName } = student.studentData;
                    const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";
                    return `${lastName}, ${firstName} ${middleInitial}`;
                  }
                  return "STUDENT NAME";
                })()}
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
            value={selectedStudent}
            onChange={handleStudentChange}
          >
            <option value="STUDENT NAME">Select Student</option>
            {filteredStudents.map((student) => (
              <option key={student._id} value={student.studentData.firstName}>
                {`${student.studentData.lastName}, ${student.studentData.firstName} ${
                  student.studentData.middleName ? `${student.studentData.middleName.charAt(0)}.` : ""
                }`}
              </option>
            ))}
          </select>
          <div className="relative w-full lg:w-96 flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="h-12 bg-[#d9d9d9] rounded-[15px] px-4 pl-10 pr-10"
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v5.586a1 1 0 01-.293.707l-2 2A1 1 0 0110 23v-7.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
                </svg>
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => { setFilterStatus("All"); setShowFilterDropdown(false); }}
                  >
                    All
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => { setFilterStatus("Not Presented"); setShowFilterDropdown(false); }}
                  >
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>Not Presented
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => { setFilterStatus("Presented"); setShowFilterDropdown(false); }}
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Presented
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => { setFilterStatus("Practiced"); setShowFilterDropdown(false); }}
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Practiced
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => { setFilterStatus("Mastered"); setShowFilterDropdown(false); }}
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Mastered
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => { setFilterStatus("Needs Attention"); setShowFilterDropdown(false); }}
                  >
                    <span className="text-red-500 font-bold mr-2">!</span>Needs Attention
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
      {selectedStudent !== "STUDENT NAME" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#5BB381] p-4 rounded-lg shadow text-center">
            <p className="text-lg font-bold">{countStatus(students.find(s => s.studentData.firstName === selectedStudent)._id).presented}</p>
            <p className="text-sm text-black">Presented</p>
          </div>
          <div className="bg-[#E3B34C] p-4 rounded-lg shadow text-center">
            <p className="text-lg font-bold">{countStatus(students.find(s => s.studentData.firstName === selectedStudent)._id).practiced}</p>
            <p className="text-sm text-black">Practiced</p>
          </div>
          <div className="bg-[#ac61ae] p-4 rounded-lg shadow text-center">
            <p className="text-lg font-bold">{countStatus(students.find(s => s.studentData.firstName === selectedStudent)._id).mastered}</p>
            <p className="text-sm text-black">Mastered</p>
          </div>
          <div className="bg-[#aeadad] p-4 rounded-lg shadow text-center">
            <p className="text-lg font-bold">{countStatus(students.find(s => s.studentData.firstName === selectedStudent)._id).total}</p>
            <p className="text-sm text-black">Total</p>
          </div>
          <div className="bg-[#ff4444] p-4 rounded-lg shadow text-center">
            <p className="text-lg font-bold">{countStatus(students.find(s => s.studentData.firstName === selectedStudent)._id).needsAttention}</p>
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
            {!selectedStudent || selectedStudent === "STUDENT NAME" ? (
              <tr>
                <td colSpan="7" className="p-3 text-center">
                  Select a student to review progress.
                </td>
              </tr>
            ) : (
              (() => {
                const student = students.find(
                  (s) => s.studentData.firstName === selectedStudent
                );
                if (!student) {
                  return (
                    <tr>
                      <td colSpan="7" className="p-3 text-center">
                        Student not found.
                      </td>
                    </tr>
                  );
                }
                if (student.studentData.lessons.length === 0) {
                  return (
                    <tr>
                      <td colSpan="7" className="p-3 text-center">
                        Oops! Create a lesson plan for this student to start tracking progress.
                      </td>
                    </tr>
                  );
                }
                return filterProgress(student._id).map(([index, row]) => (
                  <>
                    <tr key={index} className="border-b">
                      <td className="p-3 flex justify-between items-center">
                        <span className="flex items-center">
                          {getStatusIndicator(row)}
                          <span className="ml-2">{student.studentData.lessons[index]?.lesson_work || `Work ${index + 1}`}</span>
                        </span>
                        <button
                          onClick={() => toggleDropdown(index, student)}
                          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          {row.expanded ? "▲" : "▼"}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#3cd416] checked:border-gray"
                          checked={row.presented}
                          onChange={() => handleCheckboxChange(student._id, index, "presented")}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#e5a91b] checked:border-gray"
                          checked={row.practiced}
                          onChange={() => handleCheckboxChange(student._id, index, "practiced")}
                          disabled={!row.presented}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#c32cdd] checked:border-gray"
                          checked={row.mastered}
                          onChange={() => handleCheckboxChange(student._id, index, "mastered")}
                          disabled={!row.presented || !row.practiced}
                        />
                      </td>
                      <td className="p-3 relative">
                        {student.studentData.lessons[index]?.remarks || "-"}
                        <button
                          onClick={() => handleEditRemarks(index)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        >
                          <img src={assets.edit} alt="Edit" className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="p-3">
                        {student.studentData.lessons[index]?.start_date
                          ? new Date(student.studentData.lessons[index].start_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleAddSubwork(index, student)}
                          className="bg-[#4A154B] text-white px-4 py-2 rounded-lg"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                    {row.expanded &&
                      row.subRows.map((subRow, subIndex) => {
                        const subwork = student.studentData.lessons[index]?.subwork[subIndex];
                        return (
                          <tr key={`sub-${index}-${subIndex}`} className="border-b bg-gray-300">
                            <td className="p-3">
                              {subwork?.subwork_name || `Day ${subIndex + 1}: ${student.studentData.lessons[index]?.lesson_work}`}
                            </td>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#3cd416] checked:border-gray"
                                checked={subRow.presented}
                                onChange={() =>
                                  handleSubRowCheckboxChange(student._id, index, subIndex, "presented")
                                }
                              />
                            </td>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#e5a91b] checked:border-gray"
                                checked={subRow.practiced}
                                onChange={() =>
                                  handleSubRowCheckboxChange(student._id, index, subIndex, "practiced")
                                }
                                disabled={!subRow.presented}
                              />
                            </td>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#c32cdd] checked:border-gray"
                                checked={subRow.mastered}
                                onChange={() =>
                                  handleSubRowCheckboxChange(student._id, index, subIndex, "mastered")
                                }
                                disabled={!subRow.presented || !subRow.practiced}
                              />
                            </td>
                            <td className="p-3 flex justify-between items-center">
                              -
                              <button onClick={() => handleEditRemarks(index)}>
                                <img
                                  src={assets.edit}
                                  alt="Edit"
                                  className="w-5 h-5"
                                  style={{ filter: "grayscale(100%)" }}
                                />
                              </button>
                            </td>
                            <td className="p-3">{subwork?.status_date || subRow.date || "-"}</td>
                            <td className="p-3">{subwork?.updatedBy || "-"}</td>
                          </tr>
                        );
                      })}
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
          {selectedStudent !== "STUDENT NAME" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quarterWeeks[selectedQuarter].map((weekLabel, weekIndex) => (
                <div key={weekIndex} className="border border-gray-300 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{weekLabel}</h4>
                  <textarea
                    value={feedback[students.find(s => s.studentData.firstName === selectedStudent)._id]?.[selectedQuarter]?.[weekIndex] || ""}
                    onChange={(e) => handleFeedbackChange(students.find(s => s.studentData.firstName === selectedStudent)._id, weekIndex, e.target.value)}
                    className="w-full h-24 p-2 border rounded-lg"
                    placeholder={`Enter feedback for ${weekLabel}...`}
                  />
                </div>
              ))}
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
            progress[students.find(s => s.studentData.firstName === selectedStudent)._id]?.[editIndex]?.remarks || ""
          }
        />
      )}
    </div>
  );
};

export default Progress;