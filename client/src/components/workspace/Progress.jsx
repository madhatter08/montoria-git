import { useState, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

// Mock RemarksForm component (replace with your actual form component)
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
  const [progress, setProgress] = useState(
    Array(15).fill({
      presented: false,
      practiced: false,
      mastered: false,
      remarks: "",
      expanded: false,
      subRows: [],
      date: "",
    })
  );

  const [selectedStudent, setSelectedStudent] = useState("STUDENT NAME");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [feedback, setFeedback] = useState(Array(4).fill(Array(3).fill("")));
  const [selectedWeek, setSelectedWeek] = useState(Array(4).fill(null));

  const { backendUrl, userData } = useContext(AppContext);

  // Fetch classes and students based on user role
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/school/class-list`,
          {
            withCredentials: true,
          }
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backendUrl]);

  // Filter students based on selected class
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
        // Update the state with the fetched subwork data
        setProgress((prev) => {
          const newProgress = [...prev];
          newProgress[lessonIndex].subRows = response.data.subwork.map(
            (sub) => ({
              presented: sub.status === "presented",
              practiced: sub.status === "practiced",
              mastered: sub.status === "mastered",
              date: sub.status_date
                ? new Date(sub.status_date).toLocaleDateString()
                : "",
            })
          );
          return newProgress;
        });
      } else {
        toast.error("Failed to fetch subwork data.");
      }
    } catch (error) {
      console.error("Error fetching subwork:", error);
      toast.error("Failed to fetch subwork data.");
    }
  };

  // Handle class selection
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedStudent("STUDENT NAME"); // Reset student selection
  };

  // Handle student selection
  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  // Calculate counts for Presented, Practiced, Mastered, and Total
  const countPresented = progress.filter((row) => row.presented).length;
  const countPracticed = progress.reduce(
    (total, row) =>
      total + row.subRows.filter((subRow) => subRow.practiced).length,
    0
  );
  const countMastered = progress.filter((row) => row.mastered).length;
  const totalWorks = progress.length;

  // Toggle dropdown for a row
  const toggleDropdown = async (index, student) => {
    setProgress((prev) => {
      const newProgress = [...prev];
      newProgress[index].expanded = !newProgress[index].expanded;
      return newProgress;
    });

    if (!progress[index].expanded) {
      await fetchSubwork(student._id, index);
    }
  };

  // Handle checkbox change for progress table
  const handleCheckboxChange = (index, field) => {
    setProgress((prev) => {
      const newProgress = [...prev];
      const row = { ...newProgress[index] };

      if (field === "presented") {
        row.presented = !row.presented;
        if (!row.presented) {
          row.practiced = false;
          row.mastered = false;
        }
        row.date = row.presented ? new Date().toLocaleDateString() : "";
      } else if (field === "practiced" && row.presented) {
        row.practiced = !row.practiced;
        if (!row.practiced) {
          row.mastered = false;
        }
      } else if (field === "mastered" && row.presented && row.practiced) {
        row.mastered = !row.mastered;
        row.date = row.mastered ? new Date().toLocaleDateString() : row.date;
      }

      newProgress[index] = row;
      return newProgress;
    });
  };

  // Handle checkbox change for sub-rows
  const handleSubRowCheckboxChange = (index, subIndex, field) => {
    setProgress((prev) => {
      const newProgress = [...prev];
      const row = { ...newProgress[index] };
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
        if (!subRow.practiced) {
          subRow.mastered = false;
        }
      } else if (field === "mastered" && subRow.presented && subRow.practiced) {
        subRow.mastered = !subRow.mastered;
        subRow.date = subRow.mastered
          ? new Date().toLocaleDateString()
          : subRow.date;
      }

      row.subRows[subIndex] = subRow;
      newProgress[index] = row;
      return newProgress;
    });
  };

  // Handle adding a new sub-row
  const handleAddSubwork = async (index, student) => {
    const lesson = student.studentData.lessons[index];
    const newSubwork = {
      subwork_name: `Day ${lesson.subwork.length + 1}: ${lesson.lesson_work}`,
      status: "presented",
      subwork_remarks: "",
      status_date: new Date(),
      updatedBy: userData.email,
    };
    console.log("Payload being sent to backend:", {
      studentId: student.schoolId,
      lessonIndex: index,
      subwork: newSubwork,
    });

    try {
      // Send a request to the backend to add the subwork
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
        // Update the local state
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === student._id
              ? {
                  ...student,
                  studentData: {
                    ...student.studentData,
                    lessons: student.studentData.lessons.map((lesson, i) =>
                      i === index
                        ? {
                            ...lesson,
                            subwork: [...lesson.subwork, newSubwork],
                          }
                        : lesson
                    ),
                  },
                }
              : student
          )
        );

        // Update the progress state
        setProgress((prev) =>
          prev.map((row, i) => {
            if (i === index) {
              return {
                ...row,
                expanded: true,
                subRows: [
                  ...(row.subRows || []),
                  {
                    presented: true,
                    practiced: false,
                    mastered: false,
                    date: new Date().toLocaleDateString(),
                  },
                ],
              };
            }
            return row;
          })
        );

        toast.success("Subwork added successfully!");
      } else {
        throw new Error("Failed to add subwork");
      }
    } catch (error) {
      console.error("Error adding subwork:", error);
      toast.error("Failed to add subwork.");
    }
  };

  // Handle edit remarks for progress table
  const handleEditRemarks = (index) => {
    setEditIndex(index);
  };

  // Handle save remarks for progress table
  const handleSaveRemarks = (index, remarks) => {
    setProgress((prev) => {
      const newProgress = [...prev];
      newProgress[index].remarks = remarks;
      return newProgress;
    });
    setEditIndex(null);
  };

  // Handle feedback change for quarters
  const handleFeedbackChange = (quarterIndex, weekIndex, value) => {
    setFeedback((prev) => {
      const newFeedback = [...prev];
      newFeedback[quarterIndex] = [...newFeedback[quarterIndex]];
      newFeedback[quarterIndex][weekIndex] = value;
      return newFeedback;
    });
  };

  // Handle save feedback for quarters
  const handleSaveFeedback = (quarterIndex, weekIndex) => {
    toast(
      `Feedback for Quarter ${quarterIndex + 1}, Week ${weekIndex + 1} saved`
    );
  };

  // Handle week selection for quarters
  const handleWeekSelection = (quarterIndex, weekIndex) => {
    setSelectedWeek((prev) => {
      const newSelectedWeek = [...prev];
      newSelectedWeek[quarterIndex] = weekIndex;
      return newSelectedWeek;
    });
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
                    const { lastName, firstName, middleName } =
                      student.studentData;
                    const middleInitial = middleName
                      ? `${middleName.charAt(0)}.`
                      : "";
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
                {`${student.studentData.lastName}, ${
                  student.studentData.firstName
                } ${
                  student.studentData.middleName
                    ? `${student.studentData.middleName.charAt(0)}.`
                    : ""
                }`}
              </option>
            ))}
          </select>
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-12 bg-[#d9d9d9] rounded-[15px] px-4 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img
              src={assets.search}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
          </div>
        </div>
      </div>

      {/* Count Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#3cd416] p-4 rounded-lg shadow text-center">
          <p className="text-lg font-bold">{countPresented}</p>
          <p className="text-sm text-black">Presented</p>
        </div>
        <div className="bg-[#e5a91b] p-4 rounded-lg shadow text-center">
          <p className="text-lg font-bold">{countPracticed}</p>
          <p className="text-sm text-black">Practiced</p>
        </div>
        <div className="bg-purple-400 p-4 rounded-lg shadow text-center">
          <p className="text-lg font-bold">{countMastered}</p>
          <p className="text-sm text-black">Mastered</p>
        </div>
        <div className="bg-[#aeadad] p-4 rounded-lg shadow text-center">
          <p className="text-lg font-bold">{totalWorks}</p>
          <p className="text-sm text-black ">Total</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-[#9d16be] text-white">
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
                        Oops! Create a lesson plan for this student to start
                        tracking progress.
                      </td>
                    </tr>
                  );
                }
                return progress.map((row, index) => (
                  <>
                    {/* Main Row */}
                    <tr key={index} className="border-b">
                      <td className="p-3 flex justify-between items-center">
                        {student.studentData.lessons[index]?.lesson_work ||
                          `Work ${index + 1}`}
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
                          onChange={() =>
                            handleCheckboxChange(index, "presented")
                          }
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#e5a91b] checked:border-gray"
                          checked={row.practiced}
                          onChange={() =>
                            handleCheckboxChange(index, "practiced")
                          }
                          disabled={!row.presented}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#c32cdd] checked:border-gray"
                          checked={row.mastered}
                          onChange={() =>
                            handleCheckboxChange(index, "mastered")
                          }
                          disabled={!row.presented || !row.practiced}
                        />
                      </td>
                      <td className="p-3 relative">
                        {student.studentData.lessons[index]?.remarks || "-"}
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
                      <td className="p-3">
                        {student.studentData.lessons[index]?.start_date
                          ? new Date(
                              student.studentData.lessons[index].start_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleAddSubwork(index, student)}
                          className="bg-[#9d16be] text-white px-4 py-2 rounded-lg"
                        >
                          Add
                        </button>
                      </td>
                    </tr>

                    {/* Sub-Rows */}
                    {row.expanded &&
                      row.subRows.map((subRow, subIndex) => {
                        const subwork =
                          student.studentData.lessons[index]?.subwork[subIndex];
                        return (
                          <tr
                            key={`sub-${index}-${subIndex}`}
                            className="border-b bg-gray-300"
                          >
                            <td className="p-3">
                              {subwork?.subwork_name ||
                                `Day ${subIndex + 1}: ${
                                  student.studentData.lessons[index]
                                    ?.lesson_work
                                }`}
                            </td>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#3cd416] checked:border-gray"
                                checked={subRow.presented}
                                onChange={() =>
                                  handleSubRowCheckboxChange(
                                    index,
                                    subIndex,
                                    "presented"
                                  )
                                }
                              />
                            </td>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                className="w-6 h-6 appearance-none border-3 border-gray-500 rounded-full checked:bg-[#e5a91b] checked:border-gray"
                                checked={subRow.practiced}
                                onChange={() =>
                                  handleSubRowCheckboxChange(
                                    index,
                                    subIndex,
                                    "practiced"
                                  )
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
                                  handleSubRowCheckboxChange(
                                    index,
                                    subIndex,
                                    "mastered"
                                  )
                                }
                                disabled={
                                  !subRow.presented || !subRow.practiced
                                }
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
                            <td className="p-3">
                              {subwork?.status_date || subRow.date || "-"}
                            </td>
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

      {/* Quarters Section */}
      <div className="mt-8">
        <div className="bg-[#9d16be] text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">Feedback</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {Array.from({ length: 4 }).map((_, quarterIndex) => (
            <div key={quarterIndex} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-bold mb-4">
                Quarter {quarterIndex + 1}
              </h3>
              <select
                className="w-full h-12 bg-[#d9d9d9] rounded-[15px] px-4 mb-4" // Updated dropdown styling
                onChange={(e) =>
                  handleWeekSelection(quarterIndex, parseInt(e.target.value))
                }
              >
                <option value="">Select Week</option>
                {Array.from({ length: 3 }).map((_, weekIndex) => (
                  <option key={weekIndex} value={weekIndex}>
                    Week {weekIndex + 1}
                  </option>
                ))}
              </select>
              {selectedWeek[quarterIndex] !== null && (
                <div className="border border-gray-300 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    Week {selectedWeek[quarterIndex] + 1}
                  </h4>
                  <textarea
                    value={feedback[quarterIndex][selectedWeek[quarterIndex]]}
                    onChange={(e) =>
                      handleFeedbackChange(
                        quarterIndex,
                        selectedWeek[quarterIndex],
                        e.target.value
                      )
                    }
                    className="w-full h-24 p-2 border rounded-lg"
                    placeholder="Enter feedback..."
                  />
                  <button
                    onClick={() =>
                      handleSaveFeedback(
                        quarterIndex,
                        selectedWeek[quarterIndex]
                      )
                    }
                    className="mt-2 bg-[#9d16be] text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Remarks Form Modal */}
      {editIndex !== null && (
        <RemarksForm
          onClose={() => setEditIndex(null)}
          onSave={(remarks) => handleSaveRemarks(editIndex, remarks)}
          initialRemarks={progress[editIndex].remarks}
        />
      )}
    </div>
  );
};

export default Progress;
