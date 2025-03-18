// schoolController.js
import programModel from "../models/acads/programModel.js";
import levelModel from "../models/acads/levelModel.js";
import classModel from "../models/acads/classModel.js";
import areaModel from "../models/acads/areaModel.js";
import lessonModel from "../models/acads/lessonModel.js";
import workModel from "../models/acads/workModel.js";
import materialModel from "../models/acads/materialModel.js";
import curriculumModel from "../models/acads/curriculumModel.js";
import userModel from "../models/roles/userModel.js";
import OpenAI from "openai";

// Initialize OpenAI client with DeepSeek API
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.SUMMARIZER_API_KEY,
});

// Fetch student by schoolId
export const getStudentById = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const student = await userModel.findOne({ schoolId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    res.status(200).json({ success: true, ...student.toObject() });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student." });
  }
};

// Preload student data
const preloadStudentData = async () => {
  try {
    const studentData = await userModel.find({ role: "student" }).exec();
    console.log("Student data preloaded successfully:", studentData.length, "documents found");
  } catch (error) {
    console.error("Error preloading student data:", error);
  }
};

preloadStudentData();

// Summarize feedback using DeepSeek API
export const summarizeFeedback = async (req, res) => {
  const { feedback, studentName } = req.body;
  if (!feedback || !studentName) {
    return res.status(400).json({ success: false, message: "Feedback text and student name are required." });
  }
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-reasoner",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes feedback for student progress reports in a Montessori setting. " +
            "Provide a concise summary of the feedback and include suggestions for improvement. " +
            "Respond without using bold (*text*) or any other markdown formatting. " +
            "Focus on Montessori principles such as independence, self-directed learning, and holistic development. " +
            "Format the response as follows:\n\n" +
            "Progress Report:\n[Summary of the feedback]\n\n" +
            "Suggestions for Improvement:\n1. [First suggestion]\n2. [Second suggestion]\n3. [Third suggestion] (if applicable)\n\n" +
            "Ensure that each suggestion is clear, actionable, and aligns with Montessori principles."
        },
        {
          role: "user",
          content: `Summarize the following feedback for ${studentName} and provide suggestions for improvement based on Montessori principles:\n\n${feedback}`,
        },
      ],
      max_tokens: 300,
    });
    const summary = response.choices[0].message.content;
    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error summarizing feedback:", error);
    res.status(500).json({ success: false, message: "Failed to summarize feedback." });
  }
};

export const saveSummarizedFeedback = async (req, res) => {
  const { schoolId, quarter, summarizedFeedback } = req.body;

  if (!schoolId || !quarter || !summarizedFeedback) {
    return res.status(400).json({
      success: false,
      message: "School ID, quarter, and summarized feedback are required.",
    });
  }

  try {
    // Update the student's summarized_feedback field for the specified quarter
    const updateField = `studentData.feedbacks.${quarter}.summarized_feedback`;
    const updatedStudent = await userModel.findOneAndUpdate(
      { schoolId, studentData: { $exists: true } },
      { $set: { [updateField]: summarizedFeedback } },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not a student record.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback saved successfully.",
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save feedback.",
    });
  }
};

export const getSummarizedFeedback = async (req, res) => {
  const { schoolId, quarter } = req.query;

  if (!schoolId || !quarter) {
    return res.status(400).json({
      success: false,
      message: "School ID and quarter are required.",
    });
  }

  try {
    const student = await userModel.findOne(
      { schoolId, studentData: { $exists: true } },
      { [`studentData.feedbacks.${quarter}.summarized_feedback`]: 1 }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not a student record.",
      });
    }

    const summarizedFeedback =
      student.studentData.feedbacks[quarter]?.summarized_feedback || "";
    res.status(200).json({
      success: true,
      data: summarizedFeedback,
    });
  } catch (error) {
    console.error("Error fetching summarized feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch summarized feedback.",
    });
  }
};

export const getFeedback = async (req, res) => {
  const { schoolId, quarter } = req.query;
  console.log("Received feedback fetch request:", { schoolId, quarter });
  if (!schoolId || !quarter) {
    return res.status(400).json({ success: false, message: "schoolId and quarter are required." });
  }
  try {
    const student = await userModel.findOne({ schoolId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    const validQuarters = ["quarter1", "quarter2", "quarter3", "quarter4"];
    if (!validQuarters.includes(quarter)) {
      return res.status(400).json({ success: false, message: "Invalid quarter." });
    }
    const feedback = student.studentData?.feedbacks?.[quarter] || {};
    if (!Object.keys(feedback).length) {
      return res.status(404).json({ success: false, message: "No feedback found for the selected quarter." });
    }
    res.status(200).json({ success: true, message: "Feedback retrieved successfully.", data: feedback });
  } catch (error) {
    console.error("Error in getFeedback:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addFeedback = async (req, res) => {
  const { schoolId, quarter, week, feedbackText } = req.body;
  console.log("Received feedback payload:", { schoolId, quarter, week, feedbackText });
  if (!schoolId || !quarter || !week || feedbackText === undefined) {
    return res.status(400).json({ success: false, message: "schoolId, quarter, week, and feedbackText are required." });
  }
  try {
    const student = await userModel.findOne({ schoolId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    const validQuarters = ["quarter1", "quarter2", "quarter3", "quarter4"];
    if (!validQuarters.includes(quarter)) {
      return res.status(400).json({ success: false, message: "Invalid quarter." });
    }
    const validWeeks = {
      quarter1: ["week1", "week2", "week3"],
      quarter2: ["week4", "week5", "week6"],
      quarter3: ["week7", "week8", "week9"],
      quarter4: ["week10", "week11", "week12"],
    };
    if (!validWeeks[quarter].includes(week)) {
      return res.status(400).json({ success: false, message: "Invalid week for the given quarter." });
    }
    if (!student.studentData) student.studentData = {};
    if (!student.studentData.feedbacks) {
      student.studentData.feedbacks = {
        quarter1: { week1: "", week2: "", week3: "", summarized_feedback: "" },
        quarter2: { week4: "", week5: "", week6: "", summarized_feedback: "" },
        quarter3: { week7: "", week8: "", week9: "", summarized_feedback: "" },
        quarter4: { week10: "", week11: "", week12: "", summarized_feedback: "" },
      };
    }
    student.studentData.feedbacks[quarter][week] = feedbackText;
    student.markModified(`studentData.feedbacks.${quarter}`);
    await student.save();
    res.status(200).json({
      success: true,
      message: "Feedback saved successfully.",
      data: student.studentData.feedbacks[quarter],
    });
  } catch (error) {
    console.error("Error in saveFeedback:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// New getProgress function
export const getProgress = async (req, res) => {
  try {
    const { schoolId } = req.params;

    // Fetch student data
    const student = await userModel.findOne({ schoolId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    // Fetch all curriculum data
    const curriculums = await curriculumModel.find();

    // Process lesson_work and map to areas
    const lessons = student.studentData?.lessons || [];
    const areaProgress = {};

    lessons.forEach((lesson) => {
      const lessonWork = lesson.lesson_work;
      const curriculumEntry = curriculums.find((curr) =>
        lessonWork.includes(`${curr.Lesson} - ${curr.Work}`)
      );
      const area = curriculumEntry ? curriculumEntry.Areas : "Unknown";

      if (!areaProgress[area]) {
        areaProgress[area] = { presented: 0, practiced: 0, mastered: 0, total: 0 };
      }

      // Get the latest subwork entry (based on status_date or last in array if no date)
      const subwork = lesson.subwork.length > 0 ? lesson.subwork[lesson.subwork.length - 1] : null;

      if (subwork) {
        // Count only the status of the latest subwork
        if (subwork.status === "presented") areaProgress[area].presented += 1;
        else if (subwork.status === "practiced") areaProgress[area].practiced += 1;
        else if (subwork.status === "mastered") areaProgress[area].mastered += 1;
        areaProgress[area].total += 1; // Increment total for each lesson with subwork
      }
    });

    // Calculate percentages for each area
    const progressData = {};
    Object.keys(areaProgress).forEach((area) => {
      const total = areaProgress[area].total;
      if (total > 0) {
        progressData[area] = {
          presented: Math.round((areaProgress[area].presented / total) * 100),
          practiced: Math.round((areaProgress[area].practiced / total) * 100),
          mastered: Math.round((areaProgress[area].mastered / total) * 100),
        };
      } else {
        progressData[area] = { presented: 0, practiced: 0, mastered: 0 };
      }
    });

    res.status(200).json({
      success: true,
      message: "Progress data retrieved successfully.",
      data: progressData,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ success: false, message: "Failed to fetch progress data." });
  }
};
// Add Curriculum
export const addCurriculum = async (req, res) => {
  const { Program, Level, Areas, Material, Lesson, Work } = req.body;
  if (!Program || !Level || !Areas || !Material || !Lesson || !Work) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  const existing = await curriculumModel.findOne({ Program, Level, Areas, Material, Lesson, Work });
  if (existing) {
    return res.status(400).json({ success: false, message: "Curriculum already exists." });
  }

  try {
    const newCurriculum = new curriculumModel({ Program, Level, Areas, Material, Lesson, Work });
    await newCurriculum.save();
    res.status(201).json({ success: true, message: "Curriculum added successfully", data: newCurriculum });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Curriculum
export const getAllCurriculum = async (req, res) => {
  try {
    const data = await curriculumModel.find();
    if (!data.length) {
      return res.json({ success: false, message: "No data found" });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete Curriculum
export const deleteCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const curriculum = await curriculumModel.findById(id);
    if (!curriculum) {
      return res.status(404).json({ success: false, message: "Curriculum not found" });
    }
    await curriculumModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Curriculum deleted successfully" });
  } catch (error) {
    console.error("Error deleting curriculum:", error);
    res.status(500).json({ success: false, message: "Server error while deleting curriculum" });
  }
};

// Edit Curriculum
export const editCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const curriculum = await curriculumModel.findById(id);
    if (!curriculum) {
      return res.status(404).json({ success: false, message: "Curriculum not found" });
    }
    const updatedCurriculum = await curriculumModel.findByIdAndUpdate(id, updatedData, { new: true });
    res.json({
      success: true,
      message: "Curriculum updated successfully",
      data: updatedCurriculum,
    });
  } catch (error) {
    console.error("Error updating curriculum:", error);
    res.status(500).json({ success: false, message: "Server error while updating curriculum" });
  }
};

// Get Class List (Updated for Progress Page)
export const getClassList = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let students;
    if (user.role === "admin") {
      students = await userModel.find({ role: "student" }).exec();
    } else if (user.role === "guide") {
      const assignedClass = user.guideData?.class;
      if (!assignedClass) {
        return res.status(400).json({ success: false, message: "Guide class not assigned" });
      }
      students = await userModel
        .find({
          role: "student",
          "studentData.class": assignedClass,
        })
        .exec();
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error("Error in getClassList:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lesson Plan Page
export const lessonPlan = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let students;
    if (user.role === "admin") {
      students = await userModel.find({ role: "student" }).exec();
    } else if (user.role === "guide") {
      const assignedClass = user.guideData?.class;
      if (!assignedClass) {
        return res.status(400).json({ success: false, message: "Guide class not assigned" });
      }
      students = await userModel
        .find({
          role: "student",
          "studentData.class": assignedClass,
        })
        .exec();
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const curriculumData = await curriculumModel.find();
    if (!curriculumData.length) {
      return res.json({ success: false, message: "No data found" });
    }

    res.status(200).json({ success: true, students, curriculumData });
  } catch (error) {
    console.error("Error in lessonPlan:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveLesson = async (req, res) => {
  try {
    const { studentId, lesson_work, addedBy, remarks, start_date } = req.body;

    if (!studentId || !lesson_work || !addedBy || !start_date) {
      return res.status(400).json({
        success: false,
        message: "Student ID, lesson work, addedBy, and start_date are required",
      });
    }

    const student = await userModel.findById(studentId).exec();
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const lessonExists = student.studentData.lessons.some(
      (lesson) => lesson.lesson_work === lesson_work
    );

    if (lessonExists) {
      return res.status(400).json({
        success: false,
        message: "This lesson is already saved for the student.",
      });
    }

    student.studentData.lessons.push({
      lesson_work,
      addedBy,
      remarks,
      start_date,
      subwork: [],
    });
    await student.save();

    res.status(200).json({ success: true, message: "Lesson saved successfully" });
  } catch (error) {
    console.error("Error saving lesson:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveLessonToMultiple = async (req, res) => {
  try {
    const { studentIds, lesson_work, addedBy, remarks, start_date } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: "No student IDs provided" });
    }
    if (!lesson_work || !addedBy || !start_date) {
      return res.status(400).json({
        success: false,
        message: "Lesson work, addedBy, and start_date are required",
      });
    }

    const lessonData = {
      lesson_work,
      addedBy,
      remarks: remarks || "",
      start_date: new Date(start_date),
      subwork: [],
    };

    const result = await userModel.updateMany(
      {
        _id: { $in: studentIds },
        "studentData.lessons.lesson_work": { $ne: lesson_work },
      },
      {
        $push: { "studentData.lessons": lessonData },
      }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({
        success: true,
        message: `Lesson assigned to ${result.modifiedCount} student(s) successfully`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No new lessons added (possibly duplicates or no matching students)",
      });
    }
  } catch (error) {
    console.error("Error in saveLessonToMultiple:", error);
    res.status(500).json({ success: false, message: "Server error while assigning lessons" });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { studentId, lesson_work } = req.query;

    if (!studentId || !lesson_work) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Lesson Work are required",
      });
    }

    const student = await userModel.findById(studentId).exec();
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    student.studentData.lessons = student.studentData.lessons.filter(
      (lesson) => lesson.lesson_work !== lesson_work
    );
    await student.save();

    res.json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting lesson",
    });
  }
};

// Progress Page Endpoints
export const saveProgress = async (req, res) => {
  const { studentId, lessonIndex, progress } = req.body;

  if (!studentId || lessonIndex === undefined || !progress) {
    return res.status(400).json({
      success: false,
      message: "studentId, lessonIndex, and progress are required.",
    });
  }

  try {
    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    if (lessonIndex < 0 || lessonIndex >= student.studentData.lessons.length) {
      return res.status(400).json({ success: false, message: "Invalid lesson index." });
    }

    const lesson = student.studentData.lessons[lessonIndex];
    lesson.remarks = progress.remarks || lesson.remarks;

    const subRows = progress.subRows || [];
    lesson.subwork = subRows.map((sub, idx) => ({
      subwork_name: sub.subwork_name || lesson.subwork[idx]?.subwork_name || `Day ${idx + 1}: ${lesson.lesson_work}`,
      status: sub.mastered ? "mastered" : sub.practiced ? "practiced" : sub.presented ? "presented" : "not_presented",
      subwork_remarks: sub.subwork_remarks || lesson.subwork[idx]?.subwork_remarks || "",
      status_date: sub.date ? new Date(sub.date) : lesson.subwork[idx]?.status_date || new Date(),
      updatedBy: req.user?.email || lesson.subwork[idx]?.updatedBy || "system",
    }));

    const latestSubRow = subRows[subRows.length - 1] || {};
    lesson.status = latestSubRow.mastered
      ? "mastered"
      : latestSubRow.practiced
      ? "practiced"
      : latestSubRow.presented
      ? "presented"
      : lesson.status || "not_presented";
    lesson.status_date = latestSubRow.date ? new Date(latestSubRow.date) : lesson.status_date || new Date();

    student.updatedAt = new Date();
    await student.save();

    res.status(200).json({
      success: true,
      message: "Progress saved successfully.",
      data: student.studentData.lessons[lessonIndex],
    });
  } catch (error) {
    console.error("Error in saveProgress:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Updated Save Feedback Endpoint (Matches Feedback Model)
export const saveFeedback = async (req, res) => {
  const { studentId, schoolId, quarter, week, feedbackText } = req.body;

  console.log("Received feedback payload:", { studentId, schoolId, quarter, week, feedbackText });

  if (!studentId || !schoolId || !quarter || !week || feedbackText === undefined) {
    return res.status(400).json({
      success: false,
      message: "studentId, schoolId, quarter, week, and feedbackText are required.",
    });
  }

  try {
    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    const feedbackDoc = await Feedback.findOneAndUpdate(
      { studentId, schoolId },
      {
        $set: {
          [`feedbacks.${quarter}.${week}`]: feedbackText,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Feedback saved successfully.",
      data: feedbackDoc.feedbacks[quarter],
    });
  } catch (error) {
    console.error("Error in saveFeedback:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubwork = async (req, res) => {
  const { studentId, lessonIndex } = req.query;

  if (!studentId || lessonIndex === undefined) {
    return res.status(400).json({
      success: false,
      message: "Student ID and Lesson Index are required.",
    });
  }

  try {
    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    if (lessonIndex < 0 || lessonIndex >= student.studentData.lessons.length) {
      return res.status(400).json({ success: false, message: "Invalid lesson index." });
    }

    const subwork = student.studentData.lessons[lessonIndex].subwork;
    res.status(200).json({ success: true, subwork });
  } catch (error) {
    console.error("Error in fetching subwork:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addSubwork = async (req, res) => {
  try {
    const { studentId, lessonIndex, subwork } = req.body;

    console.log("Request Payload:", { studentId, lessonIndex, subwork });

    if (!studentId || lessonIndex === undefined || !subwork) {
      return res.status(400).json({
        success: false,
        message: "studentId, lessonIndex, and subwork are required.",
      });
    }

    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    if (!student.studentData.lessons[lessonIndex]) {
      return res.status(404).json({ success: false, message: "Lesson not found." });
    }

    const newSubwork = {
      subwork_name: subwork.subwork_name,
      status: subwork.status,
      status_date: subwork.status_date || new Date(),
      subwork_remarks: subwork.subwork_remarks || "",
      updatedBy: subwork.updatedBy,
    };

    student.studentData.lessons[lessonIndex].subwork.push(newSubwork);
    await student.save();

    res.status(200).json({
      success: true,
      message: "Subwork added successfully.",
      data: student,
    });
  } catch (error) {
    console.error("Error in addSubwork:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentList = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let students;
    if (user.role === "admin") {
      students = await userModel.find({ role: "student" }).exec();
    } else if (user.role === "guide") {
      const assignedClass = user.guideData?.class;
      if (!assignedClass) {
        return res.status(400).json({ success: false, message: "Guide class not assigned" });
      }
      students = await userModel
        .find({
          role: "student",
          "studentData.class": assignedClass,
        })
        .exec();
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error("Error in getClassList:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Additional CRUD Endpoints
export const addLevel = async (req, res) => {
  try {
    const { levelName, progName } = req.body;
    const existingLevel = await levelModel.findOne({ levelName, progName });
    if (existingLevel) {
      return res.status(400).json({ success: false, message: "Level already exists in this program." });
    }
    const newLevel = new levelModel({ levelName, progName });
    await newLevel.save();
    res.status(201).json({ success: true, message: "Level added successfully.", level: newLevel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const addProgram = async (req, res) => {
  try {
    const { progName } = req.body;
    const existingProgram = await programModel.findOne({ progName });
    if (existingProgram) {
      return res.status(400).json({ success: false, message: "Program already exists." });
    }
    const newProgram = new programModel({ progName });
    await newProgram.save();
    res.status(201).json({ success: true, message: "Program added successfully.", program: newProgram });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const addClass = async (req, res) => {
  try {
    const { progName, className, guides, capacity, students, schedule } = req.body;
    const existingClass = await classModel.findOne({ progName, className });
    if (existingClass) {
      return res.status(400).json({ success: false, message: "Class already exists in this program." });
    }
    const existingProgram = await programModel.findOne({ progName });
    if (!existingProgram) {
      return res.status(404).json({ success: false, message: "Program not found." });
    }
    const newClass = new classModel({
      progName,
      className,
      guides: guides || [],
      capacity,
      students: students || [],
      schedule: {
        days: schedule?.days || [],
        startTime: schedule?.startTime,
        endTime: schedule?.endTime,
      },
    });
    await newClass.save();
    res.status(201).json({ success: true, message: "Class added successfully.", class: newClass });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const addArea = async (req, res) => {
  const { areaName, levelName } = req.body;
  if (!areaName || !levelName) {
    return res.status(400).json({ success: false, message: "Name and Level are required" });
  }
  try {
    const newArea = new areaModel({ areaName, levelName });
    await newArea.save();
    res.status(201).json({ success: true, message: "Area added successfully", data: newArea });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addLesson = async (req, res) => {
  const { name, area } = req.body;
  if (!name || !area) {
    return res.status(400).json({ success: false, message: "Name and Area are required" });
  }
  try {
    const newLesson = new lessonModel({ name, area });
    await newLesson.save();
    res.status(201).json({ success: true, message: "Lesson added successfully", data: newLesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addWork = async (req, res) => {
  const { name, lesson, materials } = req.body;
  if (!name || !lesson) {
    return res.status(400).json({ success: false, message: "Name and Lesson are required" });
  }
  try {
    const newWork = new workModel({ name, lesson, materials });
    await newWork.save();
    res.status(201).json({ success: true, message: "Work added successfully", data: newWork });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMaterial = async (req, res) => {
  const { name, photo, works } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }
  try {
    const newMaterial = new materialModel({ name, photo: photo || null, works });
    await newMaterial.save();
    res.status(201).json({ success: true, message: "Material added successfully", data: newMaterial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};