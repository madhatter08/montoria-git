import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { assets } from "../../assets/assets";
import ConfirmationModal from "../ConfirmationModal";

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
  const { backendUrl, userData } = useContext(AppContext);

  // Fetch student data from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/school/lesson-plan`,
          {
            withCredentials: true,
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch students");
        }

        const data = response.data;
        setStudents(data.students);
        setCurriculum(data.curriculumData);

        // Extract all Levels and Lessons from curriculumData
        const levelsAndLessons = data.curriculumData.map((item) => ({
          Level: item.Level,
          Lesson: item.Lesson,
        }));

        // Log the extracted Levels and Lessons
        console.log("Fetched students:", data.students);
        console.log(
          "Fetched curriculum (Levels and Lessons):",
          levelsAndLessons
        );
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

  // Get lessons for a specific student level
  const getLessonsForStudentLevel = (studentLevel) => {
    return curriculumData
      .filter((item) => item.Level === studentLevel) // Filter by student's level
      .map((item) => `${item.Lesson} - ${item.Work}`); // Extract only the Lesson field
  };

  const handleBookmarkClick = async (studentId) => {
    const selectedLesson = selectedLessons[studentId];
    if (!selectedLesson) {
      toast.warning("Please select a lesson before bookmarking.");
      return;
    }

    try {
      // Check if the lesson already exists for the student
      const student = students.find((student) => student._id === studentId);
      const lessonExists = student.studentData.lessons.some(
        (lesson) => lesson.lesson_work === selectedLesson
      );

      if (lessonExists) {
        toast.warning("This lesson is already saved for the student.");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/school/save-lesson`,
        {
          studentId,
          lesson_work: selectedLesson,
          addedBy: userData.email, // Use the email from userData
          remarks: "", // Default remarks
          start_date: new Date(), // Current date
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Update the student's lessons in the local state
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === studentId
              ? {
                  ...student,
                  studentData: {
                    ...student.studentData,
                    lessons: [
                      ...student.studentData.lessons,
                      {
                        lesson_work: selectedLesson,
                        addedBy: userData.email,
                        remarks: "",
                        start_date: new Date(),
                        subwork: [], // Initialize subwork as an empty array
                      },
                    ],
                  },
                }
              : student
          )
        );
        console.log("Student lesson: ", student.studentData.lessons);
        toast.success("Lesson saved successfully!");
      } else {
        throw new Error("Failed to save lesson");
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

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    // Ensure both itemToDelete and selectedStudent are available
    if (!itemToDelete || !selectedStudent) {
      toast.error("No lesson or student selected for deletion.");
      return;
    }

    try {
      // Send DELETE request with query parameters
      const res = await axios.delete(
        `${backendUrl}/api/school/delete-lesson?studentId=${selectedStudent._id}&lesson_work=${itemToDelete}`,
        { withCredentials: true }
      );

      // Check if the deletion was successful
      if (res.data.success) {
        // Update the local state to remove the deleted lesson
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

        // Update the selectedStudent state (if it's being used elsewhere)
        setSelectedStudent((prevStudent) => ({
          ...prevStudent,
          studentData: {
            ...prevStudent.studentData,
            lessons: prevStudent.studentData.lessons.filter(
              (lesson) => lesson.lesson_work !== itemToDelete
            ),
          },
        }));

        // Show success message
        toast.success("Lesson deleted successfully!");
      } else {
        // Handle backend response indicating failure
        toast.error("Failed to delete lesson.");
      }
    } catch (err) {
      // Log the error and show a user-friendly message
      console.error("Error deleting lesson:", err);
      toast.error(
        err.response?.data?.message ||
          "An error occurred while deleting the lesson."
      );
    } finally {
      // Close the modal and reset the itemToDelete state
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const LessonPlanModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] bg-opacity-50 flex items-center justify-center z-50">
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
                    e.stopPropagation(); // Prevent the modal from closing
                    openDeleteModal(lesson.lesson_work); // Pass the lesson_work to delete
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
    setDeleteModalOpen(false); // Close the modal
    setItemToDelete(null); // Reset the item to delete
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Lesson Plan Page</h1>

      {/* Dropdowns and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Dropdowns on the Left */}
        <div className="flex space-x-4">
          {/* Class Dropdown */}
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

          {/* Level Dropdown */}
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

        {/* Search Bar in the Middle */}
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

      {/* Display Student Lessons */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-300 flex flex-col h-[300px] cursor-pointer"
              onClick={() => {
                setSelectedStudent(student); // Set the selected student
                setIsModalOpen(true); // Open the modal
              }}
            >
              <h3 className="text-xl font-semibold text-center bg-[#9d16be] text-white p-2 rounded-t-lg">
                {formatStudentName(student)}
              </h3>

              <div className="flex-grow p-3 overflow-hidden">
                <ol className="list-decimal pl-5 text-gray-700 text-base truncate">
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
                  className="w-full lg:w-58 h-12 bg-[#d9d9d9] rounded-[15px] px-4"
                  onChange={(e) => {
                    setSelectedLessons((prev) => ({
                      ...prev,
                      [student._id]: e.target.value, // Save the selected lesson for this student
                    }));
                  }}
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
                  htmlFor={`checkboxInput-${student._id}`}
                  className="bookmark cursor-pointer bg-teal-500 w-10 h-10 flex items-center justify-center rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    id={`checkboxInput-${student._id}`}
                    className="hidden"
                    onClick={() => handleBookmarkClick(student._id)}
                  />
                  <svg
                    width={15}
                    viewBox="0 0 50 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="svgIcon"
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
          <div className="col-span-full text-center">Loading students...</div>
        )}
      </div>

      {/* Render the Modal */}
      {isModalOpen && (
        <LessonPlanModal
          student={selectedStudent}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this lesson?"
      />
    </div>
  );
};

export default LessonPlan;
