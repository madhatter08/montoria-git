import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { assets } from "../../assets/assets";
import ConfirmationModal from "../ConfirmationModal";
import SaveModal from "../SaveModal";
import Loader from "../../components/style/Loader";

const LessonPlan = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [students, setStudents] = useState([]);
  const [curriculumData, setCurriculum] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [assignLessonModalOpen, setAssignLessonModalOpen] = useState(false);
  const [lessonToAssign, setLessonToAssign] = useState("");
  const [archiveAllModalOpen, setArchiveAllModalOpen] = useState(false);
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);
  const [recentlyArchived, setRecentlyArchived] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { backendUrl, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});
  const [displayOption, setDisplayOption] = useState("Per Student");
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [moveLessonError, setMoveLessonError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const lessonPlanResponse = await axios.get(
          `${backendUrl}/api/school/lesson-plan`,
          {
            withCredentials: true,
          }
        );

        if (lessonPlanResponse.status !== 200) {
          throw new Error("Failed to fetch lesson plan data");
        }

        const lessonPlanData = lessonPlanResponse.data;
        const activeStudents = lessonPlanData.students
          .filter((student) => student.isActive === true)
          .map((student) => ({
            ...student,
            studentData: {
              ...student.studentData,
              lessons: student.studentData.lessons || [],
            },
          }));
        setStudents(activeStudents);
        setCurriculum(lessonPlanData.curriculumData);

        const progressResponse = await axios.get(
          `${backendUrl}/api/school/class-list`,
          {
            withCredentials: true,
          }
        );

        if (progressResponse.status === 200 && progressResponse.data.success) {
          const studentsData = progressResponse.data.students.filter(
            (student) => student.isActive === true
          );
          const initialProgress = {};

          studentsData.forEach((student) => {
            initialProgress[student._id] = {};
            if (student.studentData?.lessons) {
              student.studentData.lessons
                .filter((lesson) => !lesson.isArchived)
                .forEach((lesson, index) => {
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

                  initialProgress[student._id][index] = {
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
        } else {
          throw new Error("Failed to fetch student progress");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  const getStudentProgress = (studentId) => {
    return progress[studentId] || {};
  };

  const getStatusIndicator = (studentId, lessonWork) => {
    const studentProgress = getStudentProgress(studentId);
    const student = students.find((s) => s._id === studentId);
    const lessonIndex = student?.studentData?.lessons.findIndex(
      (lesson) => lesson.lesson_work === lessonWork
    );

    if (lessonIndex === undefined || lessonIndex === -1) {
      return <span className="w-2 h-2 bg-gray-500 rounded-full inline-block mr-2"></span>;
    }

    const row = studentProgress[lessonIndex];
    if (!row) {
      return <span className="w-2 h-2 bg-gray-500 rounded-full inline-block mr-2"></span>;
    }

    if (row.mastered) {
      return <span className="w-2 h-2 bg-purple-500 rounded-full inline-block mr-2"></span>;
    }
    if (row.practiced) {
      return <span className="w-2 h-2 bg-orange-300 rounded-full inline-block mr-2"></span>;
    }
    if (row.presented) {
      return <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>;
    }
    return <span className="w-2 h-2 bg-gray-500 rounded-full inline-block mr-2"></span>;
  };

  const filterProgress = (studentId) => {
    const studentProgress = getStudentProgress(studentId);
    return Object.entries(studentProgress).filter(([_, row]) => {
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

  const filterStatus = "All";

  const calculateSPP = (studentId) => {
    const studentProgress = progress[studentId] || {};
    const lessons = Object.values(studentProgress);

    if (lessons.length === 0) return 0;

    const lessonSPPs = lessons.map((lesson) => {
      const ME = lesson.mastered ? 1 : 0;
      const PL = lesson.practiced ? 1 : 0;
      const OP =
        lesson.subRows.filter((sub) => sub.practiced).length >= 8 ? 1 : 0;
      const lessonSPP = PL === 0 ? ME * 100 : (ME / (PL + OP)) * 100;
      return isNaN(lessonSPP) || lessonSPP < 0 ? 0 : lessonSPP;
    });

    const totalSPP =
      lessonSPPs.reduce((sum, spp) => sum + spp, 0) / lessons.length;
    return isNaN(totalSPP) ? 0 : totalSPP;
  };

  const categorizeStudent = (spp) => {
    if (spp >= 90) return "Advanced";
    if (spp >= 75) return "Proficient";
    if (spp >= 50) return "Developing";
    return "Needs Attention";
  };

  const classes = [
    ...new Set(
      students.map((student) => student.studentData?.class).filter(Boolean)
    ),
  ];
  const levels = [
    ...new Set(
      students.map((student) => student.studentData?.level).filter(Boolean)
    ),
  ];
  const categories = [
    "Advanced",
    "Proficient",
    "Developing",
    "Needs Attention",
  ];
  const areas = [
    ...new Set(
      curriculumData.map((curriculum) => curriculum.Areas).filter(Boolean)
    ),
  ];

  const formatStudentName = (student) => {
    const { lastName, firstName, middleName } = student.studentData || {};
    const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";
    return `${lastName || ""}, ${firstName || ""} ${middleInitial}`;
  };

  const handleClassChange = (e) => setSelectedClass(e.target.value);
  const handleLevelChange = (e) => setSelectedLevel(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleAreaChange = (e) => setSelectedArea(e.target.value);
  const handleDisplayOptionChange = (e) => setDisplayOption(e.target.value);

  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diffToMonday = (day === 0 ? -6 : 1 - day);
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4);

    return {
      start: startOfWeek,
      end: endOfWeek,
      label: `${startOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${endOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`,
    };
  };

  const handlePreviousWeek = () => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(selectedWeek.getDate() - 7);
    setSelectedWeek(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(selectedWeek.getDate() + 7);
    setSelectedWeek(newWeek);
  };

  const weekRange = getWeekRange(selectedWeek);
  const weekStartString = weekRange.start.toISOString().split("T")[0];

  const filteredStudents = students.filter((student) => {
    const matchesClass = selectedClass
      ? student.studentData?.class === selectedClass
      : true;
    const matchesLevel = selectedLevel
      ? student.studentData?.level === selectedLevel
      : true;

    const spp = calculateSPP(student._id);
    const category = categorizeStudent(spp);
    const matchesCategory = selectedCategory
      ? category === selectedCategory
      : true;

    const searchLower = searchQuery.toLowerCase();
    const studentName = formatStudentName(student).toLowerCase();
    const schoolId = (student.schoolId || "").toLowerCase();
    const gender = (student.studentData?.gender || "").toLowerCase();
    const age = (student.studentData?.age || "").toString();
    const birthday = student.studentData?.birthday
      ? new Date(student.studentData.birthday).toLocaleDateString()
      : "";
    const remarks = (student.studentData?.remarks || "").toLowerCase();

    return (
      matchesClass &&
      matchesLevel &&
      matchesCategory &&
      (studentName.includes(searchLower) ||
        schoolId.includes(searchLower) ||
        gender.includes(searchLower) ||
        age.includes(searchLower) ||
        birthday.includes(searchLower) ||
        remarks.includes(searchLower))
    );
  });

  const getLessonsWithStudents = () => {
    const lessonMap = {};

    filteredStudents.forEach((student) => {
      if (student.studentData?.lessons) {
        student.studentData.lessons
          .filter((lesson) => !lesson.isArchived && lesson.week === weekStartString)
          .forEach((lesson) => {
            const lessonKey = lesson.lesson_work;
            if (!lessonMap[lessonKey]) {
              const curriculum = curriculumData.find(
                (c) => `${c.Lesson} - ${c.Work}` === lessonKey
              );
              lessonMap[lessonKey] = {
                lesson_work: lessonKey,
                area: curriculum?.Areas || "Unknown",
                level: curriculum?.Level || "Unknown",
                students: [],
                day: lesson.day || "Monday",
              };
            }
            lessonMap[lessonKey].students.push({
              id: student._id,
              name: formatStudentName(student),
              studentLevel: student.studentData?.level || "Unknown",
            });
          });
      }
    });

    let lessons = Object.values(lessonMap);

    lessons = lessons.filter((lesson) => {
      const matchesArea = selectedArea ? lesson.area === selectedArea : true;
      const matchesClass = selectedClass
        ? lesson.students.some((s) => {
            const student = students.find((st) => st._id === s.id);
            return student?.studentData?.class === selectedClass;
          })
        : true;
      const matchesLevel = selectedLevel
        ? lesson.students.some((s) => s.studentLevel === selectedLevel)
        : true;
      const matchesSearch = searchQuery
        ? lesson.lesson_work.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.students.some((s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;
      return matchesArea && matchesClass && matchesLevel && matchesSearch;
    });

    lessons.sort((a, b) => a.lesson_work.localeCompare(b.lesson_work));

    return lessons;
  };

  const getLessonsForStudentLevel = (studentLevel) => {
    if (!studentLevel) return [];
    const lessons = curriculumData
      .filter((item) => item.Level === studentLevel)
      .map((item) => `${item.Lesson} - ${item.Work}`);
    return [...new Set(lessons)];
  };

  const getLessonsForSelectedStudents = () => {
    if (selectedStudents.length === 0) return [];
    const studentLevels = selectedStudents
      .map((studentId) => {
        const student = students.find((s) => s._id === studentId);
        return student?.studentData?.level || null;
      })
      .filter(Boolean);

    if (studentLevels.length === 0) return [];

    const lessonSets = studentLevels.map((level) =>
      new Set(getLessonsForStudentLevel(level))
    );

    const commonLessons = lessonSets.reduce((common, current) =>
      new Set([...common].filter((lesson) => current.has(lesson)))
    );

    return [...commonLessons];
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
        (lesson) => lesson.lesson_work === selectedLesson && lesson.week === weekStartString
      );

      if (lessonExists) {
        toast.warning("This lesson is already assigned to the student for this week.");
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
          isArchived: false,
          week: weekStartString,
          day: "Monday",
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
                        isArchived: false,
                        week: weekStartString,
                        day: "Monday",
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

  const openArchiveModal = (lesson_work) => {
    setItemToArchive(lesson_work);
    setArchiveModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!itemToArchive || !selectedStudent) {
      toast.error("No lesson or student selected for archiving.");
      return;
    }

    const originalStudents = [...students];

    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === selectedStudent._id
          ? {
              ...student,
              studentData: {
                ...student.studentData,
                lessons: student.studentData.lessons.map((lesson) =>
                  lesson.lesson_work === itemToArchive && lesson.week === weekStartString
                    ? { ...lesson, isArchived: true }
                    : lesson
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
        lessons: prev.studentData.lessons.map((lesson) =>
          lesson.lesson_work === itemToArchive && lesson.week === weekStartString
            ? { ...lesson, isArchived: true }
            : lesson
        ),
      },
    }));
    setRecentlyArchived((prev) => [
      ...prev,
      { studentId: selectedStudent._id, lesson_work: itemToArchive },
    ]);

    try {
      const res = await axios.put(
        `${backendUrl}/api/school/archive-lesson`,
        {
          studentId: selectedStudent._id,
          lesson_work: itemToArchive,
          week: weekStartString,
        },
        { withCredentials: true }
      );

      if (!res.data.success) {
        throw new Error("Backend failed to confirm archive");
      }
      toast.success("Lesson archived successfully!");
    } catch (error) {
      console.error("Error archiving lesson:", error);
      setStudents(originalStudents);
      setSelectedStudent((prev) =>
        originalStudents.find((s) => s._id === prev._id) || prev
      );
      setRecentlyArchived((prev) =>
        prev.filter(
          (archived) =>
            !(
              archived.studentId === selectedStudent._id &&
              archived.lesson_work === itemToArchive
            )
        )
      );
      toast.error("Failed to archive lesson.");
    } finally {
      setArchiveModalOpen(false);
      setItemToArchive(null);
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

    const originalStudents = [...students];

    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === selectedStudent._id
          ? {
              ...student,
              studentData: {
                ...student.studentData,
                lessons: student.studentData.lessons.filter(
                  (lesson) => !(lesson.lesson_work === itemToDelete && lesson.week === weekStartString)
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
          (lesson) => !(lesson.lesson_work === itemToDelete && lesson.week === weekStartString)
        ),
      },
    }));

    try {
      const res = await axios.delete(
        `${backendUrl}/api/school/delete-lesson`,
        {
          data: {
            studentId: selectedStudent._id,
            lesson_work: itemToDelete,
            week: weekStartString,
          },
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        throw new Error("Backend failed to confirm deletion");
      }
      toast.success("Lesson deleted successfully!");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      setStudents(originalStudents);
      setSelectedStudent((prev) =>
        originalStudents.find((s) => s._id === prev._id) || prev
      );
      toast.error("Failed to delete lesson.");
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleArchiveAll = () => {
    if (selectedStudents.length === 0) {
      toast.warning("Please select at least one student.");
      return;
    }
    setArchiveAllModalOpen(true);
  };

  const handleArchiveAllConfirm = async () => {
    try {
      const archivedLessons = [];
      const originalStudents = [...students];

      const updatedStudents = students.map((student) => {
        if (selectedStudents.includes(student._id)) {
          const studentProgress = progress[student._id] || {};
          const lessonsToArchive = [];

          student.studentData.lessons.forEach((lesson, index) => {
            if (studentProgress[index]?.mastered && !lesson.isArchived && lesson.week === weekStartString) {
              lessonsToArchive.push(lesson.lesson_work);
              archivedLessons.push({
                studentId: student._id,
                lesson_work: lesson.lesson_work,
              });
            }
          });

          if (lessonsToArchive.length > 0) {
            return {
              ...student,
              studentData: {
                ...student.studentData,
                lessons: student.studentData.lessons.map((lesson) =>
                  lessonsToArchive.includes(lesson.lesson_work) && lesson.week === weekStartString
                    ? { ...lesson, isArchived: true }
                    : lesson
                ),
              },
            };
          }
        }
        return student;
      });

      if (archivedLessons.length > 0) {
        setStudents(updatedStudents);
        setRecentlyArchived(archivedLessons);

        if (selectedStudent && selectedStudents.includes(selectedStudent._id)) {
          setSelectedStudent((prev) => ({
            ...prev,
            studentData: {
              ...prev.studentData,
              lessons: updatedStudents
                .find((s) => s._id === prev._id)
                .studentData.lessons,
            },
          }));
        }

        const archivePromises = archivedLessons.map(
          ({ studentId, lesson_work }) =>
            axios.put(
              `${backendUrl}/api/school/archive-lesson`,
              {
                studentId,
                lesson_work,
                week: weekStartString,
              },
              { withCredentials: true }
            )
        );

        const results = await Promise.allSettled(archivePromises);

        const failedArchives = results.filter(
          (result) => result.status === "rejected"
        );
        if (failedArchives.length > 0) {
          console.error("Some lessons failed to archive:", failedArchives);
          setStudents(originalStudents);
          setSelectedStudent((prev) =>
            originalStudents.find((s) => s._id === prev._id) || prev
          );
          setRecentlyArchived([]);
          toast.error(
            "Failed to archive some mastered lessons. Changes reverted."
          );
          return;
        }
        toast.success("All mastered lessons archived successfully!");
      } else {
        toast.info("No mastered lessons found to archive.");
      }
    } catch (error) {
      console.error("Error archiving all mastered lessons:", error);
      setStudents(originalStudents);
      setRecentlyArchived([]);
      toast.error("Failed to archive mastered lessons. Changes reverted.");
    } finally {
      setArchiveAllModalOpen(false);
    }
  };

  const handleUndoArchive = async () => {
    try {
      const originalStudents = [...students];

      const updatedStudents = students.map((student) => {
        const archivedForStudent = recentlyArchived.filter(
          (archived) => archived.studentId === student._id
        );
        if (archivedForStudent.length > 0) {
          return {
            ...student,
            studentData: {
              ...student.studentData,
              lessons: student.studentData.lessons.map((lesson) =>
                archivedForStudent.some(
                  (archived) => archived.lesson_work === lesson.lesson_work && lesson.week === weekStartString
                )
                  ? { ...lesson, isArchived: false }
                  : lesson
              ),
            },
          };
        }
        return student;
      });

      setStudents(updatedStudents);

      if (
        selectedStudent &&
        recentlyArchived.some(
          (archived) => archived.studentId === selectedStudent._id
        )
      ) {
        setSelectedStudent((prev) => ({
          ...prev,
          studentData: {
            ...prev.studentData,
            lessons: updatedStudents
              .find((s) => s._id === prev._id)
              .studentData.lessons,
          },
        }));
      }

      const unarchivePromises = recentlyArchived.map(
        ({ studentId, lesson_work }) =>
          axios.put(
            `${backendUrl}/api/school/unarchive-lesson`,
            {
              studentId,
              lesson_work,
              week: weekStartString,
            },
            { withCredentials: true }
          )
      );

      const results = await Promise.allSettled(unarchivePromises);

      const failedUnarchives = results.filter(
        (result) => result.status === "rejected"
      );
      if (failedUnarchives.length > 0) {
        console.error("Some lessons failed to unarchive:", failedUnarchives);
        setStudents(originalStudents);
        setSelectedStudent((prev) =>
          originalStudents.find((s) => s._id === prev._id) || prev
        );
        toast.error("Failed to undo some archives. Changes reverted.");
        return;
      }
      toast.success("Archive action undone successfully!");
    } catch (error) {
      console.error("Error undoing archive:", error);
      setStudents(originalStudents);
      toast.error("Failed to undo archive. Changes reverted.");
    } finally {
      setRecentlyArchived([]);
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
          isArchived: false,
          week: weekStartString,
          day: "Monday",
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
                      (lesson) => lesson.lesson_work === lessonToAssign && lesson.week === weekStartString
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
                            isArchived: false,
                            week: weekStartString,
                            day: "Monday",
                          },
                        ],
                  },
                }
              : student
          )
        );
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
    if (!student || !student.studentData) {
      console.error("LessonPlanModal: Invalid student data");
      return null;
    }

    return (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Lessons for {formatStudentName(student)}
          </h2>
          {student.studentData.lessons.length > 0 ? (
            <ol className="list-decimal pl-5 text-gray-700 text-lg">
              {student.studentData.lessons
                .filter((lesson) => !lesson.isArchived && lesson.week === weekStartString)
                .map((lesson, i) => (
                  <li key={i} className="py-1 flex justify-between items-center">
                    <span>{lesson.lesson_work}</span>
                    <svg
                      className="w-5 h-5 cursor-pointer text-red-600 hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(lesson.lesson_work);
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </li>
                ))}
            </ol>
          ) : (
            <p className="text-gray-600">No active lessons assigned for this week.</p>
          )}
          <button
            onClick={onClose}
            className="mt-4 bg-[#4A154B] text-white px-4 py-2 rounded-lg hover:bg-[#5A255B]"
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

  const ArchivedLessonsModal = ({ onClose }) => {
    const archivedLessonsByStudent = students
      .map((student) => ({
        name: formatStudentName(student),
        archivedLessons: student.studentData.lessons
          .filter((lesson) => lesson.isArchived)
          .map((lesson) => lesson.lesson_work),
      }))
      .filter((entry) => entry.archivedLessons.length > 0);

    return (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Archived Lessons</h2>
          {archivedLessonsByStudent.length > 0 ? (
            <ul className="text-gray-700 text-lg">
              {archivedLessonsByStudent.map((entry, i) => (
                <li key={i} className="py-1">
                  <span className="font-semibold">{entry.name}:</span>{" "}
                  {entry.archivedLessons.join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No archived lessons found.</p>
          )}
          <button
            onClick={onClose}
            className="mt-4 bg-[#4A154B] text-white px-4 py-2 rounded-lg hover:bg-[#5A255B]"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  ArchivedLessonsModal.propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  const handleArchiveCancel = () => {
    setArchiveModalOpen(false);
    setItemToArchive(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleArchiveAllCancel = () => {
    setArchiveAllModalOpen(false);
  };

  const handleAssignCancel = () => {
    setAssignLessonModalOpen(false);
    setLessonToAssign("");
  };

  const handleDragStart = (e, lessonWork, currentDay) => {
    e.dataTransfer.setData("lessonWork", lessonWork);
    e.dataTransfer.setData("currentDay", currentDay);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetDay) => {
    e.preventDefault();
    const lessonWork = e.dataTransfer.getData("lessonWork");
    const currentDay = e.dataTransfer.getData("currentDay");

    if (!lessonWork || currentDay === targetDay) return;

    const originalStudents = [...students];
    try {
      // Find all students who have this lesson assigned on the current day
      const affectedStudents = students.filter((student) =>
        student.studentData.lessons.some(
          (lesson) =>
            lesson.lesson_work === lessonWork &&
            lesson.week === weekStartString &&
            !lesson.isArchived &&
            lesson.day === currentDay
        )
      );

      // Update the local state for all affected students
      const updatedStudents = students.map((student) => {
        const lessonIndex = student.studentData.lessons.findIndex(
          (lesson) =>
            lesson.lesson_work === lessonWork &&
            lesson.week === weekStartString &&
            !lesson.isArchived &&
            lesson.day === currentDay
        );
        if (lessonIndex !== -1) {
          const updatedLessons = [...student.studentData.lessons];
          updatedLessons[lessonIndex] = {
            ...updatedLessons[lessonIndex],
            day: targetDay,
          };
          return {
            ...student,
            studentData: {
              ...student.studentData,
              lessons: updatedLessons,
            },
          };
        }
        return student;
      });

      setStudents(updatedStudents);

      // Send the update to the backend with the list of affected student IDs
      const response = await axios.put(
        `${backendUrl}/api/school/update-lesson-day`,
        {
          studentIds: affectedStudents.map((student) => student._id),
          lesson_work: lessonWork,
          week: weekStartString,
          currentDay: currentDay,
          newDay: targetDay,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`Lesson moved to ${targetDay} successfully!`);
        setMoveLessonError(null);
      } else {
        throw new Error("Backend failed to update lesson day");
      }
    } catch (error) {
      console.error("Error updating lesson day:", error);
      setStudents(originalStudents);
      setMoveLessonError("Failed to move lesson.");
      toast.error("Failed to move lesson.");
    }
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
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="pt-24 bg-[#4A154B] min-h-screen">
      <div className="p-10 flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-4 mb-1">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
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
          {displayOption === "Per Student" && (
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
          )}
          {displayOption === "Per Lesson" && (
            <>
              <div>
                <select
                  value={selectedArea}
                  onChange={handleAreaChange}
                  className="w-80 h-12 bg-[#e6e6e6] rounded-[15px] px-4"
                >
                  <option value="">Select Area</option>
                  {areas.map((area, index) => (
                    <option key={index} value={area}>
                      {area}
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
            </>
          )}
        </div>
        <div className="flex-1 lg:flex-none lg:w-150 flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <input
            type="text"
            placeholder={
              displayOption === "Per Student"
                ? "Search for student..."
                : "Search for lesson or student..."
            }
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-12 bg-[#e6e6e6] rounded-[15px] px-4"
          />
          {displayOption === "Per Student" && (
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-40 h-12 bg-[#e6e6e6] rounded-[15px] px-4"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
          <select
            value={displayOption}
            onChange={handleDisplayOptionChange}
            className="w-40 h-12 bg-[#e6e6e6] rounded-[15px] px-4"
          >
            <option value="Per Student">Per Student</option>
            <option value="Per Lesson">Per Lesson</option>
          </select>
        </div>
      </div>

      <div className="p-10 bg-white">
        <div className="flex items-center justify-between mb-4">
          {displayOption === "Per Student" && (
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="bg-[#4A154B] text-white px-4 py-2 rounded-lg hover:bg-[#5A255B]"
              >
                {selectAll ? "Deselect All" : "Select All"}
              </button>
              <button
                onClick={handleArchiveAll}
                className="bg-[#4A154B] text-white px-4 py-2 rounded-lg hover:bg-[#5A255B]"
              >
                Archive All Mastered
              </button>
              <button
                onClick={() => setIsArchivedModalOpen(true)}
                className="bg-[#4A154B] text-white px-4 py-2 rounded-lg hover:bg-[#5A255B]"
              >
                View Archived Lessons
              </button>
              {recentlyArchived.length > 0 && (
                <button
                  onClick={handleUndoArchive}
                  className="bg-[#5BB381] text-white px-4 py-2 rounded-lg hover:bg-[#6CC491]"
                >
                  Undo Archive
                </button>
              )}
            </div>
          )}
          {displayOption === "Per Lesson" && <div className="flex-1"></div>}
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousWeek}
              className="bg-[#4A154B] text-white px-4 py-2 rounded-lg hover:bg-[#5A255B]"
            >
              {'<'}
            </button>
            <span className="text-lg text-black">{weekRange.label}</span>
            <button
              onClick={handleNextWeek}
              className="bg-[#4A154B] text-white px-4 py-2 rounded-lg hover:bg-[#5A255B]"
            >
              {'>'}
            </button>
          </div>
          {displayOption === "Per Student" && <div className="flex-1"></div>}
        </div>
        <div className="flex justify-between text-black text-center">
          {[""].map((day) => (
            <div key={day} className="flex-1">
              <div>{day}</div>
            </div>
          ))}
        </div>
      </div>

      {displayOption === "Per Student" ? (
        <div className="bg-[#e2e2e2] p-10 shadow-md">
          {selectedStudents.length > 0 && (
            <div className="flex justify-center items-center mb-4">
              <div className="flex items-center gap-2">
                <select
                  className="w-60 h-12 bg-[#ffffff] rounded-[15px] px-4"
                  onChange={(e) => handleAssignLessonToSelected(e.target.value)}
                >
                  <option value="">Select Lesson to Assign</option>
                  {getLessonsForSelectedStudents().map((lesson, i) => (
                    <option key={i} value={lesson}>
                      {lesson}
                    </option>
                  ))}
                  {getLessonsForSelectedStudents().length === 0 && (
                    <option disabled>No common lessons available</option>
                  )}
                </select>
              </div>
            </div>
          )}

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const availableLessons = getLessonsForStudentLevel(
                  student.studentData?.level
                );
                return (
                  <div
                    key={student._id}
                    className={`bg-white shadow-md rounded-lg p-4 border border-gray-300 flex flex-col h-[300px] cursor-pointer ${
                      selectedStudents.includes(student._id)
                        ? "border-[#4A154B]"
                        : ""
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

                    <div
                      className="flex-grow p-3 overflow-y-auto"
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsModalOpen(true);
                      }}
                    >
                      <ol className="list-decimal pl-5 text-gray-700 text-sm">
                        {student.studentData.lessons
                          .filter((lesson) => !lesson.isArchived && lesson.week === weekStartString)
                          .slice(0, 4)
                          .map((lesson, i) => (
                            <li key={i} className="py-1">
                              <span>{lesson.lesson_work}</span>
                            </li>
                          ))}
                        {student.studentData.lessons.filter(
                          (lesson) => !lesson.isArchived && lesson.week === weekStartString
                        ).length > 4 && (
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
                        value={selectedLessons[student._id] || ""}
                      >
                        <option value="">Select Lesson</option>
                        {availableLessons.map((lesson, i) => (
                          <option key={i} value={lesson}>
                            {lesson}
                          </option>
                        ))}
                        {availableLessons.length === 0 && (
                          <option disabled>No lessons available</option>
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
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-600">
                No active students found.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#e2e2e2] p-10 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Per Lesson View
          </h2>
          {moveLessonError && (
            <div className="text-red-600 text-center mb-4">
              {moveLessonError}
            </div>
          )}
          <div className="flex gap-4">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <div
                key={day}
                className="flex-1 min-h-[400px] bg-gray-300 p-4 rounded-lg"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
              >
                <h3 className="text-lg font-semibold text-center bg-[#4A154B] text-white p-2 rounded-t-lg">
                  {day}
                </h3>
                <div className="mt-2 space-y-4">
                  {getLessonsWithStudents()
                    .filter((lesson) => lesson.day === day)
                    .map((lesson, index) => (
                      <div
                        key={index}
                        className="bg-white shadow-md rounded-lg p-4 border border-gray-300 flex flex-col min-h-[120px] cursor-move"
                        draggable
                        onDragStart={(e) => handleDragStart(e, lesson.lesson_work, lesson.day)}
                      >
                        <div className="p-2">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {lesson.lesson_work}
                          </h4>
                        </div>
                        <div className="p-2 flex-grow">
                          <ul className="list-none pl-0 text-gray-700 text-sm">
                            {lesson.students.map((student, i) => (
                              <li key={i} className="py-1 flex items-center">
                                {getStatusIndicator(student.id, lesson.lesson_work)}
                                {student.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {getLessonsWithStudents().length === 0 && (
            <div className="text-center text-gray-600 mt-4">
              No lessons found matching the selected filters for this week.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <LessonPlanModal
          student={selectedStudent}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isArchivedModalOpen && (
        <ArchivedLessonsModal
          onClose={() => setIsArchivedModalOpen(false)}
        />
      )}

      <ConfirmationModal
        isOpen={archiveModalOpen}
        onClose={handleArchiveCancel}
        onConfirm={handleArchiveConfirm}
        message="Are you sure you want to archive this lesson? It will be hidden from the Lesson Plan page."
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this lesson? This action cannot be undone."
      />

      <ConfirmationModal
        isOpen={archiveAllModalOpen}
        onClose={handleArchiveAllCancel}
        onConfirm={handleArchiveAllConfirm}
        message="Are you sure you want to archive all mastered lessons for the selected students? They will be hidden from the Lesson Plan page."
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