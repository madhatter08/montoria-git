import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { assets } from "../../assets/assets";
import ConfirmationModal from "../ConfirmationModal";
import SaveModal from "../SaveModal";
import Loader from "../../components/style/Loader"; // Added Loader import

const LessonPlan = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [curriculumData, setCurriculum] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [assignLessonModalOpen, setAssignLessonModalOpen] = useState(false);
  const [lessonToAssign, setLessonToAssign] = useState("");
  const { backendUrl, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true); // Set loading to true before fetch
      setError(null); // Reset error state
      try {
        const response = await axios.get(`${backendUrl}/api/school/lesson-plan`, {
          withCredentials: true,
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch students");
        }

        const data = response.data;
        setStudents(data.students);
        setCurriculum(data.curriculumData);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load student data."); // Set error message
        toast.error("Failed to load student data.");
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchStudents();
  }, [backendUrl]);

  const classes = [...new Set(students.map((student) => student.studentData.class))];
  const levels = [...new Set(students.map((student) => student.studentData.level))];

  const formatStudentName = (student) => {
    const { lastName, firstName, middleName } = student.studentData;
    const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";
    return `${lastName}, ${firstName} ${middleInitial}`;
  };

  const handleClassChange = (e) => setSelectedClass(e.target.value);
  const handleLevelChange = (e) => setSelectedLevel(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredStudents = students.filter((student) => {
    const matchesClass = selectedClass ? student.studentData.class === selectedClass : true;
    const matchesLevel = selectedLevel ? student.studentData.level === selectedLevel : true;

    const searchLower = searchQuery.toLowerCase();
    const studentName = formatStudentName(student).toLowerCase();
    const schoolId = student.schoolId.toLowerCase();
    const gender = student.studentData.gender.toLowerCase();
    const age = student.studentData.age.toString();
    const birthday = new Date(student.studentData.birthday).toLocaleDateString();
    const remarks = student.studentData.remarks.toLowerCase();

    return (
      matchesClass &&
      matchesLevel &&
      (studentName.includes(searchLower) ||
        schoolId.includes(searchLower) ||
        gender.includes(searchLower) ||
        age.includes(searchLower) ||
        birthday.includes(searchLower) ||
        remarks.includes(searchLower))
    );
  });

  const getLessonsForStudentLevel = (studentLevel) => {
    return curriculumData
      .filter((item) => item.Level === studentLevel)
      .map((item) => `${item.Lesson} - ${item.Work}`);
  };

  const handleBookmarkClick = async (studentId) => {
    const selectedLesson = selectedLessons[studentId];
    if (!selectedLesson) {
      toast.warning("Please select a lesson before bookmarking.");
      return;
    }

    try {
      const student = students.find((s) => s._id === studentId);
      const lessonExists = student.studentData.lessons.some(
        (lesson) => lesson.lesson_work === selectedLesson
      );

      if (lessonExists) {
        toast.warning("This lesson is already assigned to the student.");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/school/save-lesson`,
        {
          studentId,
          lesson_work: selectedLesson,
          addedBy: userData.email,
          remarks: "",
          start_date: new Date(),
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setStudents((prevStudents) =>
          prevStudents.map((s) =>
            s._id === studentId
              ? {
                  ...s,
                  studentData: {
                    ...s.studentData,
                    lessons: [
                      ...s.studentData.lessons,
                      {
                        lesson_work: selectedLesson,
                        addedBy: userData.email,
                        remarks: "",
                        start_date: new Date(),
                        subwork: [],
                      },
                    ],
                  },
                }
              : s
          )
        );
        toast.success("Lesson saved successfully!");
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error("Failed to save lesson.");
    }
  };

  const openDeleteModal = (lesson_work) => {
    setItemToDelete(lesson_work);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !selectedStudent) {
      toast.error("No lesson or student selected for deletion.");
      return;
    }

    try {
      const res = await axios.delete(
        `${backendUrl}/api/school/delete-lesson?studentId=${selectedStudent._id}&lesson_work=${itemToDelete}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === selectedStudent._id
              ? {
                  ...student,
                  studentData: {
                    ...student.studentData,
                    lessons: student.studentData.lessons.filter(
                      (lesson) => lesson.lesson_work !== itemToDelete
                    ),
                  },
                }
              : student
          )
        );
        setSelectedStudent((prev) => ({
          ...prev,
          studentData: {
            ...prev.studentData,
            lessons: prev.studentData.lessons.filter(
              (lesson) => lesson.lesson_work !== itemToDelete
            ),
          },
        }));
        toast.success("Lesson deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson.");
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(
      selectAll ? [] : filteredStudents.map((student) => student._id)
    );
    setSelectAll(!selectAll);
  };

  const handleAssignLessonToSelected = (lesson) => {
    if (!lesson) {
      toast.warning("Please select a lesson to assign.");
      return;
    }
    if (selectedStudents.length === 0) {
      toast.warning("Please select at least one student.");
      return;
    }

    setLessonToAssign(lesson);
    setAssignLessonModalOpen(true);
  };

  const handleAssignConfirm = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/school/save-lesson-to-multiple`,
        {
          studentIds: selectedStudents,
          lesson_work: lessonToAssign,
          addedBy: userData.email,
          remarks: "",
          start_date: new Date(),
        },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.success) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            selectedStudents.includes(student._id)
              ? {
                  ...student,
                  studentData: {
                    ...student.studentData,
                    lessons: student.studentData.lessons.some(
                      (lesson) => lesson.lesson_work === lessonToAssign
                    )
                      ? student.studentData.lessons
                      : [
                          ...student.studentData.lessons,
                          {
                            lesson_work: lessonToAssign,
                            addedBy: userData.email,
                            remarks: "",
                            start_date: new Date(),
                            subwork: [],
                          },
                        ],
                  },
                }
              : student
          )
        );
        // Reset selections after successful assignment
        setSelectedStudents([]);
        setSelectAll(false);
        toast.success("Lesson assigned to selected students successfully!");
      } else {
        throw new Error("Failed to assign lesson");
      }
    } catch (error) {
      console.error("Error assigning lesson:", error);
      toast.error("Failed to assign lesson to some students.");
    } finally {
      setAssignLessonModalOpen(false);
      setLessonToAssign("");
    }
  };

  const LessonPlanModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">
            Lessons for {formatStudentName(student)}
          </h2>
          <ol className="list-decimal pl-5 text-gray-700 text-lg">
            {student.studentData.lessons.map((lesson, i) => (
              <li key={i} className="py-1 flex justify-between items-center">
                <span>{lesson.lesson_work}</span>
                <img
                  src={assets.delete_icon}
                  alt="Delete"
                  className="w-5 h-5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(lesson.lesson_work);
                  }}
                />
              </li>
            ))}
          </ol>
          <button
            onClick={onClose}
            className="mt-4 bg-[#9d16be] text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  LessonPlanModal.propTypes = {
    student: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleAssignCancel = () => {
    setAssignLessonModalOpen(false);
    setLessonToAssign("");
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

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="pt-24 bg-[#4A154B] min-h-screen">
      {/* Filters Section */}
      <div className="p-10 flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-4 mb-1">
        <div className="flex space-x-4">
          <div>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="w-80 h-12 bg-[#e6e6e6] rounded-[15px] px-4"
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
            <select
              value={selectedLevel}
              onChange={handleLevelChange}
              className="w-80 h-12 bg-[#e6e6e6] rounded-[15px] px-4"
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
        <div className="flex-1 lg:flex-none lg:w-110">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-12 bg-[#e6e6e6] rounded-[15px] px-4"
          />
        </div>
      </div>

      {/* Actions and Cards Section */}
      <div className="bg-[#f3f3f3] p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleSelectAll}
            className="bg-[#4A154B] text-white px-4 py-2 rounded-lg"
          >
            {selectAll ? "Deselect All" : "Select All"}
          </button>
          {selectedStudents.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                className="w-60 h-12 bg-[#e6e6e6] rounded-[15px] px-4"
                onChange={(e) => handleAssignLessonToSelected(e.target.value)}
              >
                <option value="">Assign Lesson to Selected</option>
                {levels.map((level) =>
                  getLessonsForStudentLevel(level).map((lesson, i) => (
                    <option key={i} value={lesson}>
                      {lesson}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                className={`bg-white shadow-md rounded-lg p-4 border border-gray-300 flex flex-col h-[300px] cursor-pointer ${
                  selectedStudents.includes(student._id) ? "border-[#4A154B]" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className="text-xl font-semibold text-center bg-[#4A154B] text-white p-2 rounded-t-lg cursor-pointer"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsModalOpen(true);
                    }}
                  >
                    {formatStudentName(student)}
                  </h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStudentSelect(student._id);
                      }}
                      className="form-checkbox h-5 w-5 text-[#4A154B]"
                    />
                  </label>
                </div>

                <div className="flex-grow p-3 overflow-y-auto">
                  <ol className="list-decimal pl-5 text-gray-700 text-base">
                    {student.studentData.lessons.slice(0, 4).map((lesson, i) => (
                      <li key={i} className="py-1">
                        {lesson.lesson_work}
                      </li>
                    ))}
                    {student.studentData.lessons.length > 4 && (
                      <li className="text-gray-500">...</li>
                    )}
                  </ol>
                </div>

                <div className="mt-auto flex items-center gap-2">
                  <select
                    className="w-full h-12 bg-[#d9d9d9] rounded-[15px] px-4"
                    onChange={(e) =>
                      setSelectedLessons((prev) => ({
                        ...prev,
                        [student._id]: e.target.value,
                      }))
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Select Lesson</option>
                    {getLessonsForStudentLevel(student.studentData.level).map(
                      (lesson, i) => (
                        <option key={i} value={lesson}>
                          {lesson}
                        </option>
                      )
                    )}
                  </select>
                  <label
                    htmlFor={`bookmark-${student._id}`}
                    className="bookmark cursor-pointer bg-[#5BB381] w-10 h-10 flex items-center justify-center rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      id={`bookmark-${student._id}`}
                      className="hidden"
                      onClick={() => handleBookmarkClick(student._id)}
                    />
                    <svg
                      width={15}
                      viewBox="0 0 50 70"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M46 62.0085L46 3.88139L3.99609 3.88139L3.99609 62.0085L24.5 45.5L46 62.0085Z"
                        stroke="white"
                        strokeWidth={7}
                      />
                    </svg>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center"></div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <LessonPlanModal
          student={selectedStudent}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this lesson?"
      />

      <SaveModal
        isOpen={assignLessonModalOpen}
        onClose={handleAssignCancel}
        onConfirm={handleAssignConfirm}
        message={`Assign "${lessonToAssign}" to ${selectedStudents.length} selected student(s)?`}
      />
    </div>
  );
};

export default LessonPlan;